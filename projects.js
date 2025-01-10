/* scroll-effects.js */
document.addEventListener('DOMContentLoaded', function() {
    const projectsGrid = document.querySelector('.projects-grid');
    projectsGrid.addEventListener('wheel', (e) => {
        if (e.deltaY !== 0) {
            e.preventDefault();
            projectsGrid.scrollBy({
                left: e.deltaY < 0 ? -30 : 30, // Adjust scroll speed
                behavior: 'smooth'
            });
        }
    });
});
