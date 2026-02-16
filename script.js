document.addEventListener('DOMContentLoaded', () => {
    // Mobile Menu Toggle
    const mobileBtn = document.querySelector('.mobile-menu-btn');
    const nav = document.querySelector('.nav');
    const navLinks = document.querySelectorAll('.nav-link');

    if (mobileBtn) {
        mobileBtn.addEventListener('click', () => {
            nav.classList.toggle('active');

            // Animate hamburger icon
            const spans = mobileBtn.querySelectorAll('span');
            if (nav.classList.contains('active')) {
                spans[0].style.transform = 'rotate(45deg) translate(5px, 5px)';
                spans[1].style.opacity = '0';
                spans[2].style.transform = 'rotate(-45deg) translate(5px, -5px)';
            } else {
                spans[0].style.transform = 'none';
                spans[1].style.opacity = '1';
                spans[2].style.transform = 'none';
            }
        });

        // Close menu when clicking a link
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                nav.classList.remove('active');
                // Reset icon
                const spans = mobileBtn.querySelectorAll('span');
                spans[0].style.transform = 'none';
                spans[1].style.opacity = '1';
                spans[2].style.transform = 'none';
            });
        });
    }

    // Metric Counters Animation
    const animateCounters = () => {
        const counters = document.querySelectorAll('.metric-value');
        counters.forEach(counter => {
            const target = +counter.getAttribute('data-target');
            const duration = 2000; // 2 seconds
            const increment = target / (duration / 16); // 60fps

            let current = 0;
            const updateCounter = () => {
                current += increment;
                if (current < target) {
                    counter.innerText = Math.ceil(current);
                    requestAnimationFrame(updateCounter);
                } else {
                    counter.innerText = target;
                }
            };
            updateCounter();
        });
    };

    // Intersection Observer for Animations
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.1
    };

    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                // Fade in animation
                entry.target.classList.add('fade-in-up');

                // Specific trigger for metrics
                if (entry.target.querySelector('.metric-value')) {
                    animateCounters();
                }

                // Trigger for CSS-Transition Charts (Bars, Donut, Area)
                // We add the 'on-screen' class to the card to trigger CSS transitions
                if (entry.target.classList.contains('chart-card')) {
                    entry.target.classList.add('on-screen');
                }

                // Also handle the existing Growth Chart reset if needed
                const chartLine = entry.target.querySelector('.growth-line');
                if (chartLine) {
                    chartLine.style.animationName = 'none';
                    // Trigger reflow
                    void chartLine.offsetWidth;
                    chartLine.style.animationName = 'drawLine';
                }

                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    // Initial fade in for sections and charts
    document.querySelectorAll('.section, .chart-card').forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(20px)';
        el.style.transition = 'opacity 0.6s ease-out, transform 0.6s ease-out';
        observer.observe(el);
    });

    // Add class for handling the visible state
    const style = document.createElement('style');
    style.innerHTML = `
        .fade-in-up {
            opacity: 1 !important;
            transform: translateY(0) !important;
        }
    `;
    document.head.appendChild(style);
});
