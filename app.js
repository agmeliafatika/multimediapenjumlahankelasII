/**
 * PASAR SAYUR MINI - APLIKASI PEMBELAJARAN MATEMATIKA KELAS 2 SD
 * Penjumlahan Bilangan sampai 100 dengan Teknik Menyimpan
 * Berbasis Gamifikasi, Audio Interaktif, dan Kurikulum Merdeka
 */

// ================= 1. AUDIO & SOUND EFFECT SYNTHESIZER =================
class SoundController {
  constructor() {
    this.ctx = null;
    this.isMuted = false;
    this.bgmPlaying = false;
    this.bgmTimer = null;
  }

  init() {
    if (!this.ctx) {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      this.ctx = new AudioContext();
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  playPop() {
    if (this.isMuted) return;
    this.init();
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(450, this.ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(800, this.ctx.currentTime + 0.08);

    gain.gain.setValueAtTime(0.2, this.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + 0.08);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start();
    osc.stop(this.ctx.currentTime + 0.08);
  }

  playCoin() {
    if (this.isMuted) return;
    this.init();
    const now = this.ctx.currentTime;
    const osc1 = this.ctx.createOscillator();
    const osc2 = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc1.type = 'triangle';
    osc2.type = 'sine';

    osc1.frequency.setValueAtTime(987.77, now); // B5
    osc1.frequency.setValueAtTime(1318.51, now + 0.08); // E6

    osc2.frequency.setValueAtTime(987.77 * 0.5, now);
    osc2.frequency.setValueAtTime(1318.51 * 0.5, now + 0.08);

    gain.gain.setValueAtTime(0.25, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.4);

    osc1.connect(gain);
    osc2.connect(gain);
    gain.connect(this.ctx.destination);

    osc1.start(now);
    osc2.start(now);
    osc1.stop(now + 0.4);
    osc2.stop(now + 0.4);
  }

  playSuccess() {
    if (this.isMuted) return;
    this.init();
    const now = this.ctx.currentTime;
    const notes = [523.25, 659.25, 783.99, 1046.50]; // C5, E5, G5, C6
    notes.forEach((freq, i) => {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, now + i * 0.1);
      gain.gain.setValueAtTime(0.25, now + i * 0.1);
      gain.gain.exponentialRampToValueAtTime(0.001, now + i * 0.1 + 0.25);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(now + i * 0.1);
      osc.stop(now + i * 0.1 + 0.25);
    });
  }

  playWrong() {
    if (this.isMuted) return;
    this.init();
    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(220, now);
    osc.frequency.linearRampToValueAtTime(150, now + 0.25);

    gain.gain.setValueAtTime(0.2, now);
    gain.gain.exponentialRampToValueAtTime(0.01, now + 0.25);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start(now);
    osc.stop(now + 0.25);
  }

  toggleBGM() {
    this.init();
    this.bgmPlaying = !this.bgmPlaying;
    const btn = document.getElementById('btnToggleBgm');
    if (this.bgmPlaying) {
      if (btn) btn.classList.remove('muted');
      this.startMelodyLoop();
    } else {
      if (btn) btn.classList.add('muted');
      clearTimeout(this.bgmTimer);
    }
  }

  startMelodyLoop() {
    if (!this.bgmPlaying || this.isMuted) return;
    const notes = [
      523.25, 587.33, 659.25, 783.99, 659.25, 783.99, 880.00, 783.99,
      659.25, 587.33, 523.25, 440.00, 523.25, 587.33, 659.25, 523.25
    ];
    let step = 0;

    const playNext = () => {
      if (!this.bgmPlaying || this.isMuted) return;
      const freq = notes[step % notes.length];
      const now = this.ctx.currentTime;

      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, now);

      gain.gain.setValueAtTime(0.04, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.28);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now);
      osc.stop(now + 0.3);

      step++;
      this.bgmTimer = setTimeout(playNext, 320);
    };

    playNext();
  }

  toggleMute() {
    this.isMuted = !this.isMuted;
    const btn = document.getElementById('btnToggleSound');
    if (btn) {
      if (this.isMuted) {
        btn.classList.add('muted');
        btn.innerHTML = '🔇';
      } else {
        btn.classList.remove('muted');
        btn.innerHTML = '🔊';
        this.playPop();
      }
    }
  }
}

const sound = new SoundController();

// Indonesian Text-to-Speech Function
function speakText(text) {
  if (!('speechSynthesis' in window)) {
    alert('Maaf, peramban Anda belum mendukung fitur suara.');
    return;
  }
  window.speechSynthesis.cancel();
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = 'id-ID';
  utterance.rate = 0.95;
  utterance.pitch = 1.1;

  // Try to find an Indonesian voice
  const voices = window.speechSynthesis.getVoices();
  const indoVoice = voices.find(v => v.lang.includes('id') || v.lang.includes('ID'));
  if (indoVoice) {
    utterance.voice = indoVoice;
  }

  window.speechSynthesis.speak(utterance);
}

// ================= 2. GAMIFICATION STATE & USER PROFILE =================
const AppState = {
  studentName: localStorage.getItem('pasar_student_name') || 'Sobat Sayur',
  studentClass: localStorage.getItem('pasar_student_class') || 'Kelas 2',
  studentSchool: localStorage.getItem('pasar_student_school') || '',
  studentAvatar: localStorage.getItem('pasar_student_avatar') || '🥕',
  coins: parseInt(localStorage.getItem('pasar_coins') || '50', 10),
  stars: parseInt(localStorage.getItem('pasar_stars') || '3', 10),
  activeNav: 'beranda',

  save() {
    localStorage.setItem('pasar_student_name', this.studentName);
    localStorage.setItem('pasar_student_class', this.studentClass);
    localStorage.setItem('pasar_student_school', this.studentSchool);
    localStorage.setItem('pasar_student_avatar', this.studentAvatar);
    localStorage.setItem('pasar_coins', this.coins.toString());
    localStorage.setItem('pasar_stars', this.stars.toString());
    this.updateUI();
  },

  addCoins(amount) {
    this.coins += amount;
    this.save();
    sound.playCoin();
    showFloatingReward(`+${amount} Koin! 🪙`);
  },

  addStar() {
    this.stars += 1;
    this.save();
    sound.playSuccess();
    showFloatingReward('+1 Bintang! ⭐');
  },

  updateUI() {
    const nameEl = document.getElementById('navStudentName');
    const coinsEl = document.getElementById('navCoins');
    const starsEl = document.getElementById('navStars');
    const inputEl = document.getElementById('studentNameInput');
    const displayAvatar = document.getElementById('navAvatarIcon');

    if (nameEl) nameEl.textContent = this.studentName;
    if (coinsEl) coinsEl.textContent = this.coins;
    if (starsEl) starsEl.textContent = this.stars;
    if (inputEl) inputEl.value = this.studentName;
    if (displayAvatar) displayAvatar.textContent = this.studentAvatar;

    // Update quiz elements if present
    const qNameInput = document.getElementById('quizStudentNameInput');
    const qClassInput = document.getElementById('quizStudentClassInput');
    const qSchoolInput = document.getElementById('quizStudentSchoolInput');

    if (qNameInput && !qNameInput.value && this.studentName !== 'Sobat Sayur') {
      qNameInput.value = this.studentName;
    }
    if (qClassInput && !qClassInput.value) {
      qClassInput.value = this.studentClass;
    }
    if (qSchoolInput && !qSchoolInput.value) {
      qSchoolInput.value = this.studentSchool;
    }

    const qHeadAvatar = document.getElementById('quizHeaderAvatar');
    const qHeadName = document.getElementById('quizHeaderName');
    const qHeadClass = document.getElementById('quizHeaderClass');
    if (qHeadAvatar) qHeadAvatar.textContent = this.studentAvatar;
    if (qHeadName) qHeadName.textContent = this.studentName;
    if (qHeadClass) qHeadClass.textContent = `(${this.studentClass})`;
  }
};

function showFloatingReward(text) {
  const el = document.createElement('div');
  el.className = 'floating-reward-toast';
  el.textContent = text;
  document.body.appendChild(el);
  setTimeout(() => el.remove(), 2500);
}

// Add simple CSS for toast reward
const toastStyle = document.createElement('style');
toastStyle.textContent = `
.floating-reward-toast {
  position: fixed;
  top: 80px;
  right: 20px;
  background: #fef08a;
  border: 3px solid #eab308;
  color: #854d0e;
  font-family: 'Fredoka', cursive, sans-serif;
  font-size: 1.2rem;
  font-weight: 700;
  padding: 0.6rem 1.4rem;
  border-radius: 9999px;
  box-shadow: 0 10px 25px rgba(234, 179, 8, 0.4);
  z-index: 99999;
  animation: floatToast 2.5s forwards ease-in-out;
}
@keyframes floatToast {
  0% { opacity: 0; transform: translateY(-20px) scale(0.8); }
  20% { opacity: 1; transform: translateY(0) scale(1.1); }
  35% { transform: scale(1); }
  80% { opacity: 1; transform: translateY(0); }
  100% { opacity: 0; transform: translateY(-30px); }
}
`;
document.head.appendChild(toastStyle);

// ================= 3. NAVIGATION MANAGEMENT =================
function switchPage(pageId) {
  sound.playPop();
  AppState.activeNav = pageId;

  // Update navbar buttons
  document.querySelectorAll('.nav-item-btn').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.page === pageId);
  });

  // Switch pages
  document.querySelectorAll('.page-section').forEach(sec => {
    sec.classList.remove('active');
  });

  const target = document.getElementById(`page-${pageId}`);
  if (target) {
    target.classList.add('active');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  // Trigger page-specific initializations
  if (pageId === 'materi') {
    initMateriSimulation();
  } else if (pageId === 'game') {
    initGameSession();
  } else if (pageId === 'kuis') {
    initQuiz();
  }
}

// ================= 4. MATERI INTERAKTIF & SIMULATION ENGINE =================
let simState = {
  num1: 27,
  num2: 15,
  currentStep: 1,
  onesRegrouped: false
};

function switchMateriTab(tabId) {
  sound.playPop();
  document.querySelectorAll('.materi-tab-btn').forEach(b => {
    b.classList.toggle('active', b.dataset.tab === tabId);
  });

  document.querySelectorAll('.materi-subtab-content').forEach(c => {
    c.style.display = 'none';
  });

  const activeContent = document.getElementById(`tab-content-${tabId}`);
  if (activeContent) {
    activeContent.style.display = 'block';
  }
}

function initMateriSimulation() {
  const input1 = document.getElementById('simNum1');
  const input2 = document.getElementById('simNum2');

  if (input1 && input2) {
    input1.value = simState.num1;
    input2.value = simState.num2;
  }
  renderSimulation();
}

function updateSimNumbers() {
  const n1 = parseInt(document.getElementById('simNum1').value, 10) || 27;
  const n2 = parseInt(document.getElementById('simNum2').value, 10) || 15;

  // Limit to 10 - 89 so sum <= 100
  simState.num1 = Math.max(11, Math.min(65, n1));
  simState.num2 = Math.max(11, Math.min(30, n2));

  document.getElementById('simNum1').value = simState.num1;
  document.getElementById('simNum2').value = simState.num2;

  simState.currentStep = 1;
  simState.onesRegrouped = false;
  sound.playPop();
  renderSimulation();
}

function renderSimulation() {
  const n1 = simState.num1;
  const n2 = simState.num2;

  const tens1 = Math.floor(n1 / 10);
  const ones1 = n1 % 10;
  const tens2 = Math.floor(n2 / 10);
  const ones2 = n2 % 10;

  const totalOnes = ones1 + ones2;
  const isRegroupNeeded = totalOnes >= 10;
  const storedTen = isRegroupNeeded && simState.onesRegrouped ? 1 : 0;
  const finalOnes = totalOnes % 10;
  const finalTens = tens1 + tens2 + (simState.onesRegrouped ? 1 : 0);
  const totalSum = n1 + n2;

  // Render simpanan slot
  const storedSlot = document.getElementById('simStoredSlot');
  if (storedSlot) {
    if (simState.onesRegrouped) {
      storedSlot.innerHTML = '🧺 <strong>1 Keranjang Simpanan (+1 Puluhan)</strong>';
      storedSlot.classList.add('has-item');
    } else {
      storedSlot.innerHTML = '<span>Slot Simpanan (Kosong)</span>';
      storedSlot.classList.remove('has-item');
    }
  }

  // Render Tens area
  const tensArea = document.getElementById('simTensItems');
  if (tensArea) {
    let tensHTML = '';
    tensHTML += `<div style="font-size:0.85rem; font-weight:700; width:100%; color:#15803d; margin-bottom:4px;">Bilangan ${n1}: (${tens1} Puluhan)</div>`;
    for (let i = 0; i < tens1; i++) {
      tensHTML += `<div class="tens-crate" title="1 Keranjang = 10 Sayur">🧺 <span>10</span></div>`;
    }
    tensHTML += `<div style="font-size:0.85rem; font-weight:700; width:100%; color:#15803d; margin:6px 0 4px;">Bilangan ${n2}: (${tens2} Puluhan)</div>`;
    for (let i = 0; i < tens2; i++) {
      tensHTML += `<div class="tens-crate" title="1 Keranjang = 10 Sayur">🧺 <span>10</span></div>`;
    }
    tensArea.innerHTML = tensHTML;
  }

  // Render Ones area
  const onesArea = document.getElementById('simOnesItems');
  if (onesArea) {
    let onesHTML = '';
    if (!simState.onesRegrouped) {
      onesHTML += `<div style="font-size:0.85rem; font-weight:700; width:100%; color:#c2410c; margin-bottom:4px;">Bilangan ${n1}: (${ones1} Satuan)</div>`;
      for (let i = 0; i < ones1; i++) {
        onesHTML += `<span class="carrot-icon" title="1 Satuan">🥕</span>`;
      }
      onesHTML += `<div style="font-size:0.85rem; font-weight:700; width:100%; color:#c2410c; margin:6px 0 4px;">Bilangan ${n2}: (${ones2} Satuan)</div>`;
      for (let i = 0; i < ones2; i++) {
        onesHTML += `<span class="carrot-icon" title="1 Satuan">🥕</span>`;
      }
      onesHTML += `<div style="width:100%; font-weight:700; margin-top:6px; color:#c2410c; font-size:0.9rem;">Total Satuan Sekarang: ${ones1} + ${ones2} = ${totalOnes} wortel!</div>`;
    } else {
      onesHTML += `<div style="font-size:0.85rem; font-weight:700; width:100%; color:#15803d; margin-bottom:4px;">10 Wortel sudah diikat jadi 1 keranjang puluhan! ✨</div>`;
      onesHTML += `<div style="font-size:0.9rem; font-weight:700; width:100%; color:#c2410c; margin-bottom:6px;">Sisa Satuan (${totalOnes} - 10 = ${finalOnes}):</div>`;
      for (let i = 0; i < finalOnes; i++) {
        onesHTML += `<span class="carrot-icon">🥕</span>`;
      }
      if (finalOnes === 0) {
        onesHTML += `<span style="font-size:0.9rem; color:#64748b;">(Semua 10 wortel terikat, satuan bersisa 0)</span>`;
      }
    }
    onesArea.innerHTML = onesHTML;
  }

  // Update step explanation & buttons
  const stepText = document.getElementById('simStepText');
  const actionBtn = document.getElementById('simActionBtn');

  if (simState.currentStep === 1) {
    stepText.innerHTML = `Langkah 1: Hitung sayur satuan dulu! Ada <strong>${ones1} + ${ones2} = ${totalOnes}</strong> wortel satuan.`;
    if (isRegroupNeeded) {
      stepText.innerHTML += ` <span style="color:#e11d48; font-weight:700;">(Wah, lebih dari 9! Harus diikat jadi 1 keranjang puluhan!)</span>`;
      actionBtn.innerHTML = '🧺 Ikat 10 Satuan Jadi 1 Puluhan!';
      actionBtn.style.display = 'inline-flex';
      actionBtn.onclick = () => {
        simState.onesRegrouped = true;
        simState.currentStep = 2;
        sound.playSuccess();
        triggerConfetti(window.innerWidth / 2, window.innerHeight / 2);
        renderSimulation();
      };
    } else {
      actionBtn.innerHTML = 'Lanjut ke Puluhan ➡️';
      actionBtn.onclick = () => {
        simState.currentStep = 2;
        sound.playPop();
        renderSimulation();
      };
    }
  } else if (simState.currentStep === 2) {
    stepText.innerHTML = `Langkah 2: Jumlahkan puluhan! ${storedTen ? '<strong>1 (simpanan) + </strong>' : ''}${tens1} + ${tens2} = <strong>${finalTens}</strong> keranjang puluhan (${finalTens * 10}).`;
    actionBtn.innerHTML = '✨ Tampilkan Hasil Lengkap!';
    actionBtn.onclick = () => {
      simState.currentStep = 3;
      sound.playSuccess();
      renderSimulation();
    };
  } else if (simState.currentStep === 3) {
    stepText.innerHTML = `Selesai! Hasil dari <strong>${n1} + ${n2} = ${totalSum}</strong> (${finalTens} Puluhan + ${finalOnes} Satuan = ${totalSum}). Hebat! 🎉`;
    actionBtn.innerHTML = '🔄 Ulangi Simulasi';
    actionBtn.onclick = () => {
      simState.currentStep = 1;
      simState.onesRegrouped = false;
      sound.playPop();
      renderSimulation();
    };
  }
}

// ================= 5. GAME "KASIR PASAR SAYUR MINI" (RAMAH KELAS 2 SD) =================
const GameData = {
  currentLevel: 1,
  levels: {
    // Level 1: Belasan + Satuan (Sangat ramah anak kelas 2, fondasi teknik menyimpan)
    1: [
      { n1: 15, n2: 7, customer: 'Bu Kelinci', icon: '🐰', message: 'Halo kasir cilik! Saya ingin membeli 15 wortel dan 7 wortel lagi untuk anak-anak kelinci!' },
      { n1: 18, n2: 5, customer: 'Pak Beruang', icon: '🐻', message: 'Tolong siapkan 18 ikat kangkung ditambah 5 ikat bayam segar ya!' },
      { n1: 16, n2: 6, customer: 'Ibu Kucing', icon: '🐱', message: 'Saya mau borong 16 tomat merah dan 6 tomat ceri manis!' },
      { n1: 17, n2: 8, customer: 'Paman Rusa', icon: '🦌', message: 'Tolong bungkuskan 17 jagung manis dan 8 jagung bakar!' }
    ],
    // Level 2: Belasan + Belasan Mudah
    2: [
      { n1: 16, n2: 15, customer: 'Kakek Kura', icon: '🐢', message: 'Pesanan warung: 16 kubis segar ditambah 15 brokoli hijau!' },
      { n1: 18, n2: 14, customer: 'Ibu Bebek', icon: '🦆', message: 'Kwek! Tolong bungkuskan 18 sawi putih dan 14 terong ungu!' },
      { n1: 25, n2: 16, customer: 'Pak Singa Koki', icon: '🦁', message: 'Restoran kami butuh 25 labu kuning dan 16 paprika merah!' },
      { n1: 27, n2: 15, customer: 'Gajah Ceria', icon: '🐘', message: 'Untuk persediaan pesta: 27 timun dan 15 melon mini!' }
    ],
    // Level 3: Puluhan Sedang
    3: [
      { n1: 26, n2: 17, customer: 'Ibu Panda', icon: '🐼', message: 'Pesanan festival: 26 rebung manis dan 17 batang tebu segar!' },
      { n1: 28, n2: 15, customer: 'Paman Jerapah', icon: '🦒', message: 'Tolong siapkan 28 ikat daun segar dan 15 wortel panjang!' },
      { n1: 35, n2: 18, customer: 'Bu Tupai', icon: '🐿️', message: 'Tolong hitung 35 biji kenari dan 18 jagung mini!' },
      { n1: 36, n2: 17, customer: 'Kancil Cilik', icon: '🦌', message: 'Saya pesan 36 mentimun renyah dan 17 wortel manis!' }
    ]
  },
  questionIndex: 0,
  isBundled: false
};

function setGameLevel(lvl) {
  sound.playPop();
  GameData.currentLevel = lvl;
  GameData.questionIndex = 0;
  document.querySelectorAll('.level-pill-btn').forEach(b => {
    b.classList.toggle('active', parseInt(b.dataset.level, 10) === lvl);
  });
  loadGameOrder();
}

function initGameSession() {
  loadGameOrder();
}

function loadGameOrder() {
  const currentLevelQuestions = GameData.levels[GameData.currentLevel];
  const q = currentLevelQuestions[GameData.questionIndex % currentLevelQuestions.length];
  GameData.isBundled = false;

  const expectedSum = q.n1 + q.n2;
  const ones1 = q.n1 % 10;
  const ones2 = q.n2 % 10;
  const totalOnes = ones1 + ones2;
  const tens1 = Math.floor(q.n1 / 10);
  const tens2 = Math.floor(q.n2 / 10);

  // Clear feedback & hint
  const feedback = document.getElementById('gameFeedback');
  const hintBox = document.getElementById('gameHintBox');
  if (feedback) { feedback.style.display = 'none'; feedback.className = 'game-feedback-banner'; }
  if (hintBox) hintBox.classList.remove('show');

  // Reset bundling button
  const bundleBtn = document.getElementById('btnBundleVeggies');
  if (bundleBtn) {
    bundleBtn.disabled = false;
    bundleBtn.classList.add('pulsing');
    bundleBtn.innerHTML = `🧺 Klik: Ikat 10 Sayur Jadi 1 Keranjang Puluhan (Simpan!)`;
  }

  const bundleText = document.getElementById('bundleInstructionText');
  if (bundleText) {
    bundleText.innerHTML = `Ada <strong>${totalOnes} sayur satuan</strong> (${ones1} + ${ones2})! Klik tombol di bawah untuk mengikat 10 sayur jadi 1 keranjang puluhan:`;
  }

  // Update customer dialogue
  document.getElementById('customerAvatarEmoji').textContent = q.icon;
  document.getElementById('customerName').textContent = q.customer;
  document.getElementById('customerSpeech').textContent = `"${q.message}"`;
  document.getElementById('customerOrderMath').textContent = `${q.n1} + ${q.n2} = ?`;

  // Render shelves
  const shelfLabel1 = document.getElementById('shelfLabel1');
  const shelfLabel2 = document.getElementById('shelfLabel2');
  const shelfSatuanSummary = document.getElementById('shelfSatuanSummary');

  if (shelfLabel1) shelfLabel1.textContent = `${q.n1} (${tens1} Puluhan + ${ones1} Satuan)`;
  if (shelfLabel2) shelfLabel2.textContent = `${q.n2} (${tens2} Puluhan + ${ones2} Satuan)`;
  if (shelfSatuanSummary) shelfSatuanSummary.textContent = `Total Satuan: ${ones1} + ${ones2} = ${totalOnes} sayur`;

  // Shelf Row 1
  let row1TensHTML = '';
  for (let i = 0; i < tens1; i++) row1TensHTML += `<div class="tens-crate">🧺 10</div>`;
  if (tens1 === 0) row1TensHTML = `<span style="font-size:0.85rem; color:#94a3b8;">(0 Puluhan)</span>`;
  document.getElementById('shelfTensRow1').innerHTML = row1TensHTML;

  let row1OnesHTML = '';
  for (let i = 0; i < ones1; i++) row1OnesHTML += `<span class="carrot-icon">🥕</span>`;
  document.getElementById('shelfOnesRow1').innerHTML = row1OnesHTML;

  // Shelf Row 2
  let row2TensHTML = '';
  for (let i = 0; i < tens2; i++) row2TensHTML += `<div class="tens-crate">🧺 10</div>`;
  if (tens2 === 0) row2TensHTML = `<span style="font-size:0.85rem; color:#94a3b8;">(0 Puluhan)</span>`;
  document.getElementById('shelfTensRow2').innerHTML = row2TensHTML;

  let row2OnesHTML = '';
  for (let i = 0; i < ones2; i++) row2OnesHTML += `<span class="carrot-icon">🥕</span>`;
  document.getElementById('shelfOnesRow2').innerHTML = row2OnesHTML;

  // Reset Simpanan slot
  const simpananSlot = document.getElementById('gameSimpananSlot');
  simpananSlot.innerHTML = '<em>Belum ada simpanan</em>';
  simpananSlot.classList.remove('has-item');

  // Reset manual inputs
  const tensInp = document.getElementById('gameTensInput');
  const onesInp = document.getElementById('gameOnesInput');
  if (tensInp) tensInp.value = '';
  if (onesInp) onesInp.value = '';

  // Render 3 Kid-Friendly Answer Cards (Pilihan Ganda Ceria 1-Click)
  renderGameAnswerCards(expectedSum, q);
}

function renderGameAnswerCards(expectedSum, q) {
  const cardsContainer = document.getElementById('gameAnswerCards');
  if (!cardsContainer) return;
  cardsContainer.innerHTML = '';

  // Generate 3 choices: correct answer + 2 smart distractors
  const choices = [expectedSum];
  const distractor1 = expectedSum - 2 > 10 ? expectedSum - 2 : expectedSum + 3;
  const distractor2 = expectedSum + 2 <= 99 ? expectedSum + 2 : expectedSum - 4;

  choices.push(distractor1);
  choices.push(distractor2);

  // Shuffle choices
  choices.sort(() => Math.random() - 0.5);

  choices.forEach(val => {
    const tens = Math.floor(val / 10);
    const ones = val % 10;

    const card = document.createElement('div');
    card.className = 'game-card-btn';
    card.innerHTML = `
      <div class="game-card-num">${val}</div>
      <div class="game-card-sub">${tens} Puluhan + ${ones} Satuan</div>
    `;
    card.onclick = () => selectGameCardAnswer(val, card);
    cardsContainer.appendChild(card);
  });
}

function bundleGameVeggies() {
  const currentLevelQuestions = GameData.levels[GameData.currentLevel];
  const q = currentLevelQuestions[GameData.questionIndex % currentLevelQuestions.length];

  const totalOnes = (q.n1 % 10) + (q.n2 % 10);
  const finalOnes = totalOnes % 10;

  GameData.isBundled = true;
  sound.playSuccess();

  const simpananSlot = document.getElementById('gameSimpananSlot');
  simpananSlot.innerHTML = '🧺 <strong>+1 Keranjang Simpanan di Puluhan!</strong>';
  simpananSlot.classList.add('has-item');

  const bundleBtn = document.getElementById('btnBundleVeggies');
  bundleBtn.disabled = true;
  bundleBtn.classList.remove('pulsing');
  bundleBtn.innerHTML = `✅ Berhasil Ikat 10 Sayur! Sisa Satuan: <strong>${finalOnes}</strong>`;

  const bundleText = document.getElementById('bundleInstructionText');
  if (bundleText) {
    bundleText.innerHTML = `🎉 Hebat! 10 sayur sudah diikat menjadi 1 keranjang puluhan. Sekarang pilih total sayurnya di bawah ya! 👇`;
  }

  // Update shelf ones to show only remaining ones
  let remainingOnesHTML = `<div style="font-size:0.85rem; color:#15803d; width:100%; font-weight:700; margin-bottom:4px;">10 Sayur sudah diikat! Sisa satuan:</div>`;
  for (let i = 0; i < finalOnes; i++) {
    remainingOnesHTML += `<span class="carrot-icon">🥕</span>`;
  }
  if (finalOnes === 0) remainingOnesHTML += `<span style="color:#64748b; font-size:0.85rem;">(Semua 10 terikat, sisa 0)</span>`;
  document.getElementById('shelfOnesRow1').innerHTML = remainingOnesHTML;
  document.getElementById('shelfOnesRow2').innerHTML = '';

  showFloatingReward('✨ 1 Keranjang Tersimpan!');
}

function selectGameCardAnswer(chosenSum, cardEl) {
  const currentLevelQuestions = GameData.levels[GameData.currentLevel];
  const q = currentLevelQuestions[GameData.questionIndex % currentLevelQuestions.length];
  const expectedSum = q.n1 + q.n2;

  // If student hasn't clicked bundle yet, auto-bundle gently or celebrate!
  if (!GameData.isBundled) {
    bundleGameVeggies();
  }

  const feedback = document.getElementById('gameFeedback');
  const allCards = document.querySelectorAll('.game-card-btn');

  if (chosenSum === expectedSum) {
    sound.playSuccess();
    cardEl.classList.add('correct');
    allCards.forEach(c => c.style.pointerEvents = 'none');

    AppState.addCoins(25);
    AppState.addStar();
    triggerConfetti(window.innerWidth / 2, window.innerHeight / 2);

    feedback.innerHTML = `🎉 Luar Biasa! ${q.n1} + ${q.n2} = <strong>${expectedSum}</strong>! Pelanggan sangat senang! (+25 Koin 🪙 & +1 Bintang ⭐)`;
    feedback.className = 'game-feedback-banner success';
    feedback.style.display = 'block';

    setTimeout(() => {
      GameData.questionIndex++;
      loadGameOrder();
    }, 2400);
  } else {
    sound.playWrong();
    cardEl.classList.add('wrong');
    setTimeout(() => cardEl.classList.remove('wrong'), 1000);

    feedback.innerHTML = `Yuk coba lagi! Hitung sisa satuannya dan jangan lupa tambah 1 keranjang simpanan ya! 💪 (Klik '💡 Bantuan Kelinci Cici' jika bingung)`;
    feedback.className = 'game-feedback-banner error';
    feedback.style.display = 'block';
  }
}

function showGameHint() {
  sound.playPop();
  const currentLevelQuestions = GameData.levels[GameData.currentLevel];
  const q = currentLevelQuestions[GameData.questionIndex % currentLevelQuestions.length];
  const expectedSum = q.n1 + q.n2;

  const ones1 = q.n1 % 10;
  const ones2 = q.n2 % 10;
  const totalOnes = ones1 + ones2;
  const finalOnes = totalOnes % 10;
  const tens1 = Math.floor(q.n1 / 10);
  const tens2 = Math.floor(q.n2 / 10);
  const finalTens = tens1 + tens2 + 1;

  const hintBox = document.getElementById('gameHintBox');
  const hintText = document.getElementById('gameHintText');

  const explanation = `Ayo hitung bareng Cici! Satuan ${ones1} + ${ones2} = ${totalOnes}. 10 sayur diikat jadi 1 keranjang puluhan, sisa ${finalOnes} di satuan. Puluhannya: 1 (simpanan) + ${tens1} + ${tens2} = ${finalTens} keranjang. Jadi jawabannya adalah ${expectedSum}! 🥕`;

  if (hintText) hintText.textContent = explanation;
  if (hintBox) {
    hintBox.classList.add('show');
    speakText(explanation);
  }
}

function checkGameAnswer() {
  const currentLevelQuestions = GameData.levels[GameData.currentLevel];
  const q = currentLevelQuestions[GameData.questionIndex % currentLevelQuestions.length];
  const expectedSum = q.n1 + q.n2;

  const tensVal = parseInt(document.getElementById('gameTensInput').value, 10);
  const onesVal = parseInt(document.getElementById('gameOnesInput').value, 10);
  const userTotal = (tensVal * 10) + onesVal;

  const feedback = document.getElementById('gameFeedback');

  if (isNaN(tensVal) || isNaN(onesVal)) {
    sound.playWrong();
    feedback.textContent = '⚠️ Masukkan angka puluhan dan satuan terlebih dahulu ya!';
    feedback.className = 'game-feedback-banner error';
    feedback.style.display = 'block';
    return;
  }

  if (userTotal === expectedSum) {
    sound.playSuccess();
    AppState.addCoins(25);
    AppState.addStar();
    triggerConfetti(window.innerWidth / 2, window.innerHeight / 2);

    feedback.innerHTML = `🎉 Luar Biasa! Pesanan Benar! ${q.n1} + ${q.n2} = <strong>${expectedSum}</strong>. Pelanggan sangat puas! (+25 Koin 🪙 & +1 Bintang ⭐)`;
    feedback.className = 'game-feedback-banner success';
    feedback.style.display = 'block';

    setTimeout(() => {
      GameData.questionIndex++;
      loadGameOrder();
    }, 2400);
  } else {
    sound.playWrong();
    feedback.innerHTML = `Yuk periksa lagi! Hitung sisa satuannya, lalu jangan lupa tambahkan 1 keranjang simpanan ke puluhan! Semangat! 💪`;
    feedback.className = 'game-feedback-banner error';
    feedback.style.display = 'block';
  }
}

// ================= 6. KUIS TANTANGAN JUARA PASAR (30 VARIASI SOAL) =================
const QuizBank = [
  // --- KATEGORI 1: VISUAL SAYUR & KERANJANG (8 Soal) ---
  {
    category: "visual",
    question: "Pak Tani memiliki 3 keranjang sayur (masing-masing isi 10) dan 4 wortel lepas. Berapakah jumlah seluruh wortel Pak Tani?",
    illustration: "🧺🧺🧺 + 🥕🥕🥕🥕",
    options: ["34 wortel", "43 wortel", "7 wortel", "30 wortel"],
    correctIndex: 0,
    explanation: "3 keranjang isi 10 = 3 puluhan (30). 4 wortel lepas = 4 satuan. 30 + 4 = 34 wortel."
  },
  {
    category: "visual",
    question: "Di rak ada 4 keranjang puluhan dan 15 buah wortel satuan. Setelah 10 wortel diikat jadi 1 keranjang puluhan baru, berapakah totalnya sekarang?",
    illustration: "🧺🧺🧺🧺 + 🥕 15 wortel",
    options: ["5 keranjang puluhan dan 5 satuan (55)", "4 keranjang puluhan dan 5 satuan (45)", "6 keranjang puluhan dan 0 satuan (60)", "3 keranjang puluhan dan 15 satuan (45)"],
    correctIndex: 0,
    explanation: "15 satuan = 1 keranjang puluhan + 5 satuan. Digabung dengan 4 keranjang lama: 4 + 1 = 5 keranjang (50) + 5 = 55."
  },
  {
    category: "visual",
    question: "Perhatikan gambar: 🧺🧺 + 🥕🥕🥕🥕🥕🥕🥕 (27 sayur) ditambah 🧺 + 🥕🥕🥕🥕🥕 (15 sayur). Berapakah jumlah seluruhnya?",
    illustration: "27 sayur + 15 sayur = ...",
    options: ["42 sayur", "32 sayur", "40 sayur", "38 sayur"],
    correctIndex: 0,
    explanation: "Satuan: 7 + 5 = 12 (tulis 2, simpan 1). Puluhan: 1 (simpanan) + 2 + 1 = 4. Jadi ada 42 sayur!"
  },
  {
    category: "visual",
    question: "Ada 14 buah tomat satuan lepas di meja kasir. Berapa keranjang puluhan yang bisa dibuat dan berapa sisa satuannya?",
    illustration: "🍅 14 tomat lepas",
    options: ["1 keranjang puluhan dan sisa 4 satuan", "4 keranjang puluhan dan sisa 1 satuan", "2 keranjang puluhan dan sisa 0 satuan", "1 keranjang puluhan dan sisa 0 satuan"],
    correctIndex: 0,
    explanation: "Angka 14 = 10 + 4. Sepuluh tomat diikat menjadi 1 keranjang puluhan, dan tersisa 4 tomat satuan."
  },
  {
    category: "visual",
    question: "Di gudang ada 3 keranjang puluhan (30) dan 18 wortel lepas. Jika 10 wortel lepas diikat menjadi keranjang puluhan baru, ada berapakah jumlahnya?",
    illustration: "🧺🧺🧺 (30) + 🥕 18 wortel",
    options: ["4 keranjang puluhan dan 8 satuan (48)", "3 keranjang puluhan dan 8 satuan (38)", "5 keranjang puluhan dan 0 satuan (50)", "4 keranjang puluhan dan 2 satuan (42)"],
    correctIndex: 0,
    explanation: "18 wortel = 1 puluhan (10) + 8 satuan. Digabung dengan 3 puluhan yang ada: 3 + 1 = 4 puluhan (40) + 8 = 48."
  },
  {
    category: "visual",
    question: "Perhatikan sayur ini: 🧺🧺🧺🧺 (40) + 🥕🥕🥕🥕🥕🥕🥕🥕 (8) ditambah 🥕🥕🥕🥕 (4). Berapa total wortel seluruhnya?",
    illustration: "48 + 4 = ...",
    options: ["52 wortel", "42 wortel", "50 wortel", "54 wortel"],
    correctIndex: 0,
    explanation: "Satuan: 8 + 4 = 12 (simpan 1 puluhan, sisa 2 satuan). Puluhan: 1 + 4 = 5. Hasilnya 52 wortel!"
  },
  {
    category: "visual",
    question: "Rak sayur A berisi 2 keranjang puluhan dan 8 wortel (28). Rak sayur B berisi 1 keranjang puluhan dan 7 wortel (17). Berapa jumlahnya?",
    illustration: "28 wortel + 17 wortel = ...",
    options: ["45 wortel", "35 wortel", "43 wortel", "41 wortel"],
    correctIndex: 0,
    explanation: "Satuan: 8 + 7 = 15 (tulis 5, simpan 1). Puluhan: 1 + 2 + 1 = 4. Total = 45 wortel."
  },
  {
    category: "visual",
    question: "Jika kamu memiliki 6 keranjang puluhan (60) dan 16 jagung manis satuan, berapakah total jagung manis seluruhnya?",
    illustration: "🌽 60 + 16 = ...",
    options: ["76 jagung", "66 jagung", "86 jagung", "70 jagung"],
    correctIndex: 0,
    explanation: "16 jagung = 1 puluhan + 6 satuan. Digabung: 6 puluhan + 1 puluhan = 7 puluhan (70) + 6 = 76 jagung."
  },

  // --- KATEGORI 2: SOAL CERITA PASAR (8 Soal) ---
  {
    category: "cerita",
    question: "Kelinci Cici memanen 36 tomat di pagi hari dan 27 tomat di sore hari. Berapa total seluruh tomat yang dipanen Cici?",
    illustration: "🍅 36 tomat + 27 tomat",
    options: ["63 tomat", "53 tomat", "61 tomat", "59 tomat"],
    correctIndex: 0,
    explanation: "Satuan: 6 + 7 = 13 (tulis 3, simpan 1). Puluhan: 1 + 3 + 2 = 6. Total = 63 tomat."
  },
  {
    category: "cerita",
    question: "Ibu membeli 38 wortel dan Bibi membeli 24 wortel di Pasar Sayur Mini. Berapa jumlah wortel mereka berdua?",
    illustration: "🥕 38 wortel + 24 wortel",
    options: ["62 wortel", "52 wortel", "61 wortel", "72 wortel"],
    correctIndex: 0,
    explanation: "Satuan: 8 + 4 = 12 (tulis 2, simpan 1). Puluhan: 1 + 3 + 2 = 6. Jadi 62 wortel."
  },
  {
    category: "cerita",
    question: "Di Pasar Sayur ada 56 ikat kangkung. Pak Tani memanen lagi 28 ikat. Berapa ikat kangkung yang ada sekarang?",
    illustration: "🌿 56 ikat + 28 ikat",
    options: ["84 ikat", "74 ikat", "82 ikat", "78 ikat"],
    correctIndex: 0,
    explanation: "Satuan: 6 + 8 = 14 (tulis 4, simpan 1). Puluhan: 1 + 5 + 2 = 8. Jadi ada 84 ikat kangkung!"
  },
  {
    category: "cerita",
    question: "Pak Beruang membeli 25 kg labu kuning dan 19 kg jagung manis untuk pesta hutan. Berapa kg total belanjaan Pak Beruang?",
    illustration: "🎃 25 kg + 🌽 19 kg",
    options: ["44 kg", "34 kg", "42 kg", "45 kg"],
    correctIndex: 0,
    explanation: "Satuan: 5 + 9 = 14 (tulis 4, simpan 1). Puluhan: 1 + 2 + 1 = 4. Total = 44 kg."
  },
  {
    category: "cerita",
    question: "Bu Siti menjual 47 ikat bayam di pagi hari dan 28 ikat bayam di siang hari. Berapa total ikat bayam yang terjual seluruhnya?",
    illustration: "🥬 47 ikat + 28 ikat",
    options: ["75 ikat", "65 ikat", "73 ikat", "71 ikat"],
    correctIndex: 0,
    explanation: "Satuan: 7 + 8 = 15 (tulis 5, simpan 1). Puluhan: 1 + 4 + 2 = 7. Total = 75 ikat bayam."
  },
  {
    category: "cerita",
    question: "Paman Rusa memetik 34 paprika hijau dan 29 paprika merah di kebun sayur. Berapa total seluruh paprika yang dipetik?",
    illustration: "🫑 34 paprika + 29 paprika",
    options: ["63 paprika", "53 paprika", "62 paprika", "59 paprika"],
    correctIndex: 0,
    explanation: "Satuan: 4 + 9 = 13 (tulis 3, simpan 1). Puluhan: 1 + 3 + 2 = 6. Total = 63 paprika."
  },
  {
    category: "cerita",
    question: "Toko Sayur Ceria memiliki 46 kotak mentimun. Datang kiriman baru dari kebun sebanyak 38 kotak. Berapa kotak timun sekarang?",
    illustration: "🥒 46 kotak + 38 kotak",
    options: ["84 kotak", "74 kotak", "82 kotak", "85 kotak"],
    correctIndex: 0,
    explanation: "Satuan: 6 + 8 = 14 (tulis 4, simpan 1). Puluhan: 1 + 4 + 3 = 8. Jadi ada 84 kotak mentimun!"
  },
  {
    category: "cerita",
    question: "Kakek Kura membawa 28 kantong brokoli dan 37 kantong kubis ke pasar sayur. Berapa kantong sayur seluruhnya?",
    illustration: "🥦 28 kantong + 37 kantong",
    options: ["65 kantong", "55 kantong", "63 kantong", "58 kantong"],
    correctIndex: 0,
    explanation: "Satuan: 8 + 7 = 15 (tulis 5, simpan 1). Puluhan: 1 + 2 + 3 = 6. Jadi 65 kantong sayur."
  },

  // --- KATEGORI 3: TEBAK ANGKA SIMPANAN (7 Soal) ---
  {
    category: "simpanan",
    question: "Mengapa pada penjumlahan bersusun seperti 27 + 15, angka 1 harus kita 'simpan' di atas kolom puluhan?",
    illustration: "7 wortel + 5 wortel = 12 wortel",
    options: [
      "Karena rak satuan hanya muat sampai angka 9, dan 10 wortel diikat jadi 1 puluhan baru",
      "Karena angka 1 tidak sengaja terjatuh ke kolom puluhan",
      "Karena keranjang sayur sudah rusak",
      "Agar susunan angkanya terlihat lebih panjang"
    ],
    correctIndex: 0,
    explanation: "Nilai satuan 7 + 5 = 12. Karena 12 = 1 puluhan dan 2 satuan, 1 puluhan disimpan di kolom puluhan dan 2 ditulis di satuan."
  },
  {
    category: "simpanan",
    question: "Pada penjumlahan bersusun 49 + 25, berapakah angka yang ditulis di tempat satuan dan berapa yang disimpan?",
    illustration: "9 + 5 = 14",
    options: [
      "Tulis 4 di satuan, dan simpan 1 di puluhan",
      "Tulis 1 di satuan, dan simpan 4 di puluhan",
      "Tulis 14 semuanya di satuan",
      "Tulis 0 di satuan dan simpan 1"
    ],
    correctIndex: 0,
    explanation: "9 + 5 = 14. Angka satuannya adalah 4 (ditulis di bawah), dan 1 adalah puluhan yang disimpan ke atas."
  },
  {
    category: "simpanan",
    question: "Pada penjumlahan 16 + 18, angka 1 kecil berwarna merah yang disimpan di atas puluhan memiliki nilai tempat...",
    illustration: "¹ (simpanan merah di atas puluhan)",
    options: ["1 puluhan (bernilai 10)", "1 satuan (bernilai 1)", "1 ratusan (bernilai 100)", "Hanya hiasan saja"],
    correctIndex: 0,
    explanation: "Angka 1 simpanan berasal dari 10 sayur satuan yang diikat, sehingga nilainya adalah 1 puluhan (10)."
  },
  {
    category: "simpanan",
    question: "Jika penjumlahan pada kolom satuan menghasilkan angka 17, berapakah angka yang ditulis di bawah satuan dan angka yang disimpan?",
    illustration: "Satuan = 17",
    options: ["Tulis 7, simpan 1", "Tulis 1, simpan 7", "Tulis 17 semuanya", "Tulis 0, simpan 2"],
    correctIndex: 0,
    explanation: "17 terdiri dari 1 puluhan dan 7 satuan. Maka tulis 7 di kolom satuan dan simpan 1 ke kolom puluhan."
  },
  {
    category: "simpanan",
    question: "Manakah dari penjumlahan berikut ini yang MEMERLUKAN teknik menyimpan?",
    illustration: "Cek apakah satuan lebih dari 9:",
    options: ["28 + 15 (karena 8 + 5 = 13)", "21 + 13 (karena 1 + 3 = 4)", "32 + 14 (karena 2 + 4 = 6)", "40 + 25 (karena 0 + 5 = 5)"],
    correctIndex: 0,
    explanation: "Pada 28 + 15, jumlah satuannya 8 + 5 = 13 (lebih dari 9), sehingga memerlukan teknik menyimpan!"
  },
  {
    category: "simpanan",
    question: "Pada penjumlahan 38 + 26, satuan 8 + 6 = 14 (simpan 1). Berapakah jumlah kolom puluhannya?",
    illustration: "Puluhan: 1 (simpanan) + 3 + 2 = ...",
    options: ["6 puluhan (bernilai 60)", "5 puluhan (bernilai 50)", "7 puluhan (bernilai 70)", "4 puluhan (bernilai 40)"],
    correctIndex: 0,
    explanation: "Puluhan = 1 (simpanan) + 3 + 2 = 6 puluhan (60). Hasil akhirnya 64!"
  },
  {
    category: "simpanan",
    question: "Di kolom satuan terdapat 9 + 4 = 13. Angka 1 dari bilangan 13 harus dipindahkan ke kolom mana?",
    illustration: "9 + 4 = 13 ➔ angka 1 pindah ke...",
    options: ["Kolom Puluhan", "Tetap di Kolom Satuan", "Kolom Ratusan", "Dibuang saja"],
    correctIndex: 0,
    explanation: "Angka 1 bernilai puluhan (10), jadi harus dipindahkan dan disimpan ke kolom puluhan."
  },

  // --- KATEGORI 4: HITUNG BERSUSUN (7 Soal) ---
  {
    category: "bersusun",
    question: "Berapakah hasil dari penjumlahan bersusun: 28 + 15 = ... ?",
    illustration: "28 + 15 = ...",
    options: ["43", "33", "42", "38"],
    correctIndex: 0,
    explanation: "Satuan: 8 + 5 = 13 (tulis 3, simpan 1). Puluhan: 1 (simpanan) + 2 + 1 = 4. Jadi hasilnya 43!"
  },
  {
    category: "bersusun",
    question: "Perhatikan penjumlahan bersusun ini: 37 + 45 = ... Berapakah hasil akhirnya?",
    illustration: "37 + 45 = ...",
    options: ["82", "72", "81", "79"],
    correctIndex: 0,
    explanation: "Satuan: 7 + 5 = 12 (tulis 2, simpan 1). Puluhan: 1 + 3 + 4 = 8. Hasilnya 82."
  },
  {
    category: "bersusun",
    question: "Berapakah hasil dari penjumlahan bersusun: 48 + 39 = ... ?",
    illustration: "48 + 39 = ...",
    options: ["87", "77", "88", "86"],
    correctIndex: 0,
    explanation: "Satuan: 8 + 9 = 17 (tulis 7, simpan 1). Puluhan: 1 + 4 + 3 = 8. Hasilnya 87!"
  },
  {
    category: "bersusun",
    question: "Pada penjumlahan bersusun: 26 + [ ? ] = 41. Angka berapakah yang tepat untuk mengisi kotak tanda tanya [ ? ] tersebut?",
    illustration: "26 + [ ? ] = 41",
    options: ["15", "14", "25", "16"],
    correctIndex: 0,
    explanation: "Karena 41 - 26 = 15. Kita cek: 26 + 15 = 41 (satuan 6 + 5 = 11, simpan 1, puluhan 1 + 2 + 1 = 4). Tepat sekali!"
  },
  {
    category: "bersusun",
    question: "Berapakah hasil dari penjumlahan bersusun: 58 + 27 = ... ?",
    illustration: "58 + 27 = ...",
    options: ["85", "75", "84", "81"],
    correctIndex: 0,
    explanation: "Satuan: 8 + 7 = 15 (tulis 5, simpan 1). Puluhan: 1 + 5 + 2 = 8. Hasilnya 85."
  },
  {
    category: "bersusun",
    question: "Hitunglah penjumlahan bersusun berikut: 67 + 25 = ... ?",
    illustration: "67 + 25 = ...",
    options: ["92", "82", "91", "89"],
    correctIndex: 0,
    explanation: "Satuan: 7 + 5 = 12 (tulis 2, simpan 1). Puluhan: 1 + 6 + 2 = 9. Hasilnya 92."
  },
  {
    category: "bersusun",
    question: "Hitunglah penjumlahan bersusun ini: 55 + 38 = ... ?",
    illustration: "55 + 38 = ...",
    options: ["93", "83", "92", "88"],
    correctIndex: 0,
    explanation: "Satuan: 5 + 8 = 13 (tulis 3, simpan 1). Puluhan: 1 + 5 + 3 = 9. Hasilnya 93!"
  }
];

// Quiz Configuration State
let quizConfig = {
  selectedCategory: 'all',
  selectedLength: 10,
  activeQuestions: []
};

let quizState = {
  currentIndex: 0,
  score: 0,
  correctCount: 0,
  userAnswers: [],
  answered: false
};

function selectQuizCategory(cat) {
  sound.playPop();
  quizConfig.selectedCategory = cat;
  document.querySelectorAll('.quiz-cat-pill').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.cat === cat);
  });
}

function selectQuizLength(len) {
  sound.playPop();
  quizConfig.selectedLength = len;
  document.querySelectorAll('.quiz-len-pill').forEach(btn => {
    btn.classList.toggle('active', parseInt(btn.dataset.len, 10) === len);
  });
}

function initQuiz() {
  quizState.currentIndex = 0;
  quizState.score = 0;
  quizState.correctCount = 0;
  quizState.userAnswers = [];
  quizState.answered = false;

  const modal = document.getElementById('quizFeedbackModal');
  if (modal) {
    modal.classList.remove('active');
    modal.style.display = 'none';
  }

  const startCard = document.getElementById('quizStartCard');
  const playingCard = document.getElementById('quizPlayingCard');
  const resultCard = document.getElementById('quizResultCard');

  if (resultCard) resultCard.classList.remove('show');
  if (playingCard) playingCard.style.display = 'none';
  if (startCard) startCard.style.display = 'block';

  // Pre-fill fields if user has an existing name
  const nameInp = document.getElementById('quizStudentNameInput');
  const classInp = document.getElementById('quizStudentClassInput');
  const schoolInp = document.getElementById('quizStudentSchoolInput');

  if (nameInp && AppState.studentName && AppState.studentName !== 'Sobat Sayur') {
    nameInp.value = AppState.studentName;
  }
  if (classInp && AppState.studentClass) {
    classInp.value = AppState.studentClass;
  }
  if (schoolInp && AppState.studentSchool) {
    schoolInp.value = AppState.studentSchool;
  }
}

function startQuizWithParticipant() {
  const nameInp = document.getElementById('quizStudentNameInput');
  const classInp = document.getElementById('quizStudentClassInput');
  const schoolInp = document.getElementById('quizStudentSchoolInput');

  const enteredName = nameInp ? nameInp.value.trim() : '';

  if (!enteredName) {
    sound.playWrong();
    if (nameInp) {
      nameInp.focus();
      nameInp.style.borderColor = '#ef4444';
      nameInp.placeholder = 'Nama tidak boleh kosong!';
      setTimeout(() => {
        nameInp.style.borderColor = '';
        nameInp.placeholder = 'Ketik nama lengkapmu di sini...';
      }, 2500);
    }
    showFloatingReward('⚠️ Tuliskan namamu dulu ya!');
    return;
  }

  // Update AppState
  AppState.studentName = enteredName;
  if (classInp && classInp.value.trim()) {
    AppState.studentClass = classInp.value.trim();
  }
  if (schoolInp && schoolInp.value.trim()) {
    AppState.studentSchool = schoolInp.value.trim();
  }
  AppState.save();

  // Filter questions based on selected category & length
  let pool = QuizBank;
  if (quizConfig.selectedCategory !== 'all') {
    pool = QuizBank.filter(q => q.category === quizConfig.selectedCategory);
  }

  // Shuffle pool to ensure random variety each time
  const shuffledPool = [...pool].sort(() => Math.random() - 0.5);
  quizConfig.activeQuestions = shuffledPool.slice(0, Math.min(quizConfig.selectedLength, shuffledPool.length));

  // If pool was smaller than requested length, backfill with other questions
  if (quizConfig.activeQuestions.length < quizConfig.selectedLength) {
    const remaining = QuizBank.filter(q => !quizConfig.activeQuestions.includes(q)).sort(() => Math.random() - 0.5);
    const needed = quizConfig.selectedLength - quizConfig.activeQuestions.length;
    quizConfig.activeQuestions = quizConfig.activeQuestions.concat(remaining.slice(0, needed));
  }

  quizState.currentIndex = 0;
  quizState.score = 0;
  quizState.correctCount = 0;

  sound.playSuccess();
  document.getElementById('quizStartCard').style.display = 'none';
  document.getElementById('quizPlayingCard').style.display = 'block';
  document.getElementById('quizResultCard').classList.remove('show');

  // Update quiz header participant badge & category badge
  const qHeadAvatar = document.getElementById('quizHeaderAvatar');
  const qHeadName = document.getElementById('quizHeaderName');
  const qHeadClass = document.getElementById('quizHeaderClass');
  if (qHeadAvatar) qHeadAvatar.textContent = AppState.studentAvatar;
  if (qHeadName) qHeadName.textContent = AppState.studentName;
  if (qHeadClass) qHeadClass.textContent = `(${AppState.studentClass})`;

  const catNames = {
    all: '🌟 Semua Variasi (Campuran)',
    visual: '🧺 Gambar Keranjang & Sayur',
    cerita: '📖 Soal Cerita Pasar',
    simpanan: '🔢 Tebak Angka Simpanan',
    bersusun: '📝 Hitung Bersusun'
  };
  const catBadge = document.getElementById('quizCategoryBadge');
  if (catBadge) {
    catBadge.textContent = `Variasi: ${catNames[quizConfig.selectedCategory]} (${quizConfig.activeQuestions.length} Soal)`;
  }

  showFloatingReward(`Semangat mengerjakan, ${AppState.studentName}! 🌟`);
  loadQuizQuestion();
}

function editQuizParticipant() {
  sound.playPop();
  document.getElementById('quizStartCard').style.display = 'block';
  document.getElementById('quizPlayingCard').style.display = 'none';
  const nameInp = document.getElementById('quizStudentNameInput');
  if (nameInp) nameInp.focus();
}

function loadQuizQuestion() {
  quizState.answered = false;
  const q = quizConfig.activeQuestions[quizState.currentIndex];

  // Close and hide feedback modal if visible
  const modal = document.getElementById('quizFeedbackModal');
  if (modal) {
    modal.classList.remove('active');
    modal.style.display = 'none';
  }

  document.getElementById('quizCurrentNum').textContent = quizState.currentIndex + 1;
  document.getElementById('quizTotalNum').textContent = quizConfig.activeQuestions.length;
  document.getElementById('quizQuestionText').textContent = q.question;
  document.getElementById('quizIllustration').innerHTML = `<span style="font-size:1.6rem;">${q.illustration}</span>`;

  const explanationBox = document.getElementById('quizExplanationBox');
  if (explanationBox) {
    explanationBox.classList.remove('show');
    explanationBox.innerHTML = '';
  }

  const optionsContainer = document.getElementById('quizOptionsContainer');
  optionsContainer.innerHTML = '';

  // Prepare options with shuffled positions so correct answer isn't always at index 0
  const mappedOptions = q.options.map((opt, idx) => ({
    text: opt,
    isCorrect: idx === q.correctIndex
  }));
  const shuffledOptions = [...mappedOptions].sort(() => Math.random() - 0.5);

  shuffledOptions.forEach((optObj, idx) => {
    const btn = document.createElement('button');
    btn.className = 'quiz-option-btn';
    btn.innerHTML = `<span>${['A', 'B', 'C', 'D'][idx]}.</span> ${optObj.text}`;
    btn.onclick = () => selectQuizAnswer(optObj.isCorrect, btn, shuffledOptions);
    optionsContainer.appendChild(btn);
  });
}

let currentModalSpeechText = '';

function selectQuizAnswer(isCorrect, btnEl, optionsList) {
  if (quizState.answered) return;
  quizState.answered = true;

  const q = quizConfig.activeQuestions[quizState.currentIndex];
  const allBtns = document.querySelectorAll('.quiz-option-btn');

  // Find correct answer text
  const correctOpt = optionsList.find(o => o.isCorrect);
  const correctText = correctOpt ? correctOpt.text : q.options[q.correctIndex];

  allBtns.forEach((b, idx) => {
    b.disabled = true;
    if (optionsList[idx].isCorrect) {
      b.classList.add('correct');
    }
  });

  if (isCorrect) {
    sound.playSuccess();
    quizState.correctCount++;
    btnEl.classList.add('correct');
    AppState.addCoins(10);
    triggerConfetti(window.innerWidth / 2, window.innerHeight * 0.4);
  } else {
    sound.playWrong();
    btnEl.classList.add('wrong');
  }

  // Update inline explanation box as backup
  const expBox = document.getElementById('quizExplanationBox');
  if (expBox) {
    expBox.innerHTML = `
      <div style="font-family:'Fredoka'; font-weight:700; color:${isCorrect ? '#15803d' : '#b91c1c'}; margin-bottom:4px;">
        ${isCorrect ? '✅ Jawaban Kamu Benar! Hebat!' : '❌ Jawaban Kurang Tepat, Perhatikan ya!'}
      </div>
      <div style="font-size:0.95rem; color:#334155;">${q.explanation}</div>
      <button class="btn-primary" style="margin-top:1rem; font-size:1rem; padding:0.6rem 1.4rem;" onclick="nextQuizQuestion()">
        ${quizState.currentIndex < quizConfig.activeQuestions.length - 1 ? 'Soal Berikutnya ➡️' : 'Lihat Hasil & Sertifikat 🏆'}
      </button>
    `;
    expBox.classList.add('show');
  }

  // Tampilkan Pop-Up Dialog Interaktif (Benar / Salah)
  showQuizFeedbackModal(isCorrect, q, correctText);
}

function showQuizFeedbackModal(isCorrect, q, correctText) {
  const modal = document.getElementById('quizFeedbackModal');
  const modalCard = document.getElementById('quizModalCard');
  const modalEmoji = document.getElementById('quizModalEmoji');
  const modalTitle = document.getElementById('quizModalTitle');
  const modalSubtitle = document.getElementById('quizModalSubtitle');
  const modalReward = document.getElementById('quizModalRewardPill');
  const answerHighlight = document.getElementById('quizModalAnswerHighlight');
  const answerLabel = document.getElementById('quizModalAnswerLabel');
  const answerVal = document.getElementById('quizModalAnswerVal');
  const expText = document.getElementById('quizModalExplanationText');
  const nextBtn = document.getElementById('btnModalNextQuestion');

  if (!modal || !modalCard) return;

  const isLastQuestion = quizState.currentIndex >= quizConfig.activeQuestions.length - 1;
  const studentName = AppState.studentName || 'Sobat Sayur';

  if (isCorrect) {
    modalCard.className = 'quiz-modal-card correct';
    if (modalEmoji) modalEmoji.textContent = '🎉';
    if (modalTitle) modalTitle.textContent = 'Hore! Jawabanmu Benar! 🌟';
    if (modalSubtitle) modalSubtitle.textContent = `Hebat sekali ${studentName}, kamu sangat teliti dan pintar!`;
    
    if (modalReward) {
      modalReward.style.display = 'inline-flex';
      modalReward.innerHTML = '<span>🪙</span> +10 Koin Emas Ditambahkan!';
    }

    if (answerHighlight) answerHighlight.style.display = 'flex';
    if (answerLabel) answerLabel.textContent = 'Jawaban Tepat:';
    if (answerVal) answerVal.textContent = correctText;

    if (nextBtn) {
      nextBtn.innerHTML = isLastQuestion 
        ? '🏆 Lihat Hasil & Sertifikat Juara' 
        : 'Lanjut ke Soal Berikutnya ➡️';
    }

    currentModalSpeechText = `Hore, jawabanmu benar! Jawaban yang tepat adalah ${correctText}. ${q.explanation}`;
  } else {
    modalCard.className = 'quiz-modal-card wrong';
    if (modalEmoji) modalEmoji.textContent = '🌱';
    if (modalTitle) modalTitle.textContent = 'Yah, Belum Tepat! Semangat ya! 💪';
    if (modalSubtitle) modalSubtitle.textContent = `Jangan berkecil hati ${studentName}, yuk kita pelajari bersama Pak Tani:`;
    
    if (modalReward) modalReward.style.display = 'none';

    if (answerHighlight) answerHighlight.style.display = 'flex';
    if (answerLabel) answerLabel.textContent = 'Jawaban yang Benar:';
    if (answerVal) answerVal.textContent = correctText;

    if (nextBtn) {
      nextBtn.innerHTML = isLastQuestion 
        ? '🏆 Lihat Hasil & Sertifikat Juara' 
        : 'Aku Paham, Lanjut Soal Berikutnya ➡️';
    }

    currentModalSpeechText = `Jawabanmu belum tepat, tapi tidak apa-apa! Jawaban yang tepat adalah ${correctText}. ${q.explanation}`;
  }

  if (expText) expText.textContent = q.explanation;

  // Pop-up modal muncul di tengah layar secara otomatis
  setTimeout(() => {
    modal.style.display = 'flex';
    requestAnimationFrame(() => {
      modal.classList.add('active');
      if (nextBtn) nextBtn.focus();
    });
  }, 280);
}

function speakModalExplanation() {
  if (currentModalSpeechText) {
    speakText(currentModalSpeechText);
  }
}

function closeQuizModalAndNext() {
  const modal = document.getElementById('quizFeedbackModal');
  if (modal) {
    modal.classList.remove('active');
    setTimeout(() => {
      modal.style.display = 'none';
      nextQuizQuestion();
    }, 220);
  } else {
    nextQuizQuestion();
  }
}

function nextQuizQuestion() {
  sound.playPop();

  // Pastikan modal tertutup
  const modal = document.getElementById('quizFeedbackModal');
  if (modal) {
    modal.classList.remove('active');
    modal.style.display = 'none';
  }

  if (quizState.currentIndex < quizConfig.activeQuestions.length - 1) {
    quizState.currentIndex++;
    loadQuizQuestion();
  } else {
    showQuizResult();
  }
}

function showQuizResult() {
  document.getElementById('quizPlayingCard').style.display = 'none';
  document.getElementById('quizStartCard').style.display = 'none';
  const resultCard = document.getElementById('quizResultCard');
  resultCard.classList.add('show');

  const totalQuestions = quizConfig.activeQuestions.length;
  const finalScore = Math.round((quizState.correctCount / totalQuestions) * 100);
  document.getElementById('quizFinalScore').textContent = finalScore;

  let starsStr = '⭐';
  let titleStr = 'Sahabat Belajar Sayur';
  if (finalScore >= 90) {
    starsStr = '⭐⭐⭐⭐⭐';
    titleStr = 'Juara Bintang Pasar Sayur (Istimewa!) 🥕👑';
    AppState.addCoins(50);
  } else if (finalScore >= 70) {
    starsStr = '⭐⭐⭐⭐';
    titleStr = 'Petani Matematika Cerdas 🌟';
    AppState.addCoins(30);
  } else {
    starsStr = '⭐⭐⭐';
    titleStr = 'Asisten Kasir Berbakat 🌱';
    AppState.addCoins(15);
  }

  document.getElementById('quizStarsDisplay').textContent = starsStr;
  document.getElementById('quizTitleDisplay').textContent = titleStr;

  // Update participant details in result card
  const resName = document.getElementById('resultStudentNameDisplay');
  const resClass = document.getElementById('resultStudentClassDisplay');
  if (resName) resName.textContent = AppState.studentName;
  if (resClass) {
    resClass.textContent = `${AppState.studentClass}${AppState.studentSchool ? ' • ' + AppState.studentSchool : ''}`;
  }

  // Prepare certificate
  document.getElementById('certStudentName').textContent = AppState.studentName;
  const certMeta = document.getElementById('certStudentMeta');
  if (certMeta) {
    certMeta.textContent = `${AppState.studentClass}${AppState.studentSchool ? ' • ' + AppState.studentSchool : ''}`;
  }

  const catNames = {
    all: '🌟 Semua Variasi (Campuran)',
    visual: '🧺 Gambar Keranjang & Sayur',
    cerita: '📖 Soal Cerita Pasar',
    simpanan: '🔢 Tebak Angka Simpanan',
    bersusun: '📝 Hitung Bersusun'
  };

  const certDesc = document.getElementById('certDescription');
  if (certDesc) {
    certDesc.innerHTML = `Telah berhasil dan cakap menguasai materi <strong>Penjumlahan Bilangan sampai 100 dengan Teknik Menyimpan</strong> (Kategori: <em>${catNames[quizConfig.selectedCategory] || 'Semua Variasi'}</em>) melalui media simulasi interaktif Pasar Sayur Mini dengan perolehan nilai: <strong><span id="certScore">${finalScore}/100</span></strong> (${quizState.correctCount} dari ${totalQuestions} Benar).`;
  }

  document.getElementById('certDate').textContent = new Date().toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  });

  sound.playSuccess();
  triggerConfetti(window.innerWidth / 2, window.innerHeight / 2);
}

function printCertificate() {
  window.print();
}

// ================= 7. CONFETTI PARTICLES ENGINE =================
function triggerConfetti(originX, originY) {
  const canvas = document.getElementById('confettiCanvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;

  const particles = [];
  const colors = ['#2ecc71', '#ff7675', '#fbc531', '#70a1ff', '#e056fd', '#ff9f43'];

  for (let i = 0; i < 70; i++) {
    particles.push({
      x: originX || canvas.width / 2,
      y: originY || canvas.height / 2,
      vx: (Math.random() - 0.5) * 14,
      vy: (Math.random() - 0.7) * 15,
      size: Math.random() * 8 + 6,
      color: colors[Math.floor(Math.random() * colors.length)],
      rotation: Math.random() * 360,
      vRot: (Math.random() - 0.5) * 10,
      life: 1
    });
  }

  function render() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    let activeCount = 0;

    particles.forEach(p => {
      if (p.life > 0) {
        activeCount++;
        p.x += p.vx;
        p.y += p.vy;
        p.vy += 0.35; // gravity
        p.rotation += p.vRot;
        p.life -= 0.015;

        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate((p.rotation * Math.PI) / 180);
        ctx.fillStyle = p.color;
        ctx.globalAlpha = Math.max(0, p.life);
        ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size * 0.7);
        ctx.restore();
      }
    });

    if (activeCount > 0) {
      requestAnimationFrame(render);
    } else {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
    }
  }

  render();
}

// ================= 8. INITIALIZATION & EVENT LISTENERS =================
document.addEventListener('DOMContentLoaded', () => {
  AppState.updateUI();

  // Navigation handlers
  document.querySelectorAll('.nav-item-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      switchPage(btn.dataset.page);
    });
  });

  // Sound toggles
  const btnBgm = document.getElementById('btnToggleBgm');
  if (btnBgm) btnBgm.addEventListener('click', () => sound.toggleBGM());

  const btnSound = document.getElementById('btnToggleSound');
  if (btnSound) btnSound.addEventListener('click', () => sound.toggleMute());

  // Save student profile
  const saveNameBtn = document.getElementById('btnSaveName');
  if (saveNameBtn) {
    saveNameBtn.addEventListener('click', () => {
      const input = document.getElementById('studentNameInput');
      if (input && input.value.trim()) {
        AppState.studentName = input.value.trim();
        AppState.save();
        sound.playPop();
        showFloatingReward(`Halo, ${AppState.studentName}! 🎉`);
      }
    });
  }

  // Avatar pickers in profile
  document.querySelectorAll('.avatar-option[data-avatar]').forEach(opt => {
    opt.addEventListener('click', () => {
      document.querySelectorAll('.avatar-option[data-avatar]').forEach(o => o.classList.remove('selected'));
      opt.classList.add('selected');
      AppState.studentAvatar = opt.dataset.avatar;
      AppState.save();
      sound.playPop();
    });
  });

  // Avatar pickers in quiz registration
  document.querySelectorAll('.avatar-option[data-quiz-avatar]').forEach(opt => {
    opt.addEventListener('click', () => {
      document.querySelectorAll('.avatar-option[data-quiz-avatar]').forEach(o => o.classList.remove('selected'));
      opt.classList.add('selected');
      AppState.studentAvatar = opt.dataset.quizAvatar;
      AppState.save();
      sound.playPop();
    });
  });

  // Handle Enter on name input in home
  const nameInput = document.getElementById('studentNameInput');
  if (nameInput) {
    nameInput.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') {
        saveNameBtn.click();
      }
    });
  }

  // Handle Enter on name input in quiz
  const quizNameInput = document.getElementById('quizStudentNameInput');
  if (quizNameInput) {
    quizNameInput.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') {
        startQuizWithParticipant();
      }
    });
  }

  // Window resize confetti
  window.addEventListener('resize', () => {
    const canvas = document.getElementById('confettiCanvas');
    if (canvas) {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    }
  });

  // Quiz Feedback Modal: Click backdrop to advance
  const quizModalOverlay = document.getElementById('quizFeedbackModal');
  if (quizModalOverlay) {
    quizModalOverlay.addEventListener('click', (e) => {
      if (e.target === quizModalOverlay) {
        closeQuizModalAndNext();
      }
    });
  }

  // Quiz Feedback Modal: Press Enter or Space to advance
  document.addEventListener('keydown', (e) => {
    const modal = document.getElementById('quizFeedbackModal');
    if (modal && modal.classList.contains('active')) {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        closeQuizModalAndNext();
      }
    }
  });

  // Default initial page
  switchPage('beranda');
});
