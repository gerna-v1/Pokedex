document.addEventListener('DOMContentLoaded', async () => {
    setRecentRegion("none");
    startPlayingMusic(getCurrentMusic(getRecentRegion()));
    if (document.querySelector('audio.exists')) {
        currentMusic = document.querySelector('audio.exists');
    }
    setupVolumeControls(currentMusic);
    const langSwitch = document.querySelector(".lang-switch");

    langSwitch.addEventListener("click", () => {
        langSwitch.classList.toggle("active");

        if (langSwitch.classList.contains("active")) {
            langSwitch.title = "English";
        } else {
            langSwitch.title = "Spanish";
        }
    });

    langSwitch.addEventListener("click", () => {
        langSwitch.classList.toggle("active");

        if (langSwitch.classList.contains("active")) {
            changeLanguage('english');
        } else {
            changeLanguage('spanish');
        }
    });

});

let lastVolume = 10;

const returnToHomepage = (dotAmount) => {
    let dots = '';
    for (let i = 0; i < dotAmount.length; i++) {
        dots += '.'
    }
    window.location.href = `${dots}/`;
}

var recentRegion = sessionStorage.getItem('recentRegion');