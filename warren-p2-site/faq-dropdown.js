let items = document.querySelectorAll('footer details');
let open = items[0];

export function updateArrowState(item, openState, color) {
    let q = item.firstElementChild;
    let arrowIcon = q.lastElementChild;

    if (openState) {
        arrowIcon.style.transition = 'all 200ms ease';
        arrowIcon.style.transform = 'rotate(90deg)';
        q.firstElementChild.style.color = color;
    } else {
        arrowIcon.style.transition = 'all 200ms ease';
        arrowIcon.style.transform = 'rotate(0deg)';
        q.firstElementChild.style.color = color;
    }
}

items.forEach((item) => {
    item.addEventListener('click', (event) => {
        event.preventDefault();

        if (window.innerWidth < 1128) {
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
    if (window.innerWidth < 1128) {
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