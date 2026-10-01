"use client";
/**
 * HUNT — Premium WebGL crash game using Pixi.js v8 + GSAP.
 *
 * ARCHITECTURE:
 *   MultiplierEngine  — pure game logic, wall-clock based, hard-capped (proven stable)
 *   PixiRenderer      — Pixi.js Application: sprites, filters, animations
 *   ParticlePool      — Pixi particles for feathers/gold/sparks
 *   HuntGame (React)  — boots renderer once via bootedRef, mirrors FSM state to UI
 *
 * ECONOMY: score = Math.floor(mult × 100) → existing PATCH /api/game/session.
 * NO AUDIO.
 */
import React, {
  useEffect, useRef, useCallback, useState, useMemo,
} from "react";
import { gsap } from "gsap";

/* ══════════════════════════════════════════
   TYPES
   ══════════════════════════════════════════ */
type Phase = "WAITING" | "COUNTDOWN" | "FLYING" | "SUCCESS" | "ESCAPED" | "DONE";

interface GameCfg {
  biasMode:    "none" | "win" | "loss";
  escapeMin:   number;
  escapeMax:   number;
  winInterval: number;
  winPerStep:  number;
}
const DEFAULT_CFG: GameCfg = {
  biasMode: "none", escapeMin: 1.1, escapeMax: 12,
  winInterval: 100, winPerStep: 10,
};

/* ── Asset manifest — background images removed; canvas uses solid dark colour ── */
const A = {
  /* Birds — tier progression */
  bird:          "/assets/birds/eagle.png",
  birdFalcon:    "/assets/birds/falcon.png",
  birdGolden:    "/assets/birds/golden-eagle.png",
  birdLegendary: "/assets/birds/legendary-eagle.png",
  birdFail:      "/assets/birds/bird-fail.png",
  /* Hunter — state progression */
  hunterIdle:    "/assets/hunter/idle.png",
  hunterAim:     "/assets/hunter/aiming.png",
  hunterBino:    "/assets/hunter/binoculars.png",
  hunterWin:     "/assets/hunter/excited.png",
  hunterFail:    "/assets/hunter/failure.png",
  /* Effects */
  trail:         "/assets/effects/speed-trail.png",
  goldTrail:     "/assets/effects/golden-trail.png",
  feathers:      "/assets/effects/feathers.png",
  burst:         "/assets/effects/final-burst.png",
  birdGlow:      "/assets/effects/bird-glow.png",
  multGlow:      "/assets/effects/multiplier-glow.png",
  targetLock:    "/assets/effects/target-lock.png",
  spawnFx:       "/assets/effects/spawn.png",
  /* Rewards */
  featherPt:     "/assets/rewards/feather.png",
  goldCoin:      "/assets/rewards/coin.png",
  chest:         "/assets/rewards/chest.png",
  trophy:        "/assets/rewards/trophy.png",
  /* Branding */
  logo:          "/assets/branding/hunt-logo.png",
} as const;

/** Bird texture key for the current multiplier tier */
function birdTexKey(m: number): keyof typeof A {
  if (m >= 8)  return "birdLegendary";
  if (m >= 5)  return "birdGolden";
  if (m >= 3)  return "birdFalcon";
  return "bird";
}

/* ── Brand colour tokens (mirrors globals.css, as hex numbers for Pixi) ──
   --brand-500 = #f5a623  →  0xf5a623  (primary gold — CTAs, trail, path)
   --gold-bright= #FFD700 →  0xFFD700  (bright gold — glow, tip dot)     */
const TRAIL_COLOR = 0xf5a623;   /* --brand-500  */
const TRAIL_GLOW  = 0xFFD700;   /* --gold-bright */

/* ══════════════════════════════════════════
   CRYPTOGRAPHIC RNG — replaces Math.random()
   Uses crypto.getRandomValues() for a uniform [0,1) float that is
   cryptographically strong and not predictable/repeating.
   Falls back to Math.random() in environments where crypto is unavailable.
   ══════════════════════════════════════════ */
function cryptoRand(): number {
  try {
    const buf = new Uint32Array(1);
    crypto.getRandomValues(buf);
    return buf[0] / (0xFFFFFFFF + 1);   /* [0, 1) uniform */
  } catch {
    return Math.random();               /* SSR / test fallback */
  }
}

/* ══════════════════════════════════════════
   MULTIPLIER ENGINE (proven stable, untouched)
   ══════════════════════════════════════════ */
class MultiplierEngine {
  private _startMs = 0;
  private _running  = false;
  readonly cap: number;

  constructor(cfg: GameCfg) {
    let raw: number;
    if (cfg.biasMode === "loss") {
      raw = cfg.escapeMin + cryptoRand() * 0.6;
    } else if (cfg.biasMode === "win") {
      raw = cfg.escapeMax * (0.85 + cryptoRand() * 0.15);
    } else {
      raw = 1.0 + (-Math.log(Math.max(0.0001, cryptoRand())) / 1.4);
    }
    this.cap = Math.max(cfg.escapeMin, Math.min(cfg.escapeMax, raw));
  }

  start()  { this._startMs = performance.now(); this._running = true; }
  stop()   { this._running = false; }

  current(): number {
    if (!this._running || !this._startMs) return 1.00;
    const sec = (performance.now() - this._startMs) / 1000;
    return Math.min(this.cap + 0.01, Math.round(Math.exp(0.07 * sec) * 100) / 100);
  }

  hasEscaped(): boolean { return this._running && this.current() >= this.cap; }
}

/* ══════════════════════════════════════════
   PIXI RENDERER
   Encapsulates all Pixi.js code. Instantiated once.
   ══════════════════════════════════════════ */
interface PixiSprite {
  x: number; y: number; rotation: number; alpha: number;
  scale: { x: number; y: number };
  visible: boolean;
  texture: unknown;
  tint: number;
  filters: unknown[] | null;
}

/** Module-level fence: resolves when the last PixiRenderer.destroy() finishes.
 *  The real-game boot awaits this before calling app.init() to prevent two
 *  PIXI.Application instances sharing the same canvas simultaneously,
 *  which causes WebGL uniform location errors.                              */
let _rendererDestroyFence: Promise<void> = Promise.resolve();

class PixiRenderer {
  app: import("pixi.js").Application | null = null;
  /** When true: suppress all particle emissions and reduce trail rate.
   *  Set before calling init() — used by the idle demo preview. */
  isDemo = false;

  /* ── Scene layers (z-order: bgOverlay → clouds → particles → trail → bird → hunter → scanlines → vignette) */
  private bgOverlay!:    import("pixi.js").Graphics;
  private groundLayer!:  import("pixi.js").Graphics;
  private particleCont!: import("pixi.js").Container;
  private trailCont!:    import("pixi.js").Container;
  private flightPath!:   import("pixi.js").Graphics;
  private birdGlowSp!:   import("pixi.js").Sprite;
  private bird!:         import("pixi.js").Sprite;
  private hunter!:       import("pixi.js").Sprite;
  private targetLock!:   import("pixi.js").Sprite;
  private multGlowSp!:   import("pixi.js").Sprite;
  private scanlines!:    import("pixi.js").Graphics;
  private vignette!:     import("pixi.js").Graphics;

  /* Bird tier tracking */
  private _birdTierKey: keyof typeof A = "bird";
  private _birdBaseScale = 1;
  /* Hunter state tracking */
  private _hunterStateKey: keyof typeof A = "hunterIdle";
  /** GSAP animation (tween or timeline) for SUCCESS phase bird motion — killed on destroy/newRound */
  private _successLoop: gsap.core.Animation | null = null;

  /* Flight path history */
  private pathPoints: {x:number;y:number}[] = [];

  /* Pixi modules (loaded dynamically) */
  private PIXI!: typeof import("pixi.js");

  /* Dimensions + bird position */
  private W = 0; private H = 0;
  private birdX = 0; private birdY = 0;
  private phase: Phase = "WAITING";

  /* Particle pool */
  private particles: {
    sp: import("pixi.js").Sprite;
    vx: number; vy: number; life: number; decay: number;
  }[] = [];

  async init(canvas: HTMLCanvasElement): Promise<void> {
    const PIXI = await import("pixi.js");
    this.PIXI  = PIXI;

    /* ── Wait for real canvas dimensions (prevents white canvas on remount) ──
       clientWidth/clientHeight can be 0 immediately after DOM insertion before
       CSS layout completes.  Poll via rAF until at least 16px are available. */
    await new Promise<void>(resolve => {
      const poll = () => {
        if (canvas.clientWidth > 16 && canvas.clientHeight > 16) { resolve(); return; }
        requestAnimationFrame(poll);
      };
      poll();
    });

    /* Re-read dimensions after layout settles */
    const W = canvas.clientWidth  || canvas.offsetWidth  || 400;
    const H = canvas.clientHeight || canvas.offsetHeight || 300;

    /* ── Await prior renderer teardown fence ───────────────────────────────
       If a demo (or previous game) PixiRenderer.destroy() was called just
       before this init(), its WebGL context may still be tearing down.
       Creating a new PIXI.Application on the same canvas while the prior GL
       context is live causes "uniformMatrix3fv: location not from associated
       program" crashes.  The fence resolves synchronously when no prior
       renderer is in flight, so there is zero overhead on first boot.       */
    await _rendererDestroyFence;

    const app = new PIXI.Application();
    await app.init({
      canvas:          canvas as HTMLCanvasElement,
      width:           W,
      height:          H,
      backgroundColor: 0x060910,
      antialias:       true,
      resolution:      window.devicePixelRatio || 1,
      autoDensity:     true,
    });
    this.app = app;
    this.W = app.screen.width;
    this.H = app.screen.height;

    /* ── Load assets fresh every boot ────────────────────────────────────
       destroy() calls PIXI.Assets.reset() which clears all three internal
       caches (resolver._assetMap, resolver._resolverHash, Cache).
       On first boot, all URLs are new. On subsequent boots, Assets.reset()
       ensures the cache is clean so all URLs load fresh. The cache.has()
       guard is kept as a defensive no-op for any edge-case where two
       PixiRenderers might share a page (shouldn't happen but safe).      */
    const allUrls = (Object.values(A) as string[]).filter(v => typeof v === "string" && v.length > 0);
    const toLoad  = allUrls.filter(u => { try { return !PIXI.Assets.cache.has(u); } catch { return true; } });
    if (toLoad.length > 0) await PIXI.Assets.load(toLoad).catch(() => {});
    /* Populate _tex — only store textures that actually resolved with real size */
    for (const src of allUrls) {
      try {
        const t = PIXI.Texture.from(src);
        /* Pixi.Texture.from can return a partially-initialised texture during
           async load; guard width AND that the texture object itself is valid  */
        if (t && !t.destroyed && t.width > 0) this._tex.set(src, t);
      } catch { /* skip: URL not resolved, wrong type, or cache in bad state */ }
    }

    this.buildScene();
  }

  private buildScene() {
    if (!this.app) return;
    const { Sprite, Graphics, Container } = this.PIXI;
    const stage = this.app.stage;

    /** Create sprite from pre-loaded cache; safe fallback to URL */
    const sp = (key: keyof typeof A) => {
      const t = this.t(A[key]);
      return t ? new Sprite(t) : Sprite.from(A[key]);
    };

    /* ── 1. Danger overlay (solid dark + red tint at high mult) ── */
    this.bgOverlay = new Graphics();
    this.bgOverlay.rect(0, 0, this.W, this.H).fill({ color: 0x000000, alpha: 0 });
    stage.addChild(this.bgOverlay);

    /* ── 2. Particle container ── */
    this.particleCont = new Container();
    stage.addChild(this.particleCont);

    /* ── 4. Trail container ── */
    this.trailCont = new Container();
    stage.addChild(this.trailCont);

    /* ── 5. Flight path line ── */
    this.flightPath = new Graphics();
    stage.addChild(this.flightPath);

    /* ── 6. Bird glow ── */
    this.birdGlowSp = sp("birdGlow");
    this.birdGlowSp.anchor.set(0.5); this.birdGlowSp.alpha = 0;
    stage.addChild(this.birdGlowSp);

    /* ── 7. Bird — proportional size, starts near ground ── */
    this._birdTierKey = "bird";
    this.bird = sp("bird");
    this.bird.anchor.set(0.5, 0.5);
    this.bird.width  = this.W * 0.16;
    this.bird.height = this.bird.width * (84 / 110);
    this._birdBaseScale = this.bird.scale.x;
    this.bird.x = this.W * 0.18; this.bird.y = this.H * 0.75;
    this.birdX = this.bird.x; this.birdY = this.bird.y;
    stage.addChild(this.bird);

    /* ── 8. Ground strip ── */
    this.groundLayer = new Graphics();
    this._drawGround();
    stage.addChild(this.groundLayer);

    /* ── 9. Hunter — bottom-left, anchored to ground ── */
    this._hunterStateKey = "hunterIdle";
    this.hunter = sp("hunterIdle");
    this.hunter.anchor.set(0.5, 1.0);
    this.hunter.width = 72; this.hunter.height = 105;
    this.hunter.x = this.W * 0.12; this.hunter.y = this.H - this._groundH() + 2;
    stage.addChild(this.hunter);

    /* ── 10. Multiplier glow (top-centre) ── */
    this.multGlowSp = sp("multGlow");
    this.multGlowSp.anchor.set(0.5);
    this.multGlowSp.alpha = 0;
    this.multGlowSp.x = this.W / 2; this.multGlowSp.y = 60;
    stage.addChild(this.multGlowSp);

    /* ── 11. Target lock (tracks bird) ── */
    this.targetLock = sp("targetLock");
    this.targetLock.anchor.set(0.5); this.targetLock.alpha = 0;
    this.targetLock.width = 64; this.targetLock.height = 64;
    stage.addChild(this.targetLock);

    /* ── 12. Tactical scanlines — removed: blocked PNG sprites ── */
    this.scanlines = new Graphics();   /* kept as field to avoid null-guards downstream */
    stage.addChild(this.scanlines);    /* empty — never drawn */

    /* ── 13. Vignette — removed: blocked PNG sprites ── */
    this.vignette = new Graphics();   /* kept as field */
    stage.addChild(this.vignette);    /* empty — never drawn */

    /* Bird spawn entrance animation — scale from small to full proportional size */
    this.bird.alpha = 0; this.bird.scale.set(this._birdBaseScale * 0.35);
    gsap.to(this.bird, { alpha: 1, duration: 0.5, ease: "power2.out" });
    gsap.to(this.bird.scale, { x: this._birdBaseScale, y: this._birdBaseScale, duration: 0.5, ease: "back.out(1.7)" });
  }

  /** Height of the ground strip — proportional to canvas */
  private _groundH(): number { return Math.max(28, this.H * 0.08); }

  /** Redraws the ground strip (solid dark earth band at bottom) */
  private _drawGround() {
    if (!this.groundLayer) return;
    const gh = this._groundH();
    this.groundLayer.clear();
    /* Earth band */
    this.groundLayer.rect(0, this.H - gh, this.W, gh)
      .fill({ color: 0x2d1b0e, alpha: 1 });
    /* Grass line */
    this.groundLayer.rect(0, this.H - gh, this.W, 4)
      .fill({ color: 0x4a7c29, alpha: 1 });
  }

  /** Draws thin horizontal scanlines over the whole canvas (drawn once; alpha set in update) */
  private _drawScanlines() {
    if (!this.scanlines) return;
    this.scanlines.clear();
    const step = 4;   /* 4px apart — fine enough to be subtle, visible enough to texture */
    for (let y = 0; y < this.H; y += step) {
      this.scanlines.rect(0, y, this.W, 1).fill({ color: 0x000000, alpha: 1 });
    }
    this.scanlines.alpha = 0.08;   /* barely visible — atmospheric only */
  }

  /** Draws a radial vignette (dark corners) with `intensity` 0–1 */
  private _drawVignette(intensity: number) {
    if (!this.vignette) return;
    this.vignette.clear();
    /* Four corner gradients simulated with large semi-transparent ellipses at corners */
    const r  = Math.max(this.W, this.H) * 0.75;
    const a  = 0.38 + intensity * 0.30;   /* 0.38 base → 0.68 at max danger */
    /* Top-left */
    this.vignette.ellipse(-r * 0.1, -r * 0.1, r, r).fill({ color: 0x000000, alpha: a * 0.7 });
    /* Top-right */
    this.vignette.ellipse(this.W + r * 0.1, -r * 0.1, r, r).fill({ color: 0x000000, alpha: a * 0.7 });
    /* Bottom corners are slightly stronger (ground area) */
    this.vignette.ellipse(-r * 0.1, this.H + r * 0.1, r, r).fill({ color: 0x000000, alpha: a * 0.85 });
    this.vignette.ellipse(this.W + r * 0.1, this.H + r * 0.1, r, r).fill({ color: 0x000000, alpha: a * 0.85 });
    /* Top-centre dark band — keeps multiplier text readable */
    this.vignette.rect(0, 0, this.W, this.H * 0.12).fill({ color: 0x000000, alpha: 0.35 });
  }

  /** Draws parallax cloud shapes; called each frame during FLYING */
  private _drawClouds(_m: number) { /* clouds removed */ }

  private _destroyed = false;
  /** Pre-resolved texture cache — populated after Assets.load() only.
   *  Never call Texture.from() in the update loop — use this instead. */
  private _tex = new Map<string, import("pixi.js").Texture>();

  /** Get a texture from cache — returns null if not loaded yet (safe for update loop) */
  private t(src: string): import("pixi.js").Texture | null {
    return this._tex.get(src) ?? null;
  }

  /** Update every frame */
  update(m: number, phase: Phase) {
    if (!this.app || !this.PIXI || this._destroyed) return;
    this.phase = phase;

    /* ── Danger overlay — subtle red tint only above m=9 so sprites stay visible ── */
    const dangerAlpha = Math.min(0.18, Math.max(0, (m - 9) * 0.04));
    this.bgOverlay.clear();
    this.bgOverlay.rect(0, 0, this.W, this.H).fill({ color: 0x8c1414, alpha: dangerAlpha });

    /* ── Vignette + scanlines disabled — were blocking PNG sprites ── */

    /* ── Bird tier swap ── */
    if (phase === "FLYING") {
      const newBirdKey = birdTexKey(m);
      if (newBirdKey !== this._birdTierKey) {
        const nt = this.t(A[newBirdKey]);
        if (nt) {
          this._birdTierKey = newBirdKey;
          this.bird.texture = nt;
          /* Reapply proportional width so new texture keeps the same screen size */
          this.bird.width  = this.W * 0.16;
          this.bird.height = this.bird.width * (nt.height / nt.width);
          this._birdBaseScale = this.bird.scale.x;
        }
      }

      /* Hunter state: binoculars at m≥4, otherwise aiming */
      const wantedHunter: keyof typeof A = m >= 4 ? "hunterBino" : "hunterAim";
      if (wantedHunter !== this._hunterStateKey) {
        const ht = this.t(A[wantedHunter]);
        if (ht) { this._hunterStateKey = wantedHunter; this.hunter.texture = ht; }
      }

      /* ── Bird trajectory — exponential arc matching the multiplier curve ──
         The crash-game reference draws a curve from bottom-left → top-right.
         We compute the bird's EXACT target position from `m` using the same
         exponent the MultiplierEngine uses (e^0.07t), normalised over the
         expected escape range so the arc fills the canvas.

         progress ∈ [0,1]:  0 = 1× (start), 1 = 12× (cap)
         x: left 15% → right 75%  (bird moves across the screen)
         y: bottom 82% → top 8%   (bird rises as multiplier climbs)

         Important: lerp at 0.14 (14%/frame) so the bird visibly moves
         even at the first tick after 1.0→1.05 transition.               */
      const MULT_MIN  = 1.0;
      const MULT_MAX  = 12.0;
      const progress  = Math.min(1, Math.max(0, (m - MULT_MIN) / (MULT_MAX - MULT_MIN)));
      /* Ease-in: slow start (matches graph curvature), accelerates toward top */
      const eased     = Math.pow(progress, 0.55);

      const tarX  = this.W * (0.15 + eased * 0.60);
      const tarY  = this.H * (0.82 - eased * 0.74);
      /* Bob amplitude shrinks as bird rises (less wobble at high multipliers) */
      const bob   = Math.sin(performance.now() * 0.004) * (10 - eased * 8);
      const cTarY = Math.max(this.H * 0.06, Math.min(this.H * 0.84, tarY + bob));

      this.birdX += (tarX  - this.birdX) * 0.14;
      this.birdY += (cTarY - this.birdY) * 0.14;
      this.bird.x = this.birdX;
      this.bird.y = this.birdY;

      /* Bank angle — nose up based on vertical velocity (how fast it's rising) */
      const velY  = cTarY - this.birdY;   /* negative = rising */
      this.bird.rotation = Math.max(-0.55, Math.min(0.1, velY * 0.012)) - 0.08;

      /* Wing flap — multiply against base scale so proportional size is preserved */
      const flap = 1 + Math.sin(performance.now() * 0.009) * 0.05;
      this.bird.scale.set(this._birdBaseScale * flap, this._birdBaseScale / flap);

      /* Trail — reduced rate in demo (25%) so canvas stays clean; full rate in real game */
      const trailRate = this.isDemo ? 0.25 : 0.85 + Math.min(0.14, (m - 1) * 0.04);
      if (Math.random() < trailRate) this.emitTrailDot(m);

      /* Bird glow */
      const glowAlpha = Math.min(0.75, (m - 3) * 0.14);
      this.birdGlowSp.alpha  = Math.max(0, glowAlpha);
      this.birdGlowSp.x      = this.birdX; this.birdGlowSp.y = this.birdY;
      this.birdGlowSp.width  = 150 + glowAlpha * 70;
      this.birdGlowSp.height = 110 + glowAlpha * 45;

      /* Multiplier glow (top-centre) */
      const mgAlpha = Math.min(0.8, (m - 2) * 0.11);
      this.multGlowSp.alpha   = Math.max(0, mgAlpha);
      this.multGlowSp.width   = 280 + mgAlpha * 130;
      this.multGlowSp.height  = 75  + mgAlpha * 45;
      this.multGlowSp.rotation += 0.003;

      /* Target lock tracks bird */
      this.targetLock.x     = this.birdX; this.targetLock.y = this.birdY;
      this.targetLock.alpha = 0.3 + Math.sin(performance.now() * 0.007) * 0.22;
      this.targetLock.rotation += 0.022;

      /* Flight path */
      /* Flight path — drawn from theoretical curve, not recorded points */
      this.drawFlightPath(m);

      /* Clouds (parallax) */
      this._drawClouds(m);
    }

    if (phase === "SUCCESS") {
      this.drawFlightPath(m);
      /* Fade dynamic effects so it looks secured, not still flying */
      if (this.targetLock.alpha > 0) this.targetLock.alpha = 0;
      if (this.multGlowSp.alpha  > 0)
        this.multGlowSp.alpha = Math.max(0, this.multGlowSp.alpha - 0.02);
    }

    if (phase === "ESCAPED") {
      this.birdGlowSp.alpha  = 0;
      this.targetLock.alpha  = 0;
      this.multGlowSp.alpha  = 0;
      this.flightPath.clear();
      this._hideAxisLabels(0);   /* hide all axis labels when bird escapes */
    }

    this.updateParticles();
  }

  private drawFlightPath(m: number) {
    if (!this.flightPath) return;
    this.flightPath.clear();
    if (m < 1.02) return;

    const lineColor = TRAIL_COLOR;   /* 0xf5a623 --brand-500  */
    const glowColor = TRAIL_GLOW;    /* 0xFFD700 --gold-bright */

    const MULT_MIN = 1.0;
    const MULT_MAX = 12.0;
    const steps    = 60;

    /* ── Compute curve points ── */
    const points: { x: number; y: number }[] = [];
    for (let i = 0; i <= steps; i++) {
      const mSample = MULT_MIN + (m - MULT_MIN) * (i / steps);
      const prog    = Math.min(1, Math.max(0, (mSample - MULT_MIN) / (MULT_MAX - MULT_MIN)));
      const eased   = Math.pow(prog, 0.55);
      points.push({
        x: this.W * (0.15 + eased * 0.60),
        y: this.H * (0.82 - eased * 0.74),
      });
    }

    /* ── Baseline Y — sits 2px above the bottom edge ── */
    const baseY = this.H * 0.87;
    const tip   = points[points.length - 1];
    const tail  = points[0];

    /* ── 1. Filled area under the curve (Aviator-style shaded region) ──
       Build a closed polygon: path points forward + baseline back.
       Fill with semi-transparent gold that fades toward the baseline
       by using two stacked fills at different alphas.                */
    /* Deep fill — low alpha, full body */
    this.flightPath.moveTo(tail.x, baseY);
    for (const p of points) this.flightPath.lineTo(p.x, p.y);
    this.flightPath.lineTo(tip.x, baseY);
    this.flightPath.closePath();
    this.flightPath.fill({ color: lineColor, alpha: 0.18 });

    /* Mid fill — slightly brighter, covers lower half only */
    const midY = (tip.y + baseY) / 2;
    this.flightPath.moveTo(tail.x, baseY);
    for (const p of points) {
      /* Only include points in the lower half of the shaded region */
      this.flightPath.lineTo(p.x, Math.max(p.y, midY));
    }
    this.flightPath.lineTo(tip.x, baseY);
    this.flightPath.closePath();
    this.flightPath.fill({ color: lineColor, alpha: 0.14 });

    /* ── 2. Outer glow stroke (wide, low alpha) ── */
    this.flightPath.setStrokeStyle({ width: 7, color: glowColor, alpha: 0.20 });
    this.flightPath.moveTo(tail.x, tail.y);
    for (let i = 1; i < points.length; i++) this.flightPath.lineTo(points[i].x, points[i].y);
    this.flightPath.stroke();

    /* ── 3. Main line — alpha ramps from faint at tail to bright at tip ── */
    for (let i = 1; i < points.length; i++) {
      const alpha = 0.25 + (i / points.length) * 0.70;
      this.flightPath.setStrokeStyle({ width: 2.5, color: lineColor, alpha });
      this.flightPath.moveTo(points[i - 1].x, points[i - 1].y);
      this.flightPath.lineTo(points[i].x, points[i].y);
      this.flightPath.stroke();
    }

    /* ── 4. Bright dot at bird tip ── */
    this.flightPath.circle(tip.x, tip.y, 5);
    this.flightPath.fill({ color: glowColor, alpha: 1 });

    /* ── 5. Axis baseline ── */
    this.flightPath.setStrokeStyle({ width: 1.5, color: 0xf5a623, alpha: 0.35 });
    this.flightPath.moveTo(tail.x - 4, baseY);
    this.flightPath.lineTo(tip.x + 8, baseY);
    this.flightPath.stroke();

    /* ── 6. X-axis tick marks + multiplier labels ──
       Show integer milestones from 1× up to floor(m)×.
       Each tick is positioned by inverting the eased progress formula
       so ticks align exactly with where the curve passes that multiplier. */
    const fontSize   = Math.max(9, Math.min(13, this.W * 0.022));
    const tickH      = 5;
    const labelY     = baseY + tickH + fontSize + 2;
    const maxTick    = Math.floor(m);

    for (let tick = 1; tick <= maxTick; tick++) {
      const prog  = Math.min(1, Math.max(0, (tick - MULT_MIN) / (MULT_MAX - MULT_MIN)));
      const eased = Math.pow(prog, 0.55);
      const tx    = this.W * (0.15 + eased * 0.60);

      /* Tick mark */
      this.flightPath.setStrokeStyle({ width: 1.2, color: 0xf5a623, alpha: 0.45 });
      this.flightPath.moveTo(tx, baseY);
      this.flightPath.lineTo(tx, baseY + tickH);
      this.flightPath.stroke();

      /* Label — drawn as a Graphics circle placeholder is wrong; use PIXI.Text */
      /* We reuse a Text pool stored on the renderer to avoid creating/destroying
         Text objects every frame (expensive).                                   */
      this._setAxisLabel(tick, tx, labelY, fontSize);
    }
    /* Hide any pooled labels beyond current maxTick */
    this._hideAxisLabels(maxTick);
  }

  /* ── Text label pool for axis — created once, repositioned each frame ── */
  private _axisLabels: import("pixi.js").Text[] = [];

  private _setAxisLabel(tick: number, x: number, y: number, fontSize: number) {
    if (this._destroyed || !this.app || !this.PIXI) return;
    /* Grow pool on demand */
    while (this._axisLabels.length < tick) {
      const t = new this.PIXI.Text({
        text: "",
        style: {
          fontFamily:  "monospace",
          fontSize,
          fill:        0xf5a623,
          fontWeight:  "700",
          align:       "center",
        },
      });
      t.anchor.set(0.5, 0);
      t.alpha = 0.6;
      this.app.stage.addChild(t);
      this._axisLabels.push(t);
    }
    const label = this._axisLabels[tick - 1];
    /* Guard: label may be destroyed if rend.destroy() ran during a rAF frame */
    if (!label || label.destroyed) return;
    label.text  = `${tick}×`;
    label.x     = x;
    label.y     = y;
    label.alpha = 0.6;
    label.visible = true;
    label.style.fontSize = fontSize;
  }

  private _hideAxisLabels(visibleCount: number) {
    for (let i = visibleCount; i < this._axisLabels.length; i++) {
      if (!this._axisLabels[i].destroyed) this._axisLabels[i].visible = false;
    }
  }

  private emitTrailDot(m: number) {
    if (!this.app || !this.PIXI || !this.trailCont) return;
    /* Graphics circle trail — no texture dependency.
       Sprite-based trail relied on PNG assets that were often absent,
       causing the bird PNG to render as ghost copies instead.           */
    const g   = new this.PIXI.Graphics();
    const r   = 4 + Math.min(8, (m - 1) * 0.8);
    const col = m >= 5 ? TRAIL_GLOW : TRAIL_COLOR;
    g.circle(0, 0, r).fill({ color: col, alpha: 0.6 });
    g.x = this.birdX + (Math.random() - 0.5) * 8;
    g.y = this.birdY + (Math.random() - 0.5) * 8;
    this.trailCont.addChild(g);
    gsap.to(g, {
      alpha: 0,
      x: g.x - r * 3.5 * Math.cos(this.bird.rotation || 0),
      y: g.y + r * 1.2,
      duration: 0.4 + Math.random() * 0.2, ease: "power1.out",
      onComplete: () => {
        if (!g.destroyed) {
          try { this.trailCont?.removeChild(g); g.destroy(); } catch { /* gone */ }
        }
      },
    });
  }

  private updateParticles() {
    for (let i = this.particles.length - 1; i >= 0; i--) {
      const p = this.particles[i];
      /* Skip already-destroyed sprites (can occur after rend.destroy()) */
      if (p.sp.destroyed) { this.particles.splice(i, 1); continue; }
      p.sp.x += p.vx; p.sp.y += p.vy;
      p.vy += 0.08; p.vx *= 0.97;
      p.life -= p.decay;
      p.sp.alpha = p.life;
      if (p.life <= 0) {
        try { this.particleCont?.removeChild(p.sp); p.sp.destroy(); } catch { /* already gone */ }
        this.particles.splice(i, 1);
      }
    }
  }

  /** Safe texture helper — never throws, returns null if not ready */
  private tex(src: string): import("pixi.js").Texture | null {
    return this.t(src);  /* delegate to pre-populated cache */
  }

  emitParticles(x: number, y: number, count: number, src: string, spd = 3.5, sz = 30) {
    /* Demo mode: skip all PNG particle bursts — they clutter the preview canvas */
    if (this.isDemo) return;
    if (!this.app || !this.PIXI) return;
    const t = this.tex(src);
    if (!t) return;
    for (let i = 0; i < count; i++) {
      const sp  = new this.PIXI.Sprite(t);
      const ang = Math.random() * Math.PI * 2;
      const s   = spd * (0.5 + Math.random());
      sp.anchor.set(0.5);
      sp.width  = sz * (0.7 + Math.random() * 0.6);
      sp.height = sp.width;
      sp.x = x; sp.y = y; sp.alpha = 0.9;
      this.particleCont.addChild(sp);
      this.particles.push({
        sp,
        vx: Math.cos(ang) * s,
        vy: Math.sin(ang) * s - Math.random() * 2,
        life: 1,
        decay: 0.014 + Math.random() * 0.016,
      });
    }
  }

  /* ── Phase transitions ── */
  onFlyingStart() {
    if (this._destroyed) return;
    /* Switch hunter from idle → aiming as bird takes off */
    this._setHunter("hunterAim");
    this.emitParticles(this.birdX, this.birdY, 12, A.spawnFx, 4.5, 38);
  }

  onSuccess(x: number, y: number) {
    if (this._destroyed) return;
    this._setHunter("hunterWin");
    /* Hunter celebration */
    gsap.fromTo(this.hunter, { y: this.hunter.y },
      { y: this.hunter.y - 18, duration: 0.18, yoyo: true, repeat: 3, ease: "power1.inOut",
        onComplete: () => {
          /* Guard: hunter may be destroyed if rend.destroy() ran during the tween */
          if (this._destroyed || !this.hunter || this.hunter.destroyed) return;
          this.hunter.y = this.H - this._groundH() + 2;
        },
      });
    this.emitParticles(x, y, 28, A.goldTrail, 4.5, 36);
    this.emitParticles(x, y, 12, A.goldCoin,  3.5, 28);
    this.emitParticles(x, y, 10, A.featherPt, 3,   26);
    this.emitParticles(x, y, 6,  A.trophy,    2.5, 32);
    gsap.to(this.targetLock, { alpha: 0, duration: 0.3 });

    /* ── Freeze bird at current position — single upward bounce then hold ──
       Use a GSAP timeline stored as _successLoop so destroy() can kill it
       reliably. The nested onComplete → gsap.to pattern creates an orphan
       inner tween that survives the killTweensOf sweep in destroy().         */
    this._killSuccessLoop();
    gsap.killTweensOf(this.bird.scale);
    gsap.killTweensOf(this.bird);
    this.bird.scale.set(this._birdBaseScale);
    this.bird.rotation = -0.12;
    /* Store in _successLoop so destroy() can kill both segments atomically */
    this._successLoop = gsap.timeline()
      .to(this.bird, { y: this.birdY - this.H * 0.06, duration: 0.35, ease: "power2.out" })
      .to(this.bird, { y: this.birdY - this.H * 0.02, duration: 0.50, ease: "power1.in" });
  }

  onEscapeStart(x: number, y: number) {
    if (this._destroyed) return;
    const tFail = this.t(A.birdFail);
    if (tFail && !this.bird.destroyed) this.bird.texture = tFail;
    this._setHunter("hunterFail");
    /* Dejected hunter slump */
    gsap.to(this.hunter, { rotation: 0.15, duration: 0.35, ease: "power1.out" });
    this.emitParticles(x, y, 24, A.feathers, 5, 34);
    this.emitParticles(x, y, 12, A.burst,    4, 46);
    gsap.to(this.targetLock, { alpha: 0, duration: 0.2 });
    /* Camera shake */
    gsap.to(this.app!.stage, {
      x: 10, duration: 0.04, yoyo: true, repeat: 9, ease: "none",
      onComplete: () => {
        if (this._destroyed || !this.app) return;
        this.app.stage.x = 0;
      },
    });
  }

  onNewRound() {
    if (this._destroyed) return;
    this._killSuccessLoop();   /* stop SUCCESS flying loop before resetting bird position */
    /* Reset bird → eagle, position near ground */
    const tBird = this.t(A.bird);
    if (tBird && !this.bird.destroyed) {
      this.bird.texture = tBird; this._birdTierKey = "bird";
      /* Reapply proportional size so reset always matches buildScene */
      this.bird.width  = this.W * 0.16;
      this.bird.height = this.bird.width * (tBird.height / tBird.width);
      this._birdBaseScale = this.bird.scale.x;
    }
    this.birdX = this.W * 0.18; this.birdY = this.H * 0.75;
    this.bird.x = this.birdX; this.bird.y = this.birdY;
    this.bird.rotation = 0; this.bird.alpha = 0;
    this.bird.scale.set(this._birdBaseScale * 0.35);
    gsap.to(this.bird, { alpha: 1, duration: 0.5, ease: "power2.out" });
    gsap.to(this.bird.scale, { x: this._birdBaseScale, y: this._birdBaseScale, duration: 0.5, ease: "back.out(1.7)" });

    /* Reset hunter → idle */
    this._setHunter("hunterIdle");
    if (!this.hunter.destroyed) {
      this.hunter.rotation = 0;
      this.hunter.y = this.H - this._groundH() + 2;
    }

    /* Reset dynamic layers — no background sprite (solid canvas colour) */
    this.trailCont.removeChildren().forEach((c: import("pixi.js").Container) => c.destroy());
    this.pathPoints = []; this.flightPath?.clear();
    this._hideAxisLabels(0);   /* reset axis labels for new round */
    this.multGlowSp.alpha = 0; this.birdGlowSp.alpha = 0; this.targetLock.alpha = 0;
  }

  /** Swap hunter texture only when the key changes */
  private _setHunter(key: keyof typeof A) {
    if (this._destroyed || this.hunter?.destroyed) return;
    if (key === this._hunterStateKey) return;
    const t = this.t(A[key]);
    if (t) { this.hunter.texture = t; this._hunterStateKey = key; }
  }

  /** Kill the SUCCESS looping flight tween if running */
  private _killSuccessLoop() {
    if (this._successLoop) { this._successLoop.kill(); this._successLoop = null; }
  }

  resize(w: number, h: number) {
    if (this._destroyed || !this.app || !this.bgOverlay || !this.groundLayer || !this.scanlines || !this.vignette) return;
    this.app.renderer.resize(w, h);
    this.W = w; this.H = h;
    this.bgOverlay.clear().rect(0, 0, w, h).fill({ color: 0, alpha: 0 });
    this._drawGround();
    this._drawScanlines();
    this._drawVignette(0);
    if (!this.hunter.destroyed) {
      this.hunter.x = w * 0.12; this.hunter.y = h - this._groundH() + 2;
    }
  }

  destroy() {
    this._destroyed = true;
    /* Set the module-level fence so the next PixiRenderer.init() waits
       until this GL context is fully torn down before creating a new one. */
    let _resolve!: () => void;
    _rendererDestroyFence = new Promise<void>(r => { _resolve = r; });

    this._killSuccessLoop();   /* kill SUCCESS loop tween before GSAP sweep */
    gsap.killTweensOf(this.bird);
    gsap.killTweensOf(this.hunter);
    gsap.killTweensOf(this.birdGlowSp);
    gsap.killTweensOf(this.multGlowSp);
    if (this.app?.stage) gsap.killTweensOf(this.app.stage);
    try {
      this.trailCont?.children.forEach((c) => gsap.killTweensOf(c));
      this.particleCont?.children.forEach((c) => gsap.killTweensOf(c));
      this.particles.forEach((p) => gsap.killTweensOf(p.sp));
    } catch { /* containers may be null if init never completed */ }
    this.particles = [];

    /* ── Clear the PIXI.Assets singleton fully BEFORE app.destroy() ─────────
       PIXI.Assets maintains THREE separate internal caches:
         1. resolver._assetMap      — URL → asset descriptor (cleared by Assets.reset())
         2. resolver._resolverHash  — URL → resolved asset  (cleared by Assets.reset())
         3. Cache (TextureCache)    — URL → Texture object  (cleared by Cache.remove/Assets.reset())
       Prior fix used Cache.remove() per URL which only clears cache #3.
       The resolver._assetMap (#1) was left intact. On next boot, Assets.load()
       sees hasKey(url)=true (map still populated), skips re-adding, calls
       resolver.resolve() → _buildResolvedAsset() → getUrlExtension(src).
       If src was corrupted to null by app.destroy(), null.split('.') crashes.
       Fix: call Assets.reset() which clears ALL THREE caches atomically.    */
    try {
      if (this.PIXI) {
        this.PIXI.Assets.reset();   /* clears resolver._assetMap + _resolverHash + cache */
        this._tex.clear();
      }
    } catch { /* PIXI not imported if init() never completed */ }

    /* Destroy pooled axis Text objects before app.destroy() */
    try {
      this._axisLabels.forEach(t => { try { t.destroy(); } catch { /* already gone */ } });
      this._axisLabels = [];
    } catch { /* pool may be empty if init never completed */ }

    /* ── Second GSAP sweep — catches orphan tweens spawned by onComplete callbacks ──
       onSuccess() queues a nested gsap.to(this.bird) inside an onComplete callback.
       That inner tween is created AFTER the first gsap.killTweensOf(this.bird) ran,
       so it is never killed by the first sweep.
       A second kill right before app.destroy() removes all such orphans.           */
    gsap.killTweensOf(this.bird);
    gsap.killTweensOf(this.hunter);
    if (this.app?.stage) gsap.killTweensOf(this.app.stage);

    this.app?.destroy(false, { children: true });
    this.app = null;
    /* Fence fulfilled — next init() may now proceed */
    _resolve();
  }
}

/* ══════════════════════════════════════════
   HUNT GAME ENGINE (FSM + tick, no render)
   ══════════════════════════════════════════ */
class HuntEngine {
  private mult:    MultiplierEngine;
  private cfg:     GameCfg;
  private rafId    = 0;
  private frame    = 0;
  private acted    = false;
  private cdStart  = 0;
  private escVx    = 5;
  private escVy    = -2;
  private birdX    = 0;
  private birdY    = 0;
  phase: Phase     = "WAITING";

  onPhaseChange: (p: Phase, m: number) => void = () => {};
  onMultChange:  (m: number) => void = () => {};
  onEscape:      (x: number, y: number) => void = () => {};
  onSuccess:     (x: number, y: number) => void = () => {};
  onTick:        (m: number, phase: Phase, bx: number, by: number) => void = () => {};
  onCountdown:   (n: number) => void = () => {};

  constructor(cfg: GameCfg) {
    this.cfg  = cfg;
    this.mult = new MultiplierEngine(cfg);
  }

  startRound(initialX: number, initialY: number) {
    if (this.phase !== "WAITING" && this.phase !== "DONE") return;
    this.acted = false; this.frame = 0;
    this.mult  = new MultiplierEngine(this.cfg);
    this.birdX = initialX; this.birdY = initialY;
    this.escVx = 5; this.escVy = -2;
    this.cdStart = performance.now();
    this._phase("COUNTDOWN");
  }

  secureAction(bx: number, by: number): number | null {
    if (this.phase !== "FLYING" || this.acted) return null;
    this.acted = true;
    const m = this.mult.current();
    this.mult.stop();
    this.onSuccess(bx, by);
    this._phase("SUCCESS");
    return Math.floor(m * 100);
  }

  adminCrash() { if (this.phase === "FLYING") this._doEscape(); }

  private _doEscape() {
    const m = this.mult.current();
    this.mult.stop();
    this.onEscape(this.birdX, this.birdY);
    this._phase("ESCAPED");
  }

  private _phase(p: Phase) {
    this.phase = p;
    this.onPhaseChange(p, this.mult.current());
  }

  private tick = () => {
    this.frame++;
    const m = this.mult.current();

    if (this.phase === "COUNTDOWN") {
      const el = (performance.now() - this.cdStart) / 1000;
      const n  = Math.max(0, 3 - Math.floor(el));
      this.onCountdown(n);
      if (el >= 4.0) { this.mult.start(); this._phase("FLYING"); }
    }

    if (this.phase === "FLYING") {
      this.onMultChange(m);
      if (!this.acted && this.mult.hasEscaped()) this._doEscape();
    }

    if (this.phase === "ESCAPED") {
      this.escVx += 0.8; this.escVy -= 0.25;
      this.birdX += this.escVx; this.birdY += this.escVy;
    }

    this.onTick(m, this.phase, this.birdX, this.birdY);
    this.rafId = requestAnimationFrame(this.tick);
  };

  start()   { this.rafId = requestAnimationFrame(this.tick); }
  destroy() { cancelAnimationFrame(this.rafId); }
}

/* ══════════════════════════════════════════
   DEMO ENGINE
   Runs continuous looping preview flights on the Pixi canvas when no
   real game is active.  Reuses MultiplierEngine (composition, DRY).
   Never calls onGameOver — purely cosmetic.
   ══════════════════════════════════════════ */
class DemoEngine {
  private mult!:   MultiplierEngine;
  private rafId  = 0;
  private phase: Phase = "WAITING";
  private cdStart = 0;
  private birdX  = 0;
  private birdY  = 0;
  private holdTimer: ReturnType<typeof setTimeout> | null = null;

  /** Demo caps cycle through high values so idle screen shows impressive numbers.
   *  Always "none" bias — outcome is random per round but cap is always enticing. */
  private static readonly DEMO_CAPS = [8, 12, 15, 20, 25, 10, 18];
  private static _capIdx = 0;

  private static randCfg(): GameCfg {
    /* Cycle through preset high caps so every demo looks different */
    const cap = DemoEngine.DEMO_CAPS[DemoEngine._capIdx % DemoEngine.DEMO_CAPS.length];
    DemoEngine._capIdx++;
    return { ...DEFAULT_CFG, biasMode: "none", escapeMin: cap * 0.85, escapeMax: cap };
  }

  onTick:        (m: number, phase: Phase, bx: number, by: number) => void = () => {};
  onPhaseChange: (p: Phase, m: number) => void = () => {};
  onMultChange:  (m: number) => void = () => {};
  onEscape:      (bx: number, by: number) => void = () => {};
  onSuccess:     (bx: number, by: number) => void = () => {};

  /** Start the first demo round on the given canvas dimensions */
  startDemo(canvasW: number, canvasH: number) {
    this.birdX = canvasW * 0.18;
    this.birdY = canvasH * 0.75;
    this._startRound();
  }

  private _startRound() {
    this.mult  = new MultiplierEngine(DemoEngine.randCfg());
    this.phase = "WAITING";
    this.cdStart = performance.now();
    this._setPhase("COUNTDOWN");
  }

  private _setPhase(p: Phase) {
    this.phase = p;
    this.onPhaseChange(p, this.mult.current());
  }

  private tick = () => {
    const m = this.mult.current();

    if (this.phase === "COUNTDOWN") {
      const el = (performance.now() - this.cdStart) / 1000;
      /* Shorter countdown in demo (1.5 s) so it feels snappy */
      if (el >= 1.5) { this.mult.start(); this._setPhase("FLYING"); }
    }

    if (this.phase === "FLYING") {
      this.onMultChange(m);
      if (this.mult.hasEscaped()) {
        /* Always escape in demo — bird flies high and off-screen so users see big numbers */
        this.mult.stop();
        this.onEscape(this.birdX, this.birdY);
        this._setPhase("ESCAPED");
        /* Auto-reset after a visual hold so user reads the number */
        if (this.holdTimer) clearTimeout(this.holdTimer);
        this.holdTimer = setTimeout(() => {
          this.holdTimer = null;
          if (this.rafId === 0) return;
          this.onPhaseChange("DONE", m);
          this._startRound();
        }, 2800);
      }
    }

    this.onTick(m, this.phase, this.birdX, this.birdY);
    this.rafId = requestAnimationFrame(this.tick);
  };

  start() { this.rafId = requestAnimationFrame(this.tick); }

  destroy() {
    cancelAnimationFrame(this.rafId);
    this.rafId = 0;
    if (this.holdTimer) { clearTimeout(this.holdTimer); this.holdTimer = null; }
  }
}

/* ══════════════════════════════════════════
   REACT COMPONENT
   ══════════════════════════════════════════ */
interface FlappyBirdProps {
  wager:       number;
  onGameOver:  (score: number) => void;
  onCashOut?:  (score: number) => void;
  active:      boolean;
  /** When true — render only the Pixi canvas, no built-in action bar.
   *  The parent page.tsx owns stake/action controls in this mode. */
  canvasOnly?: boolean;
  /** Current multiplier exposed for parent to display */
  onMultiplierChange?: (mult: number) => void;
  /** Current phase exposed for parent button states */
  onPhaseChange?: (phase: string) => void;
}

export default function FlappyBird({
  wager, onGameOver, onCashOut, active,
  canvasOnly = false,
  onMultiplierChange,
  onPhaseChange,
}: FlappyBirdProps) {
  const canvasRef  = useRef<HTMLCanvasElement>(null);
  const rendRef    = useRef<PixiRenderer | null>(null);
  const engineRef  = useRef<HuntEngine   | null>(null);
  const bootedRef  = useRef(false);
  const multRef    = useRef({ m: 1.0, bx: 0, by: 0 });
  /** Ensures onGameOver fires exactly once per session regardless of how
   *  many ESCAPED ticks fire before React tears down the engine.           */
  const gameOverFiredRef = useRef(false);
  /* ── Demo mode refs ── */
  const demoRendRef  = useRef<PixiRenderer | null>(null);
  const demoEngRef   = useRef<DemoEngine   | null>(null);
  const demoBootRef  = useRef(false);

  const [phase,     setPhase]     = useState<Phase>("WAITING");
  const [mult,      setMult]      = useState(1.00);
  const [cfg,       setCfg]       = useState<GameCfg>(DEFAULT_CFG);
  const [cfgLoaded, setCfgLoaded] = useState(false);
  const [acted,     setActed]     = useState(false);
  const [countdown, setCountdown] = useState(3);
  /** Live multiplier shown in demo idle overlay */
  const [demoMult,  setDemoMult]  = useState(1.00);

  const reward = useMemo(() => Math.floor(wager * mult), [wager, mult]);

  /* Load config once */
  useEffect(() => {
    if (!active || cfgLoaded) return;
    const tok = typeof window !== "undefined" ? localStorage.getItem("flappywin-token") ?? "" : "";
    fetch("/api/game/config", { credentials: "include", headers: { Authorization: `Bearer ${tok}` } })
      .then(r => r.ok ? r.json() : DEFAULT_CFG)
      .then((d: Record<string, unknown>) => setCfg({
        biasMode:    (d.biasMode as "none"|"win"|"loss") ?? "none",
        escapeMin:   (d.escapeMin as number) ?? 1.1,
        escapeMax:   (d.escapeMax as number) ?? 12,
        winInterval: (d.winInterval  as number) ?? 100,
        winPerStep:  (d.winPerStep   as number) ?? 10,
      }))
      .catch(() => {})
      .finally(() => setCfgLoaded(true));
  }, [active, cfgLoaded]);

  /* Reset boot flag + UI state when game becomes inactive (round ended) */
  useEffect(() => {
    if (!active) {
      bootedRef.current = false;
      gameOverFiredRef.current = false;   /* reset one-shot guard for next session */
      setPhase("WAITING");
      setMult(1.0);
      setActed(false);
      setCountdown(3);
      setCfgLoaded(false);   /* force fresh config fetch on next boot */
    }
  }, [active]);

  /* ── Demo mode — runs continuous preview flights when no game is active ──
     Uses a separate PixiRenderer + DemoEngine pair so demo state never
     bleeds into the real game session.  Destroyed as soon as active→true. */
  useEffect(() => {
    if (active) {
      /* Real game starting — tear down demo immediately */
      if (demoEngRef.current)  { demoEngRef.current.destroy();  demoEngRef.current  = null; }
      if (demoRendRef.current) { demoRendRef.current.destroy(); demoRendRef.current = null; }
      demoBootRef.current = false;
      setDemoMult(1.00);
      return;
    }
    if (demoBootRef.current) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    demoBootRef.current = true;

    const rend = new PixiRenderer();
    rend.isDemo = true;   /* suppress particle bursts — demo shows bird flight only */
    const demo = new DemoEngine();

    demo.onPhaseChange = (p, _m) => {
      if (p === "DONE") { setDemoMult(1.00); rend.onNewRound(); }
    };
    demo.onMultChange  = (m) => { setDemoMult(m); };
    demo.onSuccess = (bx, by) => rend.onSuccess(bx, by);
    demo.onEscape  = (bx, by) => rend.onEscapeStart(bx, by);
    demo.onTick    = (m, p, _bx, _by) => rend.update(m, p);

    demoRendRef.current = rend;
    demoEngRef.current  = demo;

    rend.init(canvas).then(() => {
      const rect = canvas.getBoundingClientRect();
      demo.startDemo(rect.width, rect.height);
      demo.start();
    });

    const obs = new ResizeObserver(() => {
      const r = canvas.getBoundingClientRect();
      rend.resize(r.width, r.height);
    });
    obs.observe(canvas);

    return () => {
      obs.disconnect();
      demo.destroy();
      rend.destroy();
      demoRendRef.current = null;
      demoEngRef.current  = null;
      demoBootRef.current = false;
    };
  }, [active]);   // eslint-disable-line react-hooks/exhaustive-deps

  /* Boot once — runs each time active goes true and bootedRef is clear */
  useEffect(() => {
    if (!active || !cfgLoaded || bootedRef.current) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    bootedRef.current = true;

    const rend   = new PixiRenderer();
    const engine = new HuntEngine(cfg);

    /* Wire callbacks */
    engine.onPhaseChange = (p, m) => {
      setPhase(p);
      onPhaseChange?.(p);
      if ((p === "DONE" || p === "ESCAPED") && !gameOverFiredRef.current) {
        gameOverFiredRef.current = true;   /* one-shot: prevent multi-fire from rAF ticks */
        onGameOver(Math.floor(m * 100));
      }
    };
    engine.onMultChange = (m) => {
      setMult(m);
      multRef.current.m = m;
      onMultiplierChange?.(m);
    };
    engine.onSuccess    = (bx, by) => { rend.onSuccess(bx, by); };
    engine.onEscape     = (bx, by) => { rend.onEscapeStart(bx, by); };
    engine.onCountdown  = setCountdown;
    engine.onTick       = (m, p, bx, by) => {
      multRef.current = { m, bx, by };
      rend.update(m, p);
      /* Bird escaped off screen (right or top) → end round */
      if (p === "ESCAPED" && (bx > canvas.clientWidth + 120 || by < -80)) {
        engine.adminCrash();
      }
    };

    rendRef.current   = rend;
    engineRef.current = engine;

    rend.init(canvas).then(() => {
      engine.start();
      const rect = canvas.getBoundingClientRect();
      /* Bird starts near ground level — 75% down the canvas height */
      engine.startRound(rect.width * 0.18, rect.height * 0.75);
    });

    /* Resize handler */
    const obs = new ResizeObserver(() => {
      const r = canvas.getBoundingClientRect();
      rend.resize(r.width, r.height);
    });
    obs.observe(canvas);

    return () => {
      obs.disconnect();
      engine.destroy();
      rend.destroy();
      rendRef.current   = null;
      engineRef.current = null;
      bootedRef.current = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [active, cfgLoaded]);

  /* SPACE = secure */
  useEffect(() => {
    const h = (e: KeyboardEvent) => {
      if (e.code === "Space" && e.target === document.body) { e.preventDefault(); handleSecure(); }
    };
    window.addEventListener("keydown", h);
    return () => window.removeEventListener("keydown", h);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [phase, acted]);

  const handleSecure = useCallback(() => {
    if (acted || phase !== "FLYING") return;
    const { bx, by } = multRef.current;
    const score = engineRef.current?.secureAction(bx, by);
    if (score == null) return;
    setActed(true);
    onCashOut?.(score);
  }, [phase, acted, onCashOut]);

  const canSecure = phase === "FLYING" && !acted;

  /* Multiplier colour — smooth transition */
  const multColor = mult >= 10 ? "#ef4444" : mult >= 5 ? "#f97316" : mult >= 2 ? "#fbbf24" : "#f0f0ff";
  const multGlow  = mult >= 10 ? "#ef444466" : mult >= 5 ? "#f9731666" : mult >= 2 ? "#fbbf2466" : "transparent";

  return (
    <div className="relative w-full h-full flex flex-col bg-[#060910]" style={{ minHeight: 0 }}>

      {/* Pixi WebGL canvas */}
      <canvas
        ref={canvasRef}
        className="flex-1 block w-full touch-none"
        style={{ minHeight: 0 }}
        aria-label={`HUNT ${mult.toFixed(2)}×`}
        role="application"
      />      {/* ── Multiplier overlay — hidden in canvasOnly mode (parent page shows it) ── */}
      {phase === "FLYING" && !canvasOnly && (
        <div className="absolute top-0 left-0 right-0 flex flex-col items-center pt-2 pointer-events-none">
          {/* HUD chip — frosted glass panel frames the number */}
          <div
            className="relative flex flex-col items-center px-5 pt-2 pb-1.5 rounded-2xl"
            style={{
              background:    "rgba(4,6,14,0.55)",
              border:        `1px solid ${multColor}33`,
              backdropFilter:"blur(8px)",
              boxShadow:     `0 0 24px ${multColor}22`,
              transition:    "border-color 0.25s, box-shadow 0.25s",
            }}
          >
            {/* Ambient glow blob behind the number */}
            <div
              className="absolute inset-0 rounded-2xl blur-2xl pointer-events-none"
              style={{ background: multGlow, opacity: 0.55 }}
            />
            <span
              className="relative font-black tabular-nums leading-none tracking-tighter select-none"
              style={{
                fontSize:   "clamp(2.4rem,9vw,4.5rem)",
                color:      multColor,
                textShadow: `0 0 18px ${multColor}, 0 0 48px ${multColor}66`,
                transition: "color 0.2s, text-shadow 0.2s",
              }}
            >
              {mult.toFixed(2)}×
            </span>
            {/* Tier label — changes text as multiplier climbs */}
            <span
              className="relative text-[9px] font-black uppercase tracking-[0.3em] mt-0.5"
              style={{ color: `${multColor}99` }}
            >
              {mult >= 8 ? "LEGENDARY" : mult >= 5 ? "GOLDEN" : mult >= 3 ? "FALCON" : "EAGLE"}
            </span>
          </div>

          {/* Warning pulse — visible from m≥2 so player has warning early */}
          {phase === "FLYING" && mult >= 2 && (
            <div
              className="mt-1.5 px-3 py-0.5 rounded-full text-[10px] font-black uppercase tracking-widest animate-pulse"
              style={{
                background: mult >= 5 ? "rgba(239,68,68,0.18)" : "rgba(251,191,36,0.14)",
                border:     `1px solid ${mult >= 5 ? "rgba(239,68,68,0.45)" : "rgba(251,191,36,0.35)"}`,
                color:      mult >= 5 ? "#ef4444" : "#fbbf24",
              }}
            >
              {mult >= 5 ? "DANGER — SECURE NOW!" : "BIRD IN SIGHT"}
            </div>
          )}
        </div>
      )}

      {/* ── Countdown overlay ── */}
      {phase === "COUNTDOWN" && (
        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none gap-3">
          {/* Outer pulsing targeting ring */}
          <div className="absolute w-48 h-48 rounded-full border-2 pointer-events-none"
            style={{
              borderColor: countdown === 0 ? "#fbbf24" : "#60a5fa",
              animation: "hunt-ring 1s ease-in-out infinite",
              opacity: 0.35,
            }}
          />
          <div className="absolute w-32 h-32 rounded-full border pointer-events-none"
            style={{
              borderColor: countdown === 0 ? "#fbbf24" : "#60a5fa",
              animation: "hunt-ring 1s ease-in-out infinite 0.25s",
              opacity: 0.25,
            }}
          />
          {/* Ambient glow */}
          <div className="absolute w-40 h-40 rounded-full blur-3xl opacity-25"
            style={{ background: countdown === 0 ? "#fbbf24" : "#60a5fa" }}
          />
          {/* Number */}
          <span className="font-black leading-none select-none relative z-10"
            style={{
              fontSize:   "clamp(4rem,15vw,7rem)",
              color:      countdown === 0 ? "#fbbf24" : "#f8faff",
              textShadow: countdown === 0
                ? "0 0 40px #fbbf24, 0 0 80px #fbbf2450"
                : "0 0 20px rgba(248,250,255,0.35)",
              animation: "hunt-pop 0.25s ease",
            }}
          >
            {countdown === 0 ? "GO!" : countdown}
          </span>
          <span className="text-xs font-bold uppercase tracking-[0.35em] relative z-10"
            style={{ color: "rgba(200,210,240,0.4)" }}>
            {countdown === 0 ? "HUNT BEGINS" : "NEXT HUNT"}
          </span>
        </div>
      )}

      {/* ── Waiting / idle — demo multiplier overlay baits the user ──
           Only renders when NOT active (real game not running).
           This prevents the logo PNG from flashing over the game canvas
           during the brief tick between active=true and phase=COUNTDOWN. */}
      {(phase === "WAITING" || phase === "DONE") && !active && (
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 pointer-events-none">
          {/* Live demo multiplier number — large, colour-coded, pulsing */}
          {demoBootRef.current && demoMult > 1.01 ? (
            <>
              {/* Number */}
              <span
                className="font-black tabular-nums leading-none tracking-tighter select-none"
                style={{
                  fontSize:   "clamp(3.5rem,13vw,6rem)",
                  color:      demoMult >= 10 ? "#ef4444" : demoMult >= 5 ? "#f97316" : demoMult >= 2 ? "#fbbf24" : "#f0f0ff",
                  textShadow: demoMult >= 5
                    ? `0 0 28px #f97316, 0 0 60px #f9731644`
                    : `0 0 22px #fbbf24, 0 0 50px #fbbf2444`,
                  transition: "color 0.2s, text-shadow 0.2s",
                }}
              >
                {demoMult.toFixed(2)}×
              </span>
              {/* Tier label */}
              <span
                className="text-[10px] font-black uppercase tracking-[0.3em]"
                style={{
                  color: demoMult >= 10 ? "#ef4444" : demoMult >= 5 ? "#f97316" : "#fbbf24",
                  opacity: 0.75,
                }}
              >
                {demoMult >= 10 ? "LEGENDARY RUN" : demoMult >= 5 ? "GOLDEN FLIGHT" : demoMult >= 2 ? "FALCON MODE" : "EAGLE FLIGHT"}
              </span>
              {/* Bait CTA */}
              <span
                className="mt-1 text-xs font-semibold uppercase tracking-[0.2em]"
                style={{ color: "rgba(200,215,255,0.45)" }}
              >
                Start your hunt!
              </span>
            </>
          ) : (
            <>
              <img
                src={A.logo} alt="HUNT"
                className="w-28 object-contain opacity-70 mb-1"
                onError={e => { (e.target as HTMLImageElement).style.display = "none"; }}
              />
              <span
                className="text-sm font-semibold uppercase tracking-[0.25em]"
                style={{ color: "rgba(200,215,255,0.45)" }}
              >
                Select wager · Click START HUNT
              </span>
            </>
          )}
        </div>
      )}

      {/* ── Success flash overlay ── */}
      {phase === "SUCCESS" && (
        <div
          className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none"
          style={{ animation: "hunt-fadein 0.3s ease" }}
        >
          <div
            className="flex flex-col items-center gap-2 px-8 py-5 rounded-2xl"
            style={{
              background:   "rgba(6,9,16,0.7)",
              border:       "1px solid rgba(251,191,36,0.4)",
              backdropFilter: "blur(12px)",
            }}
          >
            <span className="text-[11px] font-bold uppercase tracking-widest text-[#fbbf24]">
              HUNT SUCCESS
            </span>
            <span
              className="font-black tabular-nums"
              style={{ fontSize: "clamp(2rem,8vw,3.5rem)", color: "#fbbf24",
                       textShadow: "0 0 30px #fbbf24" }}
            >
              {mult.toFixed(2)}×
            </span>
            <span className="text-sm font-semibold text-white/70">
              +Rs. {reward.toLocaleString()}
            </span>
          </div>
        </div>
      )}

      {/* ── Escaped flash overlay ── */}
      {phase === "ESCAPED" && (
        <div
          className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none"
          style={{ animation: "hunt-fadein 0.3s ease" }}
        >
          <div
            className="flex flex-col items-center gap-2 px-8 py-5 rounded-2xl"
            style={{
              background:   "rgba(6,9,16,0.7)",
              border:       "1px solid rgba(239,68,68,0.35)",
              backdropFilter: "blur(12px)",
            }}
          >
            <span className="text-[11px] font-bold uppercase tracking-widest text-[#ef4444]">
              HUNTER GOT THE BIRD
            </span>
            <span
              className="font-black tabular-nums"
              style={{ fontSize: "clamp(2rem,8vw,3.5rem)", color: "#ef4444",
                       textShadow: "0 0 30px #ef4444" }}
            >
              {mult.toFixed(2)}×
            </span>
            <span className="text-sm font-semibold" style={{ color: "rgba(239,68,68,0.7)" }}>
              Wager lost — secure next time
            </span>
          </div>
        </div>
      )}

      {/* ── Built-in bottom action bar — only shown when canvasOnly=false ── */}
      {!canvasOnly && (
      <div
        className="flex-shrink-0 flex flex-col items-center gap-2 px-4 py-3"
        style={{
          background:     "rgba(4,6,14,0.98)",
          borderTop:      "1px solid rgba(255,255,255,0.06)",
          backdropFilter: "blur(16px)",
        }}
      >
        {/* Live potential display */}
        {canSecure && (
          <div className="flex items-center gap-2">
            <span
              className="text-[10px] font-bold uppercase tracking-widest"
              style={{ color: "rgba(200,215,255,0.3)" }}
            >
              Potential
            </span>
            <span
              className="text-xl font-black tabular-nums"
              style={{
                color:      multColor,
                textShadow: `0 0 14px ${multColor}88`,
                transition: "color 0.2s",
              }}
            >
              Rs. {reward.toLocaleString()}
            </span>
            <span
              className="text-xs font-semibold px-1.5 py-0.5 rounded-full"
              style={{ background: "rgba(255,255,255,0.06)", color: "rgba(255,255,255,0.35)" }}
            >
              {mult.toFixed(2)}×
            </span>
          </div>
        )}

        {/* SECURE button */}
        {canSecure ? (
          <button
            type="button"
            onClick={handleSecure}
            className="w-full max-w-sm h-14 rounded-2xl font-black text-base tracking-tight
              text-[#06090f] active:scale-95 transition-transform duration-100
              focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#fbbf24]
              flex items-center justify-center gap-2.5 relative overflow-hidden"
            style={{
              background: mult >= 5
                ? "linear-gradient(135deg,#ef4444 0%,#f97316 100%)"
                : "linear-gradient(135deg,#fbbf24 0%,#f97316 100%)",
              boxShadow: mult >= 5
                ? "0 0 28px rgba(239,68,68,0.6), 0 0 60px rgba(239,68,68,0.15)"
                : "0 0 28px rgba(251,191,36,0.55), 0 0 60px rgba(251,191,36,0.15)",
              transition: "background 0.3s, box-shadow 0.3s",
            }}
          >
            {/* Shimmer effect */}
            <div
              className="absolute inset-0 pointer-events-none"
              style={{
                background: "linear-gradient(105deg,transparent 40%,rgba(255,255,255,0.15) 50%,transparent 60%)",
                animation:  "hunt-shimmer 2s ease infinite",
              }}
            />
            <img
              src={A.goldCoin} alt="" width={22} height={22}
              className="object-contain relative z-10"
              onError={e => { (e.target as HTMLImageElement).style.display = "none"; }}
            />
            <span className="relative z-10">SECURE Rs. {reward.toLocaleString()}</span>
          </button>
        ) : (
          <div className="h-14 flex items-center justify-center w-full max-w-sm">
            <div
              className="px-6 py-2 rounded-2xl text-sm font-semibold uppercase tracking-widest"
              style={{
                background: "rgba(255,255,255,0.04)",
                color:      "rgba(200,215,255,0.25)",
                border:     "1px solid rgba(255,255,255,0.05)",
              }}
            >
              {phase === "COUNTDOWN" ? "Tracking..."   :
               phase === "SUCCESS"   ? "Hunt secured!" :
               phase === "ESCAPED"   ? "Wager lost"    :
               phase === "DONE"      ? "Round over"    :
               "Select wager"}
            </div>
          </div>
        )}

        {canSecure && (
          <p
            className="text-[9px] font-medium"
            style={{ color: "rgba(200,215,255,0.18)" }}
          >
            SPACE to secure instantly
          </p>
        )}
      </div>
      )}{/* end !canvasOnly */}

      {/* Global animations (injected once) */}
      <style>{`
        @keyframes hunt-pop {
          0%   { transform: scale(0.75); opacity: 0; }
          60%  { transform: scale(1.06); }
          100% { transform: scale(1); opacity: 1; }
        }
        @keyframes hunt-fadein {
          from { opacity: 0; transform: scale(0.95); }
          to   { opacity: 1; transform: scale(1); }
        }
        @keyframes hunt-shimmer {
          0%   { transform: translateX(-100%); }
          100% { transform: translateX(200%); }
        }
        @keyframes hunt-ring {
          0%   { transform: scale(0.85); opacity: 0.15; }
          50%  { transform: scale(1.12); opacity: 0.45; }
          100% { transform: scale(0.85); opacity: 0.15; }
        }
      `}</style>
    </div>
  );
}
