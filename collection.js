function initCollection() {
    const invBtn = document.getElementById('inventory-btn');
    const invWindow = document.getElementById('inventory-window');
    const storage = document.querySelector('.cards-storage');

    if (invBtn && invWindow) {
        invBtn.onclick = () => invWindow.classList.toggle('hidden');
    }

    if (!storage) return;
    storage.innerHTML = '';

    const cards = (typeof myCards !== 'undefined') ? myCards : [];

    cards.forEach(cardData => {
        const img = document.createElement('img');
        img.src = cardData.img;
        img.className = 'draggable-card';
        img.dataset.id = cardData.id;
        img.draggable = true;

        img.ondragstart = (e) => img.classList.add('dragging');
        img.ondragend = (e) => handleDrop(img, e.clientX, e.clientY, invWindow, storage);

        let touchOffset = { x: 0, y: 0 };
        img.addEventListener('touchstart', (e) => {
            const touch = e.touches[0];
            const rect = img.getBoundingClientRect();
            touchOffset.x = touch.clientX - rect.left;
            touchOffset.y = touch.clientY - rect.top;
            img.classList.add('dragging');
            img.style.position = 'fixed';
            img.style.zIndex = '10000';
            document.body.appendChild(img);
        }, { passive: false });

        img.addEventListener('touchmove', (e) => {
            e.preventDefault();
            const touch = e.touches[0];
            img.style.left = (touch.clientX - touchOffset.x) + 'px';
            img.style.top = (touch.clientY - touchOffset.y) + 'px';
        }, { passive: false });

        img.addEventListener('touchend', (e) => {
            img.classList.remove('dragging');
            const touch = e.changedTouches[0];
            handleDrop(img, touch.clientX, touch.clientY, invWindow, storage);
        });

        storage.appendChild(img);
    });
}

function handleDrop(img, x, y, invWindow, storage) {
    const rectInv = invWindow.getBoundingClientRect();
    const isOverInventory = (
        x > rectInv.left && x < rectInv.right &&
        y > rectInv.top && y < rectInv.bottom
    );

    if (isOverInventory) {
        img.style.position = 'static';
        img.style.margin = '0';
        storage.appendChild(img);
    } else {
        document.body.appendChild(img);
        img.style.position = 'fixed';
        img.style.zIndex = '10000';
        img.style.left = (x - 40) + 'px';
        img.style.top = (y - 55) + 'px';
    }
}

document.ondragover = (e) => e.preventDefault();
window.onload = initCollection;
