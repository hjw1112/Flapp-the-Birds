function createFloatingImage() {
    const container = document.getElementById('container'); // Corrected "getElementByID" to "getElementById"

    // Create the image element
    const img = document.createElement('img'); // Fixed "document.createElement('.img')" to "document.createElement('img')"
    img.src = '/Resources/Bubbles.png'; // Corrected "scroll" to "src"
    img.className = 'floating-image';

    // Generate a random horizontal position
    const randomX = Math.random() * window.innerWidth;
    img.style.left = `${randomX}px`; // Corrected template literal syntax

    // Generate a random size
    const randomSize = Math.random() * 30 + 20; // Random size between 30px and 80px
    img.style.width = `${randomSize}px`;

    img.style.bottom = `0px`;

    // Append the image to the container
    container.appendChild(img);

    // Remove the image after the animation ends
    img.addEventListener('animationend', () => {
        img.remove();
    });
}

// Continuously create floating images
setInterval(createFloatingImage, 500); // Adjust the interval as needed
