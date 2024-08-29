document.addEventListener('DOMContentLoaded', async () => {
    setLanguage();
});

const returnToHomepage = (dotAmount) => {
    let dots = '';
    for (let i = 0; i < dotAmount.length; i++) {
        dots += '.'
    }
    window.location.href = `${dots}/`;
}

var recentRegion = localStorage.getItem('recentRegion');