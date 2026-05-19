document.addEventListener('DOMContentLoaded', () => {
    /* =====================================
       INTRO SCREEN LOGIC
    ===================================== */
    const startScreen = document.getElementById('start-screen');
    const startBtn = document.getElementById('start-btn');
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

    // Check if we should skip the intro video (coming back from register page)
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get('skipVideo') === 'true') {
        if (startScreen) startScreen.classList.add('hidden');
        // Apply immediate skip without transition flash
        introScreen.style.transition = 'none';
        enterMainMenu();
        // Restore transition for subsequent interactions
        setTimeout(() => {
            introScreen.style.transition = '';
        }, 100);
    }

    // Start Mission Logic
    if (startBtn && startScreen) {
        startBtn.addEventListener('click', () => {
            startScreen.classList.add('hidden');
            introScreen.classList.remove('hidden');
            if (introVideo) {
                introVideo.play().catch(e => {
                    console.log("Autoplay prevented:", e);
                });
            }
        });
    }

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
