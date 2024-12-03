function createFloatingImage() {
    const container = document.getElementById('container');

    const img = document.createElement('img');
    img.src = '/Resources/Bubbles.png';
    img.className = 'floating-image';

    const randomX = Math.random() * window.innerWidth;
    img.style.left = `${randomX}px`;

    const randomSize = Math.random() * 30 + 20;
    img.style.width = `${randomSize}px`;

    img.style.bottom = `0px`;

    container.appendChild(img);

    img.addEventListener('animationend', () => {
        img.remove();
    });
}

const windowWidth = window.innerWidth;

setInterval(createFloatingImage, (windowWidth/2.5));
