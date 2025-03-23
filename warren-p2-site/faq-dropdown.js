let items = document.querySelectorAll('footer details');
let open = items[0];

function updateArrowState(item, openState) {
    let q = item.firstElementChild;
    let arrowIcon = q.lastElementChild;

    if (openState) {
        arrowIcon.style.transform = 'rotate(90deg)';
        q.firstElementChild.style.color = '#d2d0dd';
    } else {
        arrowIcon.style.transform = 'rotate(0deg)';
        q.firstElementChild.style.color = '#676182';
    }
}

items.forEach((item) => {
    item.addEventListener('click', (event) => {
        event.preventDefault();

        if (window.innerWidth < 1128) {
            if (item.open) {
                updateArrowState(item, false);
                item.open = false;
            } else {
                if (open !== item) {
                    updateArrowState(open, false);
                    open.open = false;
                }
                updateArrowState(item, true);
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

function Reset(item, bool, color) {
    item.open = bool;
    let q = item.firstElementChild;
    q.firstElementChild.style.color = color;
    updateArrowState(item, bool);
}

window.addEventListener('resize', handleResize);
document.addEventListener('DOMContentLoaded', handleResize);