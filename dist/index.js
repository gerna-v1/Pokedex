document.addEventListener('DOMContentLoaded', async () => {
    setRecentRegion("none");
    setupSidebarButtons();
    setLanguage();
    startPlayingMusic(getCurrentMusic(getRecentRegion()));
    if (document.querySelector('audio.exists')) {
        currentMusic = document.querySelector('audio.exists');
    }
    setupVolumeControls(currentMusic);

    setupLanguageSwitch();

    applyLanguageText();


});

var applyLanguageText = () => {
    let search = document.getElementById('searchbar');
    search.placeholder = getTranslatedText('search', getCurrentLanguage());

    let all = document.getElementById('allregions');
    all.innerText = getTranslatedText('all', getCurrentLanguage());

    let splash = document.getElementById('title');
    let splashSubtitle = document.getElementById('subtitle');

    splash.innerText = getTranslatedText('splash', getCurrentLanguage());
    splashSubtitle.innerText = getTranslatedText('splashSubtitle', getCurrentLanguage());

    let regionGens = document.querySelectorAll('.region-gen');
    regionGens.forEach((element) => {
        let generationText = element.innerText.split(':')[1].trim(); 
        element.innerText = `${getTranslatedText('generation', getCurrentLanguage())}: ${generationText}`;
    });
}

let lastVolume = 10;

const returnToHomepage = (dotAmount) => {
    let dots = '';
    for (let i = 0; i < dotAmount.length; i++) {
        dots += '.'
    }
    window.location.href = `${dots}/`;
}

var recentRegion = sessionStorage.getItem('recentRegion');