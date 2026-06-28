// Script definitions
const SCRIPTS = {
  'khaenriah':  { name: 'Ancient',           fontFamily: 'GenshinKhaenriah', missing: [] },
  'teyvat':     { name: 'Teyvat Common',     fontFamily: 'GenshinTeyvat',    missing: [] },
  'inazuma':    { name: 'Inazuma',           fontFamily: 'GenshinInazuma',   missing: [] },
  'liyue':      { name: 'Liyue',            fontFamily: 'GenshinLiyue',     missing: [] },
  'sumeru':     { name: 'Sumeru',            fontFamily: 'GenshinSumeru',    missing: [] },
  'deshret':    { name: 'Deshret',           fontFamily: 'GenshinDeshret',   missing: [] },
  'fontaine':   { name: 'Fontaine',          fontFamily: 'GenshinFontaine',  missing: [] },
  'drip':       { name: 'Drip Marketing',    fontFamily: 'GenshinDrip',      missing: [] },
};

const CHARACTERS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ,.'.split('');
const CHAR_LABELS = { ',': ',', '.': '.' };

let currentScript = 'khaenriah';
let mode = 'decode';
let layout = 'side'; // 'side' or 'bottom'

// DOM elements
const inputText = document.getElementById('input-text');
const outputText = document.getElementById('output-text');
const inputLabel = document.getElementById('input-label');
const outputLabel = document.getElementById('output-label');
const modeEncode = document.getElementById('mode-encode');
const modeDecode = document.getElementById('mode-decode');
const scriptSelect = document.getElementById('script-select');
const btnLayout = document.getElementById('btn-layout');
const layoutIconSide = document.getElementById('layout-icon-side');
const layoutIconBottom = document.getElementById('layout-icon-bottom');
const mainArea = document.getElementById('main-area');
const chartGrid = document.getElementById('chart-grid');
const chartTitle = document.getElementById('chart-title');

function getFont() {
  return SCRIPTS[currentScript].fontFamily;
}

function getScriptName() {
  return SCRIPTS[currentScript].name;
}

function getMissing() {
  return SCRIPTS[currentScript].missing;
}

// Apply script font + styling to an element (works for both textarea and output div)
function applyScriptStyle(element) {
  element.style.fontFamily = `'${getFont()}', 'Cinzel', serif`;
  element.classList.add('script-styled');
}

// Remove script font + styling
function clearScriptStyle(element) {
  element.style.fontFamily = '';
  element.classList.remove('script-styled');
}

function translate() {
  const input = inputText.value;
  if (mode === 'encode') {
    outputText.textContent = input.toUpperCase();
    outputText.classList.remove('english-output');
    applyScriptStyle(outputText);
  } else {
    outputText.textContent = input;
    outputText.classList.add('english-output');
    clearScriptStyle(outputText);
  }
}

function setMode(newMode) {
  mode = newMode;
  inputText.value = '';
  outputText.textContent = '';

  if (mode === 'encode') {
    modeEncode.classList.add('active');
    modeDecode.classList.remove('active');
    inputLabel.textContent = 'English Text';
    outputLabel.textContent = getScriptName() + ' Script';
    inputText.placeholder = 'Type English text here...';
    clearScriptStyle(inputText);
    outputText.classList.remove('english-output');
    applyScriptStyle(outputText);
  } else {
    modeDecode.classList.add('active');
    modeEncode.classList.remove('active');
    inputLabel.textContent = getScriptName() + ' Script';
    outputLabel.textContent = 'English Text';
    inputText.placeholder = 'Type to see glyphs decode to English...';
    applyScriptStyle(inputText);
    outputText.classList.add('english-output');
    clearScriptStyle(outputText);
  }
}

function setScript(scriptKey) {
  currentScript = scriptKey;
  if (mode === 'encode') {
    outputLabel.textContent = getScriptName() + ' Script';
    applyScriptStyle(outputText);
  } else {
    inputLabel.textContent = getScriptName() + ' Script';
    applyScriptStyle(inputText);
  }
  buildChart();
  translate();
}

function toggleLayout() {
  const controlsRow = document.querySelector('.controls-row');

  // Fade out both controls row and main area
  mainArea.classList.add('layout-transitioning');
  controlsRow.classList.add('controls-transitioning');

  setTimeout(() => {
    if (layout === 'side') {
      layout = 'bottom';
      mainArea.classList.add('layout-bottom');
      layoutIconSide.style.display = 'none';
      layoutIconBottom.style.display = 'block';
    } else {
      layout = 'side';
      mainArea.classList.remove('layout-bottom');
      layoutIconSide.style.display = 'block';
      layoutIconBottom.style.display = 'none';
    }

    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        mainArea.classList.remove('layout-transitioning');
        controlsRow.classList.remove('controls-transitioning');
      });
    });
  }, 300);
}

// Event listeners
inputText.addEventListener('input', translate);
modeEncode.addEventListener('click', () => setMode('encode'));
modeDecode.addEventListener('click', () => setMode('decode'));
scriptSelect.addEventListener('change', (e) => setScript(e.target.value));
btnLayout.addEventListener('click', toggleLayout);

function buildChart() {
  chartGrid.innerHTML = '';
  chartTitle.textContent = getScriptName() + ' Reference';
  const missing = getMissing();

  CHARACTERS.forEach(ch => {
    const isMissing = missing.includes(ch.toUpperCase());

    const item = document.createElement('div');
    item.className = 'chart-item' + (isMissing ? ' chart-item-missing' : '');

    const glyph = document.createElement('span');
    glyph.className = 'chart-glyph';
    if (isMissing) {
      glyph.textContent = '?';
      glyph.title = 'Unknown — not yet deciphered';
    } else {
      glyph.textContent = ch;
      glyph.style.fontFamily = `'${getFont()}', serif`;
    }

    const label = document.createElement('span');
    label.className = 'chart-letter';
    label.textContent = CHAR_LABELS[ch] || ch;

    item.appendChild(glyph);
    item.appendChild(label);

    if (!isMissing) {
      item.addEventListener('click', () => {
        inputText.value += ch;
        translate();
        inputText.focus();
      });
    }

    chartGrid.appendChild(item);
  });
}

function showToast(message) {
  let toast = document.querySelector('.copy-toast');
  if (!toast) {
    toast = document.createElement('div');
    toast.className = 'copy-toast';
    document.body.appendChild(toast);
  }
  toast.textContent = message;
  toast.classList.add('show');
  setTimeout(() => toast.classList.remove('show'), 1500);
}

function createParticles() {
  const container = document.getElementById('particles');
  for (let i = 0; i < 30; i++) {
    const particle = document.createElement('div');
    particle.className = 'particle';
    particle.style.left = Math.random() * 100 + '%';
    particle.style.animationDuration = (8 + Math.random() * 12) + 's';
    particle.style.animationDelay = Math.random() * 10 + 's';
    particle.style.width = (1 + Math.random() * 3) + 'px';
    particle.style.height = particle.style.width;
    container.appendChild(particle);
  }
}

// About modal
const aboutOverlay = document.getElementById('about-overlay');
const btnAbout = document.getElementById('btn-about');
const fontRepoLink = document.getElementById('font-repo-link');

btnAbout.addEventListener('click', () => {
  aboutOverlay.classList.remove('hidden');
});

aboutOverlay.addEventListener('click', (e) => {
  if (e.target === aboutOverlay) {
    aboutOverlay.classList.add('hidden');
  }
});

fontRepoLink.addEventListener('click', (e) => {
  e.preventDefault();
  require('electron').shell.openExternal('https://github.com/thomas200593/genshin-fonts-collections');
});

document.getElementById('btn-minimize').style.display='none';document.getElementById('btn-maximize').style.display='none';document.getElementById('btn-close').style.display='none';

// Init
applyScriptStyle(inputText);
buildChart();
createParticles();
inputText.focus();
