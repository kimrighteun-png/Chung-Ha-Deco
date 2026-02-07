// dogs.js - ТВОЙ КОД БЕЗ ИЗМЕНЕНИЙ, ТОЛЬКО ДОБАВЛЯЕМ НАЧИСЛЕНИЕ


// ТВОЙ СУЩЕСТВУЮЩИЙ КОД...

// dogs.js - только таймеры и смена картинок
document.addEventListener('DOMContentLoaded', function() {

    // Вешаем обработчики на кнопки
    document.querySelectorAll('.feed-btn').forEach(button => {
        button.addEventListener('click', function() {
            const dogId = this.getAttribute('data-dog');
            console.log('Клик по кнопке кормления:', dogId);
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

// Кормление собаки - ДОБАВЛЯЕМ ТОЛЬКО НАЧИСЛЕНИЕ ВАЛЮТЫ
function feedDog(dogId) {
    console.log('Вызов feedDog для:', dogId);

    if (!canFeed(dogId)) {
        console.log('Собака еще не голодна');
        return;
    }

    // НАЧИСЛЯЕМ ВАЛЮТУ - ТОЛЬКО ЭТО ДОБАВЛЯЕМ
    if (typeof window.addHearts === 'function') {
        window.addHearts(5);
    }

    // Сохраняем время кормления (ТВОЙ КОД)
    localStorage.setItem(dogId + '_fed', Date.now().toString());

    // Обновляем отображение (ТВОЙ КОД)
    updateDog(dogId);
}

// Проверка, можно ли кормить (ТВОЙ КОД БЕЗ ИЗМЕНЕНИЙ)
function canFeed(dogId) {
    const lastFed = localStorage.getItem(dogId + '_fed');
    if (!lastFed) return true;

    const now = Date.now();
    const twoHours = 2 * 60 * 60 * 1000; // 2 часа
    return (now - parseInt(lastFed)) > twoHours;
}

// Сколько времени осталось ждать (ТВОЙ КОД БЕЗ ИЗМЕНЕНИЙ)
function getTimeLeft(dogId) {
    const lastFed = localStorage.getItem(dogId + '_fed');
    if (!lastFed) return 0;

    const now = Date.now();
    const twoHours = 2 * 60 * 60 * 1000;
    const timeLeft = twoHours - (now - parseInt(lastFed));

    return Math.max(0, timeLeft);
}

// Форматирование времени (ТВОЙ КОД БЕЗ ИЗМЕНЕНИЙ)
function formatTime(ms) {
    if (ms <= 0) return '0m';

    const hours = Math.floor(ms / (1000 * 60 * 60));
    const minutes = Math.floor((ms % (1000 * 60 * 60)) / (1000 * 60));

    if (hours > 0) return hours + 'h ' + minutes + 'm';
    return minutes + 'm';
}

// Обновление отображения собаки (ТВОЙ КОД БЕЗ ИЗМЕНЕНИЙ)
function updateDog(dogId) {


    const canFeedNow = canFeed(dogId);
    const card = document.getElementById(dogId);

    if (!card) {
        return;
    }

    // Картинки
    const hungryImg = card.querySelector('.hungry-img');
    const fullImg = card.querySelector('.full-img');


    if (canFeedNow) {
        // Голодная
        if (hungryImg) hungryImg.style.display = 'block';
        if (fullImg) fullImg.style.display = 'none';
    } else {
        // Сытая
        if (hungryImg) hungryImg.style.display = 'none';
        if (fullImg) fullImg.style.display = 'block';
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
