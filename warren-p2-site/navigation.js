let navButton = document.getElementById('nav-button');
let headerNav = document.getElementById('header-navigation');
let isOpen = false;
navButton.addEventListener('click', event => {
    if (!isOpen) {
        isOpen = true;
        event.target.innerText = 'Close'
        return openNavigation();
    }
    isOpen = false;
    event.target.innerText = 'Menu'
    closeNavigation();
});

function openNavigation() {
    headerNav.classList.add('h-max');
}

function closeNavigation() {
    headerNav.classList.remove('h-max');
}

window.addEventListener('resize', function() {
    if (window.innerWidth > 1128) {
        openNavigation();
    } else {
        closeNavigation();
    }
})