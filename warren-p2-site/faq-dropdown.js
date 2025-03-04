let items = document.querySelectorAll('details');
let open = items[0];


items.forEach((item) => item.addEventListener('click', (event) => {
    let faqClicked = item.firstElementChild;
    if (faqClicked !== open) open.parentElement.open = false;
    faqClicked.lastElementChild.style.transform = 'rotate(90deg)';
    open.lastElementChild.style.transform = 'rotate(0deg)';
    open = faqClicked;
}));


// find svg and switch to other svg