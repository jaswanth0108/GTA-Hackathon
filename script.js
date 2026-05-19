document.addEventListener('DOMContentLoaded', () => {
    /* =====================================
       INTRO SCREEN LOGIC
    ===================================== */
    const introScreen = document.getElementById('intro-screen');
    const introVideo = document.getElementById('intro-video');
    const skipBtn = document.getElementById('skip-btn');
    const mainScreen = document.getElementById('main-screen');

    const enterMainMenu = () => {
        introScreen.classList.add('hidden');
        mainScreen.classList.remove('hidden');
        if (introVideo) {
            introVideo.pause();
        }
    };

    if (skipBtn) {
        skipBtn.addEventListener('click', enterMainMenu);
    }
    
    if (introVideo) {
        introVideo.addEventListener('ended', enterMainMenu);
        // Fallback in case video fails to autoplay or load
        introVideo.addEventListener('error', enterMainMenu);
    }

    /* =====================================
       MODAL & NAVIGATION LOGIC
    ===================================== */
    const navBtns = document.querySelectorAll('.nav-btn');
    const contentModal = document.getElementById('content-modal');
    const closeModal = document.getElementById('close-modal');
    const modalBackdrop = document.getElementById('modal-close');
    const panels = document.querySelectorAll('.panel');

    const openPanel = (targetId) => {
        // Hide all panels
        panels.forEach(panel => panel.classList.add('hidden'));
        // Show target panel
        const targetPanel = document.getElementById(targetId);
        if (targetPanel) {
            targetPanel.classList.remove('hidden');
        }
        // Show modal container
        contentModal.classList.remove('hidden');
    };

    const closePanel = () => {
        contentModal.classList.add('hidden');
        // Optional: clear form on close
        // resetForm();
    };

    navBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const target = btn.getAttribute('data-target');
            openPanel(target);
        });
    });

    closeModal.addEventListener('click', closePanel);
    modalBackdrop.addEventListener('click', closePanel);

    /* =====================================
       FAQ ACCORDION LOGIC
    ===================================== */
    const accordionHeaders = document.querySelectorAll('.accordion-header');

    accordionHeaders.forEach(header => {
        header.addEventListener('click', () => {
            const item = header.parentElement;
            const content = header.nextElementSibling;
            const isActive = item.classList.contains('active');

            // Close all others (optional, if you want only one open at a time)
            document.querySelectorAll('.accordion-item').forEach(otherItem => {
                otherItem.classList.remove('active');
                otherItem.querySelector('.accordion-content').style.maxHeight = null;
            });

            if (!isActive) {
                item.classList.add('active');
                content.style.maxHeight = content.scrollHeight + 'px';
            }
        });
    });

    /* =====================================
       REGISTRATION FORM LOGIC MOVED
       Moved to register.js for register.html
    ===================================== */
});
