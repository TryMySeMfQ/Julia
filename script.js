/**
 * JTA Portfolio - Cyberpunk/Gamer Edition
 * Script completo com efeitos avançados de jogo
 */

class JTAPortfolio {
  constructor() {
      this.config = {
          easterEggTrigger: ['j', 't', 'a'],
          radioStations: [
              { 
                  name: "K-DST - The Dust (Rock Classic)", 
                  genre: "rock",
                  cover: "images/rock.jpg"
              },
              { 
                  name: "Bounce FM (Electronic)", 
                  genre: "electronic",
                  cover: "images/radio-electro.jpg"
              },
              { 
                  name: "Radio Los Santos (Hip-Hop)", 
                  genre: "hiphop",
                  cover: "images/radio-hiphop.jpg"
              },
              { 
                  name: "KPOP.LIVE (K-Pop Hits)", 
                  genre: "kpop",
                  cover: "images/radio-kpop.jpg"
              }
          ],
          radioInterval: 15000,
          glitchElements: ['.glitch', '.neon-text', '.section-title', '.jta-badge'],
          musicBars: '.music-bars span',
          soundEffects: {
              hover: "sounds/hover.wav",
              select: "sounds/select.wav",
              switch: "sounds/switch.wav",
              confirm: "sounds/confirm.flac",
              cheat: "sounds/cheat.wav"
          },
          particles: true
      };

      this.currentStationIndex = 0;
      this.isPlaying = false;
      this.audioContext = null;
      this.sounds = {};
      this.init();
  }

  init() {
      this.initCurrentYear();
      this.initThemeSwitcher();
      this.initEasterEgg();
      this.initRadioStation();
      this.initSmoothScrolling();
      this.initAnimations();
      this.initLazyLoading();
      this.initGlitchEffects();
      this.initMusicBars();
      this.initSoundEffects();
      this.initGameButtons();
      this.initConsoleLogStyle();
      
      if (this.config.particles) {
          this.initParticles();
      }
  }

  initCurrentYear() {
      document.getElementById('current-year').textContent = new Date().getFullYear();
  }

  initThemeSwitcher() {
      const themeSwitcher = document.querySelector('.theme-switcher');
      const htmlElement = document.documentElement;
      
      // Verifica tema salvo ou preferência do sistema
      const savedTheme = localStorage.getItem('theme') || 
                        (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
      
      htmlElement.setAttribute('data-theme', savedTheme);
      this.updateThemeIcon(themeSwitcher, savedTheme);
      
      themeSwitcher.addEventListener('click', () => {
          const currentTheme = htmlElement.getAttribute('data-theme');
          const newTheme = currentTheme === 'light' ? 'dark' : 'light';
          
          htmlElement.setAttribute('data-theme', newTheme);
          localStorage.setItem('theme', newTheme);
          
          this.updateThemeIcon(themeSwitcher, newTheme);
          this.playSound('switch');
      });
  }

  updateThemeIcon(button, theme) {
      const icon = button.querySelector('i');
      if (!icon) return;
      
      icon.className = theme === 'dark' ? 'fas fa-sun' : 'fas fa-moon';
  }

  initEasterEgg() {
      const easterEgg = document.getElementById('easterEgg');
      let keySequence = [];
      
      const handleKeyDown = (e) => {
          const key = e.key.toLowerCase();
          
          if (this.config.easterEggTrigger.includes(key)) {
              keySequence.push(key);
              
              if (this.arraysEqual(keySequence, this.config.easterEggTrigger)) {
                  this.showEasterEgg(easterEgg);
                  this.playSound('cheat');
                  keySequence = [];
              }
              
              if (keySequence.length > this.config.easterEggTrigger.length) {
                  keySequence = [];
              }
          } else {
              keySequence = [];
          }
      };
      
      document.addEventListener('keydown', handleKeyDown);
  }

  showEasterEgg(element) {
      element.classList.add('show');
      
      setTimeout(() => {
          element.classList.remove('show');
      }, 3000);
  }

  initRadioStation() {
      const radioDisplay = document.querySelector('.station-name');
      const radioVisualizer = document.querySelector('.radio-visualizer');
      const playPauseBtn = document.querySelector('.play-pause');
      const prevBtn = document.querySelector('.prev');
      const nextBtn = document.querySelector('.next');
      
      if (!radioDisplay || !this.config.radioStations.length) return;
      
      // Inicia com a primeira estação
      this.changeRadioStation();
      
      // Configura controles
      playPauseBtn.addEventListener('click', () => {
          this.isPlaying = !this.isPlaying;
          playPauseBtn.innerHTML = this.isPlaying ? 
              '<i class="fas fa-pause"></i>' : '<i class="fas fa-play"></i>';
          this.playSound('select');
      });
      
      prevBtn.addEventListener('click', () => {
          this.currentStationIndex = 
              (this.currentStationIndex - 1 + this.config.radioStations.length) % 
              this.config.radioStations.length;
          this.changeRadioStation();
          this.playSound('select');
      });
      
      nextBtn.addEventListener('click', () => {
          this.currentStationIndex = 
              (this.currentStationIndex + 1) % this.config.radioStations.length;
          this.changeRadioStation();
          this.playSound('select');
      });
      
      // Anima visualizador
      this.animateRadioVisualizer(radioVisualizer);
  }

  changeRadioStation() {
      const station = this.config.radioStations[this.currentStationIndex];
      const radioDisplay = document.querySelector('.station-name');
      const radioElement = document.querySelector('.radio-station');
      
      if (!radioDisplay || !radioElement) return;
      
      radioDisplay.textContent = station.name;
      radioElement.className = `radio-station ${station.genre}`;
      
      // Efeito de transição
      radioDisplay.style.animation = 'none';
      void radioDisplay.offsetWidth;
      radioDisplay.style.animation = 'radioTune 0.5s';
  }

  animateRadioVisualizer(visualizer) {
      const bars = visualizer.querySelectorAll('span');
      
      bars.forEach((bar, index) => {
          const duration = 0.5 + Math.random() * 0.5;
          const delay = index * 0.1;
          
          bar.style.animation = `equalizer ${duration}s infinite ease-in-out ${delay}s`;
      });
  }

  initSmoothScrolling() {
      document.querySelectorAll('a[href^="#"]').forEach(anchor => {
          anchor.addEventListener('click', (e) => {
              const targetId = anchor.getAttribute('href');
              const targetElement = document.querySelector(targetId);
              
              if (targetElement) {
                  e.preventDefault();
                  this.playSound('select');
                  
                  targetElement.scrollIntoView({
                      behavior: 'smooth',
                      block: 'start'
                  });
                  
                  history.pushState(null, null, targetId);
              }
          });
      });
  }

  initAnimations() {
      const observer = new IntersectionObserver((entries) => {
          entries.forEach(entry => {
              if (entry.isIntersecting) {
                  entry.target.classList.add('animate');
              }
          });
      }, {
          threshold: 0.1,
          rootMargin: '0px 0px -50px 0px'
      });
      
      document.querySelectorAll('[data-animate]').forEach(element => {
          observer.observe(element);
      });
  }

  initLazyLoading() {
      if ('loading' in HTMLImageElement.prototype) {
          document.querySelectorAll('img[loading="lazy"]').forEach(img => {
              if (img.dataset.src) img.src = img.dataset.src;
          });
      } else {
          const lazyObserver = new IntersectionObserver((entries) => {
              entries.forEach(entry => {
                  if (entry.isIntersecting) {
                      const img = entry.target;
                      if (img.dataset.src) img.src = img.dataset.src;
                      lazyObserver.unobserve(img);
                  }
              });
          });
          
          document.querySelectorAll('img[loading="lazy"]').forEach(img => {
              lazyObserver.observe(img);
          });
      }
  }

  initGlitchEffects() {
      this.config.glitchElements.forEach(selector => {
          document.querySelectorAll(selector).forEach(element => {
              element.addEventListener('mouseenter', () => {
                  element.classList.add('glitch-active');
              });
              
              element.addEventListener('mouseleave', () => {
                  element.classList.remove('glitch-active');
              });
          });
      });
  }

  initMusicBars() {
      document.querySelectorAll(this.config.musicBars).forEach((bar, index) => {
          const duration = 1 + Math.random() * 0.5;
          const delay = index * 0.1;
          
          bar.style.animation = `equalizer ${duration}s infinite ease-in-out ${delay}s`;
      });
  }

  initSoundEffects() {
      // Tenta criar AudioContext
      try {
          this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
          
          // Pré-carrega efeitos sonoros
          Object.entries(this.config.soundEffects).forEach(([key, path]) => {
              fetch(path)
                  .then(response => response.arrayBuffer())
                  .then(arrayBuffer => this.audioContext.decodeAudioData(arrayBuffer))
                  .then(audioBuffer => {
                      this.sounds[key] = audioBuffer;
                  });
          });
      } catch (e) {
          console.warn("Web Audio API não suportada ou bloqueada:", e);
      }
      
      // Configura elementos com efeitos sonoros
      document.querySelectorAll('[data-sound]').forEach(element => {
          const soundType = element.getAttribute('data-sound');
          
          element.addEventListener('mouseenter', () => {
              if (soundType === 'hover') this.playSound(soundType);
          });
          
          element.addEventListener('click', () => {
              if (soundType !== 'hover') this.playSound(soundType);
          });
      });
  }

  playSound(type) {
      if (!this.audioContext || !this.sounds[type]) return;
      
      const source = this.audioContext.createBufferSource();
      source.buffer = this.sounds[type];
      source.connect(this.audioContext.destination);
      
      // Ajusta volume baseado no tipo
      const gainNode = this.audioContext.createGain();
      const volume = {
          hover: 0.3,
          select: 0.5,
          switch: 0.4,
          confirm: 0.6,
          cheat: 0.7
      }[type] || 0.5;
      
      gainNode.gain.value = volume;
      source.connect(gainNode);
      gainNode.connect(this.audioContext.destination);
      
      source.start(0);
  }

  initGameButtons() {
      document.querySelectorAll('.game-button, .menu-item').forEach(button => {
          // Efeito de brilho ao passar o mouse
          button.addEventListener('mouseenter', () => {
              const shine = document.createElement('div');
              shine.className = 'button-shine';
              button.appendChild(shine);
              
              setTimeout(() => {
                  shine.remove();
              }, 1000);
          });
      });
  }

  initParticles() {
      // Configura partículas para fundo (opcional)
      // Implementação depende da biblioteca de partículas escolhida
      console.log("Inicializando partículas...");
      // particlesJS.load('particles-js', 'assets/particles.json');
  }

  initConsoleLogStyle() {
      console.log('%cJTA PORTFOLIO v2.4.1', 
          'color: #ff2a6d; font-size: 18px; font-weight: bold; font-family: "Audiowide", sans-serif;');
      console.log('%cROCK, KPOP E CÓDIGO PESADO!', 
          'font-size: 14px; color: #05d9e8; font-family: "Press Start 2P", cursive;');
      console.log('%c🔫 GAME STYLE ACTIVATED 🔫', 
          'font-size: 16px; color: #f9f002;');
  }

  arraysEqual(a, b) {
      return a.length === b.length && a.every((val, index) => val === b[index]);
  }
}

// Inicializa quando o DOM estiver pronto
document.addEventListener('DOMContentLoaded', () => {
  const portfolio = new JTAPortfolio();
  
  // Easter egg adicional - clique no logo
  document.querySelector('.jta-badge').addEventListener('click', () => {
      portfolio.playSound('cheat');
  });
});

// Polyfill para smooth scrolling
if (!('scrollBehavior' in document.documentElement.style)) {
  import('smoothscroll-polyfill').then(module => {
      module.polyfill();
  });
}