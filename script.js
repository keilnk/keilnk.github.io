/* ----------------------------
   Navigation (no inline handlers)
----------------------------- */
document.addEventListener('click', (e) => {
  const btn = e.target.closest('.redirect-button[data-href]');
  if (btn) {
    const url = btn.getAttribute('data-href');
    if (url) window.location.href = url;
  }
});

/* ----------------------------
   DON’T CLICK -> new tab + danger click effect
----------------------------- */
const dontClickBtn = document.getElementById('dontClick');
if (dontClickBtn) {
  dontClickBtn.addEventListener('click', () => {
    // Visual danger nudge
    dontClickBtn.animate([
      { transform:'translateX(-50%) scale(1)', filter:'contrast(1)' },
      { transform:'translateX(-50%) scale(1.08)', filter:'contrast(1.3)' },
      { transform:'translateX(-50%) scale(1)', filter:'contrast(1)' }
    ], { duration: 320, easing:'cubic-bezier(.3,.7,.2,1)' });
    // Original action
    window.open('./Pages/dontClick.htm', '_blank', 'noopener,noreferrer');
  });
}

/* ----------------------------
   Audio consent + controls
----------------------------- */
const audioOverlay = document.getElementById('audioOverlay');
const enableAudioBtn = document.getElementById('enableAudio');
const backgroundMusic = document.getElementById('backgroundMusic');
const muteButton = document.getElementById('muteButton');
const volumeSlider = document.getElementById('volumeSlider');

document.addEventListener('DOMContentLoaded', () => {
  if (backgroundMusic) {
    backgroundMusic.play().catch(() => {
      if (audioOverlay) audioOverlay.style.display = 'flex';
    });
  }
});

if (enableAudioBtn) {
  enableAudioBtn.addEventListener('click', () => {
    if (!backgroundMusic) return;
    backgroundMusic.muted = false;
    if (audioOverlay) audioOverlay.style.display = 'none';
    localStorage.setItem('audioEnabled', 'true');
    backgroundMusic.play().catch(() => {});
  });
}

if (localStorage.getItem('audioEnabled') === 'true' && backgroundMusic) {
  backgroundMusic.muted = false;
  if (audioOverlay) audioOverlay.style.display = 'none';
  backgroundMusic.play().catch(() => {});
}

let audioUnlocked = false;
document.addEventListener('click', function initAudio() {
  if (!audioUnlocked && backgroundMusic) {
    backgroundMusic.muted = false;
    audioUnlocked = true;
    document.removeEventListener('click', initAudio);
  }
}, { once: true });

if (muteButton && backgroundMusic) {
  muteButton.addEventListener('click', () => {
    backgroundMusic.muted = !backgroundMusic.muted;
    muteButton.textContent = backgroundMusic.muted ? 'Unmute' : 'Mute';
  });
}

if (volumeSlider && backgroundMusic) {
  volumeSlider.addEventListener('input', () => {
    backgroundMusic.volume = Number(volumeSlider.value);
  });
}

/* ----------------------------
   Seamless video loop fade
----------------------------- */
const bgVideo = document.getElementById('backgroundVideo');
if (bgVideo) {
  const fade = ()=> {
    bgVideo.classList.add('fade-restart');
    setTimeout(()=> {
      bgVideo.currentTime = 0.05;
      bgVideo.play().catch(()=>{});
      bgVideo.classList.remove('fade-restart');
    }, 120);
  };
  bgVideo.addEventListener('ended', (e)=> { e.preventDefault(); fade(); });
}

/* ----------------------------
   Live counter (local visits or Firebase-ready)
----------------------------- */
const viewsEl = document.getElementById('viewsCounter');
if (viewsEl) {
  const total = Number(localStorage.getItem('visits_total') || '0') + 1;
  localStorage.setItem('visits_total', String(total));
  viewsEl.textContent = String(total); // replace with Firebase online count if enabled
}

/* ----------------------------
   Secret modal gate (SHA-256)
----------------------------- */
async function sha256Hex(str) {
  const enc = new TextEncoder().encode(str);
  const buf = await crypto.subtle.digest('SHA-256', enc);
  return Array.from(new Uint8Array(buf)).map(b => b.toString(16).padStart(2, '0')).join('');
}

// IMPORTANT: set to the SHA-256 of the plain password (not the hash itself)
const SECRET_HASH = '83974b9e12373ca84ce7431c7e6e0d92b047bf590da77c80f63e34886344ea5b';

const openSecret = document.getElementById('openSecret');
const pwModal = document.getElementById('pwModal');
const pwInput = document.getElementById('pwInput');
const pwSubmit = document.getElementById('pwSubmit');
const pwCancel = document.getElementById('pwCancel');
const pwError = document.getElementById('pwError');

// Open modal
if (openSecret && pwModal) {
  openSecret.addEventListener('click', () => {
    pwModal.classList.add('show');
    if (pwInput) {
      pwInput.value = '';
      pwInput.setAttribute('autocapitalize', 'off');
      pwInput.setAttribute('autocorrect', 'off');
      pwInput.setAttribute('spellcheck', 'false');
      setTimeout(() => pwInput.focus(), 50);
    }
    if (pwError) pwError.textContent = '';
  });
}

// Cancel / close
if (pwCancel && pwModal) {
  pwCancel.addEventListener('click', () => {
    pwModal.classList.remove('show');
  });
}

// Version marker
console.log('script.js version=2025-09-25T20:45Z SECRET_HASH=', SECRET_HASH);

// Submit and verify (accept plain or hex)
if (pwSubmit && pwModal && pwInput) {
  pwSubmit.addEventListener('click', async () => {
    let guess = (pwInput.value || '');
    guess = guess.replace(/^\s+|\s+$/g, '');
    if (!guess) {
      if (pwError) pwError.textContent = 'Enter a password.';
      return;
    }
    let attempt;
    if (/^[0-9a-f]{64}$/i.test(guess)) {
      attempt = guess.toLowerCase();
    } else {
      attempt = (await sha256Hex(guess)).toLowerCase();
    }
    const target = (SECRET_HASH || '').toLowerCase();

    if (attempt === target) {
      window.location.href = './Pages/83974b9e12373ca84ce7431c7e6e0d92b047bf590da77c80f63e34886344ea5b.html';
    } else {
      if (pwError) pwError.textContent = 'Wrong password.';
      const card = pwModal.querySelector('.pw-card');
      if (card) {
        card.style.transform = 'translateX(-6px)';
        setTimeout(() => (card.style.transform = ''), 120);
      }
      setTimeout(() => pwModal.classList.remove('show'), 600);
    }
  });

  pwInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') pwSubmit.click();
  });
}
