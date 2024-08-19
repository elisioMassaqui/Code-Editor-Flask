const toggleDrawer = document.getElementById('toggle-drawer');
const set30 = document.getElementById('close-drawer');
const drawer = document.getElementById('drawer');
const overlay = document.getElementById('overlay');
const set50 = document.getElementById('set-50');
const set100 = document.getElementById('set-100');
const restartWebGL = document.getElementById('restart-webgl');
const webglFrame = document.getElementById('webgl-frame');

toggleDrawer.addEventListener('click', () => {
    drawer.classList.add('open');
    overlay.classList.add('show');
});

set30.addEventListener('click', () => {
    drawer.style.width = '30%';
});

overlay.addEventListener('click', () => {
    drawer.classList.remove('open');
    overlay.classList.remove('show');
});

set50.addEventListener('click', () => {
    drawer.style.width = '50%';
});

set100.addEventListener('click', () => {
    drawer.style.width = '100%';
});

restartWebGL.addEventListener('click', () => {
    // Restart WebGL by resetting the iframe src
    webglFrame.src = webglFrame.src;
});