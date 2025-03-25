let items = document.querySelectorAll('footer summary');
let open = items[0].parentElement;
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
            let details = item.parentElement;
            if (details.open) {
                updateArrowState(details, false, '#676182');
                details.open = false;
            } else {
                if (open !== details) {
                    updateArrowState(open, false, '#676182');
                    open.open = false;
                }
                updateArrowState(details, true, '#d2d0dd');
                details.open = true;
            }
            open = details;
        }
    });
});


function handleResize() {
    if (window.innerWidth < width) {
        items.forEach((item) => {
            Reset(item.parentElement, false, '#676182')
        });
    } else {
        items.forEach((item) => Reset(item.parentElement, true, '#fff'));
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