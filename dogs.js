// dogs.js - ВСТАВЬ ЭТО В САМОЕ НАЧАЛО ФАЙЛА
console.log('🐶 DOGS.JS ЗАГРУЖЕН! ВЕРСИЯ: 1.0');

// ТВОЙ СУЩЕСТВУЮЩИЙ КОД...

// dogs.js - только таймеры и смена картинок
document.addEventListener('DOMContentLoaded', function() {
    // Вешаем обработчики на кнопки
    document.querySelectorAll('.feed-btn').forEach(button => {
        button.addEventListener('click', function() {
            const dogId = this.getAttribute('data-dog');
            feedDog(dogId);
        });
    });

    // Проверяем состояние собак
    updateDog('aranroom1');
    updateDog('bambiroom1');

    // Обновляем каждую минуту
    setInterval(() => {
        updateDog('aranroom1');
        updateDog('bambiroom1');
    }, 60000);
});

// Кормление собаки
function feedDog(dogId) {
    if (!canFeed(dogId)) return;

    // Сохраняем время кормления
    localStorage.setItem(dogId + '_fed', Date.now().toString());

    // Обновляем отображение
    updateDog(dogId);
}

// Проверка, можно ли кормить
function canFeed(dogId) {
    const lastFed = localStorage.getItem(dogId + '_fed');
    if (!lastFed) return true;

    const now = Date.now();
    const twoHours = 2 * 60 * 60 * 1000; // 2 часа
    return (now - parseInt(lastFed)) > twoHours;
}

// Сколько времени осталось ждать
function getTimeLeft(dogId) {
    const lastFed = localStorage.getItem(dogId + '_fed');
    if (!lastFed) return 0;

    const now = Date.now();
    const twoHours = 2 * 60 * 60 * 1000;
    const timeLeft = twoHours - (now - parseInt(lastFed));

    return Math.max(0, timeLeft);
}

// Форматирование времени
function formatTime(ms) {
    if (ms <= 0) return '0m';

    const hours = Math.floor(ms / (1000 * 60 * 60));
    const minutes = Math.floor((ms % (1000 * 60 * 60)) / (1000 * 60));

    if (hours > 0) return hours + 'h ' + minutes + 'm';
    return minutes + 'm';
}

// Обновление отображения собаки
function updateDog(dogId) {
    const canFeedNow = canFeed(dogId);
    const card = document.getElementById(dogId);

    if (!card) return;

    // Картинки
    const hungryImg = card.querySelector('.hungry-img');
    const fullImg = card.querySelector('.full-img');

    if (canFeedNow) {
        // Голодная
        hungryImg.style.display = 'block';
        fullImg.style.display = 'none';
    } else {
        // Сытая
        hungryImg.style.display = 'none';
        fullImg.style.display = 'block';
    }

    // Статус
    const statusEl = document.getElementById(dogId + '-status');
    if (statusEl) {
        statusEl.textContent = canFeedNow ? 'Hungry' : 'Full';
    }

    // Таймер
    const timerEl = document.getElementById(dogId + '-timer');
    if (timerEl) {
        timerEl.textContent = canFeedNow ? 'Can feed' : 'Wait: ' + formatTime(getTimeLeft(dogId));
    }

    // Кнопка
    const btn = card.querySelector('.feed-btn');
    if (btn) {
        btn.disabled = !canFeedNow;
        btn.textContent = canFeedNow ? 'Feed' : 'Fed';
    }
}
