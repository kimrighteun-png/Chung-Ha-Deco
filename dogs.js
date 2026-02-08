// dogs.js - ТВОЙ КОД БЕЗ ИЗМЕНЕНИЙ, ТОЛЬКО ДОБАВЛЯЕМ НАЧИСЛЕНИЕ

let catchGameActive = false;
let gameLives = 3;
let boneInterval;

function initCatchGame(dogType) {
    // Выбор картинки собаки
    const dogImg = (dogType === 'aran') ? "dogs/aran.webp" : "dogs/bambi.webp";
    document.getElementById('catcher-dog').src = dogImg;

    // Переключение блоков
    document.getElementById('game-selection').classList.add('hidden');
    document.getElementById('game-play-layer').classList.remove('hidden');

    startCatchLogic();
}

function startCatchLogic() {
    catchGameActive = true;
    gameLives = 3;
    updateGameLives();

    const dog = document.getElementById('catcher-dog');

    // ДВИЖЕНИЕ
    const handleMove = (e) => {
        if (!catchGameActive) return;
        let x = e.touches ? e.touches[0].clientX : e.clientX;
        let left = x - dog.offsetWidth / 2;
        left = Math.max(0, Math.min(window.innerWidth - dog.offsetWidth, left));
        dog.style.left = left + "px";
    };

    window.addEventListener('mousemove', handleMove);
    window.addEventListener('touchmove', handleMove, { passive: false });

    // ПАДЕНИЕ КОСТЕЙ
    boneInterval = setInterval(spawnBone, 1200);
}

function spawnBone() {
  if (!catchGameActive) return;
  const layer = document.getElementById('game-play-layer');

  // Создаем не div, а img
  const bone = document.createElement('img');

  // УКАЖИ ПУТЬ К СВОЕЙ КАРТИНКЕ ЗДЕСЬ
  bone.src = "dogs/item.webp";

  bone.className = "falling-bone";
  bone.style.left = Math.random() * (window.innerWidth - 60) + "px"; // Чуть больше запас под ширину картинки
  bone.style.top = "-60px";

  layer.appendChild(bone);

    let pos = -50;
    const fall = setInterval(() => {
        if (!catchGameActive) { clearInterval(fall); bone.remove(); return; }

        pos += 6; // Скорость падения
        bone.style.top = pos + "px";

        const dog = document.getElementById('catcher-dog');
        const bRect = bone.getBoundingClientRect();
        const dRect = dog.getBoundingClientRect();

        // СТОЛКНОВЕНИЕ
        if (!(bRect.top > dRect.bottom || bRect.bottom < dRect.top || bRect.right < dRect.left || bRect.left > dRect.right)) {
            bone.remove();
            clearInterval(fall);
            console.log("Поймала!"); // Тут будет начисление валюты
        }

        // ПРОМАХ
        if (pos > window.innerHeight) {
            bone.remove();
            clearInterval(fall);
            gameLives--;
            updateGameLives();
            if (gameLives <= 0) stopCatchGame();
        }
    }, 20);
}

function updateGameLives() {
    document.getElementById('game-lives').innerText = "⚡".repeat(gameLives);
}

function stopCatchGame() {
    catchGameActive = false;
    clearInterval(boneInterval);
    alert("GAME OVER");
    exitCatchGame();
}

function exitCatchGame() {
    catchGameActive = false;
    clearInterval(boneInterval);
    document.getElementById('game-selection').classList.remove('hidden');
    document.getElementById('game-play-layer').classList.add('hidden');
    showScreen('dogs-room');
}





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
