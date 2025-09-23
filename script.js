// Keep original audio logic
const audioOverlay = document.getElementById('audioOverlay');
const enableAudioBtn = document.getElementById('enableAudio');
const backgroundMusic = document.getElementById('backgroundMusic');
const muteButton = document.getElementById('muteButton');
const volumeSlider = document.getElementById('volumeSlider');

document.addEventListener('DOMContentLoaded', () => {
  backgroundMusic.play().catch(() => {
    audioOverlay.style.display = 'flex';
  });
});

enableAudioBtn.addEventListener('click', () => {
  backgroundMusic.muted = false;
  audioOverlay.style.display = 'none';
  localStorage.setItem('audioEnabled', 'true');
  backgroundMusic.play().catch(() => {});
});

if (localStorage.getItem('audioEnabled') === 'true') {
  backgroundMusic.muted = false;
  audioOverlay.style.display = 'none';
  backgroundMusic.play().catch(() => {});
}

let audioUnlocked = false;
document.addEventListener('click', function initAudio() {
  if (!audioUnlocked) {
    backgroundMusic.muted = false;
    audioUnlocked = true;
    document.removeEventListener('click', initAudio);
  }
}, { once: true });

muteButton.addEventListener('click', () => {
  backgroundMusic.muted = !backgroundMusic.muted;
  muteButton.textContent = backgroundMusic.muted ? 'Unmute' : 'Mute';
});

volumeSlider.addEventListener('input', () => {
  backgroundMusic.volume = Number(volumeSlider.value);
});

// Navigation buttons (kept behavior, no inline handlers)
document.addEventListener('click', (e) => {
  const btn = e.target.closest('.redirect-button[data-href]');
  if (btn) {
    const url = btn.getAttribute('data-href');
    if (url) window.location.href = url;
  }
});

// DON’T CLICK -> open in a new tab securely
document.getElementById('dontClick').addEventListener('click', () => {
  window.open('./Pages/dontClick.htm', '_blank', 'noopener,noreferrer');
});

// Thunder effect (unchanged)
function createThunder() {
  const thunder = document.createElement('div');
  thunder.className = 'thunder';
  thunder.style.left = Math.random() * 100 + '%';
  document.getElementById('thunder-container').appendChild(thunder);
  setTimeout(() => thunder.remove(), 1000);
}
setInterval(createThunder, 600);
