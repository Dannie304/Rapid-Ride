 const teamMembers = [
            {
                image: "https://placehold.co/180x180/a0c4ff/ffffff?text=John+Doe",
                name: "John Doe",
                position: "Lead Developer"
            },
            {
                image: "https://placehold.co/180x180/bdb2ff/ffffff?text=Jane+Smith",
                name: "Jane Smith",
                position: "UI/UX Designer"
            },
            {
                image: "https://placehold.co/180x180/ffc6ff/ffffff?text=Peter+Jones",
                name: "Peter Jones",
                position: "Project Manager"
            },
            {
                image: "https://placehold.co/180x180/ffadad/ffffff?text=Alice+Brown",
                name: "Alice Brown",
                position: "Quality Assurance"
            },
            {
                image: "https://placehold.co/180x180/ffd6a5/ffffff?text=Bob+Williams",
                name: "Bob Williams",
                position: "Marketing Specialist"
            }
        ];

        let currentSlideIndex = 0; // Keep track of the current slide
        let isAnimating = false; // Flag to prevent multiple animations at once

        // Get DOM elements
        const slideshowContainer = document.getElementById('slideshow-container');
        const slideContent = document.getElementById('slide-content');
        const teamImage = document.getElementById('team-image');
        const teamName = document.getElementById('team-name');
        const teamPosition = document.getElementById('team-position');
        const prevBtn = document.getElementById('prev-btn');
        const nextBtn = document.getElementById('next-btn');
        const dotsContainer = document.getElementById('dots-container');

        /**
         * Displays the team member at the given index with a sliding animation.
         * @param {number} newIndex - The index of the team member to display.
         * @param {string} direction - 'next' for sliding left, 'prev' for sliding right.
         */
        function showSlide(newIndex, direction) {
            if (isAnimating) return; // Prevent animation overlap
            isAnimating = true;

            const oldIndex = currentSlideIndex;
            currentSlideIndex = (newIndex + teamMembers.length) % teamMembers.length;

            // Determine the initial off-screen position for the incoming slide
            const startPosition = direction === 'next' ? '100vw' : '-100vw';
            // Determine the end off-screen position for the outgoing slide
            const endPosition = direction === 'next' ? '-100vw' : '100vw';

            // 1. Start current slide moving off-screen
            slideContent.style.transform = `translateX(${endPosition})`;

            // Listen for the end of the first transition (current slide moving out)
            const transitionEndHandler = () => {
                slideContent.removeEventListener('transitionend', transitionEndHandler);

                // 2. Update content after the old slide is off-screen
                const member = teamMembers[currentSlideIndex];
                teamImage.src = member.image;
                teamName.textContent = member.name;
                teamPosition.textContent = member.position;

                // 3. Instantly move the updated slide to the starting off-screen position (no transition)
                slideContent.style.transition = 'none'; // Disable transition for instant jump
                slideContent.style.transform = `translateX(${startPosition})`;

                // Use requestAnimationFrame to ensure the browser applies the instant jump
                // before re-enabling transition and starting the slide-in animation
                requestAnimationFrame(() => {
                    requestAnimationFrame(() => {
                        // 4. Re-enable transition and slide the new content into view
                        slideContent.style.transition = 'transform 0.7s ease-in-out';
                        slideContent.style.transform = 'translateX(0)';

                        // Listen for the end of the second transition (new slide moving in)
                        const slideInEndHandler = () => {
                            slideContent.removeEventListener('transitionend', slideInEndHandler);
                            isAnimating = false; // Animation finished
                            updateDots(); // Update dots after full animation
                        };
                        slideContent.addEventListener('transitionend', slideInEndHandler);
                    });
                });
            };

            slideContent.addEventListener('transitionend', transitionEndHandler);
        }

        /**
         * Navigates to the previous slide.
         */
        function prevSlide() {
            showSlide(currentSlideIndex - 1, 'prev');
        }

        /**
         * Navigates to the next slide.
         */
        function nextSlide() {
            showSlide(currentSlideIndex + 1, 'next');
        }

        /**
         * Creates and appends dot indicators for each team member.
         */
        function createDots() {
            dotsContainer.innerHTML = ''; // Clear existing dots
            teamMembers.forEach((_, index) => {
                const dot = document.createElement('span');
                dot.classList.add('dot', 'w-4', 'h-4', 'bg-gray-300', 'rounded-full', 'cursor-pointer', 'hover:bg-gray-400');
                dot.dataset.index = index; // Store index for navigation
                dot.addEventListener('click', () => {
                    if (index > currentSlideIndex) {
                        showSlide(index, 'next');
                    } else if (index < currentSlideIndex) {
                        showSlide(index, 'prev');
                    }
                });
                dotsContainer.appendChild(dot);
            });
            updateDots(); // Set initial active dot
        }

        /**
         * Updates the active state of the dot indicators.
         */
        function updateDots() {
            const dots = dotsContainer.querySelectorAll('.dot');
            dots.forEach((dot, index) => {
                if (index === currentSlideIndex) {
                    dot.classList.add('active');
                } else {
                    dot.classList.remove('active');
                }
            });
        }

        // Add event listeners for navigation buttons
        prevBtn.addEventListener('click', prevSlide);
        nextBtn.addEventListener('click', nextSlide);

        // Initialize the slideshow when the window loads
        window.onload = function() {
            createDots(); // Create dots first
            // Display the first slide without animation initially
            const member = teamMembers[currentSlideIndex];
            teamImage.src = member.image;
            teamName.textContent = member.name;
            teamPosition.textContent = member.position;
            updateDots();
        };