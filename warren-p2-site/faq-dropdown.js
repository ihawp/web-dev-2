let items = document.querySelectorAll('details');
let open = items[0];

items.forEach((item) => item.addEventListener('click', (event) => {
    event.preventDefault();
    let q = item.firstElementChild;
    if (window.innerWidth < 1128) {
        if (item.open) {
            item.open = false;
            q.firstElementChild.style.color = '#676182';
            q.lastElementChild.style.transform = 'rotate(0deg)';
        } else {
            open.open = false;
            open.firstElementChild.lastElementChild.style.transform = 'rotate(0deg)';
            open.firstElementChild.firstElementChild.style.color = '#676182';
            item.open = true;
            q.lastElementChild.style.transform = 'rotate(90deg)';
            q.firstElementChild.style.color = '#d2d0dd';
        }
        open = item;
    }
}));

if (window.innerWidth > 1128) {
    items.forEach((item) => item.open = true);
}

window.addEventListener('resize', (event) => {
    if (event.target.innerWidth > 1128) {
        items.forEach((item) => {
            item.open = true
            item.firstElementChild.firstElementChild.style.color = '#fff';
        });
    } else {
        items.forEach((item) => {

            item.open = false;
            item.firstElementChild.firstElementChild.style.color = '#676182';

        });
    }
});



// find svg and switch to other svg