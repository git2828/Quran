let quranData = [];
let translationData = [];
let currentSurah = 0; // Default to the first Surah (Al-Fatiha)
let currentPage = 1;
let ayatPerPage = 5; // Default ayat per page
let highlightedAyah = null;
let showQuranText = true;
let showTranslation = true;
let darkMode = false;

const surahNames = [
  "Al-Fatiha", "Al-Baqarah", "Al-Imran", "An-Nisa", "Al-Ma'idah", "Al-An'am", "Al-A'raf", 
  "Al-Anfal", "At-Tawbah", "Yunus", "Hud", "Yusuf", "Ar-Ra'd", "Ibrahim", "Al-Hijr", 
  "An-Nahl", "Al-Isra", "Al-Kahf", "Maryam", "Ta-Ha", "Al-Anbiya", "Al-Hajj", "Al-Mu’minun", 
  "An-Nur", "Al-Furqan", "Ash-Shu'ara", "An-Naml", "Al-Qasas", "Al-Ankabut", "Ar-Rum", 
  "Luqman", "As-Sajda", "Al-Ahzab", "Saba", "Fatir", "Ya-Sin", "As-Saffat", "Sad", 
  "Az-Zumar", "Ghafir", "Fussilat", "Ash-Shura", "Az-Zukhruf", "Ad-Dukhan", "Al-Jathiyah", 
  "Al-Ahqaf", "Muhammad", "Al-Fath", "Al-Hujurat", "Qaf", "Adh-Dhariyat", "At-Tur", 
  "An-Najm", "Al-Qamar", "Ar-Rahman", "Al-Waqi'a", "Al-Hadid", "Al-Mujadila", "Al-Hashr", 
  "Al-Mumtahina", "As-Saff", "Al-Jumu'a", "Al-Munafiqun", "At-Taghabun", "At-Talaq", 
  "At-Tahrim", "Al-Mulk", "Al-Qalam", "Al-Haqqah", "Al-Ma'arij", "Nuh", "Al-Jinn", 
  "Al-Muzzammil", "Al-Muddathir", "Al-Qiyamah", "Al-Insan", "Al-Mursalat", "An-Naba", 
  "An-Nazi'at", "Abasa", "At-Takwir", "Al-Infitar", "Al-Mutaffifin", "Al-Inshiqaq", 
  "Al-Buruj", "At-Tariq", "Al-A'la", "Al-Ghashiyah", "Al-Fajr", "Al-Balad", "Ash-Shams", 
  "Al-Lail", "Ad-Duha", "Ash-Sharh", "At-Tin", "Al-Alaq", "Al-Qadr", "Al-Bayyina", 
  "Az-Zalzalah", "Al-Adiyat", "Al-Qari'a", "At-Takathur", "Al-Asr", "Al-Humazah", 
  "Al-Fil", "Quraish", "Al-Ma'un", "Al-Kawthar", "Al-Kafirun", "An-Nasr", "Al-Masad", 
  "Al-Ikhlas", "Al-Falaq", "An-Nas"
];

document.addEventListener('DOMContentLoaded', () => {
    loadFiles();
    setupControls();
});

function loadFiles() {
    fetch('quran.json')
        .then(response => response.json())
        .then(data => {
            quranData = data;
            fetch('translation.json')
                .then(response => response.json())
                .then(transData => {
                    translationData = transData;
                    populateSurahDropdown();
                    renderPage();
                });
        });
}

function setupControls() {
    document.getElementById('toggleDarkMode').addEventListener('click', toggleDarkMode);
    document.getElementById('toggleQuranicText').addEventListener('click', toggleQuranicText);
    document.getElementById('toggleTranslation').addEventListener('click', toggleTranslation);
    document.getElementById('surahSelect').addEventListener('change', changeSurah);
    document.getElementById('ayatCount').addEventListener('change', changeAyatCount);
    document.getElementById('prevPage').addEventListener('click', () => changePage(-1));
    document.getElementById('nextPage').addEventListener('click', () => changePage(1));
}

function populateSurahDropdown() {
    const surahSelect = document.getElementById('surahSelect');
    surahNames.forEach((name, index) => {
        const option = document.createElement('option');
        option.value = index;
        option.textContent = name;
        surahSelect.appendChild(option);
    });
}

function renderPage() {
    const surahData = quranData.filter(ayah => ayah[1] == currentSurah + 1); // Filter ayahs for the selected surah
    const translationSurahData = translationData.filter((_, index) => quranData[index][1] == currentSurah + 1); // Filter corresponding translations

    const totalAyat = surahData.length;
    const startAyah = (currentPage - 1) * ayatPerPage;
    const endAyah = Math.min(startAyah + ayatPerPage, totalAyat);

    let content = '';

    if (fullTranslationMode) {
        // In full translation mode, display all translations as a paragraph
        const allTranslations = translationSurahData.map(translation => translation[0]).join(' ');
        content = `<div class="full-translation"><p>${allTranslations}</p></div>`;
    } else {
        // Normal mode: Display Quranic text with corresponding translation and ayah number
        surahData.slice(startAyah, endAyah).forEach((ayah, index) => {
            const ayahNumber = ayah[2];  // Ayah number from JSON (3rd element)
            const ayahText = ayah[4];    // Quranic text from JSON (5th element)
            const translationIndex = startAyah + index;
            const translationText = translationSurahData[translationIndex] ? translationSurahData[translationIndex][0] : "Translation not available";

            // Debugging line to ensure ayah number and text are being processed correctly
            console.log(`Ayah Number: ${ayahNumber}, Ayah Text: ${ayahText}`);

            content += `<div class="ayah" data-index="${index}">
                          ${showQuranText ? `<p class="quranic"><span class="ayah-number">${ayahNumber}</span> ${ayahText}</p>` : ''}
                          ${showTranslation ? `<p class="translation">${translationText}</p>` : ''}
                        </div>`;
        });
    }

    document.getElementById('quranContent').innerHTML = content;

    if (!fullTranslationMode) {
        // Handle highlighting when not in full translation mode
        document.querySelectorAll('.ayah').forEach(el => {
            el.addEventListener('click', highlightAyah);
        });
    }

    updatePaginationInfo(totalAyat);
}

function highlightAyah(event) {
    if (highlightedAyah) {
        highlightedAyah.classList.remove('highlight');
    }
    highlightedAyah = event.currentTarget;
    highlightedAyah.classList.add('highlight');
}

function toggleDarkMode() {
    darkMode = !darkMode;
    document.body.classList.toggle('dark-mode', darkMode);
}

function toggleQuranicText() {
    showQuranText = !showQuranText;
    renderPage();
}

function toggleTranslation() {
    showTranslation = !showTranslation;
    renderPage();
}

function changeSurah() {
    currentSurah = parseInt(document.getElementById('surahSelect').value);
    currentPage = 1;
    renderPage();
}

function changeAyatCount() {
    ayatPerPage = parseInt(document.getElementById('ayatCount').value);
    currentPage = 1;
    renderPage();
}

function changePage(direction) {
    const surahData = quranData.filter(ayah => ayah[1] == currentSurah + 1); // Get ayat for the current surah
    const totalAyat = surahData.length;
    const totalPages = Math.ceil(totalAyat / ayatPerPage);

    currentPage += direction;

    // Handle moving to the next surah
    if (currentPage > totalPages) {
        currentPage = 1;
        if (currentSurah < surahNames.length - 1) {
            currentSurah++; // Go to the next surah
        } else {
            currentSurah = 0; // Wrap around to the first surah
        }
    }

    // Handle moving to the previous surah
    if (currentPage < 1) {
        if (currentSurah > 0) {
            currentSurah--; // Go to the previous surah
            const previousSurahData = quranData.filter(ayah => ayah[1] == currentSurah + 1);
            const previousSurahTotalAyat = previousSurahData.length;
            currentPage = Math.ceil(previousSurahTotalAyat / ayatPerPage); // Go to the last page of the previous surah
        } else {
            currentSurah = surahNames.length - 1; // Wrap around to the last surah
            const lastSurahData = quranData.filter(ayah => ayah[1] == currentSurah + 1);
            currentPage = Math.ceil(lastSurahData.length / ayatPerPage); // Go to the last page of the last surah
        }
    }

    renderPage();
}

function updatePaginationInfo(totalAyat) {
    const totalPages = Math.ceil(totalAyat / ayatPerPage);
    document.getElementById('paginationInfo').textContent = `Page ${currentPage} of ${totalPages}`;
}

// book type
let fullTranslationMode = false; // A new flag for full translation mode

document.addEventListener('DOMContentLoaded', () => {
    loadFiles();
    setupControls();
    setupFullTranslationButton();
});

function setupFullTranslationButton() {
    const fullTranslationBtn = document.createElement('button');
    fullTranslationBtn.id = 'toggleFullTranslation';
    fullTranslationBtn.textContent = 'Full Translation';
    document.querySelector('header').appendChild(fullTranslationBtn);
    
    fullTranslationBtn.addEventListener('click', toggleFullTranslation);
}

function toggleFullTranslation() {
    fullTranslationMode = !fullTranslationMode;
    renderPage(); // Re-render the page with full translation mode
}
