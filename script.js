document.addEventListener('DOMContentLoaded', function() {
    const navbar = document.querySelector('.navbar');
    const heroSection = document.querySelector('.hero-visual'); // Assuming this is the main visual section

    if (navbar && heroSection) {
        // Calculate the point at which the navbar should change.
        // This is typically when the user scrolls past the initial hero section.
        // We subtract navbar.offsetHeight to make the change happen slightly before the hero section completely leaves the viewport.
        const scrollThreshold = heroSection.offsetHeight - navbar.offsetHeight;

        window.addEventListener('scroll', function() {
            if (window.scrollY > scrollThreshold) {
                navbar.classList.add('navbar-scrolled');
            } else {
                navbar.classList.remove('navbar-scrolled');
            }
        });
    }
});
