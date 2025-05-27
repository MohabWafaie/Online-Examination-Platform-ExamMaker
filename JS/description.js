document.addEventListener('DOMContentLoaded', () => {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const animationType = entry.target.dataset.animate;
                if (animationType === 'left') {
                    entry.target.classList.add('animateLeft');
                } else if (animationType === 'right') {
                    entry.target.classList.add('animateRight');
                }
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.1
    });
    document.querySelectorAll('[data-animate]').forEach((element) => {
        observer.observe(element);
    });
});

document.getElementById('heroGetStartBtn').addEventListener('click', function() {
    document.getElementById('examTopics').scrollIntoView({ behavior: 'smooth' });
  });