let open = undefined;
let items = document.querySelectorAll('details');

items.forEach((item) => item.addEventListener('click', (event) => {
    let faqClicked = event.target;
    if ( open !== undefined && faqClicked !== open) open.parentElement.open = false;
    open = faqClicked;
}));