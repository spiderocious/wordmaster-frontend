/**
 * Sound Service
 *
 * Manages game sound effects with mute/unmute functionality
 */

class SoundService {
  private isMuted: boolean = false;
  private listeners: Set<(muted: boolean) => void> = new Set();
  private activeSounds: Set<HTMLAudioElement> = new Set();

  private sounds = {
    buttonClick: new Audio('sounds/button-click.wav'),
    roundStart: new Audio('/sounds/round-start.wav'),
    letterSpin: new Audio('/sounds/spin.wav'),
    letterReveal: new Audio('https://assets.mixkit.co/active_storage/sfx/2018/2018-preview.mp3'),
    success: new Audio('/sounds/success.wav'),
    error: new Audio('https://assets.mixkit.co/active_storage/sfx/2955/2955-preview.mp3'),
    tick: new Audio('data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBg=='),
    complete: new Audio('/sounds/complete.wav'),
    answering: new Audio('/sounds/answering.wav'),
    welcome: new Audio('/sounds/welcome.wav'),
  };

  constructor() {
    const saved = localStorage.getItem('wordblitz_muted');
    this.isMuted = saved === 'true';

    Object.values(this.sounds).forEach(sound => {
      sound.volume = 0.3;
    });

    Object.values(this.sounds).forEach(sound => {
      sound.load();
    });

    const observer = new MutationObserver(() => {
      document.querySelectorAll("button").forEach(button => {
        if (!(button as any)._hasSoundListener) {
          button.addEventListener("click", () => {
            this.playButtonClick();
          });
          (button as any)._hasSoundListener = true;
        }
      });
    });

    observer.observe(document.body, { childList: true, subtree: true });
  }

  private playSound(sound: HTMLAudioElement): () => void {
    if (this.isMuted) return () => {};

    const clone = sound.cloneNode() as HTMLAudioElement;
    clone.volume = sound.volume;

    this.activeSounds.add(clone);

    const cleanup = () => {
      this.activeSounds.delete(clone);
    };

    clone.addEventListener('ended', cleanup);
    clone.addEventListener('pause', cleanup);

    clone.play().catch(() => {
      cleanup();
    });

    return () => {
      clone.pause();
      clone.currentTime = 0;
      cleanup();
    };
  }

  playWelcome(): () => void {
    return this.playSound(this.sounds.welcome);
  }

  playAnswering(): () => void {
    return this.playSound(this.sounds.answering);
  }

  playButtonClick(): () => void {
    return this.playSound(this.sounds.buttonClick);
  }

  playRoundStart(): () => void {
    return this.playSound(this.sounds.roundStart);
  }

  playLetterSpin(): () => void {
    return this.playSound(this.sounds.letterSpin);
  }

  playLetterReveal(): () => void {
    return this.playSound(this.sounds.letterReveal);
  }

  playSuccess(): () => void {
    return this.playSound(this.sounds.success);
  }

  playError(): () => void {
    return this.playSound(this.sounds.error);
  }

  playTick(): () => void {
    return this.playSound(this.sounds.tick);
  }

  playComplete(): () => void {
    return this.playSound(this.sounds.complete);
  }

  stopAllSounds() {
    this.activeSounds.forEach(sound => {
      sound.pause();
      sound.currentTime = 0;
    });
    this.activeSounds.clear();
  }

  toggleMute() {
    this.isMuted = !this.isMuted;
    localStorage.setItem('wordblitz_muted', String(this.isMuted));

    if (this.isMuted) {
      this.stopAllSounds();
    }

    this.notifyListeners();
  }

  setMuted(muted: boolean) {
    this.isMuted = muted;
    localStorage.setItem('wordblitz_muted', String(this.isMuted));
    this.notifyListeners();
  }

  getMuted(): boolean {
    return this.isMuted;
  }

  subscribe(listener: (muted: boolean) => void) {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  private notifyListeners() {
    this.listeners.forEach(listener => listener(this.isMuted));
  }
}

export const soundService = new SoundService();
