"use client";
/**
 * HUNT — Premium Bird Tracking Game Layout
 * ─────────────────────────────────────────
 * Layout (spec §2):
 *   1. Game header: logo + balance + deposit
 *   2. Multiplier hero (large, colour-coded, ambient glow)
 *   3. Pixi gameplay canvas (canvasOnly mode, no built-in bar)
 *   4. Three-column strip: Stake | Potential Reward | Main Action
 *   5. Recent hunts row
 *
 * Economy: POST /api/game/session (start), PATCH (end) — unchanged.
 * NO AUDIO. DRY: authHeaders, STAKE_PRESETS, Icon — defined once.
 */
import React, { useState, useEffect, useCallback, useRef, useMemo } from "react";
import { useToast }          from "@/components/Toast";
import { GAME }              from "@/lib/gameConstants";
import { safeFetch, ApiError } from "@/lib/api";
import FlappyBird            from "./FlappyBird";
import DepositModal          from "@/components/game/DepositModal";

/* ── Types ── */
interface SessionRecord { id:string; wagerAmount:number; finalScore:number; winAmount:number; startedAt:string; }
interface WalletData {
  balance:number; walletId:string;
  sessions:SessionRecord[]; totalGames:number;
  minDeposit:number; minWager:number; maxWager:number;
  winInterval:number; winPerStep:number;
  jackpotScore:number; jackpotMult:number;
  jackpotBonusScore:number; jackpotBonusMult:number;
}


function tok() { return typeof window!=="undefined" ? localStorage.getItem("flappywin-token")??"" : ""; }
function authHeaders(json=true): Record<string,string> {
  return json
    ? { Authorization:`Bearer ${tok()}`, "Content-Type":"application/json" }
    : { Authorization:`Bearer ${tok()}` };
}

/**
 * buildStakePresets — generates 5-7 preset buttons from server-defined limits.
 * DRY: computed once from wallet data, never hardcoded.
 * Algorithm: start at minWager, multiply by ~2x each step, cap at maxWager.
 * Always includes minWager as the first entry so admin-set floor is always visible.
 */
function buildStakePresets(min: number, max: number): number[] {
  if (min <= 0 || max <= 0 || min > max) return [min];
  const steps = [1, 2, 5, 10, 25, 50, 100, 250, 500, 1000, 2500, 5000, 10000];
  // Find first step >= min, then collect ~6 entries up to max
  const result: number[] = [];
  for (const s of steps) {
    const v = s * Math.ceil(min / (s || 1));
    if (v >= min && v <= max && !result.includes(v)) result.push(v);
    if (result.length >= 7) break;
  }
  // Always ensure min and max appear
  if (!result.includes(min)) result.unshift(min);
  if (!result.includes(max) && result.length < 8) result.push(max);
  return [...new Set(result)].sort((a, b) => a - b);
}

/* ── Colour helper ── */
function mc(m:number) {
  return m>=10?"#ef4444":m>=5?"#f97316":m>=2?"#fbbf24":"#f0f0ff";
}

/* ── SVG icon ── */
function Icon({ d, className="w-5 h-5" }:{d:string;className?:string}) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"
      aria-hidden="true"><path d={d}/></svg>
  );
}

/* ══════════════════════════════════════════
   MAIN GAME PAGE
   ══════════════════════════════════════════ */
export default function GamePage() {
  const toast = useToast();

  /* wallet */
  const [wallet,   setWallet]   = useState<WalletData|null>(null);
  const [wLoading, setWLoading] = useState(true);
  const [wError,   setWError]   = useState("");

  /* session */
  const [wager,        setWager]       = useState(GAME.MIN_WAGER);
  const [gameActive,   setGameActive]  = useState(false);
  const [gameKey,      setGameKey]     = useState(0); /* increments each session → fresh canvas DOM node */
  const [startBusy,    setStartBusy]   = useState(false);
  const [depositOpen,  setDepositOpen] = useState(false);
  const sessionRef    = useRef<string|null>(null);
  const securingRef   = useRef(false);   /* prevent double-click on SECURE */
  const initialWagerSetRef = useRef(false); /* snap wager to server minWager on first load */
  /** Timer that delays setGameActive(false) so the result animation plays out.
   *  Cleared on unmount and at start of each new game.                        */
  const resultHoldRef = useRef<ReturnType<typeof setTimeout>|null>(null);

  /* live game feedback */
  const [liveMult,  setLiveMult]  = useState(1.0);
  const [livePhase, setLivePhase] = useState("WAITING");
  const livePhaseRef = useRef("WAITING"); /* ref so click handler never stale-closes */
  const liveMultRef  = useRef(1.0);       /* ref so onCashOut reads instant mult */

  /** Sync setter — updates both state (for render) and ref (for click handler) atomically */
  const setPhase = useCallback((p: string) => {
    livePhaseRef.current = p;
    setLivePhase(p);
  }, []);

  /** Sync mult setter — updates state + ref atomically so onCashOut reads live value */
  const setMult = useCallback((m: number) => {
    liveMultRef.current = m;
    setLiveMult(m);
  }, []);

  /* recent hunts */
  const [recent, setRecent] = useState<{mult:number;won:boolean}[]>([]);

  /* ── wallet ── */
  const fetchWallet = useCallback(async()=>{
    try {
      setWError("");
      const d = await safeFetch<WalletData>("/api/game/wallet",{credentials:"include",headers:authHeaders()});
      setWallet(d);
      if (!initialWagerSetRef.current) {
        /* First load — snap wager to server minWager so admin-set floor is respected.
           Math.max(w, minWager) alone only clamps UP; if initial state (GAME.MIN_WAGER=120)
           is above minWager (e.g. 5), wager stays at 120 forever.
           On first load we always use minWager as the correct starting point.          */
        initialWagerSetRef.current = true;
        setWager(d.minWager);
      } else {
        /* Subsequent refreshes (30s poll, BroadcastChannel) — only clamp if the
           current wager has fallen below the (possibly updated) minWager.               */
        setWager(w => w < d.minWager ? d.minWager : w > d.maxWager ? d.maxWager : w);
      }
    } catch(e){ setWError(e instanceof ApiError?e.message:"Failed to load wallet."); }
    finally { setWLoading(false); }
  },[]);

  useEffect(()=>{
    fetchWallet();
    const id = setInterval(fetchWallet, 30_000);

    /* ── Listen for admin settings changes broadcast ──────────────────────
       When an admin saves game settings in any same-origin tab,
       a BroadcastChannel message "game-settings-updated" is posted.
       We re-fetch the wallet immediately so stake presets, deposit minimums,
       and wager limits reflect the new values without waiting 30 seconds.    */
    let ch: BroadcastChannel | null = null;
    try {
      ch = new BroadcastChannel("hunt:settings");
      ch.onmessage = (e: MessageEvent) => {
        if (e.data?.type === "game-settings-updated") fetchWallet();
      };
    } catch { /* BroadcastChannel not supported — fall back to 30s poll */ }

    return () => {
      clearInterval(id);
      if (resultHoldRef.current) clearTimeout(resultHoldRef.current);
      try { ch?.close(); } catch { /* already closed */ }
    };
  },[fetchWallet]);

  /* ── start ── */
  const startGame = useCallback(async()=>{
    if(!wallet||wallet.balance<wager){ toast.error("Insufficient balance. Please deposit first."); return; }
    setStartBusy(true);
    try {
      const d = await safeFetch<{sessionId:string}>("/api/game/session",{
        method:"POST",credentials:"include",headers:authHeaders(),body:JSON.stringify({wagerAmount:wager}),
      });
      sessionRef.current = d.sessionId;
      setWallet(w=>w?{...w,balance:w.balance-wager}:w);
      securingRef.current = false;
      /* Clear any pending result-hold timer from the previous round */
      if(resultHoldRef.current){ clearTimeout(resultHoldRef.current); resultHoldRef.current=null; }
      setLiveMult(1.0); liveMultRef.current = 1.0; setPhase("WAITING");
      setGameKey(k => k + 1);   /* new key → React remounts FlappyBird with a fresh <canvas> */
      setGameActive(true);
    } catch(e){ toast.error(e instanceof ApiError?e.message:"Could not start game."); }
    finally { setStartBusy(false); }
  },[wallet,wager,toast]);

  /* ── end session ──────────────────────────────────────────────────────────
     Two-phase teardown:
       1. API phase (immediate)  — PATCH /api/game/session, credit balance, toast.
       2. Visual phase (delayed) — setGameActive(false) fires after RESULT_HOLD_MS
          so the SUCCESS/ESCAPED canvas animation plays out before idle screen shows.
     cashout=true  → player pressed SECURE  → phase will be "SUCCESS"
     cashout=false → bird escaped/hunter got it → phase will be "ESCAPED"
     The wager was already deducted in startGame — on a loss no credit is given.  */
  const RESULT_HOLD_MS = 2500;

  const endSession = useCallback(async(finalScore:number, cashout:boolean)=>{
    const sid = sessionRef.current;
    if(!sid) return;
    sessionRef.current  = null;
    securingRef.current = false;

    /* Phase label already set by FlappyBird's onPhaseChange callback
       ("SUCCESS" or "ESCAPED") — we preserve it during the hold.
       Only after the hold do we transition to "DONE" + idle.           */

    /* ── 1. API teardown — fire immediately, don't block the animation ── */
    const mult = Math.round(finalScore/100*100)/100;
    safeFetch<{winAmount:number;milestoneWin:number;jackpotWin:number}>("/api/game/session",{
      method:"PATCH",credentials:"include",headers:authHeaders(),
      body:JSON.stringify({sessionId:sid,finalScore,cashout}),
    }).then(d=>{
      const won = d.winAmount>0;
      setRecent(p=>[{mult,won},...p].slice(0,10));
      if(won){
        /* Do NOT do a second setWallet here — onCashOut already applied an
           optimistic credit. fetchWallet() below reconciles the true balance. */
        toast.success(`+Rs. ${d.winAmount} earned!`);
      } else if(!cashout){
        /* Bird escaped — wager already deducted on session start, no refund */
        toast.error(`Hunter got the bird! Rs. ${wager.toLocaleString()} lost.`);
      }
      fetchWallet();
    }).catch(e=>{ toast.error(e instanceof ApiError?e.message:"Failed to save result."); fetchWallet(); });

    /* ── 2. Visual teardown — delayed so animation plays ── */
    if(resultHoldRef.current) clearTimeout(resultHoldRef.current);
    resultHoldRef.current = setTimeout(()=>{
      resultHoldRef.current = null;
      setGameActive(false);
      setPhase("DONE");
      /* Increment key → React unmounts old FlappyBird (destroys WebGL ctx + clears
         PIXI.Assets cache) then mounts a fresh instance with a clean canvas for demo.
         Without this, the demo renderer calls init() on a canvas whose WebGL context
         was already destroyed by the real game's app.destroy() → white canvas.       */
      setGameKey(k => k + 1);
    }, RESULT_HOLD_MS);
  },[toast,fetchWallet,setPhase]);

  const onGameOver = useCallback((s:number)=>endSession(s,false),[endSession]);
  const onCashOut  = useCallback((s:number)=>{
    if(securingRef.current) return;   /* block double fire */
    securingRef.current=true;
    /* ── Optimistic balance credit ──────────────────────────────────────
       winAmount = wager × multiplier (crash-game formula, mirrors server).
       We credit instantly so the player sees their new balance immediately
       rather than waiting for the PATCH response (~50ms).
       The `.then()` in endSession will call fetchWallet() which reconciles
       the true server balance, correcting any rounding difference.       */
    const optimisticWin = Math.round(wager * liveMultRef.current);
    setWallet(w => w ? { ...w, balance: w.balance + optimisticWin } : w);
    endSession(s,true);
  },[endSession, wager]);

  /* ── derived ── */
  const balance  = wallet?.balance??0;
  const minWager = wallet?.minWager??GAME.MIN_WAGER;
  const maxWager = wallet?.maxWager??GAME.MAX_WAGER;
  const stakePresets = useMemo(()=>buildStakePresets(minWager, maxWager),[minWager, maxWager]);
  const reward   = useMemo(()=>Math.floor(wager*liveMult),[wager,liveMult]);
  const clr      = mc(liveMult);
  const isFlying = livePhase==="FLYING";

  /* SECURE action — reads live ref, not state, to avoid stale closure */
  const handleSecurePage = useCallback(()=>{
    if(livePhaseRef.current!=="FLYING"||securingRef.current) return;
    /* Dispatch Space to document.body — FlappyBird's keyboard handler checks
       e.target === document.body to avoid button-focus conflicts.
       securingRef guard is set inside FlappyBird's onCashOut path. */
    document.body.dispatchEvent(
      new KeyboardEvent("keydown",{code:"Space",bubbles:true,cancelable:true})
    );
  },[]);

  /* merge API sessions + live recent */
  const allRecent = useMemo(()=>{
    const api = (wallet?.sessions??[]).map(s=>({mult:s.finalScore/100,won:s.winAmount>0}));
    return [...recent,...api].slice(0,10);
  },[recent,wallet]);

  /* ── loading / error ── */
  if(wLoading) return(
    <div className="flex flex-col gap-3 animate-pulse p-4">
      <div className="h-14 rounded-2xl" style={{background:"rgba(255,255,255,0.04)"}}/>
      <div className="h-10 rounded-xl" style={{background:"rgba(255,255,255,0.04)"}}/>
      <div className="rounded-2xl" style={{height:"clamp(180px,38vh,340px)",background:"rgba(255,255,255,0.04)"}}/>
      <div className="h-28 rounded-2xl" style={{background:"rgba(255,255,255,0.04)"}}/>
    </div>
  );
  if(wError) return(
    <div className="flex flex-col items-center gap-4 py-16 text-center">
      <Icon d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" className="w-10 h-10 text-red-400"/>
      <p className="font-semibold text-white">{wError}</p>
      <button type="button" onClick={fetchWallet}
        className="px-5 py-2 rounded-full text-sm font-bold border text-white/60 hover:text-white transition-colors"
        style={{borderColor:"rgba(255,255,255,0.1)"}}>
        Retry
      </button>
    </div>
  );

  /* ══════════════════════════════════════
     RENDER
     ══════════════════════════════════════ */
  return (
    <div className="flex flex-col gap-0 w-full min-h-0"
      style={{background:"radial-gradient(ellipse 80% 50% at 50% 0%,rgba(59,130,246,0.08) 0%,transparent 65%),#060910"}}>

      {/* 1 ── HEADER */}
      <header className="flex items-center justify-between px-3 sm:px-5 py-2.5 flex-shrink-0 min-w-0"
        style={{borderBottom:"1px solid rgba(255,255,255,0.05)"}}>

        {/* Left: logo + name + badge */}
        <div className="flex items-center gap-1.5 min-w-0 flex-shrink-0">
          <img src="/assets/branding/hunt-icon.png" alt="HUNT" className="w-6 h-6 sm:w-7 sm:h-7 object-contain flex-shrink-0"
            onError={e=>{(e.target as HTMLImageElement).style.display="none";}}/>
          <span className="font-black text-white text-base sm:text-lg tracking-tight whitespace-nowrap">HUNT</span>
          <span className="max-[380px]:hidden inline-flex text-[9px] font-bold uppercase tracking-widest px-1.5 py-0.5 rounded-full flex-shrink-0"
            style={{background:"rgba(251,191,36,0.1)",color:"#fbbf24",border:"1px solid rgba(251,191,36,0.2)"}}>
            Arcade
          </span>
        </div>

        {/* Right: balance + deposit */}
        <div className="flex items-center gap-2 flex-shrink-0">
          {/* Balance pill — shows coin icon on sm+, number always */}
          <div className="flex items-center gap-1 sm:gap-1.5 px-2 sm:px-3 py-1.5 rounded-full"
            style={{background:"rgba(255,255,255,0.05)",border:"1px solid rgba(255,255,255,0.08)"}}>
            <img src="/assets/rewards/coin.png" alt="" className="w-3.5 h-3.5 sm:w-4 sm:h-4 object-contain"
              onError={e=>{(e.target as HTMLImageElement).style.display="none";}}/>
            <span className="font-black tabular-nums text-xs sm:text-sm text-white whitespace-nowrap">
              {/* Show "Rs." label only on sm+ to save space */}
              <span className="hidden sm:inline">Rs. </span>
              {balance.toLocaleString()}
            </span>
          </div>

          {/* Deposit button — icon only on xs, icon+text on sm+ */}
          <button type="button" onClick={()=>setDepositOpen(true)}
            className="flex items-center gap-1 sm:gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-full text-xs font-bold transition-all active:scale-95 flex-shrink-0"
            style={{background:"linear-gradient(135deg,#fbbf24,#f97316)",color:"#060910",
              boxShadow:"0 0 14px rgba(251,191,36,0.35)"}}>
            <Icon d="M12 4v16m8-8H4" className="w-3.5 h-3.5"/>
            <span className="hidden sm:inline">Deposit</span>
          </button>
        </div>
      </header>

      {/* 2 ── MULTIPLIER HERO */}
      <div className="flex flex-col items-center justify-center py-2 flex-shrink-0 relative overflow-hidden"
        style={{minHeight:"72px"}}>
        {gameActive&&(
          <>
            <div className="absolute inset-0 pointer-events-none"
              style={{background:`radial-gradient(ellipse 70% 100% at 50% 0%,${clr}15 0%,transparent 70%)`,
                      transition:"background 0.3s"}}/>
            {/* Live counter only during FLYING — freeze display on result */}
            {isFlying ? (
              <>
                <span className="relative font-black tabular-nums leading-none select-none"
                  style={{fontSize:"clamp(2.8rem,9vw,5rem)",color:clr,
                          textShadow:`0 0 28px ${clr}88,0 0 60px ${clr}33`,
                          transition:"color 0.25s,text-shadow 0.25s"}}>
                  {liveMult.toFixed(2)}×
                </span>
                {liveMult>=3&&(
                  <div className="mt-1 px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-widest animate-pulse"
                    style={{background:"rgba(239,68,68,0.1)",border:"1px solid rgba(239,68,68,0.28)",color:"#ef4444"}}>
                    BIRD IN SIGHT — SECURE NOW!
                  </div>
                )}
              </>
            ) : livePhase==="SUCCESS" ? (
              <span className="relative font-black tabular-nums leading-none select-none"
                style={{fontSize:"clamp(2.8rem,9vw,5rem)",color:"#fbbf24",
                        textShadow:"0 0 28px #fbbf2488,0 0 60px #fbbf2433"}}>
                {liveMult.toFixed(2)}×
              </span>
            ) : livePhase==="ESCAPED" ? (
              <span className="relative font-black tabular-nums leading-none select-none"
                style={{fontSize:"clamp(2.8rem,9vw,5rem)",color:"#ef4444",
                        textShadow:"0 0 28px #ef444488,0 0 60px #ef444433"}}>
                {liveMult.toFixed(2)}×
              </span>
            ) : (
              <p className="text-xs font-semibold uppercase tracking-[0.2em]"
                style={{color:"rgba(200,215,255,0.3)"}}>Tracking…</p>
            )}
          </>
        )}
        {!gameActive&&(
          <p className="text-xs font-semibold uppercase tracking-[0.2em]"
            style={{color:"rgba(200,215,255,0.3)"}}>
            Watching demo · Select stake to play
          </p>
        )}
      </div>

      {/* 3 ── PIXI CANVAS
           Height: vh-based clamp so it fills the screen proportionally on any phone.
           42vw on narrow screens (375px phone inside dashboard) = ~158px → too short.
           38vh gives ~307px on a 812px iPhone, ~260px on a 680px small Android — correct. */}
      <div className="flex-shrink-0 mx-3 sm:mx-4 relative"
        style={{
          height:"clamp(180px,38vh,340px)",
          borderRadius:"20px",overflow:"hidden",
          border:`1.5px solid ${gameActive ? clr+"55" : "rgba(255,255,255,0.07)"}`,
          boxShadow:gameActive
            ?`0 0 0 1px ${clr}22, 0 0 40px ${clr}30, 0 0 80px ${clr}14, 0 8px 40px rgba(0,0,0,0.7)`
            :"0 8px 32px rgba(0,0,0,0.5)",
          transition:"box-shadow 0.35s, border-color 0.35s",
        }}>
        <FlappyBird
          key={gameKey}
          wager={wager} onGameOver={onGameOver} onCashOut={onCashOut}
          active={gameActive} canvasOnly={true}
          onMultiplierChange={setMult}
          onPhaseChange={setPhase}
        />
        {/* Demo badge — shown while idle so user knows they're watching a preview */}
        {!gameActive&&(
          <div className="absolute top-2 right-2 pointer-events-none z-10">
            <span className="text-[9px] font-black uppercase tracking-widest px-2 py-0.5 rounded-full"
              style={{background:"rgba(255,255,255,0.08)",color:"rgba(200,215,255,0.4)",
                      border:"1px solid rgba(255,255,255,0.1)"}}>
              DEMO
            </span>
          </div>
        )}
        {/* Escaped overlay — visible during result hold AND after game ends */}
        {livePhase==="ESCAPED"&&(
          <div className="absolute inset-0 flex items-center justify-center"
            style={{background:"rgba(6,9,16,0.65)",animation:"hunt-fi 0.3s ease"}}>
            <div className="flex flex-col items-center gap-2 px-8 py-5 rounded-2xl"
              style={{background:"rgba(6,9,16,0.6)",border:"1px solid rgba(239,68,68,0.3)",backdropFilter:"blur(10px)"}}>
              {/* Icon row */}
              <div className="flex items-center gap-2">
                <svg className="w-4 h-4 flex-shrink-0" viewBox="0 0 24 24" fill="none"
                  stroke="#ef4444" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <path d="M12 9v4m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"/>
                </svg>
                <p className="text-[10px] font-black uppercase tracking-widest" style={{color:"#ef4444"}}>
                  HUNTER GOT THE BIRD
                </p>
              </div>
              {/* Multiplier at escape */}
              <p className="font-black tabular-nums leading-none"
                style={{fontSize:"clamp(2.2rem,7vw,3rem)",color:"#ef4444",textShadow:"0 0 22px #ef444488"}}>
                {liveMult.toFixed(2)}×
              </p>
              {/* Wager lost — the key message */}
              <p className="text-sm font-black" style={{color:"rgba(239,68,68,0.85)"}}>
                −Rs. {wager.toLocaleString()} lost
              </p>
              <p className="text-[10px]" style={{color:"rgba(200,215,255,0.4)"}}>
                Secure the bird next time
              </p>
            </div>
          </div>
        )}
        {/* Success overlay — visible during result hold AND after game ends */}
        {livePhase==="SUCCESS"&&(
          <div className="absolute inset-0 flex items-center justify-center"
            style={{background:"rgba(6,9,16,0.5)",animation:"hunt-fi 0.3s ease"}}>
            <div className="flex flex-col items-center gap-1.5 px-8 py-4 rounded-2xl"
              style={{background:"rgba(6,9,16,0.55)",border:"1px solid rgba(251,191,36,0.28)",backdropFilter:"blur(8px)"}}>
              <p className="text-[10px] font-bold uppercase tracking-widest" style={{color:"#fbbf24"}}>HUNT SECURED</p>
              <p className="font-black tabular-nums" style={{fontSize:"2.5rem",color:"#fbbf24",textShadow:"0 0 20px #fbbf24"}}>
                {liveMult.toFixed(2)}×
              </p>
              <p className="text-sm font-bold" style={{color:"#fbbf24"}}>+Rs. {reward.toLocaleString()}</p>
            </div>
          </div>
        )}
        <style>{`
          @keyframes hunt-fi{from{opacity:0;transform:scale(0.96);}to{opacity:1;transform:scale(1);}}
          @keyframes hunt-sh{0%{transform:translateX(-100%);}100%{transform:translateX(200%);}}
        `}</style>
      </div>

      {/* 4 ── CONTROLS STRIP
           Mobile:  Stake full-width, then Reward | Action side by side (2-col)
           Desktop: all three in a single row (3-col)                           */}
      <div className="flex-shrink-0 px-3 sm:px-4 pt-2.5 pb-2">
        {/* Stake — always full-width on mobile, 1/3 on desktop */}
        <div className="flex flex-col gap-1.5 p-3 rounded-2xl mb-2 sm:hidden"
          style={{background:"rgba(255,255,255,0.03)",border:"1px solid rgba(255,255,255,0.07)"}}>
          <p className="text-[10px] font-bold uppercase tracking-widest"
            style={{color:"rgba(200,215,255,0.38)"}}>Stake</p>
          <div className="flex flex-wrap gap-1.5">
            {stakePresets.map(s=>(
              <button key={s} type="button"
                disabled={gameActive||balance<s}
                onClick={()=>setWager(s)}
                className="px-2.5 py-1 rounded-lg text-xs font-bold transition-all disabled:opacity-25 disabled:cursor-not-allowed"
                style={{
                  background:wager===s?"rgba(251,191,36,0.15)":"rgba(255,255,255,0.05)",
                  border:`1px solid ${wager===s?"rgba(251,191,36,0.4)":"rgba(255,255,255,0.08)"}`,
                  color:wager===s?"#fbbf24":"rgba(200,215,255,0.55)",
                }}>
                {s}
              </button>
            ))}
          </div>
          <input type="number" min={minWager} max={balance} value={wager}
            disabled={gameActive}
            onChange={e=>setWager(Math.max(minWager,parseInt(e.target.value)||minWager))}
            className="h-8 px-3 rounded-lg text-xs font-bold w-full outline-none"
            style={{background:"rgba(255,255,255,0.05)",border:"1px solid rgba(255,255,255,0.09)",
                    color:"#fbbf24",opacity:gameActive?0.4:1}}/>
        </div>

        {/* Mobile: Reward + Action row */}
        <div className="flex gap-2 sm:hidden">
          {/* POTENTIAL REWARD — compact */}
          <div className="flex-1 flex flex-col justify-center items-center gap-0.5 p-2.5 rounded-2xl min-w-0"
            style={{background:"rgba(255,255,255,0.03)",border:"1px solid rgba(255,255,255,0.07)"}}>
            <p className="text-[9px] font-bold uppercase tracking-widest"
              style={{color:"rgba(200,215,255,0.38)"}}>Reward</p>
            <p className="font-black tabular-nums text-base leading-tight"
              style={{
                color:isFlying?clr:"rgba(200,215,255,0.45)",
                textShadow:isFlying?`0 0 10px ${clr}55`:"none",
                transition:"color 0.25s",
              }}>
              Rs.&nbsp;{reward.toLocaleString()}
            </p>
            {isFlying&&(
              <p className="text-[9px]" style={{color:"rgba(200,215,255,0.3)"}}>
                {liveMult.toFixed(2)}×
              </p>
            )}
          </div>

          {/* MAIN ACTION — compact */}
          <div className="flex-1 flex flex-col justify-center items-center p-2 rounded-2xl min-w-0"
            style={{background:"rgba(255,255,255,0.03)",border:"1px solid rgba(255,255,255,0.07)"}}>
            {!gameActive ? (
              <button type="button" disabled={startBusy||balance<wager}
                onClick={startGame}
                className="w-full h-12 rounded-xl font-black text-sm text-black transition-all active:scale-95 disabled:opacity-35 disabled:cursor-not-allowed"
                style={{background:"linear-gradient(135deg,#fbbf24,#f97316)",
                        boxShadow:"0 0 18px rgba(251,191,36,0.4)"}}>
                {startBusy?"…":"START HUNT"}
              </button>
            ) : isFlying ? (
              <button type="button"
                onClick={handleSecurePage}
                className="w-full h-12 rounded-xl font-black text-xs text-black transition-all active:scale-95 relative overflow-hidden"
                style={{
                  background:liveMult>=5?"linear-gradient(135deg,#ef4444,#f97316)":"linear-gradient(135deg,#fbbf24,#f97316)",
                  boxShadow:liveMult>=5?"0 0 22px rgba(239,68,68,0.5)":"0 0 22px rgba(251,191,36,0.45)",
                  transition:"background 0.3s,box-shadow 0.3s",
                }}>
                <div className="absolute inset-0 pointer-events-none"
                  style={{background:"linear-gradient(105deg,transparent 40%,rgba(255,255,255,0.18) 50%,transparent 60%)",
                          animation:"hunt-sh 2s ease infinite"}}/>
                <span className="relative text-xs leading-tight">SECURE<br/>Rs.&nbsp;{reward.toLocaleString()}</span>
              </button>
            ) : (
              <div className="w-full h-12 rounded-xl flex items-center justify-center text-[10px] font-semibold uppercase tracking-wider text-center"
                style={{background:"rgba(255,255,255,0.04)",color:"rgba(200,215,255,0.28)",
                        border:"1px solid rgba(255,255,255,0.06)"}}>
                {livePhase==="COUNTDOWN"?"Tracking…":
                 livePhase==="SUCCESS"?"Secured!":
                 livePhase==="ESCAPED"?"Wager Lost":
                 livePhase==="DONE"?"Done":"Waiting…"}
              </div>
            )}
          </div>
        </div>

        {/* Desktop: original 3-col grid (unchanged) */}
        <div className="hidden sm:grid sm:grid-cols-3 gap-2.5">

          {/* STAKE */}
          <div className="flex flex-col gap-2 p-3 rounded-2xl"
            style={{background:"rgba(255,255,255,0.03)",border:"1px solid rgba(255,255,255,0.07)"}}>
            <p className="text-[10px] font-bold uppercase tracking-widest"
              style={{color:"rgba(200,215,255,0.38)"}}>Stake</p>
            <div className="flex flex-wrap gap-1.5">
              {stakePresets.map(s=>(
                <button key={s} type="button"
                  disabled={gameActive||balance<s}
                  onClick={()=>setWager(s)}
                  className="px-2.5 py-1 rounded-lg text-xs font-bold transition-all disabled:opacity-25 disabled:cursor-not-allowed"
                  style={{
                    background:wager===s?"rgba(251,191,36,0.15)":"rgba(255,255,255,0.05)",
                    border:`1px solid ${wager===s?"rgba(251,191,36,0.4)":"rgba(255,255,255,0.08)"}`,
                    color:wager===s?"#fbbf24":"rgba(200,215,255,0.55)",
                  }}>
                  {s}
                </button>
              ))}
            </div>
            <input type="number" min={minWager} max={balance} value={wager}
              disabled={gameActive}
              onChange={e=>setWager(Math.max(minWager,parseInt(e.target.value)||minWager))}
              className="h-8 px-3 rounded-lg text-xs font-bold w-full outline-none"
              style={{background:"rgba(255,255,255,0.05)",border:"1px solid rgba(255,255,255,0.09)",
                      color:"#fbbf24",opacity:gameActive?0.4:1}}/>
          </div>

          {/* POTENTIAL REWARD */}
          <div className="flex flex-col justify-center items-center gap-1 p-3 rounded-2xl"
            style={{background:"rgba(255,255,255,0.03)",border:"1px solid rgba(255,255,255,0.07)"}}>
            <p className="text-[10px] font-bold uppercase tracking-widest"
              style={{color:"rgba(200,215,255,0.38)"}}>Potential Reward</p>
            <p className="font-black tabular-nums"
              style={{
                fontSize:"clamp(1.5rem,4vw,2.2rem)",
                color:isFlying?clr:"rgba(200,215,255,0.45)",
                textShadow:isFlying?`0 0 14px ${clr}55`:"none",
                transition:"color 0.25s,text-shadow 0.25s",
              }}>
              Rs. {reward.toLocaleString()}
            </p>
            {isFlying&&(
              <p className="text-[10px]" style={{color:"rgba(200,215,255,0.3)"}}>
                {liveMult.toFixed(2)}×
              </p>
            )}
          </div>

          {/* MAIN ACTION */}
          <div className="flex flex-col justify-center items-center gap-2 p-3 rounded-2xl"
            style={{background:"rgba(255,255,255,0.03)",border:"1px solid rgba(255,255,255,0.07)"}}>
            {!gameActive ? (
              <button type="button" disabled={startBusy||balance<wager}
                onClick={startGame}
                className="w-full h-14 rounded-xl font-black text-sm text-black transition-all active:scale-95 disabled:opacity-35 disabled:cursor-not-allowed"
                style={{background:"linear-gradient(135deg,#fbbf24,#f97316)",
                        boxShadow:"0 0 22px rgba(251,191,36,0.4)"}}>
                {startBusy?"Starting…":"START HUNT"}
              </button>
            ) : isFlying ? (
              <button type="button"
                onClick={handleSecurePage}
                className="w-full h-14 rounded-xl font-black text-sm text-black transition-all active:scale-95 relative overflow-hidden"
                style={{
                  background:liveMult>=5
                    ?"linear-gradient(135deg,#ef4444,#f97316)"
                    :"linear-gradient(135deg,#fbbf24,#f97316)",
                  boxShadow:liveMult>=5
                    ?"0 0 28px rgba(239,68,68,0.5)"
                    :"0 0 28px rgba(251,191,36,0.45)",
                  transition:"background 0.3s,box-shadow 0.3s",
                }}>
                <div className="absolute inset-0 pointer-events-none"
                  style={{background:"linear-gradient(105deg,transparent 40%,rgba(255,255,255,0.18) 50%,transparent 60%)",
                          animation:"hunt-sh 2s ease infinite"}}/>
                <span className="relative">SECURE Rs. {reward.toLocaleString()}</span>
              </button>
            ) : (
              <div className="w-full h-14 rounded-xl flex items-center justify-center text-xs font-semibold uppercase tracking-widest"
                style={{background:"rgba(255,255,255,0.04)",color:"rgba(200,215,255,0.28)",
                        border:"1px solid rgba(255,255,255,0.06)"}}>
                {livePhase==="COUNTDOWN"?"Tracking…":
                 livePhase==="SUCCESS"?"Hunt Secured!":
                 livePhase==="ESCAPED"?"Wager Lost":
                 livePhase==="DONE"?"Round Over":"Waiting…"}
              </div>
            )}
            {!gameActive&&balance<wager&&(
              <p className="text-[10px] font-semibold text-center" style={{color:"rgba(251,191,36,0.65)"}}>
                Need Rs. {(wager-balance).toLocaleString()} more ·{" "}
                <button type="button" onClick={()=>setDepositOpen(true)}
                  className="underline underline-offset-2 hover:opacity-80 transition-opacity">
                  Deposit
                </button>
              </p>
            )}
            {isFlying&&(
              <p className="text-[9px]" style={{color:"rgba(200,215,255,0.2)"}}>
                SPACE to secure instantly
              </p>
            )}
          </div>
        </div>{/* end desktop sm:grid */}
      </div>{/* end controls strip */}

      {/* 5 ── RECENT HUNTS */}
      {allRecent.length>0&&(
        <div className="flex-shrink-0 px-3 sm:px-4 pb-4">
          <div className="p-3 rounded-2xl"
            style={{background:"rgba(255,255,255,0.025)",border:"1px solid rgba(255,255,255,0.06)"}}>
            <p className="text-[10px] font-bold uppercase tracking-widest mb-2.5"
              style={{color:"rgba(200,215,255,0.35)"}}>Recent Hunts</p>
            <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
              {allRecent.map((h,i)=>(
                <div key={i} className="flex-shrink-0 flex flex-col items-center gap-0.5 px-3 py-2 rounded-xl"
                  style={{
                    background:h.won?"rgba(251,191,36,0.08)":"rgba(239,68,68,0.06)",
                    border:`1px solid ${h.won?"rgba(251,191,36,0.2)":"rgba(239,68,68,0.15)"}`,
                    minWidth:"58px",
                  }}>
                  <span className="text-xs font-black tabular-nums"
                    style={{color:h.won?"#fbbf24":"#ef4444"}}>
                    {h.mult.toFixed(2)}×
                  </span>
                  <span className="text-[8px] font-bold uppercase"
                    style={{color:h.won?"rgba(251,191,36,0.55)":"rgba(239,68,68,0.5)"}}>
                    {h.won?"WIN":"LOST"}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {depositOpen&&wallet&&(
        <DepositModal
          minDeposit={wallet.minDeposit}
          onClose={()=>setDepositOpen(false)}
          onSuccess={()=>{setDepositOpen(false);fetchWallet();}}
        />
      )}
    </div>
  );
}
