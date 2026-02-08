// localStorage.removeItem('chungha_inventory');


// inventory.js
console.log('=== inventory.js ===');

let playerInventory = JSON.parse(localStorage.getItem('chungha_inventory')) || [];

function initInventory() {
    // Привязываемся только к cardbinder-screen
    const screen = document.getElementById('cardbinder-screen');
    if (!screen) return;

    const btn = screen.querySelector('#inventory-btn');
    const win = screen.querySelector('#inventory-window');
    const grid = screen.querySelector('#inventory-grid');

    if (!btn || !win || !grid) {
        console.error('Не найдены элементы инвентаря на cardbinder-screen');
        return;
    }

    // Обновить кнопку с количеством карт
    btn.textContent = `📚 Inventory (${playerInventory.length})`;

    // Клик по кнопке — открываем/закрываем инвентарь
    btn.onclick = () => {
        win.classList.toggle('hidden');
        if (!win.classList.contains('hidden')) {
            loadInventory();
        }
    };

    console.log('Инвентарь готов');
}

// Загружаем карты в инвентарь
function loadInventory() {
    const screen = document.getElementById('cardbinder-screen');
    const grid = screen.querySelector('#inventory-grid');
    if (!grid) return;

    grid.innerHTML = '';

    if (playerInventory.length === 0) {
        grid.innerHTML = '<div class="empty-inventory">No cards yet</div>';
        return;
    }

    const shopCards = window.allCards || [];

    playerInventory.forEach(cardId => {
        const card = shopCards.find(c => c.id === cardId);
        if (card) {
            const cardEl = document.createElement('div');
            cardEl.className = 'inventory-card';
            cardEl.setAttribute('draggable', 'true'); // чтобы можно было тянуть
            cardEl.dataset.id = card.id;
            cardEl.innerHTML =`
                <div class="card-wrapper">
                    <img src="${card.image}" alt="${card.name}">
                </div>
                <span>${card.name}</span>
            `;

            // событие dragstart
            cardEl.addEventListener('dragstart', e => {
                e.dataTransfer.setData('cardID', card.id); // передаем id карты
            });

            grid.appendChild(cardEl);
        }
    });
}

// Обновляем кнопку и сетку (например после покупки)
function updateInventory() {
    // ПЕРЕД отрисовкой всегда берем свежие данные из памяти
    playerInventory = JSON.parse(localStorage.getItem('chungha_inventory')) || [];

    const screen = document.getElementById('cardbinder-screen');
    const btn = screen.querySelector('#inventory-btn');
    const win = screen.querySelector('#inventory-window');

    if (btn) btn.textContent = `📚 Inventory (${playerInventory.length})`;

    if (win && !win.classList.contains('hidden')) {
        loadInventory(); // Эта функция отрисует уже обновленный массив
    }
}

// Добавление карты в инвентарь
function addCardToInventory(cardId) {
    if (!playerInventory.includes(cardId)) {
        playerInventory.push(cardId);
        localStorage.setItem('chungha_inventory', JSON.stringify(playerInventory));
        updateInventory();
        return true;
    }
    return false;
}

// Делаем функции глобально доступными для магазина
window.addCardToInventory = addCardToInventory;
window.updateInventory = updateInventory;

document.addEventListener('DOMContentLoaded', initInventory);






// Добавь это в конец inventory.js
function enableTouchDrag() {
    document.addEventListener('touchstart', function(e) {
        const el = e.target.closest('.inventory-card');
        if (!el) return;

        const touch = e.touches[0];
        const startX = touch.clientX;
        const startY = touch.clientY;
        const cardId = el.dataset.id;

        let ghost = null;
        let dragStarted = false;
        let moveChecked = false;

        function onTouchMove(ev) {
            const t = ev.touches[0];
            const dx = Math.abs(t.clientX - startX);
            const dy = Math.abs(t.clientY - startY);

            // Проверяем направление только в начале движения
            if (!moveChecked) {
                if (dx > dy) {
                    // Если горизонтальный сдвиг больше — это СКРОЛЛ.
                    // Снимаем обработчики и даем браузеру листать.
                    document.removeEventListener('touchmove', onTouchMove);
                    return;
                }
                moveChecked = true;
            }

            // Если мы поняли, что это Drag (движение вверх/вниз)
            if (dy > 10 && !dragStarted) {
                dragStarted = true;
                ghost = el.cloneNode(true);
                ghost.style.cssText = `position:fixed; width:70px; z-index:10000; opacity:0.8; pointer-events:none;`;
                document.body.appendChild(ghost);
            }

            if (dragStarted && ghost) {
                ev.preventDefault(); // Блокируем скролл только если УЖЕ тащим карту
                ghost.style.left = t.clientX - 35 + 'px';
                ghost.style.top = t.clientY - 50 + 'px';
            }
        }

        function onTouchEnd(ev) {
            if (dragStarted && ghost) {
                const t = ev.changedTouches[0];
                const dropTarget = document.elementFromPoint(t.clientX, t.clientY);
                const slot = dropTarget ? dropTarget.closest('.cards-slot') : null;

                if (slot && !slot.hasChildNodes()) {
                    moveCardToBinder(cardId, slot);
                }
                ghost.remove();
            }
            document.removeEventListener('touchmove', onTouchMove);
            document.removeEventListener('touchend', onTouchEnd);
        }

        document.addEventListener('touchmove', onTouchMove, { passive: false });
        document.addEventListener('touchend', onTouchEnd);
    }, { passive: true }); // passive: true разрешает браузеру начать скролл
}





document.addEventListener('DOMContentLoaded', enableTouchDrag);
