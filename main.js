function startGame() {
    const loader = document.getElementById('loading-screen');

    // 1. Показываем загрузку
    loader.classList.remove('hidden');

    // 2. Через 1.5 секунды переключаем экран
    setTimeout(() => {
        // Прячем загрузку
        loader.classList.add('hidden');

        // Показываем счетчик и переходим в игру
        document.getElementById('heart-display').style.opacity = '1';
        showScreen('work-zone');

        // ПОЛНОЭКРАННЫЙ РЕЖИМ после загрузки
        setTimeout(enableFullscreen, 100);
    }, 1500);
}

// Функция полноэкранного режима
function enableFullscreen() {
    const elem = document.documentElement;

    // Все браузеры
    if (elem.requestFullscreen) {
        elem.requestFullscreen().catch(e => console.log('Fullscreen error:', e));
    } else if (elem.webkitRequestFullscreen) { // Safari
        elem.webkitRequestFullscreen();
    } else if (elem.msRequestFullscreen) { // IE/Edge
        elem.msRequestFullscreen();
    } else if (elem.mozRequestFullScreen) { // Firefox
        elem.mozRequestFullScreen();
    }

    // Для мобилок дополнительно
    if (/iPhone|iPad|iPod|Android/i.test(navigator.userAgent)) {
        document.body.style.overflow = 'hidden';
        document.documentElement.style.overflow = 'hidden';
        window.scrollTo(0, 1);
    }
}

function showScreen(screenId) {
    document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
    const target = document.getElementById(screenId);
    if(target) target.classList.add('active');
}
