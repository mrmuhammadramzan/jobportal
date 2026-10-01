/**
 * notifSound.ts — Programmatic notification chime via Web Audio API.
 *
 * NO audio files, NO CDN, NO third-party libs.
 * Generates a two-tone chime entirely in JavaScript.
 *
 * Gate: only plays when NEXT_PUBLIC_NOTIF_SOUND is not "false".
 * Defaults to enabled. Set NEXT_PUBLIC_NOTIF_SOUND=false in .env.local
 * to silence all notification sounds.
 *
 * Two chime flavours:
 *   playNotifSound("alert") — rising two-tone (new request / incoming event)
 *   playNotifSound("success") — major chord feel (approval)
 *   playNotifSound("error") — descending (rejection)
 *
 * OOP: SoundChime class owns the AudioContext singleton so it is only
 *       created once (browsers allow ≤ a handful per tab).
 */

type SoundFlavour = "alert" | "success" | "error";

/* Frequency pairs [start Hz, end Hz] and envelope for each flavour */
const CHIMES: Record<SoundFlavour, { freqs: number[]; gainPeak: number }> = {
  alert:   { freqs: [660, 880],       gainPeak: 0.18 },
  success: { freqs: [528, 660, 880],  gainPeak: 0.14 },
  error:   { freqs: [440, 330],       gainPeak: 0.12 },
};

class SoundChime {
  private ctx: AudioContext | null = null;

  private enabled(): boolean {
    if (typeof window === "undefined") return false;
    return process.env.NEXT_PUBLIC_NOTIF_SOUND !== "false";
  }

  private getCtx(): AudioContext | null {
    if (!this.enabled()) return null;
    if (!this.ctx) {
      try {
        this.ctx = new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)();
      } catch { return null; }
    }
    /* Resume if suspended (browser autoplay policy) */
    if (this.ctx.state === "suspended") {
      this.ctx.resume().catch(() => {});
    }
    return this.ctx;
  }

  play(flavour: SoundFlavour = "alert"): void {
    const ctx = this.getCtx();
    if (!ctx) return;

    const { freqs, gainPeak } = CHIMES[flavour];
    const now   = ctx.currentTime;
    const step  = 0.12; /* seconds per note */

    freqs.forEach((freq, i) => {
      const osc  = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.type      = "sine";
      osc.frequency.setValueAtTime(freq, now + i * step);

      /* Short attack → sustain → quick release */
      gain.gain.setValueAtTime(0,         now + i * step);
      gain.gain.linearRampToValueAtTime(gainPeak, now + i * step + 0.04);
      gain.gain.exponentialRampToValueAtTime(0.001,  now + i * step + step);

      osc.start(now + i * step);
      osc.stop( now + i * step + step);
    });
  }
}

/* Singleton — one AudioContext for the whole tab lifetime */
const chime = new SoundChime();

export function playNotifSound(flavour: SoundFlavour = "alert"): void {
  chime.play(flavour);
}
