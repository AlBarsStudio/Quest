// Внешние высококачественные аудиодорожки (SFX)
const SOUND_URLS = {
  // Глубокий саб-удар и нарастающий бас
  impact: 'https://assets.mixkit.co/active_storage/sfx/2874/2874-preview.mp3',
  // Космический / кинематографичный переход (Whoosh)
  whoosh: 'https://assets.mixkit.co/active_storage/sfx/2571/2571-preview.mp3',
  // Звук глитча / матрицы
  glitch: 'https://assets.mixkit.co/active_storage/sfx/2658/2658-preview.mp3',
  // Звук механической клавиатуры / терминала
  typing: 'https://assets.mixkit.co/active_storage/sfx/2544/2544-preview.mp3',
  // Разблокировка шлюза / бип подтверждения
  access: 'https://assets.mixkit.co/active_storage/sfx/2568/2568-preview.mp3',
  // Финальный взрыв перехода
  warp: 'https://assets.mixkit.co/active_storage/sfx/2875/2875-preview.mp3'
};

class SoundController {
  constructor() {
    this.audioPool = {};
    this.isMuted = false;
  }

  // Предзагрузка звуков
  preload() {
    try {
      Object.keys(SOUND_URLS).forEach((key) => {
        const audio = new Audio(SOUND_URLS[key]);
        audio.preload = 'auto';
        this.audioPool[key] = audio;
      });
    } catch (e) {
      console.warn('Audio preload error:', e);
    }
  }

  play(name, volume = 0.6) {
    if (this.isMuted) return;
    try {
      const src = SOUND_URLS[name];
      if (!src) return;
      
      const audio = new Audio(src);
      audio.volume = volume;
      audio.play().catch(() => {
        // Браузерная блокировка автоплея до первого клика
      });
    } catch (e) {
      console.warn(`Audio play failed: ${name}`, e);
    }
  }
}

export const sfx = new SoundController();
    
