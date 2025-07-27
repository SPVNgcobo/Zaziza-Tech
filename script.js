Document.addEventListener('DOMContentLoaded', () => {
    console.log("DOM Content Loaded - Zaziza Tech script running.");

    // Smooth scrolling for navigation
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();

            const targetId = this.getAttribute('href');
            // Defensive check: ensure target element exists before scrolling
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                targetElement.scrollIntoView({
                    behavior: 'smooth'
                });
            }
        });
    });

    // Services Carousel Functionality
    const slides = document.querySelectorAll('.carousel-slide');
    const dotsContainer = document.querySelector('.carousel-dots');
    const prevBtn = document.querySelector('.prev-btn');
    const nextBtn = document.querySelector('.next-btn');
    const playPauseBtn = document.querySelector('.carousel-play-pause');
    // Defensive check: ensure playPauseBtn exists before querying its child
    const playPauseIcon = playPauseBtn ? playPauseBtn.querySelector('i') : null;
    const carouselContainer = document.querySelector('.carousel-container');

    console.log("Services Carousel elements found:");
    console.log({
        slidesCount: slides.length,
        dotsContainerExists: !!dotsContainer,
        prevBtnExists: !!prevBtn,
        nextBtnExists: !!nextBtn,
        playPauseBtnExists: !!playPauseBtn
    });

    let currentSlide = 0;
    let slideInterval;
    const intervalTime = 5000; // 5 seconds

    if (carouselContainer) {
        carouselContainer.setAttribute('aria-live', 'polite');
    }

    const dots = []; // Array to store dot elements directly
    if (dotsContainer) { // Only proceed if dotsContainer exists
        slides.forEach((_, index) => {
            const dot = document.createElement('span');
            dot.classList.add('carousel-dot');
            dot.setAttribute('role', 'button'); // Make dots semantically clickable
            dot.setAttribute('aria-label', `Go to service slide ${index + 1}`);
            if (index === 0) {
                dot.classList.add('active');
                dot.setAttribute('aria-current', 'true'); // Indicate current slide
            }
            dot.addEventListener('click', () => {
                console.log(`Service Dot ${index} clicked.`);
                goToSlide(index);
                pauseAutoSlide(); // Pause if user interacts
            });
            dotsContainer.appendChild(dot);
            dots.push(dot); // Add to our dots array
        });
        console.log("Service dots created:", dots.length);
    } else {
        console.warn("Service dots container not found. Carousel dots will not function.");
    }


    function showSlide(index) {
        if (slides.length === 0) {
            console.warn("showSlide called but no slides found.");
            return; // Prevent errors if no slides
        }
        console.log(`Showing service slide: ${index}`);

        // Ensure all slides are inactive and hidden from accessibility tree
        slides.forEach((slide, i) => {
            slide.classList.remove('active');
            slide.setAttribute('aria-hidden', 'true'); // Hide inactive slides from accessibility tree
            if (dots[i]) { // Defensive check if dot exists
                dots[i].classList.remove('active');
                dots[i].removeAttribute('aria-current');
            }
        });

        // Activate and make current slide visible to accessibility tree
        if (slides[index]) { // Defensive check if slide exists
            slides[index].classList.add('active');
            slides[index].removeAttribute('aria-hidden'); // Make active slide visible
        }
        if (dots[index]) { // Defensive check if dot exists
            dots[index].classList.add('active');
            dots[index].setAttribute('aria-current', 'true');
        }
    }

    function nextSlide() {
        if (slides.length === 0) return;
        console.log("Next service slide triggered. Current slide before increment:", currentSlide);
        currentSlide = (currentSlide + 1) % slides.length;
        showSlide(currentSlide);
    }

    function prevSlide() {
        if (slides.length === 0) return;
        console.log("Previous service slide triggered. Current slide before decrement:", currentSlide);
        currentSlide = (currentSlide - 1 + slides.length) % slides.length;
        showSlide(currentSlide);
    }

    function goToSlide(index) {
        if (slides.length === 0) return;
        console.log(`Go to specific service slide: ${index}`);
        currentSlide = index;
        showSlide(currentSlide);
    }

    function startAutoSlide() {
        if (slides.length === 0) {
            console.warn("Cannot start auto-slide for services: No slides found.");
            return;
        }
        console.log("Attempting to start auto-slide for services.");
        if (!slideInterval) { // Prevent multiple intervals
            slideInterval = setInterval(nextSlide, intervalTime);
            if (playPauseIcon) { // Defensive check
                playPauseIcon.classList.remove('fa-play');
                playPauseIcon.classList.add('fa-pause');
            }
            if (playPauseBtn) { // Defensive check
                playPauseBtn.setAttribute('aria-label', 'Pause slideshow');
            }
            console.log("Service slideInterval set, ID:", slideInterval);
        } else {
            console.log("Service slideInterval already running. Not restarting.");
        }
    }

    function pauseAutoSlide() {
        console.log("Pausing auto-slide for services.");
        clearInterval(slideInterval);
        slideInterval = null; // Reset interval
        if (playPauseIcon) { // Defensive check
            playPauseIcon.classList.remove('fa-pause');
            playPauseIcon.classList.add('fa-play');
        }
        if (playPauseBtn) { // Defensive check
            playPauseBtn.setAttribute('aria-label', 'Play slideshow');
        }
        console.log("Service slideInterval cleared.");
    }

    // Event listeners for service carousel controls
    if (prevBtn) {
        prevBtn.addEventListener('click', () => {
            prevSlide();
            pauseAutoSlide();
        });
    }

    if (nextBtn) {
        nextBtn.addEventListener('click', () => {
            nextSlide();
            pauseAutoSlide();
        });
    }

    if (playPauseBtn) {
        playPauseBtn.addEventListener('click', () => {
            if (slideInterval) {
                pauseAutoSlide();
            } else {
                startAutoSlide();
            }
        });
    }

    // Initialize services carousel
    if (slides.length > 0) { // Only initialize if slides exist
        showSlide(currentSlide);
        startAutoSlide();
    } else {
        console.warn("No service slides found to initialize carousel.");
    }


    // MODAL FUNCTIONALITY
    const moreDetailsButtons = document.querySelectorAll('.more-details-btn');
    const closeButtons = document.querySelectorAll('.modal .close-button');
    const modals = document.querySelectorAll('.modal');
    let lastFocusedElement = null; // To store element that opened the modal

    moreDetailsButtons.forEach(button => {
        button.addEventListener('click', () => {
            const serviceId = button.dataset.service;
            const modal = document.getElementById(`modal-${serviceId}`);
            if (modal) {
                lastFocusedElement = button; // Store reference to the button that opened the modal
                modal.classList.add('show');
                document.body.style.overflow = 'hidden'; // Prevent scrolling background
                modal.focus(); // Set focus to the modal itself (it has tabindex="-1")
                console.log(`Modal for ${serviceId} opened. Focus set.`);
            }
        });
    });

    closeButtons.forEach(button => {
        button.addEventListener('click', () => {
            const modal = button.closest('.modal');
            if (modal) {
                modal.classList.remove('show');
                document.body.style.overflow = ''; // Restore scrolling
                if (lastFocusedElement) {
                    lastFocusedElement.focus(); // Return focus to element that opened modal
                    lastFocusedElement = null; // Clear reference
                }
                console.log("Modal closed.");
            }
        });
    });

    // Close modal if clicking outside modal content
    modals.forEach(modal => {
        modal.addEventListener('click', (e) => {
            if (e.target === modal) { // Check if the click was directly on the overlay
                modal.classList.remove('show');
                document.body.style.overflow = '';
                if (lastFocusedElement) {
                    lastFocusedElement.focus();
                    lastFocusedElement = null;
                }
                console.log("Modal closed by clicking outside.");
            }
        });
    });

    // Close modal with Escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            modals.forEach(modal => {
                if (modal.classList.contains('show')) { // Only close if modal is currently open
                    modal.classList.remove('show');
                    document.body.style.overflow = '';
                    if (lastFocusedElement) {
                        lastFocusedElement.focus();
                        lastFocusedElement = null;
                    }
                    console.log("Modal closed by Escape key.");
                }
            });
        }
    });

    // Handle 'Price Plans' button to link to contact form with pre-filled subject
    document.querySelectorAll('.price-plans-btn').forEach(button => {
        button.addEventListener('click', (e) => {
            // Get the service name from the parent slide's h3 or data attribute
            // This regex now robustly removes any <i> tags and surrounding whitespace
            const serviceName = e.target.closest('.carousel-slide').querySelector('h3').textContent.trim().replace(/\s*<i[^>]*>.*?<\/i>\s*/g, '').trim();
            const subjectInput = document.getElementById('subject');
            if (subjectInput) {
                subjectInput.value = `Enquiry about Pricing for ${serviceName}`;
                // Optional: Focus on message after setting subject
                document.getElementById('message').focus();
            }
            // Smooth scroll to contact section
            document.querySelector(e.target.getAttribute('href')).scrollIntoView({
                behavior: 'smooth'
            });
            console.log(`Price Plans button clicked for: ${serviceName}`);
        });
    });

    // Adjust modal contact button to also pre-fill subject
    document.querySelectorAll('.modal-contact-btn').forEach(button => {
        button.addEventListener('click', (e) => {
            const modal = e.target.closest('.modal');
            if (modal) {
                modal.classList.remove('show');
                document.body.style.overflow = '';
                if (lastFocusedElement) { // If modal closed via this button, return focus to its opener
                    lastFocusedElement.focus();
                    lastFocusedElement = null;
                }
            }

            // Get the service name from the modal's h3
            const serviceName = e.target.closest('.modal-content').querySelector('h3').textContent.replace(': Deep Dive', '').trim();
            const subjectInput = document.getElementById('subject');
            if (subjectInput) {
                subjectInput.value = `Enquiry about ${serviceName}`;
                document.getElementById('message').focus();
            }
            // Smooth scroll to contact section
            document.querySelector(e.target.getAttribute('href')).scrollIntoView({
                behavior: 'smooth'
            });
            console.log(`Modal contact button clicked for: ${serviceName}`);
        });
    });


    // Team Carousel Functionality (mirroring services carousel logic)
    const teamSlides = document.querySelectorAll('.team-carousel-slide');
    const teamDotsContainer = document.querySelector('.team-carousel-dots');
    const teamPrevBtn = document.querySelector('.team-prev-btn');
    const teamNextBtn = document.querySelector('.team-next-btn');
    const teamPlayPauseBtn = document.querySelector('.team-carousel-play-pause');
    // Defensive check
    const teamPlayPauseIcon = teamPlayPauseBtn ? teamPlayPauseBtn.querySelector('i') : null;
    const teamCarouselContainer = document.querySelector('.team-carousel-container');

    console.log("Team Carousel elements found:");
    console.log({
        teamSlidesCount: teamSlides.length,
        teamDotsContainerExists: !!teamDotsContainer,
        teamPrevBtnExists: !!teamPrevBtn,
        teamNextBtnExists: !!teamNextBtn,
        teamPlayPauseBtnExists: !!teamPlayPauseBtn
    });

    let currentTeamSlide = 0;
    let teamSlideInterval;
    const teamIntervalTime = 7000; // 7 seconds for team slides, slightly longer

    if (teamCarouselContainer) {
        teamCarouselContainer.setAttribute('aria-live', 'polite');
    }

    const teamDots = []; // Array to store team dot elements
    if (teamDotsContainer) { // Only proceed if teamDotsContainer exists
        teamSlides.forEach((_, index) => {
            const dot = document.createElement('span');
            dot.classList.add('team-carousel-dot');
            dot.setAttribute('role', 'button');
            dot.setAttribute('aria-label', `Go to team member slide ${index + 1}`);
            if (index === 0) {
                dot.classList.add('active');
                dot.setAttribute('aria-current', 'true');
            }
            dot.addEventListener('click', () => {
                console.log(`Team Dot ${index} clicked.`);
                goToTeamSlide(index);
                pauseAutoTeamSlide();
            });
            teamDotsContainer.appendChild(dot);
            teamDots.push(dot); // Add to our team dots array
        });
        console.log("Team dots created:", teamDots.length);
    } else {
        console.warn("Team dots container not found. Team carousel dots will not function.");
    }


    function showTeamSlide(index) {
        if (teamSlides.length === 0) {
            console.warn("showTeamSlide called but no team slides found.");
            return;
        }
        console.log(`Showing team slide: ${index}`);

        teamSlides.forEach((slide, i) => {
            slide.classList.remove('active');
            slide.setAttribute('aria-hidden', 'true'); // Hide inactive slides
            if (teamDots[i]) { // Defensive check
                teamDots[i].classList.remove('active');
                teamDots[i].removeAttribute('aria-current');
            }
        });

        if (teamSlides[index]) { // Defensive check
            teamSlides[index].classList.add('active');
            teamSlides[index].removeAttribute('aria-hidden'); // Make active slide visible
        }
        if (teamDots[index]) { // Defensive check
            teamDots[index].classList.add('active');
            teamDots[index].setAttribute('aria-current', 'true');
        }
    }

    function nextTeamSlide() {
        if (teamSlides.length === 0) return;
        console.log("Next team slide triggered. Current slide before increment:", currentTeamSlide);
        currentTeamSlide = (currentTeamSlide + 1) % teamSlides.length;
        showTeamSlide(currentTeamSlide);
    }

    function prevTeamSlide() {
        if (teamSlides.length === 0) return;
        console.log("Previous team slide triggered. Current slide before decrement:", currentTeamSlide);
        currentTeamSlide = (currentTeamSlide - 1 + teamSlides.length) % teamSlides.length;
        showTeamSlide(currentTeamSlide);
    }

    function goToTeamSlide(index) {
        if (teamSlides.length === 0) return;
        console.log(`Go to specific team slide: ${index}`);
        currentTeamSlide = index;
        showTeamSlide(currentTeamSlide);
    }

    function startAutoTeamSlide() {
        if (teamSlides.length === 0) {
            console.warn("Cannot start auto-slide for team: No slides found.");
            return;
        }
        console.log("Attempting to start auto-slide for team.");
        if (!teamSlideInterval) {
            teamSlideInterval = setInterval(nextTeamSlide, teamIntervalTime);
            if (teamPlayPauseIcon) { // Defensive check
                teamPlayPauseIcon.classList.remove('fa-play');
                teamPlayPauseIcon.classList.add('fa-pause');
            }
            if (teamPlayPauseBtn) { // Defensive check
                teamPlayPauseBtn.setAttribute('aria-label', 'Pause team slideshow');
            }
            console.log("Team slideInterval set, ID:", teamSlideInterval);
        } else {
            console.log("Team slideInterval already running. Not restarting.");
        }
    }

    function pauseAutoTeamSlide() {
        console.log("Pausing auto-slide for team.");
        clearInterval(teamSlideInterval);
        teamSlideInterval = null;
        if (teamPlayPauseIcon) { // Defensive check
            teamPlayPauseIcon.classList.remove('fa-pause');
            teamPlayPauseIcon.classList.add('fa-play');
        }
        if (teamPlayPauseBtn) { // Defensive check
            teamPlayPauseBtn.setAttribute('aria-label', 'Play team slideshow');
        }
        console.log("Team slideInterval cleared.");
    }

    // Event listeners for team carousel controls
    if (teamPrevBtn) {
        teamPrevBtn.addEventListener('click', () => {
            prevTeamSlide();
            pauseAutoTeamSlide();
        });
    }

    if (teamNextBtn) {
        teamNextBtn.addEventListener('click', () => {
            nextTeamSlide(); // Corrected to call nextTeamSlide()
            pauseAutoTeamSlide();
        });
    }

    if (teamPlayPauseBtn) {
        teamPlayPauseBtn.addEventListener('click', () => {
            if (teamSlideInterval) {
                pauseAutoTeamSlide();
            } else {
                startAutoTeamSlide();
            }
        });
    }

    // Initialize team carousel
    if (teamSlides.length > 0) { // Only initialize if slides exist
        showTeamSlide(currentTeamSlide);
        startAutoTeamSlide();
    } else {
        console.warn("No team slides found to initialize carousel.");
    }
});
