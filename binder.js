// === binder.js ===

let currentBinderPage = 0;
// Объект для хранения: какой ID карты в каком слоте лежит
window.binderData = JSON.parse(localStorage.getItem('chungha_binder_data')) || {};

// 1. ОТКРЫТЬ ЭКРАН БИНДЕРА
function openCardBinderScreen() {
    document.querySelectorAll('.screen').forEach(screen => screen.classList.add('hidden'));
    const screen = document.getElementById('cardbinder-screen');
    screen.classList.remove('hidden');
    document.getElementById('cardbinder-spread').classList.add('hidden');
    document.getElementById('main-cover').classList.remove('hidden');
}

// 2. ИНИЦИАЛИЗАЦИЯ КНИГИ (КЛИКИ И ЛИСТАНИЕ)
// 2. ИНИЦИАЛИЗАЦИЯ КНИГИ (КЛИКИ И ЛИСТАНИЕ)
document.addEventListener('DOMContentLoaded', function() {
    const book = document.querySelector('.cardbinder-book');
    if (!book) return;

    const spread = document.getElementById('cardbinder-spread');
    const mainCover = document.getElementById('main-cover');

    book.addEventListener('click', function(event) {
        // 1. ПРОВЕРКА: Если кликнули по навигации — СТОП (добавил ||)
        if (event.target.closest('.nav-column') || event.target.closest('.back-btn')) {
            return;
        }

        const rect = book.getBoundingClientRect();
        const clickX = event.clientX - rect.left;
        const isRight = clickX > rect.width / 2;

        if (spread.classList.contains('hidden')) {
            if (isRight) {
                spread.classList.remove('hidden');
                mainCover.classList.add('hidden');
                currentBinderPage = 0;
                renderBinderPage(0);
            }
        } else {
            if (isRight) {
                if (checkIfPageFull()) {
                    currentBinderPage++;
                    renderBinderPage(currentBinderPage);
                }
            } else {
                if (currentBinderPage > 0) {
                    currentBinderPage--;
                    renderBinderPage(currentBinderPage);
                } else {
                    spread.classList.add('hidden');
                    mainCover.classList.remove('hidden');
                }
            }
        }
    }); // Здесь всё закрыто правильно
});

// 3. ЛОГИКА СТРАНИЦ
function checkIfPageFull() {
    const slots = document.querySelectorAll('.cards-slot');
    if (slots.length === 0) return false;
    return Array.from(slots).every(slot => slot.hasChildNodes());
}

function renderBinderPage(pageIndex) {
    const grid = document.getElementById('cards-grid');
    if (!grid) return;
    grid.innerHTML = "";

    for (let i = 1; i <= 4; i++) {
        const slotId = (pageIndex * 4) + i;
        const slot = document.createElement('div');
        slot.className = 'cards-slot';
        slot.dataset.slot = slotId;
        grid.appendChild(slot);

        const savedCardId = window.binderData["slot-" + slotId];
        if (savedCardId) {
            const card = window.allCards.find(c => String(c.id) === String(savedCardId));
            if (card) createBinderCardElement(card, slot);
        }
    }
    initBinderDragAndDrop();
}

// 4. ПЕРЕМЕЩЕНИЕ КАРТ (ИНВЕНТАРЬ <-> БИНДЕР)
function moveCardToBinder(cardId, slot) {
    const sId = String(cardId);

    // 1. Убираем из массива в памяти
    let inv = JSON.parse(localStorage.getItem('chungha_inventory')) || [];
    inv = inv.filter(id => String(id) !== sId);
    localStorage.setItem('chungha_inventory', JSON.stringify(inv));

    // 2. Обновляем глобальную переменную, чтобы inventory.js её увидел
    if (window.playerInventory) window.playerInventory = inv;

    // 3. Создаем в биндере
    const card = window.allCards.find(c => String(c.id) === sId);
    if (card) createBinderCardElement(card, slot);

    // 4. Запоминаем в биндере
    window.binderData["slot-" + slot.dataset.slot] = sId;
    localStorage.setItem('chungha_binder_data', JSON.stringify(window.binderData));

    // 5. ГЛАВНОЕ: перерисовываем инвентарь
    updateInventory();
}




function returnCardToInventory(cardId) {
    const sCardId = String(cardId);

    if (typeof addCardToInventory === 'function') {
        // Добавляем обратно в данные инвентаря
        addCardToInventory(sCardId);

        // Чистим память биндера
        for (let key in window.binderData) {
            if (String(window.binderData[key]) === sCardId) {
                delete window.binderData[key];
                break;
            }
        }
        localStorage.setItem('chungha_binder_data', JSON.stringify(window.binderData));

        // УДАЛЯЕМ ВИЗУАЛЬНО ИЗ БИНДЕРА (важно!)
        const cardInBinder = document.querySelector(`.binder-card[data-id="${sCardId}"]`);
        if (cardInBinder) {
            cardInBinder.remove();
        }

        // Обновляем инвентарь, чтобы карта там появилась
        if (typeof updateInventory === 'function') updateInventory();
    }
}


// 5. СОЗДАНИЕ КАРТОЧКИ
function createBinderCardElement(card, slot) {
    const cardEl = document.createElement('div');
    cardEl.className = 'binder-card';
    cardEl.dataset.id = card.id;
    cardEl.setAttribute('draggable', 'true');
    cardEl.innerHTML = `<img src="${card.image}" style="width:100%; display:block; pointer-events: none;">`;

    let clickTimer = 0;
    cardEl.addEventListener('mousedown', () => { clickTimer = Date.now(); });
    cardEl.addEventListener('click', () => {
        if (Date.now() - clickTimer < 200) openDecorationMode(card);
    });

    cardEl.addEventListener('dragstart', e => {
        e.dataTransfer.setData('cardId', card.id);
        e.dataTransfer.setData('source', 'binder');
    });

    slot.appendChild(cardEl);
}

// 6. DRAG AND DROP И TOUCH SUPPORT
function initBinderDragAndDrop() {
    const slots = document.querySelectorAll('.cards-slot');
    const invGrid = document.getElementById('inventory-grid');

    slots.forEach(slot => {
        slot.addEventListener('dragover', e => {
            e.preventDefault();
            if (!slot.hasChildNodes()) slot.classList.add('drag-over');
        });
        slot.addEventListener('dragleave', () => slot.classList.remove('drag-over'));
        slot.addEventListener('drop', e => {
            e.preventDefault();
            slot.classList.remove('drag-over');
            const cardId = e.dataTransfer.getData('cardId');
            const source = e.dataTransfer.getData('source');
            if (cardId && source !== 'binder' && !slot.hasChildNodes()) {
                moveCardToBinder(cardId, slot);
            }
        });
    });

    if (invGrid) {
        invGrid.addEventListener('dragover', e => e.preventDefault());
        invGrid.addEventListener('drop', e => {
            e.preventDefault();
            const cardId = e.dataTransfer.getData('cardId');
            if (e.dataTransfer.getData('source') === 'binder' && cardId) {
                returnCardToInventory(cardId);
            }
        });
    }
}

document.addEventListener('DOMContentLoaded', initBinderDragAndDrop);

// TOUCH ПОДДЕРЖКА (ИНВЕНТАРЬ)
document.addEventListener('DOMContentLoaded', function() {
    document.addEventListener('touchstart', e => {
        const cardEl = e.target.closest('.inventory-card');
        if (!cardEl) return;

        const cardId = cardEl.dataset.id;
        const touch = e.touches[0];
        const ghost = cardEl.cloneNode(true);
        ghost.style.cssText = `position:fixed; top:${touch.clientY}px; left:${touch.clientX}px; width:70px; z-index:10000; opacity:0.8; pointer-events:none;`;
        document.body.appendChild(ghost);

        const onMove = ev => {
            ghost.style.top = ev.touches[0].clientY - 40 + 'px';
            ghost.style.left = ev.touches[0].clientX - 35 + 'px';
        };

        const onEnd = ev => {
            const t = ev.changedTouches[0];
            const target = document.elementFromPoint(t.clientX, t.clientY);
            const slot = target ? target.closest('.cards-slot') : null;
            if (slot && !slot.hasChildNodes()) moveCardToBinder(cardId, slot);
            ghost.remove();
            document.removeEventListener('touchmove', onMove);
            document.removeEventListener('touchend', onEnd);
        };
        document.addEventListener('touchmove', onMove);
        document.addEventListener('touchend', onEnd);
    });
});

// TOUCH ПОДДЕРЖКА (БИНДЕР)
document.addEventListener('touchstart', (e) => {
    const targetCard = e.target.closest('.binder-card');
    if (!targetCard) return;

    const cardId = targetCard.dataset.id;
    const touch = e.touches[0];
    const startX = touch.clientX, startY = touch.clientY;
    let isMoving = false, ghost = null;

    const onMove = ev => {
        const moveTouch = ev.touches[0];
        const dist = Math.hypot(moveTouch.clientX - startX, moveTouch.clientY - startY);
        if (dist > 10 && !isMoving) {
            isMoving = true;
            ghost = targetCard.cloneNode(true);
            ghost.style.cssText = `position:fixed; top:${moveTouch.clientY}px; left:${moveTouch.clientX}px; width:70px; z-index:10000; opacity:0.8; pointer-events:none;`;
            document.body.appendChild(ghost);
        }
        if (isMoving && ghost) {
            ghost.style.top = moveTouch.clientY - 40 + 'px';
            ghost.style.left = moveTouch.clientX - 35 + 'px';
        }
    };

    const onEnd = ev => {
        if (!isMoving) {
            const cardData = window.allCards.find(c => String(c.id) === String(cardId));
            if (cardData) openDecorationMode(cardData);
        } else {
            const t = ev.changedTouches[0];
            const dropTarget = document.elementFromPoint(t.clientX, t.clientY);
            const invGrid = document.getElementById('inventory-grid');
            if (invGrid && (dropTarget === invGrid || invGrid.contains(dropTarget))) returnCardToInventory(cardId);
            if (ghost) ghost.remove();
        }
        document.removeEventListener('touchmove', onMove);
        document.removeEventListener('touchend', onEnd);
    };

    document.addEventListener('touchmove', onMove);
    document.addEventListener('touchend', onEnd);
}, { passive: false });
