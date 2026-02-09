function startGame() {
const loader = document.getElementById('loading-screen');

// 1. Показываем загрузку
loader.classList.remove('hidden');

// 2. Через 3 секунды переключаем экран
setTimeout(() => {
    // Прячем загрузку
    loader.classList.add('hidden');

    // Показываем счетчик и переходим в игру
    document.getElementById('heart-display').style.opacity = '1';
    showScreen('work-zone');
}, 1500);
}

function showScreen(screenId) {
    document.querySelectorAll('.screen').forEach(s => {
        s.classList.remove('active'); // Твоя старая логика
        s.classList.add('hidden');    // Добавляем скрытие для биндера
    });

    const target = document.getElementById(screenId);
    if (target) {
        target.classList.add('active');
        target.classList.remove('hidden'); // Убираем скрытие у нового экрана
    }
}



function resetAllProgress() {
    if (confirm("Are you sure you want to reset your progress?")) {
        localStorage.clear();
        window.location.reload();
    }
}



// === ПРОСТОЙ LAZY LOAD ДЛЯ ТВОЕЙ БИБЛИОТЕКИ ===

// 1. Находим ВСЕ аудио элементы на странице
const allAudios = document.querySelectorAll('audio');

// 2. Для каждого аудио отключаем предзагрузку
allAudios.forEach(audio => {
    audio.setAttribute('preload', 'none'); // Важно!
});

// 3. Загружаем аудио только когда начинается воспроизведение
allAudios.forEach(audio => {
    audio.addEventListener('play', function() {
        if (!this.dataset.loaded) {
            console.log('Загружаю аудио:', this.src);
            this.dataset.loaded = 'true';
        }
    });

    // Опционально: предзагрузка при наведении
    audio.addEventListener('mouseenter', function() {
        if (!this.dataset.loaded && !this.dataset.hovered) {
            this.load(); // Предзагружаем
            this.dataset.hovered = 'true';
        }
    });
});
