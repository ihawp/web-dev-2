let items = document.querySelectorAll('footer details');
let open = items[0];
export const width = 1248;

export function updateArrowState(item, openState, color) {
    let q = item.firstElementChild;
    let arrowIcon = q.lastElementChild;

    arrowIcon.style.transition = 'all 200ms ease';
    q.firstElementChild.style.color = color;
    if (openState) {
        arrowIcon.style.transform = `rotate(90deg)`;
    } else {
        arrowIcon.style.transform = 'rotate(0deg)';
    }
}

items.forEach((item) => {
    item.addEventListener('click', (event) => {
        event.preventDefault();

        if (window.innerWidth < width) {
            if (item.open) {
                updateArrowState(item, false, '#676182');
                item.open = false;
            } else {
                if (open !== item) {
                    updateArrowState(open, false, '#676182');
                    open.open = false;
                }
                updateArrowState(item, true, '#d2d0dd');
                item.open = true;
            }
            open = item;
        }
    });
});


function handleResize() {
    if (window.innerWidth < width) {
        items.forEach((item) => Reset(item, false, '#676182'));
    } else {
        items.forEach((item) => Reset(item, true, '#fff'));
    }
}

export function Reset(item, bool, color) {
    item.open = bool;
    let q = item.firstElementChild;
    q.firstElementChild.style.color = color;
    updateArrowState(item, bool, color);
}

window.addEventListener('resize', handleResize);
document.addEventListener('DOMContentLoaded', handleResize);