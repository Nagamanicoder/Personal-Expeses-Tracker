/* ======================================================
   landingPage.js
   Utility functions for landing page
   ====================================================== */

console.log('✅ landingPage.js loaded');

// Initialize smooth scrolling
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({ behavior: 'smooth' });
        }
    });
});

document.addEventListener('DOMContentLoaded', function() {
    console.log('✅ Landing page DOM ready');
});