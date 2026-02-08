// decoration.js
const stickerData = {
    pink: ["ps1.webp", "ps2.webp", "ps3.webp"],
    blue: ["lbs1.webp", "lbs2.webp", "lbs3.webp"],
    black: ["bs1.webp", "bs2.webp", "bs3.webp"]
};







var activeWrapper = null;

// Функция выбора цвета (вызывается из кнопок)
function selectColor(colorName) {
    // Переводим входящее "Pink" в "pink", чтобы совпало с твоей базой
    const searchKey = colorName.toLowerCase();

    console.log("Ищем в базе ключ:", searchKey);

    const list = document.getElementById('sticker-list');
    list.innerHTML = "";

    // Теперь ищем по маленькой букве
    const files = stickerData[searchKey];

    if (!files) {
        console.error("В базе всё еще нет ключа:", searchKey);
        console.log("Доступные ключи:", Object.keys(stickerData));
        return;
    }

    files.forEach(fileName => {
        const sImg = document.createElement('img');
        // Путь: stickers/pink/имя.webp
        sImg.src = "stickers/" + searchKey + "/" + fileName;
        sImg.className = 'sticker-preview-icon';

        sImg.onclick = function() {
            addStickerToCard(this.src);
        };

        list.appendChild(sImg);
    });
}


// decoration.js

function openDecorationMode(card) {
    console.log("Открываем декоратор для карты:", card.id);

    const decScreen = document.getElementById('decoration-screen');
    const preview = document.getElementById('selected-card-preview');

    if (!decScreen || !preview) {
        console.error("Экран декоратора или превью не найдены!");
        return;
    }

    // Очищаем экран от старых стикеров и вставляем новую карту
    preview.innerHTML = `<img src="${card.image}" class="main-decor-img" draggable="false">`;

    // Показываем экран (используем твою общую функцию переключения)
    if (typeof showScreen === 'function') {
        showScreen('decoration-screen');
    } else {
        // Если showScreen нет, просто переключаем классы
        document.querySelectorAll('.screen').forEach(s => s.classList.add('hidden'));
        decScreen.classList.remove('hidden');
    }
}



// Функция деактивации (убираем рамки, когда кликаем в пустоту)
function deselectAllStickers() {
    if (activeWrapper) {
        activeWrapper.classList.remove('active');
        // Скрываем все ресайзеры и кнопки удаления внутри него
        const controls = activeWrapper.querySelectorAll('.resizer, .sticker-delete');
        controls.forEach(c => c.style.display = 'none');
        activeWrapper = null;
    }
}

// Добавляем глобальный клик для снятия выделения
// Замени свой старый блок "клик вне стикера" на этот:
// Работает и для мыши, и для тача
function globalDeselect(e) {
    if (!e.target.closest('.sticker-wrapper') && !e.target.closest('.text-color-btn') && !e.target.closest('.sticker-preview-icon')) {
        deselectAllStickers();
    }
}
document.addEventListener('mousedown', globalDeselect);
document.addEventListener('touchstart', globalDeselect, { passive: true });



// Для тач-устройств то же самое
document.addEventListener('touchstart', function(e) {
    if (!e.target.closest('.sticker-wrapper') && !e.target.closest('.text-color-btn') && !e.target.closest('.sticker-preview-icon')) {
        deselectAllStickers();
    }
}, { passive: true });


// 1. Создание стикера с кнопкой удаления
function addStickerToCard(src) {
    // ЗАМЕНА: используем новый ID из HTML
    var container = document.getElementById('selected-card-preview');
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

    // --- НОВОЕ: Кнопка удаления ---
    var deleteBtn = document.createElement('div');
    deleteBtn.className = 'sticker-delete';
    deleteBtn.innerHTML = "×";
    deleteBtn.style.cssText = "position:absolute; top:-10px; left:-10px; width:25px; height:25px; background:red; color:white; border-radius:50%; display:none; align-items:center; justify-content:center; cursor:pointer; z-index:10; font-weight:bold;";
    deleteBtn.onclick = function(e) {
        e.stopPropagation();
        wrapper.remove();
        activeWrapper = null;
    };

    var resizerSE = document.createElement('div');
  resizerSE.className = 'resizer se'; // Классы подхватят стили из CSS

  var resizerTR = document.createElement('div');
  resizerTR.className = 'resizer tr';
  resizerTR.innerHTML = "↻";


    wrapper.appendChild(img);
    wrapper.appendChild(deleteBtn); // Добавили в обертку
    wrapper.appendChild(resizerSE);
    wrapper.appendChild(resizerTR);
    container.appendChild(wrapper);

    // ... в конце функции addStickerToCard ...
activateSticker(wrapper);
makeDraggable(wrapper);
setupResizers(wrapper); // <--- ДОБАВЬ ЭТУ СТРОЧКУ
setupTouchControls(wrapper)
}

function setupTouchControls(wrapper) {
    var resizerSE = wrapper.querySelector('.resizer.se');
    var resizerTR = wrapper.querySelector('.resizer.tr');

    // ПЕРЕМЕЩЕНИЕ ПАЛЬЦЕМ
    wrapper.addEventListener('touchstart', function(e) {
        if (e.target.classList.contains('resizer') || e.target.classList.contains('sticker-delete')) return;
        e.preventDefault(); // Чтобы страница не дергалась
        activateSticker(wrapper);

        var t = e.touches[0];
        var sX = t.clientX, sY = t.clientY, sL = wrapper.offsetLeft, sT = wrapper.offsetTop;

        function move(ev) {
            var mt = ev.touches[0];
            wrapper.style.left = (sL + (mt.clientX - sX)) + "px";
            wrapper.style.top = (sT + (mt.clientY - sY)) + "px";
        }
        document.addEventListener('touchmove', move, { passive: false });
        document.addEventListener('touchend', function() { document.removeEventListener('touchmove', move); }, { once: true });
    }, { passive: false });

    // РЕСАЙЗ ПАЛЬЦЕМ
    resizerSE.addEventListener('touchstart', function(e) {
        e.stopPropagation(); e.preventDefault();
        var t = e.touches[0];
        var sX = t.clientX, sW = wrapper.offsetWidth;
        var aspect = wrapper.offsetWidth / wrapper.offsetHeight;

        function res(ev) {
            var mt = ev.touches[0];
            var newW = Math.max(30, sW + (mt.clientX - sX));
            wrapper.style.width = newW + "px";
            wrapper.style.height = (newW / aspect) + "px";
        }
        document.addEventListener('touchmove', res, { passive: false });
        document.addEventListener('touchend', function() { document.removeEventListener('touchmove', res); }, { once: true });
    }, { passive: false });

    // ПОВОРОТ ПАЛЬЦЕМ
    resizerTR.addEventListener('touchstart', function(e) {
        e.stopPropagation(); e.preventDefault();
        var t = e.touches[0];
        var sX = t.clientX, sRot = getCurrentRotation(wrapper);

        function rot(ev) {
            var mt = ev.touches[0];
            wrapper.style.transform = "rotate(" + (sRot + (mt.clientX - sX)) + "deg)";
        }
        document.addEventListener('touchmove', rot, { passive: false });
        document.addEventListener('touchend', function() { document.removeEventListener('touchmove', rot); }, { once: true });
    }, { passive: false });
}


// 2. Активация (визуальная рамка)
function activateSticker(wrapper) {
    if (activeWrapper && activeWrapper !== wrapper) {
        activeWrapper.classList.remove('active');
        activeWrapper.style.border = "2px dashed transparent";
        // Скрываем всё лишнее у старого
        activeWrapper.querySelectorAll('.resizer, .sticker-delete').forEach(el => el.style.display = 'none');
    }

    activeWrapper = wrapper;
    wrapper.classList.add('active');
    wrapper.style.border = "2px dashed #ff9a9e";

    // Показываем ресайзеры и КРЕСТИК
    wrapper.querySelectorAll('.resizer, .sticker-delete').forEach(el => el.style.display = 'flex');
}

var previewArea = document.getElementById('selected-card-preview');
if (previewArea) {
    previewArea.addEventListener('click', function(e) {
        if (e.target === this && activeWrapper) {
            activeWrapper.classList.remove('active');
            activeWrapper.style.border = "2px dashed transparent";
            activeWrapper.querySelectorAll('.resizer, .sticker-delete').forEach(el => el.style.display = 'none');
            activeWrapper = null;
        }
    });
}

function makeDraggable(el) {
    el.onmousedown = function(e) {
        if (e.target.classList.contains('resizer') || e.target.classList.contains('sticker-delete')) return;

        activateSticker(el);

        var startX = e.clientX;
        var startY = e.clientY;
        var startLeft = el.offsetLeft;
        var startTop = el.offsetTop;

        function onMouseMove(e) {
            el.style.left = (startLeft + (e.clientX - startX)) + "px";
            el.style.top = (startTop + (e.clientY - startY)) + "px";
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

// Функция для получения текущего угла (нужна для вращения)
function getCurrentRotation(el) {
    var st = window.getComputedStyle(el, null);
    var tr = st.getPropertyValue("transform");

    if (tr === 'none' || !tr) return 0;

    // Матрица выглядит как matrix(a, b, c, d, e, f)
    var values = tr.split('(')[1].split(')')[0].split(',');
    var a = parseFloat(values[0]);
    var b = parseFloat(values[1]);

    // atan2(b, a) возвращает угол в радианах, переводим в градусы
    var angle = Math.round(Math.atan2(b, a) * (180 / Math.PI));
    return angle;
}



// ЛОГИКА РЕСАЙЗА И ПОВОРОТА (МЫШЬ)
function setupResizers(wrapper) {
    var resizerSE = wrapper.querySelector('.resizer.se');
    var resizerTR = wrapper.querySelector('.resizer.tr');

    // Изменение размера (SE)
    resizerSE.onmousedown = function(e) {
        e.stopPropagation(); e.preventDefault();
        var startX = e.clientX, startWidth = wrapper.offsetWidth;
        var aspect = wrapper.offsetWidth / wrapper.offsetHeight;

        function onMouseMove(e) {
            var newWidth = Math.max(30, startWidth + (e.clientX - startX));
            wrapper.style.width = newWidth + "px";
            wrapper.style.height = (newWidth / aspect) + "px";
        }
        function onMouseUp() {
            window.removeEventListener('mousemove', onMouseMove);
            window.removeEventListener('mouseup', onMouseUp);
        }
        window.addEventListener('mousemove', onMouseMove);
        window.addEventListener('mouseup', onMouseUp);
    };

    // Вращение (TR)
    resizerTR.onmousedown = function(e) {
        e.stopPropagation(); e.preventDefault();
        var startX = e.clientX, startRot = getCurrentRotation(wrapper);
        function onMouseMove(e) {
            var delta = e.clientX - startX;
            wrapper.style.transform = "rotate(" + (startRot + delta) + "deg)";
        }
        function onMouseUp() {
            window.removeEventListener('mousemove', onMouseMove);
            window.removeEventListener('mouseup', onMouseUp);
        }
        window.addEventListener('mousemove', onMouseMove);
        window.addEventListener('mouseup', onMouseUp);
    };
}



// 4. Твоя логика Touch (вынес в отдельную функцию для чистоты)
function setupTouchControls(wrapper) {
    var resizerSE = wrapper.querySelector('.resizer.se');
    var resizerTR = wrapper.querySelector('.resizer.tr');

    // 1. ПЕРЕМЕЩЕНИЕ
    wrapper.addEventListener('touchstart', function(e) {
        if (e.target.classList.contains('resizer') || e.target.classList.contains('sticker-delete')) return;
        e.preventDefault();
        activateSticker(wrapper);
        var t = e.touches[0];
        var startX = t.clientX - wrapper.offsetLeft;
        var startY = t.clientY - wrapper.offsetTop;

        function move(ev) {
            var mt = ev.touches[0];
            wrapper.style.left = (mt.clientX - startX) + "px";
            wrapper.style.top = (mt.clientY - startY) + "px";
        }
        function stop() {
            document.removeEventListener('touchmove', move);
            document.removeEventListener('touchend', stop);
        }
        document.addEventListener('touchmove', move, { passive: false });
        document.addEventListener('touchend', stop);
    }, { passive: false });

    // 2. РЕСАЙЗ
    if (resizerSE) {
        resizerSE.addEventListener('touchstart', function(e) {
            e.preventDefault(); e.stopPropagation();
            var t = e.touches[0];
            var startX = t.clientX, startWidth = wrapper.offsetWidth;
            var aspect = wrapper.offsetWidth / wrapper.offsetHeight;
            function res(ev) {
                var mt = ev.touches[0];
                var newW = Math.max(40, startWidth + (mt.clientX - startX));
                wrapper.style.width = newW + "px";
                wrapper.style.height = (newW / aspect) + "px";
            }
            document.addEventListener('touchmove', res, { passive: false });
            document.addEventListener('touchend', () => document.removeEventListener('touchmove', res), { once: true });
        }, { passive: false });
    }

    // 3. ПОВОРОТ (ВОТ ОН!)
    if (resizerTR) {
        resizerTR.addEventListener('touchstart', function(e) {
            e.preventDefault(); e.stopPropagation();
            var t = e.touches[0];
            var startX = t.clientX;
            var startRot = getCurrentRotation(wrapper);

            function rot(ev) {
                var mt = ev.touches[0];
                var delta = mt.clientX - startX;
                // Вращаем стикер
                wrapper.style.transform = "rotate(" + (startRot + delta) + "deg)";
            }
            document.addEventListener('touchmove', rot, { passive: false });
            document.addEventListener('touchend', () => document.removeEventListener('touchmove', rot), { once: true });
        }, { passive: false });
    }
}





document.addEventListener('touchstart', function(e) {
    // Если ткнули НЕ в стикер и НЕ в кнопки выбора
    if (!e.target.closest('.sticker-wrapper') && !e.target.closest('.text-color-btn') && !e.target.closest('.sticker-preview-icon')) {
        if (activeWrapper) {
            deselectAllStickers();
        }
    }
}, { passive: true });




























async function saveToGallery() {
    const screen = document.getElementById('decoration-screen');
    const cardArea = document.getElementById('selected-card-preview');
    const images = cardArea.querySelectorAll('img');

    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const q = 2; // Коэффициент качества

    canvas.width = window.innerWidth * q;
    canvas.height = window.innerHeight * q;

    const loadImage = (src) => new Promise(res => {
        const img = new Image();
        img.crossOrigin = "anonymous"; // Важно для GitHub
        img.onload = () => res(img);
        img.onerror = () => res(null);
        img.src = src;
    });

    const loadImageFromTag = (imgTag) => new Promise(res => {
        if (imgTag.complete) res(imgTag);
        else imgTag.onload = () => res(imgTag);
    });

    try {
        // 1. РИСУЕМ ФОН СТОЛА
        const style = window.getComputedStyle(screen);
        const bgImgUrl = style.backgroundImage.slice(4, -1).replace(/"/g, "");

        if (bgImgUrl && bgImgUrl !== "none") {
            const bgImg = await loadImage(bgImgUrl);
            if (bgImg) {
                ctx.drawImage(bgImg, 0, 0, canvas.width, canvas.height);
            }
        } else {
            // Если картинка вдруг не подгрузилась — заливаем цветом
            ctx.fillStyle = style.backgroundColor || "#222";
            ctx.fillRect(0, 0, canvas.width, canvas.height);
        }

        // 2. РИСУЕМ КАРТУ И СТИКЕРЫ
        for (let imgTag of images) {
            const img = await loadImageFromTag(imgTag);
            const r = imgTag.getBoundingClientRect();

            const w = r.width * q;
            const h = r.height * q;
            const x = r.left * q + (w / 2);
            const y = r.top * q + (h / 2);

            const wrapper = imgTag.closest('.sticker-wrapper');
            let angle = 0;
            if (wrapper) {
                const wStyle = window.getComputedStyle(wrapper);
                const matrix = wStyle.transform;
                if (matrix !== 'none') {
                    const values = matrix.split('(')[1].split(')')[0].split(',');
                    angle = Math.atan2(parseFloat(values[1]), parseFloat(values[0]));
                }
            }

            ctx.save();
            ctx.translate(x, y);
            ctx.rotate(angle);
            ctx.drawImage(img, -w / 2, -h / 2, w, h);
            ctx.restore();
        }

        // 3. СКАЧИВАНИЕ
        const link = document.createElement('a');
        link.download = `my_decoration_${Date.now()}.png`;
        link.href = canvas.toDataURL('image/png');
        link.click();

    } catch (e) {
        console.error("Ошибка сохранения:", e);
        alert("Не удалось сохранить. Проверь консоль.");
    }
}
