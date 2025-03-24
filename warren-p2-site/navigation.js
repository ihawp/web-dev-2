let navButton = document.getElementById('nav-button');
let headerNav = document.getElementById('header-navigation');
let isOpen = false;

import { updateArrowState, Reset, width } from './faq-dropdown.js';

let svg = {};

svg.x = `
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none"><g clip-path="url(#clip0_2514_2420)"><path d="M10.0001 8.82166L14.1251 4.69666L15.3034 5.87499L11.1784 9.99999L15.3034 14.125L14.1251 15.3033L10.0001 11.1783L5.87511 15.3033L4.69678 14.125L8.82178 9.99999L4.69678 5.87499L5.87511 4.69666L10.0001 8.82166Z" fill="url(#paint0_linear_2514_2420)"></path></g><defs><linearGradient id="paint0_linear_2514_2420" x1="10.0001" y1="4.69666" x2="10.0001" y2="15.3033" gradientUnits="userSpaceOnUse"><stop offset="0.364583" stop-color="white" stop-opacity="0.41"></stop><stop offset="1" stop-color="white"></stop></linearGradient><clipPath id="clip0_2514_2420"><rect width="20" height="20" fill="white"></rect></clipPath></defs></svg>
`;

svg.ham = `
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none"><path d="M4 4H16M4 10H16M4 16H16" stroke="url(#paint0_linear_2514_2120)" stroke-width="1.5" stroke-linecap="square"></path><defs><linearGradient id="paint0_linear_2514_2120" x1="3.5" y1="-3.5" x2="16" y2="17" gradientUnits="userSpaceOnUse"><stop stop-color="white" stop-opacity="0.3"></stop><stop offset="0.796875" stop-color="white"></stop></linearGradient></defs></svg>
`;

navButton.addEventListener('click', function() {
        if (!isOpen) {
            return openNavigation('hidden');
        }
        closeNavigation();
});

const UpdateNavigation = (bool, svg, overflow) => {
    isOpen = bool;
    navButton.innerHTML = svg;
    document.body.style.overflow = overflow;
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

let headerSummary = document.querySelectorAll('header summary');
let headerDetailsOpen;
let openDropdown;
let color = '#d2d0dd';

const Mobile = (item) => {

    let details = item.parentElement;

    // animate ul
    updateArrowState(details, !details.open, color);

    if (headerDetailsOpen === details) {
        return headerDetailsOpen = undefined;
    }

    if (headerDetailsOpen) {
        Reset(headerDetailsOpen, false, color);
    }

    headerDetailsOpen = details;
}

function preventIt(event) {
    event.preventDefault();
}

function Desktop(event, item) {
    event.preventDefault();

    if (openDropdown && openDropdown !== item) {
        openDropdown.parentElement.open = false;
    }
    item.parentElement.open = true;
    openDropdown = item;

    const handle = (event) => {

        let screenWidth = window.innerWidth;
        let leftEdge = (screenWidth - width) / 2;

        let mouseX = event.clientX;
        let mouseY = event.clientY;

        // make numbers more magical
        // need to work for any total screen width 
        // essentially they need to start from the left edge of the max content width (1248px, everything is centered in body)

        let q = item.nextElementSibling;

        if (mouseY < 5
            || mouseY > 84 && mouseX < leftEdge + 200
            || mouseX < leftEdge + 16
            || mouseX > (leftEdge + item.nextElementSibling.clientWidth + 120) 
            || mouseX > leftEdge + 588 && mouseY < 84
            || mouseY > 70 + item.nextElementSibling.clientHeight) {
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

function NavigationResize() {

    headerSummary.forEach(item => {
        item.parentElement.open = false;
    });

    if (window.innerWidth > width) {
        openNavigation('auto');

        headerSummary.forEach(item => {
            if (item._handleMobile) {
                console.log('removed');
                item.removeEventListener('click', item._handleMobile);
            }

            updateArrowState(item.parentElement, false, '#d2d0dd', 'rotate(90deg)');

            item.addEventListener('click', preventIt);

            const deskingHandler = handleDesking(item);
            item._handleDesking = deskingHandler;

            item.addEventListener('mouseover', deskingHandler);
        });
    } else {

        // Reset (breaks after resize from mobile-to-desktop-to-mobile if not)
        headerDetailsOpen = undefined;

        headerSummary.forEach(item => {
            if (item._handleDesking) {
                console.log('removedDesking');
                item.removeEventListener('mouseover', item._handleDesking);
            }
            item.removeEventListener('click', preventIt);

            updateArrowState(item.parentElement, false, '#d2d0dd', 'rotate(0deg)');

            const mobileHandler = handleMobile(item);
            item._handleMobile = mobileHandler;
            
            item.addEventListener('click', mobileHandler);
        });

        closeNavigation();
    }
}


window.addEventListener('resize', NavigationResize);

window.dispatchEvent(new Event('resize'));