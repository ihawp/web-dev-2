let items = document.querySelectorAll('details');
let open = items[0];


items.forEach((item) => item.addEventListener('click', (event) => {
    event.preventDefault();
    if (item.open) {
        item.open = false;
        item.firstElementChild.lastElementChild.style.transform = 'rotate(0deg)';
    } else {
        open.open = false;
        open.firstElementChild.lastElementChild.style.transform = 'rotate(0deg)';
        item.open = true;
        item.firstElementChild.lastElementChild.style.transform = 'rotate(90deg)';
    }
    open = item;
}));


// find svg and switch to other svg