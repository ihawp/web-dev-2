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
        items.forEach((item) => {
            item.open = false;
            let q = item.firstElementChild;
            q.firstElementChild.style.color = '#676182';
            updateArrowState(item, false);
        });
    } else {
        items.forEach((item) => {
            item.open = true;
            let q = item.firstElementChild;
            q.firstElementChild.style.color = '#fff';
            updateArrowState(item, true);
        });
    }
}

window.addEventListener('resize', handleResize);

handleResize();
