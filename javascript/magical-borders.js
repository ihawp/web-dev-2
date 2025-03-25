


const magicalBorders = document.querySelectorAll('.magical-borders');
const cards = document.querySelectorAll('[class*="magical-borders-c"]');


const placeCursor = ({ x, y }) => {
    document.documentElement.style.setProperty("--x", x.toFixed(2));
    document.documentElement.style.setProperty("--y", y.toFixed(2));
};

cards.forEach(item => {
    item.addEventListener('pointermove', placeCursor);
    item.addEventListener('mouseout', () => {
        document.documentElement.style.setProperty("--x", "-10000");
        document.documentElement.style.setProperty("--y", "-10000");
    });
});

magicalBorders.forEach(item => {
    const mouseDot = document.createElement('div');
    mouseDot.classList.add('mouse-dot');
    mouseDot.style.transition = '400ms ease opacity';
    mouseDot.style.opacity = '0';
    item.appendChild(mouseDot);
    item.addEventListener('mousemove', (event) => {
        mouseDot.style.opacity = '1';
        const bounds = item.getBoundingClientRect();
        const x = event.clientX - bounds.left;
        const y = event.clientY - bounds.top;

        mouseDot.style.left = `${x}px`;
        mouseDot.style.top = `${y}px`;
    });
    item.addEventListener('mouseout', () => {
        mouseDot.style.opacity = '0';
    });
});