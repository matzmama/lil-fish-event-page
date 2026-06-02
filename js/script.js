/* =========================
   BACK TO TOP
========================= */

window.onscroll = function () {

    scrollFunction();

};

function scrollFunction() {

    const topBtn =
        document.getElementById("topBtn");

    // ONLY RUN IF BUTTON EXISTS
    if (!topBtn) return;

    if (
        document.body.scrollTop > 300 ||
        document.documentElement.scrollTop > 300
    ) {

        topBtn.style.display = "block";

    } else {

        topBtn.style.display = "none";

    }

}

// SMOOTH SCROLL TO TOP
function topFunction() {

    window.scrollTo({

        top: 0,

        behavior: "smooth"

    });

}

/* =========================
   MOBILE NAVIGATION
========================= */

const hamburger =
    document.getElementById("hamburger");

const navLinks =
    document.getElementById("navLinks");

hamburger.addEventListener("click", () => {

    navLinks.classList.toggle("show");

});

/* =========================
   GALLERY LIGHTBOX
========================= */

const galleryImages =
    document.querySelectorAll(".gallery-grid img");

// ONLY RUN ON GALLERY PAGE
if (galleryImages.length > 0) {

    // CREATE LIGHTBOX
    const lightbox =
        document.createElement("div");

    lightbox.classList.add("lightbox");

    document.body.appendChild(lightbox);

    // CREATE IMAGE
    const lightboxImg =
        document.createElement("img");

    lightboxImg.classList.add("lightbox-content");

    lightbox.appendChild(lightboxImg);

    // CLICK IMAGE
    galleryImages.forEach(image => {

        image.addEventListener("click", () => {

            // SHOW LIGHTBOX
            lightbox.style.display = "flex";

            // SET IMAGE
            lightboxImg.src = image.src;

            // REMOVE OLD ORIENTATION CLASSES
            lightboxImg.classList.remove(
                "landscape",
                "portrait"
            );

            // WAIT FOR IMAGE TO LOAD
            lightboxImg.onload = function () {

                // LANDSCAPE IMAGE
                if (
                    lightboxImg.naturalWidth >
                    lightboxImg.naturalHeight
                ) {

                    lightboxImg.classList.add(
                        "landscape"
                    );

                } else {

                    // PORTRAIT IMAGE
                    lightboxImg.classList.add(
                        "portrait"
                    );

                }

            };

        });

    });

    // CLOSE LIGHTBOX
    lightbox.addEventListener("click", () => {

        lightbox.style.display = "none";

    });

}

/* =========================
   EVENT FILTERING
========================= */

const filterButtons =
    document.querySelectorAll(".filter-btn");

const filterCards =
    document.querySelectorAll(".card");

// ONLY RUN ON EVENTS PAGE
if (
    filterButtons.length > 0 &&
    filterCards.length > 0
) {

    filterButtons.forEach(button => {

        button.addEventListener("click", () => {

            // REMOVE ACTIVE STATE
            filterButtons.forEach(btn => {

                btn.classList.remove("active");

            });

            // ADD ACTIVE STATE
            button.classList.add("active");

            const filter =
                button.dataset.filter;

            filterCards.forEach(card => {

                const category =
                    card.dataset.category;

                // SHOW MATCHING CARDS
                if (
                    filter === "all" ||
                    category === filter
                ) {

                    card.style.display = "block";

                } else {

                    card.style.display = "none";

                }

            });

        });

    });

}
/* =========================
   EVENT COUNTDOWN TIMERS
========================= */

const countdowns =
    document.querySelectorAll(".countdown");

// ONLY RUN IF COUNTDOWNS EXIST
if (countdowns.length > 0) {

    function updateCountdowns() {

        countdowns.forEach(countdown => {

            const eventDate =
                new Date(
                    countdown.dataset.date
                ).getTime();

            const now =
                new Date().getTime();

            const distance =
                eventDate - now;

            // TIME CALCULATIONS
            const days =
                Math.floor(
                    distance /
                    (1000 * 60 * 60 * 24)
                );

            const hours =
                Math.floor(
                    (
                        distance %
                        (1000 * 60 * 60 * 24)
                    ) /
                    (1000 * 60 * 60)
                );

            const minutes =
                Math.floor(
                    (
                        distance %
                        (1000 * 60 * 60)
                    ) /
                    (1000 * 60)
                );

            // DISPLAY
            if (distance > 0) {

                countdown.innerHTML = `
                    Starts In:
                    ${days}d
                    ${hours}h
                    ${minutes}m
                `;

            } else {

                countdown.innerHTML =
                    "Event Started";

            }

        });

    }

    // INITIAL RUN
    updateCountdowns();

    // UPDATE EVERY MINUTE
    setInterval(
        updateCountdowns,
        60000
    );

}/* =========================
   SCROLL REVEAL
========================= */

const revealElements =
    document.querySelectorAll(".reveal");

function revealOnScroll() {

    const windowHeight =
        window.innerHeight;

    revealElements.forEach(element => {

        const elementTop =
            element.getBoundingClientRect().top;

        const revealPoint = 100;

        if (elementTop < windowHeight - revealPoint) {

            element.classList.add("active");

        }

    });

}

window.addEventListener(
    "scroll",
    revealOnScroll
);

// RUN ON PAGE LOAD
revealOnScroll();

/* =========================
   ACTIVE NAVIGATION
========================= */

const currentPage =
    window.location.pathname.split("/").pop();

const navItems =
    document.querySelectorAll("#navLinks a");

navItems.forEach(link => {

    const linkPage =
        link.getAttribute("href");

    if (linkPage === currentPage) {

        link.classList.add("active-page");

    }

});
/* =========================
   SEASONAL THEME SYSTEM
========================= */

const themeToggle =
    document.getElementById("themeToggle");

// AVAILABLE THEMES
const themes = [

     "default-theme",
    "spring-theme",
    "summer-theme",
    "autumn-theme",
    "winter-theme",
    "concert-theme"

];

// THEME ICONS
const themeIcons = {

    "default-theme": "✨",
    "spring-theme": "🌸",
    "summer-theme": "☀️",
    "autumn-theme": "🍂",
    "winter-theme": "❄️",
    "concert-theme": "🎶"

};

// STARTING THEME
let currentThemeIndex = 0;

// LOAD SAVED THEME
const savedTheme =
    localStorage.getItem("theme");

// IF SAVED THEME EXISTS
if (
    savedTheme &&
    themes.includes(savedTheme)
) {

    currentThemeIndex =
        themes.indexOf(savedTheme);

    document.body.classList.add(
        savedTheme
    );

} else {

    // DEFAULT THEME
    document.body.classList.add(
        themes[0]
    );

}

// UPDATE BUTTON ICON
function updateThemeIcon() {

    const activeTheme =
        themes[currentThemeIndex];

    themeToggle.innerHTML =
        themeIcons[activeTheme];

}

// INITIAL ICON
updateThemeIcon();

// THEME SWITCHER
themeToggle.addEventListener("click", () => {

    // REMOVE CURRENT THEMES
    themes.forEach(theme => {

        document.body.classList.remove(theme);

    });

    // NEXT THEME
    currentThemeIndex++;

    // LOOP TO START
    if (
        currentThemeIndex >= themes.length
    ) {

        currentThemeIndex = 0;

    }

    // APPLY NEW THEME
    const nextTheme =
        themes[currentThemeIndex];

    document.body.classList.add(
        nextTheme
    );

    // SAVE THEME
    localStorage.setItem(
        "theme",
        nextTheme
    );

    // UPDATE ICON
    updateThemeIcon();

});
/* =========================
   FORM VALIDATION
========================= */

const contactForm =
    document.getElementById("contactForm");

if (contactForm) {

    contactForm.addEventListener(
        "submit",
        function (e) {

            e.preventDefault();

            // INPUTS
            const name =
                document.getElementById("name");

            const email =
                document.getElementById("email");

            const message =
                document.getElementById("message");

            const formMessage =
                document.getElementById("formMessage");

            // RESET STYLES
            [name, email, message].forEach(field => {

                field.classList.remove(
                    "error",
                    "success"
                );

            });

            let isValid = true;

            // NAME VALIDATION
            if (
                name.value.trim() === ""
            ) {

                name.classList.add("error");

                isValid = false;

            } else {

                name.classList.add("success");

            }

            // EMAIL VALIDATION
            const emailPattern =
                /^[^ ]+@[^ ]+\.[a-z]{2,3}$/;

            if (
                !email.value.match(emailPattern)
            ) {

                email.classList.add("error");

                isValid = false;

            } else {

                email.classList.add("success");

            }

            // MESSAGE VALIDATION
            if (
                message.value.trim() === ""
            ) {

                message.classList.add("error");

                isValid = false;

            } else {

                message.classList.add("success");

            }

            // FINAL RESULT
            if (isValid) {

                formMessage.innerHTML =
                    "✅ Message sent successfully!";

                formMessage.style.color =
                    "#5cb85c";

                contactForm.reset();

            } else {

                formMessage.innerHTML =
                    "❌ Please complete all fields correctly.";

                formMessage.style.color =
                    "#d9534f";

            }

        }
    );

}