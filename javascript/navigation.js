let navButton = document.getElementById('nav-button');
let headerNav = document.getElementById('header-navigation');
let isOpen = false;


let headerSummary = document.querySelectorAll('header summary');
let headerDetailsOpen = undefined;
let openDropdown = undefined;
let color = '#d2d0dd';

import { updateArrowState, Reset, width } from './faq-dropdown.js';

let svg = {};

svg.x = `
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none"><g clip-path="url(#clip0_2514_2420)"><path d="M10.0001 8.82166L14.1251 4.69666L15.3034 5.87499L11.1784 9.99999L15.3034 14.125L14.1251 15.3033L10.0001 11.1783L5.87511 15.3033L4.69678 14.125L8.82178 9.99999L4.69678 5.87499L5.87511 4.69666L10.0001 8.82166Z" fill="url(#paint0_linear_2514_2420)"></path></g><defs><linearGradient id="paint0_linear_2514_2420" x1="10.0001" y1="4.69666" x2="10.0001" y2="15.3033" gradientUnits="userSpaceOnUse"><stop offset="0.364583" stop-color="white" stop-opacity="0.41"></stop><stop offset="1" stop-color="white"></stop></linearGradient><clipPath id="clip0_2514_2420"><rect width="20" height="20" fill="white"></rect></clipPath></defs></svg>
`;

svg.ham = `
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none"><path d="M4 4H16M4 10H16M4 16H16" stroke="url(#paint0_linear_2514_2120)" stroke-width="1.5" stroke-linecap="square"></path><defs><linearGradient id="paint0_linear_2514_2120" x1="3.5" y1="-3.5" x2="16" y2="17" gradientUnits="userSpaceOnUse"><stop stop-color="white" stop-opacity="0.3"></stop><stop offset="0.796875" stop-color="white"></stop></linearGradient></defs></svg>
`;

function ControlNav() {
    if (!isOpen) {
        return openNavigation('hidden');
    }
    closeNavigation();
}

function UpdateNavigation(bool, svg, overflow) {
    isOpen = bool;
    navButton.innerHTML = svg;
    document.body.style.overflowY = overflow;
    document.documentElement.style.overflowY = overflow;
}

function openNavigation(bodyOverflow) {
    headerNav.classList.add('h-max');
    UpdateNavigation(true, `${svg.x} Close`, bodyOverflow);
}

function closeNavigation() {
    headerNav.classList.remove('h-max');
    UpdateNavigation(false, `${svg.ham} Menu`, 'auto');
}


// REFACTOR BELOW SO THAT MOBILE AND DESKTOP WORKS upon load AND when screen resized.

const Mobile = (item) => {

    let details = item.parentElement;

    updateArrowState(details, !details.open, color);

    if (headerDetailsOpen === details) {
        setPColor(openDropdown, '#d2d0dd');
        return headerDetailsOpen = undefined;
    }

    setPColor(item, '#fff');

    if (headerDetailsOpen && headerDetailsOpen !== details) {
        Reset(headerDetailsOpen, false, color);
    }

    headerDetailsOpen = details;
}

function preventIt(event) {
    event.preventDefault();
}

const setPColor = (item, color) => {
    let q = item.childNodes[1];
    q.style.color = color;
}

function Desktop(event, item) {
    event.preventDefault();

    if (openDropdown && openDropdown !== item) {
        openDropdown.parentElement.open = false;
        setPColor(openDropdown, '#d2d0dd');
    }
    item.parentElement.open = true;
    setPColor(item, '#fff');
    headerSummary.forEach((item) => {
        let q = item.parentElement.childNodes[3];
        q.classList.add('one-open');
    });
    

    openDropdown = item;

    const handle = (event) => {

        let screenWidth = window.innerWidth;
        let leftEdge = (screenWidth - width) / 2;

        let mouseX = event.clientX;
        let mouseY = event.clientY;

        if (mouseY < 5
            || mouseY > 84 && mouseX < leftEdge + 200
            || mouseX < leftEdge + 16
            || mouseX > (leftEdge + item.nextElementSibling.clientWidth + 120) 
            || mouseX > leftEdge + 588 && mouseY < 84
            || mouseY > 70 + item.nextElementSibling.clientHeight) {
                headerSummary.forEach((item) => {
                    let q = item.parentElement.childNodes[3];
                    setPColor(openDropdown, '#d2d0dd');
                    q.classList.remove('one-open');
                });
                document.documentElement.removeEventListener('pointermove', handle);
                item.parentElement.open = false;
            }
    }

    document.documentElement.addEventListener('pointermove', handle);

}

const handleDesking = (item) => {
    return function(event) {
        Desktop(event, item);
    }
}

const handleMobile = (item) => {
    return function() {
        Mobile(item);
    }
}

// To force nothing to happen (other then reassignment of lasting, lasting2 when NavigationResize is called by window resize event listener and the screen has not had to update css via media query)
let lasting = !(window.innerWidth > width);
let lasting2 = !(window.innerWidth < width);

function NavigationResize() {

    if (window.innerWidth > width && !lasting && lasting2) {
        openNavigation('auto');

        headerSummary.forEach(item => {
            if (item._handleMobile) {
                item.removeEventListener('click', item._handleMobile);
            }

            item.parentElement.open = false;

            updateArrowState(item.parentElement, false, '#d2d0dd', 'rotate(90deg)');

            item.addEventListener('click', preventIt);

            const deskingHandler = handleDesking(item);
            item._handleDesking = deskingHandler;

            item.addEventListener('mouseover', deskingHandler);
        });

        navButton.removeEventListener('click', ControlNav);

    }
    if (window.innerWidth < width && lasting && !lasting2) {

        headerSummary.forEach(item => {
            if (item._handleDesking) {
                item.removeEventListener('mouseover', item._handleDesking);
                item.removeEventListener('click', preventIt);
            }

            item.parentElement.open = false;
            headerDetailsOpen = undefined;

            updateArrowState(item.parentElement, false, '#d2d0dd', 'rotate(0deg)');

            const mobileHandler = handleMobile(item);
            item._handleMobile = mobileHandler;
            
            item.addEventListener('click', mobileHandler);
        });

        navButton.addEventListener('click', ControlNav);
        closeNavigation();
    }
    lasting = window.innerWidth > width;
    lasting2 = window.innerWidth < width;
}


window.addEventListener('resize', NavigationResize);

window.dispatchEvent(new Event('resize'));