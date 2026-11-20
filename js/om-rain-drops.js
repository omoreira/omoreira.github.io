const canvas = document.getElementById('matrixCanvas');
const ctx = canvas.getContext('2d');

// Set canvas dimensions to cover the window
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

// Character set for the rain effect
const characters = '10101111000001110011010010101001001010101001010100100010101010101001010100';
const fontSize = 16;
const columns = canvas.width / fontSize;

// Array to store y-coordinates of each column's character
const drops = [];
for (let i = 0; i < columns; i++) {
    drops[i] = 1; // Start drops from the top
}

function draw() {
// Create a fading trail effect by drawing a semi-transparent black rectangle
    ctx.fillStyle = 'rgba(0, 0, 0, 0.05)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

 // Set text color and font
    ctx.fillStyle = '#4b80a9ff'; // Green color for Matrix effect
    ctx.font = `${fontSize}px monospace`;

    // Loop through each column and draw a character
    for (let i = 0; i < drops.length; i++) {
        const text = characters.charAt(Math.floor(Math.random() * characters.length));
        ctx.fillText(text, i * fontSize, drops[i] * fontSize);

        // Reset drop to top if it reaches the bottom or randomly
        if (drops[i] * fontSize > canvas.height && Math.random() > 0.975) {
            drops[i] = 0;
        }

        // Move drop down
        drops[i]++;
    }
}

// Animate the rain effect
setInterval(draw, 100); // Adjust interval for desired speed

// Handle window resizing to adjust canvas dimensions
window.addEventListener('resize', () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    // Re-initialize drops array for new dimensions if needed
    // const newColumns = canvas.width / fontSize;
    // if (newColumns !== columns) { /* Recreate drops array */ }
});
