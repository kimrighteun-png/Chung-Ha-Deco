// --- 1. ПЕРЕМЕННЫЕ (ПРОВЕРЬ, ЧТОБЫ НАЗВАНИЯ ПАПОК СОВПАДАЛИ) ---
var activeWrapper = null;
var musicPath = "Music/original/";
var pocaPath = "POCAs/";
var tracks = ["algorithm.ogg", "beat of my heart.ogg", "i'm ready.ogg", "snapping.ogg", "sparkling.ogg"];
var pocas = ["1.webp", "2.webp", "3.webp", "4.webp", "5.webp", "6.webp", "7.webp", "8.webp", "9.webp"];

var stickerData = {
    pink: ["ps1.webp", "ps2.webp", "ps3.webp"],
    blue: ["lbs1.webp", "lbs2.webp", "lbs3.webp"],
    black: ["bs1.webp", "bs2.webp", "bs3.webp"]
};

var currentAudio = null; // ИСПРАВЛЕНО: был new Audio(), теперь null
var currentTrackName = "";
var musicType = 'original'; // ИСПРАВЛЕНО: добавлена переменная типа
var currentTime = 0; // ИСПРАВЛЕНО: для сохранения позиции

// --- 2. НАСТРОЙКИ (ВСЕГДА РАБОТАЮТ) ---
function toggleSettings() {
    var modal = document.getElementById('settings-modal'); // ИСПРАВЛЕНО: settings-modal
    if (modal) {
        modal.style.display = (modal.style.display === 'none' || modal.style.display === '') ? 'block' : 'none';
    }
}

// --- 3. МУЗЫКА И ЭКРАНЫ ---
function showScreen(num) {
    document.getElementById("screen-1").style.display = "none";
    document.getElementById("screen-2").style.display = "none";
    document.getElementById("screen-3").style.display = "none";
    document.getElementById("screen-" + num).style.display = "block";

    if (num === 2 && !currentAudio) playMusic();
}

function playMusic() {
    // Останавливаем предыдущую музыку если есть
    if (currentAudio) {
        currentAudio.pause();
    }

    // Выбираем случайный трек
    var name = tracks[Math.floor(Math.random() * tracks.length)];
    currentTrackName = name;

    // Создаем новый аудио элемент
    currentAudio = new Audio(musicPath + name);
    currentAudio.loop = false; // ИСПРАВЛЕНО: не зацикливаем

    // Когда трек заканчивается - играем следующий
    currentAudio.addEventListener('ended', function() {
        setTimeout(playMusic, 100); // небольшой интервал
    });

    // Пытаемся играть
    currentAudio.play().catch(function() {
        console.log("Кликни для звука");
        // Ждем клика
        var clickHandler = function() {
            currentAudio.play();
            document.removeEventListener('click', clickHandler);
        };
        document.addEventListener('click', clickHandler);
    });
}

// ИСПРАВЛЕННАЯ ФУНКЦИЯ ПЕРЕКЛЮЧЕНИЯ МУЗЫКИ
function changeMusicType() {
    if (!currentAudio || !currentTrackName) return;

    // Сохраняем текущее состояние
    var wasPlaying = !currentAudio.paused;
    currentTime = currentAudio.currentTime; // сохраняем секунду

    // Меняем тип
    musicType = musicType === 'original' ? 'instrumental' : 'original';
    musicPath = "Music/" + musicType + "/";

    // Обновляем кнопку
    var button = document.getElementById('music-toggle');
    if (button) {
        button.textContent = musicType === 'original' ? 'Оригинал' : 'Инструментал';
    }

    // Останавливаем текущий
    currentAudio.pause();

    // Создаем новый с тем же треком
    currentAudio = new Audio(musicPath + currentTrackName);
    currentAudio.currentTime = currentTime; // ВОССТАНАВЛИВАЕМ СЕКУНДУ
    currentAudio.loop = false;

    // Когда заканчивается - следующий трек
    currentAudio.addEventListener('ended', function() {
        setTimeout(playMusic, 100);
    });

    // Если играл - продолжаем
    if (wasPlaying) {
        currentAudio.play().catch(function(e) {
            console.log("Ошибка воспроизведения после переключения");
        });
    }
}

function backToCards() {
    showScreen(2);
    var container = document.getElementById('final-card-container');
    if (container) container.innerHTML = "";
    activeWrapper = null;
}

// --- 4. ЗАГРУЗКА ДАННЫХ ---
window.onload = function() {
    var selector = document.getElementById('card-selector');
    if (!selector) return;

    // Очищаем селектор
    selector.innerHTML = "";

    pocas.forEach(function(name) {
        var img = document.createElement('img');
        img.src = pocaPath + name;
        img.style.width = "100px";
        img.style.margin = "10px";
        img.style.cursor = "pointer";
        img.style.borderRadius = "10px";
        img.onclick = function() { selectCard(name); };
        selector.appendChild(img);
    });
};

function selectCard(pocaName) {
    var container = document.getElementById('final-card-container');
    if (!container) return;

    // Очищаем контейнер
    container.innerHTML = "";

    // Устанавливаем размер контейнера
    container.style.width = "300px";
    container.style.height = "400px";

    var finalImg = document.createElement('img');
    finalImg.src = pocaPath + pocaName;
    finalImg.style.width = "100%";
    finalImg.style.height = "100%";
    finalImg.style.objectFit = "cover";
    finalImg.style.borderRadius = "15px";
    container.appendChild(finalImg);

    showScreen(3);

    // ЗАГРУЖАЕМ СТИКЕРЫ ПО УМОЛЧАНИЮ
    setTimeout(function() {
        loadStickers('pink');
    }, 100);
}

// --- 5. ВОТ ТУТ БЫЛА ОШИБКА (ИСПРАВЛЕНО) ---
function loadStickers(color) {
    console.log("Загружаем стикеры цвета: " + color);

    var list = document.getElementById('sticker-list');
    if (!list) {
        console.error("Элемент sticker-list не найден!");
        return;
    }

    list.innerHTML = ""; // Очищаем список перед загрузкой

    // Важно: если папка называется "light blue", убедись, что путь совпадает
    var folder = (color === 'blue') ? 'light blue' : color;

    var files = stickerData[color];
    if (!files || files.length === 0) {
        console.error("Нет файлов для цвета: " + color);
        list.innerHTML = "<p style='color:#666;'>Стикеры не найдены</p>";
        return;
    }

    console.log("Папка: " + folder + ", файлы: " + files);

    files.forEach(function(fileName) {
        var sImg = document.createElement('img');
        sImg.src = "stickers/" + folder + "/" + fileName;
        sImg.alt = fileName;
        sImg.style.width = "70px";
        sImg.style.height = "70px";
        sImg.style.margin = "5px";
        sImg.style.cursor = "pointer";
        sImg.style.borderRadius = "5px";
        sImg.style.objectFit = "contain";
        sImg.style.backgroundColor = "white";
        sImg.style.padding = "5px";

        // Проверяем загрузку изображения
        sImg.onerror = function() {
            console.error("Не удалось загрузить стикер: " + this.src);
            this.style.border = "2px dashed red";
            this.style.opacity = "0.5";
        };

        sImg.onload = function() {
            console.log("Стикер загружен: " + fileName);
        };

        sImg.onclick = function() {
            console.log("Добавляем стикер: " + fileName);
            addStickerToCard(this.src);
        };

        list.appendChild(sImg);
    });

    console.log("Загружено стикеров: " + files.length);
}

// --- 6. ДОБАВЛЕНИЕ СТИКЕРА (РАМКА И ДВИЖЕНИЕ) ---
// --- 6. ДОБАВЛЕНИЕ СТИКЕРА (РАМКА И ДВИЖЕНИЕ) ---
function addStickerToCard(src) {
    var container = document.getElementById('final-card-container');
    if (!container) return;

    var wrapper = document.createElement('div');
    wrapper.className = 'sticker-wrapper';
    wrapper.style.position = "absolute";
    wrapper.style.left = "50px";
    wrapper.style.top = "50px";
    wrapper.style.width = "80px";
    wrapper.style.height = "80px";

    var img = document.createElement('img');
    img.src = src;
    img.style.width = "100%";
    img.style.height = "100%";
    img.style.objectFit = "contain";
    img.style.pointerEvents = "none";

    // Ресайзер для изменения размера
    var resizerSE = document.createElement('div');
    resizerSE.className = 'resizer se';

    // Ресайзер для вращения (верхний правый)
    var resizerTR = document.createElement('div');
    resizerTR.className = 'resizer tr';
    resizerTR.innerHTML = "↻";
    resizerTR.style.fontSize = "10px";
    resizerTR.style.display = "flex";
    resizerTR.style.alignItems = "center";
    resizerTR.style.justifyContent = "center";
    resizerTR.style.color = "#555";

    wrapper.appendChild(img);
    wrapper.appendChild(resizerSE);
    wrapper.appendChild(resizerTR);
    container.appendChild(wrapper);

    // Активируем новый стикер
    activateSticker(wrapper);

    // События для ресайзера SE (изменение размера с сохранением пропорций)
    resizerSE.onmousedown = function(e) {
        e.stopPropagation();
        e.preventDefault();

        var startX = e.clientX;
        var startY = e.clientY;
        var startWidth = wrapper.offsetWidth;
        var startHeight = wrapper.offsetHeight;
        var aspectRatio = startWidth / startHeight;

        function onMouseMove(e) {
            var dx = e.clientX - startX;
            var dy = e.clientY - startY;

            // Изменяем размер с сохранением пропорций
            var newWidth = Math.max(30, startWidth + dx);
            var newHeight = newWidth / aspectRatio;

            wrapper.style.width = newWidth + "px";
            wrapper.style.height = newHeight + "px";
        }

        function onMouseUp() {
            window.removeEventListener('mousemove', onMouseMove);
            window.removeEventListener('mouseup', onMouseUp);
        }

        window.addEventListener('mousemove', onMouseMove);
        window.addEventListener('mouseup', onMouseUp);
    };

    // События для ресайзера TR (вращение)
    resizerTR.onmousedown = function(e) {
        e.stopPropagation();
        e.preventDefault();

        var startX = e.clientX;
        var startY = e.clientY;
        var rect = wrapper.getBoundingClientRect();
        var centerX = rect.left + rect.width / 2;
        var centerY = rect.top + rect.height / 2;

        // Получаем начальный угол
        var startAngle = Math.atan2(startY - centerY, startX - centerX);
        var currentRotation = getCurrentRotation(wrapper);

        function onMouseMove(e) {
            var currentX = e.clientX;
            var currentY = e.clientY;
            var currentAngle = Math.atan2(currentY - centerY, currentX - centerX);
            var angleDiff = currentAngle - startAngle;

            // Конвертируем радианы в градусы и добавляем к текущему вращению
            var newRotation = currentRotation + angleDiff * (180 / Math.PI);

            // Применяем вращение
            wrapper.style.transform = 'rotate(' + newRotation + 'deg)';
        }

        function onMouseUp() {
            window.removeEventListener('mousemove', onMouseMove);
            window.removeEventListener('mouseup', onMouseUp);
        }

        window.addEventListener('mousemove', onMouseMove);
        window.addEventListener('mouseup', onMouseUp);
    };

    // Делаем стикер перетаскиваемым
    makeDraggable(wrapper);
}

// Функция для получения текущего угла вращения
function getCurrentRotation(element) {
    var style = window.getComputedStyle(element);
    var matrix = style.transform;

    if (matrix === 'none') return 0;

    var values = matrix.split('(')[1].split(')')[0].split(',');
    var a = values[0];
    var b = values[1];

    return Math.round(Math.atan2(b, a) * (180 / Math.PI));
}

// Функция активации стикера
function activateSticker(wrapper) {
    // Убираем активность с предыдущего стикера
    if (activeWrapper && activeWrapper !== wrapper) {
        activeWrapper.classList.remove('active');
        activeWrapper.style.border = "2px dashed transparent";
        var oldResizers = activeWrapper.querySelectorAll('.resizer');
        oldResizers.forEach(function(resizer) {
            resizer.style.display = 'none';
        });
    }

    // Активируем новый стикер
    activeWrapper = wrapper;
    wrapper.classList.add('active');
    wrapper.style.border = "2px dashed #ff9a9e";

    // Показываем ресайзеры
    var resizers = wrapper.querySelectorAll('.resizer');
    resizers.forEach(function(resizer) {
        resizer.style.display = 'block';
    });
}

// Делаем стикер перетаскиваемым
function makeDraggable(el) {
    el.onmousedown = function(e) {
        // Не активируем при клике на ресайзер
        if (e.target.classList.contains('resizer')) return;

        // Активируем стикер
        activateSticker(el);

        var startX = e.clientX;
        var startY = e.clientY;
        var startLeft = el.offsetLeft;
        var startTop = el.offsetTop;

        function onMouseMove(e) {
            var dx = e.clientX - startX;
            var dy = e.clientY - startY;

            el.style.left = (startLeft + dx) + "px";
            el.style.top = (startTop + dy) + "px";
        }

        function onMouseUp() {
            window.removeEventListener('mousemove', onMouseMove);
            window.removeEventListener('mouseup', onMouseUp);
        }

        window.addEventListener('mousemove', onMouseMove);
        window.addEventListener('mouseup', onMouseUp);

        e.preventDefault();
    };
}

// --- 7. КЛИК ВНЕ СТИКЕРА (убираем рамку) ---
document.addEventListener('click', function(e) {
    var stickerWrappers = document.querySelectorAll('.sticker-wrapper');
    var clickedOnSticker = false;

    // Проверяем, кликнули ли на стикер или его ресайзер
    stickerWrappers.forEach(function(wrapper) {
        if (wrapper.contains(e.target)) {
            clickedOnSticker = true;
        }
    });

    // Если кликнули не на стикер - убираем все рамки
    if (!clickedOnSticker && activeWrapper) {
        activeWrapper.classList.remove('active');
        activeWrapper.style.border = "2px dashed transparent";

        var resizers = activeWrapper.querySelectorAll('.resizer');
        resizers.forEach(function(resizer) {
            resizer.style.display = 'none';
        });

        activeWrapper = null;
    }
});

// Также добавляем обработчик для контейнера карточки
var finalCardContainer = document.getElementById('final-card-container');
if (finalCardContainer) {
    finalCardContainer.addEventListener('click', function(e) {
        // Если кликнули на саму карточку (не на стикер)
        if (e.target === this && activeWrapper) {
            activeWrapper.classList.remove('active');
            activeWrapper.style.border = "2px dashed transparent";

            var resizers = activeWrapper.querySelectorAll('.resizer');
            resizers.forEach(function(resizer) {
                resizer.style.display = 'none';
            });

            activeWrapper = null;
        }
    });
}







// ==================== TOUCH ПОДДЕРЖКА ДЛЯ ТЕЛЕФОНОВ ====================

// Проверяем, мобильное ли устройство
function isTouchDevice() {
    return ('ontouchstart' in window) || (navigator.maxTouchPoints > 0);
}

// Если устройство touch, заменяем мышиные события на touch
if (isTouchDevice()) {
    console.log("Touch устройство обнаружено, включаем touch-режим");

    // Увеличиваем ресайзеры для пальцев
    document.addEventListener('DOMContentLoaded', function() {
        var style = document.createElement('style');
        style.textContent = `
            .resizer {
                width: 30px !important;
                height: 30px !important;
            }
            .resizer.se {
                right: -15px !important;
                bottom: -15px !important;
            }
            .resizer.tr {
                right: -15px !important;
                top: -15px !important;
            }
        `;
        document.head.appendChild(style);
    });

    // Перехватываем создание стикеров и добавляем touch события
    var originalAddStickerToCard = window.addStickerToCard;

    window.addStickerToCard = function(src) {
        // Вызываем оригинальную функцию
        originalAddStickerToCard(src);

        // Находим последний созданный стикер
        var wrappers = document.querySelectorAll('.sticker-wrapper');
        var wrapper = wrappers[wrappers.length - 1];

        if (!wrapper) return;

        // Touch для перемещения
        wrapper.addEventListener('touchstart', function(e) {
            e.preventDefault();

            // Активируем стикер
            if (typeof activateSticker === 'function') {
                activateSticker(wrapper);
            }

            var touch = e.touches[0];
            var startX = touch.clientX;
            var startY = touch.clientY;
            var startLeft = wrapper.offsetLeft;
            var startTop = wrapper.offsetTop;

            function onTouchMove(e) {
                var touch = e.touches[0];
                var dx = touch.clientX - startX;
                var dy = touch.clientY - startY;

                wrapper.style.left = (startLeft + dx) + "px";
                wrapper.style.top = (startTop + dy) + "px";
            }

            function onTouchEnd() {
                document.removeEventListener('touchmove', onTouchMove);
                document.removeEventListener('touchend', onTouchEnd);
            }

            document.addEventListener('touchmove', onTouchMove);
            document.addEventListener('touchend', onTouchEnd);
        }, { passive: false });

        // Touch для ресайзера SE (размер)
        var resizerSE = wrapper.querySelector('.resizer.se');
        if (resizerSE) {
            resizerSE.addEventListener('touchstart', function(e) {
                e.preventDefault();
                e.stopPropagation();

                var touch = e.touches[0];
                var startX = touch.clientX;
                var startY = touch.clientY;
                var startWidth = wrapper.offsetWidth;
                var startHeight = wrapper.offsetHeight;

                function onTouchMove(e) {
                    var touch = e.touches[0];
                    var dx = touch.clientX - startX;
                    var dy = touch.clientY - startY;

                    var newWidth = Math.max(40, startWidth + dx);
                    var newHeight = Math.max(40, startHeight + dy);

                    wrapper.style.width = newWidth + "px";
                    wrapper.style.height = newHeight + "px";
                }

                function onTouchEnd() {
                    document.removeEventListener('touchmove', onTouchMove);
                    document.removeEventListener('touchend', onTouchEnd);
                }

                document.addEventListener('touchmove', onTouchMove);
                document.addEventListener('touchend', onTouchEnd);
            }, { passive: false });
        }

        // Touch для ресайзера TR (вращение)
        var resizerTR = wrapper.querySelector('.resizer.tr');
        if (resizerTR) {
            resizerTR.addEventListener('touchstart', function(e) {
                e.preventDefault();
                e.stopPropagation();

                var touch = e.touches[0];
                var startX = touch.clientX;

                // Получаем текущий угол вращения
                var style = window.getComputedStyle(wrapper);
                var matrix = style.transform;
                var currentRotation = 0;

                if (matrix !== 'none') {
                    var values = matrix.split('(')[1].split(')')[0].split(',');
                    var a = values[0];
                    var b = values[1];
                    currentRotation = Math.round(Math.atan2(b, a) * (180 / Math.PI));
                }

                function onTouchMove(e) {
                    var touch = e.touches[0];
                    var dx = touch.clientX - startX;
                    var rotation = currentRotation + dx * 0.5;

                    wrapper.style.transform = 'rotate(' + rotation + 'deg)';
                }

                function onTouchEnd() {
                    document.removeEventListener('touchmove', onTouchMove);
                    document.removeEventListener('touchend', onTouchEnd);
                }

                document.addEventListener('touchmove', onTouchMove);
                document.addEventListener('touchend', onTouchEnd);
            }, { passive: false });
        }
    };
}
