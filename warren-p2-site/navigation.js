let navButton = document.getElementById('nav-button');
let headerNav = document.getElementById('header-navigation');
let isOpen = false;

import { updateArrowState, Reset } from './faq-dropdown.js';

let svg = {};

svg.x = `
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none"><g clip-path="url(#clip0_2514_2420)"><path d="M10.0001 8.82166L14.1251 4.69666L15.3034 5.87499L11.1784 9.99999L15.3034 14.125L14.1251 15.3033L10.0001 11.1783L5.87511 15.3033L4.69678 14.125L8.82178 9.99999L4.69678 5.87499L5.87511 4.69666L10.0001 8.82166Z" fill="url(#paint0_linear_2514_2420)"></path></g><defs><linearGradient id="paint0_linear_2514_2420" x1="10.0001" y1="4.69666" x2="10.0001" y2="15.3033" gradientUnits="userSpaceOnUse"><stop offset="0.364583" stop-color="white" stop-opacity="0.41"></stop><stop offset="1" stop-color="white"></stop></linearGradient><clipPath id="clip0_2514_2420"><rect width="20" height="20" fill="white"></rect></clipPath></defs></svg>
`;

svg.ham = `
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none"><path d="M4 4H16M4 10H16M4 16H16" stroke="url(#paint0_linear_2514_2120)" stroke-width="1.5" stroke-linecap="square"></path><defs><linearGradient id="paint0_linear_2514_2120" x1="3.5" y1="-3.5" x2="16" y2="17" gradientUnits="userSpaceOnUse"><stop stop-color="white" stop-opacity="0.3"></stop><stop offset="0.796875" stop-color="white"></stop></linearGradient></defs></svg>
`;

navButton.addEventListener('click', function() {
        if (!isOpen) {
            return openNavigation();
        }
        closeNavigation();
});

const UpdateNavigation = (bool, svg, overflow) => {
    isOpen = bool;
    navButton.innerHTML = svg;
    document.body.style.overflow = overflow;
}

function openNavigation() {
    headerNav.classList.add('h-max');
    UpdateNavigation(true, `${svg.x} Close`, 'hidden');
}

function closeNavigation() {
    headerNav.classList.remove('h-max');
    UpdateNavigation(false, `${svg.ham} Menu`, 'auto');
}

window.addEventListener('resize', function() {
    if (window.innerWidth > 1128) {
        openNavigation();

        alterDom();

    } else {
        closeNavigation();
    }
});

function alterDom() {
    console.log('dom being altered!');
}

let headerDetailsOpen = undefined;
let headerDetails = document.querySelectorAll('header details');

headerDetails.forEach(item => {
    item.addEventListener('click', () => {
        if (headerDetailsOpen !== undefined && item !== headerDetailsOpen) {
            updateArrowState(item, true, '#d2d0dd');
            Reset(headerDetailsOpen, false, 'inherit')
        }
        updateArrowState(item, true, '#d2d0dd');
        headerDetailsOpen = item;
    });
});