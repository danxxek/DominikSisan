/* ==========================================================
   MOBILE MENU
========================================================== */

const menuButton =
    document.querySelector(".menu-toggle");

const navLinks =
    document.querySelector(".nav-links");


function closeMenu(){

    if(!menuButton || !navLinks){
        return;
    }

    navLinks.classList.remove("active");

    menuButton.classList.remove("active");

    menuButton.setAttribute(
        "aria-expanded",
        "false"
    );

    document.body.classList.remove(
        "menu-open"
    );

}


function toggleMenu(){

    if(!menuButton || !navLinks){
        return;
    }

    const isOpen =
        navLinks.classList.toggle("active");


    menuButton.classList.toggle(
        "active",
        isOpen
    );


    menuButton.setAttribute(
        "aria-expanded",
        String(isOpen)
    );


    document.body.classList.toggle(
        "menu-open",
        isOpen
    );

}


if(menuButton){

    menuButton.addEventListener(
        "click",
        toggleMenu
    );

}


document
    .querySelectorAll(".nav-links a")
    .forEach(link => {

        link.addEventListener(
            "click",
            closeMenu
        );

    });


document.addEventListener(
    "keydown",
    event => {

        if(event.key === "Escape"){

            closeMenu();

        }

    }
);


window.addEventListener(
    "resize",
    () => {

        if(window.innerWidth > 992){

            closeMenu();

        }

    }
);



/* ==========================================================
   STICKY HEADER
========================================================== */

const header =
    document.querySelector(".header");


function updateHeader(){

    if(!header){
        return;
    }


    if(window.scrollY > 80){

        header.classList.add(
            "scrolled"
        );

    }else{

        header.classList.remove(
            "scrolled"
        );

    }

}


window.addEventListener(
    "scroll",
    updateHeader,
    {
        passive:true
    }
);


updateHeader();



/* ==========================================================
   ACTIVE NAVIGATION
========================================================== */

const sections =
    document.querySelectorAll(
        "main section[id]"
    );


const navigation =
    document.querySelectorAll(
        ".nav-links a"
    );


function updateActiveNavigation(){

    let current = "";


    sections.forEach(section => {

        const sectionTop =
            section.offsetTop - 180;


        if(
            window.scrollY >=
            sectionTop
        ){

            current =
                section.getAttribute(
                    "id"
                );

        }

    });


    navigation.forEach(link => {

        link.classList.remove(
            "active"
        );


        if(
            link.getAttribute("href") ===
            "#" + current
        ){

            link.classList.add(
                "active"
            );

        }

    });

}


window.addEventListener(
    "scroll",
    updateActiveNavigation,
    {
        passive:true
    }
);


updateActiveNavigation();



/* ==========================================================
   VIDEO MODAL
========================================================== */

const modal =
    document.getElementById(
        "videoModal"
    );


const video =
    document.getElementById(
        "localVideo"
    );


const closeVideo =
    document.getElementById(
        "closeVideo"
    );


const openVideoButtons = [

    document.getElementById(
        "videoBtn"
    ),

    document.getElementById(
        "videoBtn2"
    )

].filter(Boolean);



function openVideo(){

    if(!modal || !video){
        return;
    }


    modal.classList.add(
        "active"
    );


    document.body.style.overflow =
        "hidden";


    video.currentTime = 0;


    const playPromise =
        video.play();


    if(
        playPromise &&
        typeof playPromise.catch ===
        "function"
    ){

        playPromise.catch(() => {});

    }

}



function hideVideo(){

    if(!modal || !video){
        return;
    }


    video.pause();

    video.currentTime = 0;


    modal.classList.remove(
        "active"
    );


    document.body.style.overflow =
        "";

}



openVideoButtons.forEach(
    button => {

        button.addEventListener(
            "click",
            openVideo
        );

    }
);



if(closeVideo){

    closeVideo.addEventListener(
        "click",
        hideVideo
    );

}



if(modal){

    modal.addEventListener(
        "click",
        event => {

            if(
                event.target.classList
                    .contains(
                        "video-overlay"
                    )
            ){

                hideVideo();

            }

        }
    );

}



document.addEventListener(
    "keydown",
    event => {

        if(event.key === "Escape"){

            hideVideo();

        }

    }
);



/* ==========================================================
   SCROLL ANIMATIONS
========================================================== */

const observer =
    new IntersectionObserver(
        entries => {

            entries.forEach(
                entry => {

                    if(
                        entry.isIntersecting
                    ){

                        entry.target
                            .classList
                            .add("show");

                        observer.unobserve(
                            entry.target
                        );

                    }

                }
            );

        },
        {
            threshold:.15
        }
    );


document
    .querySelectorAll(
        ".service-card, .about-card, .cta"
    )
    .forEach(
        element => {

            element.classList.add(
                "hidden"
            );

            observer.observe(
                element
            );

        }
    );



/* ==========================================================
   BUTTON MOUSE EFFECT
========================================================== */

document
    .querySelectorAll(".button")
    .forEach(
        button => {

            button.addEventListener(
                "mousemove",
                event => {

                    const rect =
                        button.getBoundingClientRect();


                    const x =
                        event.clientX -
                        rect.left;


                    const y =
                        event.clientY -
                        rect.top;


                    button.style.setProperty(
                        "--x",
                        `${x}px`
                    );


                    button.style.setProperty(
                        "--y",
                        `${y}px`
                    );

                }
            );

        }
    );



/* ==========================================================
   REVIEWS CAROUSEL
========================================================== */

const reviewsTrack =
    document.querySelector(
        ".reviews-track"
    );


const reviewCards =
    [
        ...document.querySelectorAll(
            ".review-card"
        )
    ];


const prevReview =
    document.querySelector(
        ".reviews-prev"
    );


const nextReview =
    document.querySelector(
        ".reviews-next"
    );


const reviewDots =
    [
        ...document.querySelectorAll(
            ".review-dot"
        )
    ];


const reviewsCarousel =
    document.querySelector(
        ".reviews-carousel"
    );



let currentReview = 0;

let reviewTimer = null;

let touchStartX = 0;

let touchStartY = 0;



/* ==========================================================
   VISIBLE CARDS
========================================================== */

function getVisibleCards(){

    const width =
        window.innerWidth;


    if(width < 769){

        return 1;

    }


    if(width < 1200){

        return 2;

    }


    return 3;

}



/* ==========================================================
   MAX INDEX
========================================================== */

function getMaxReviewIndex(){

    return Math.max(
        0,
        reviewCards.length -
        getVisibleCards()
    );

}



/* ==========================================================
   UPDATE CAROUSEL
========================================================== */

function updateReviewCarousel(){

    if(
        !reviewsTrack ||
        !reviewCards.length
    ){

        return;

    }


    const cardWidth =
        reviewCards[0]
            .getBoundingClientRect()
            .width;


    const gap =
        parseFloat(
            getComputedStyle(
                reviewsTrack
            ).gap
        ) || 0;


    const maxIndex =
        getMaxReviewIndex();


    currentReview =
        Math.min(
            currentReview,
            maxIndex
        );


    const offset =
        currentReview *
        (
            cardWidth +
            gap
        );


    reviewsTrack.style.transform =
        `translate3d(
            -${offset}px,
            0,
            0
        )`;


    reviewDots.forEach(
        (dot,index) => {

            dot.classList.toggle(
                "active",
                index ===
                currentReview
            );

        }
    );

}



/* ==========================================================
   NEXT
========================================================== */

function nextReviewSlide(){

    const maxIndex =
        getMaxReviewIndex();


    if(maxIndex === 0){

        return;

    }


    if(
        currentReview >=
        maxIndex
    ){

        currentReview = 0;

    }else{

        currentReview++;

    }


    updateReviewCarousel();

    restartReviewTimer();

}



/* ==========================================================
   PREVIOUS
========================================================== */

function previousReviewSlide(){

    const maxIndex =
        getMaxReviewIndex();


    if(maxIndex === 0){

        return;

    }


    if(currentReview <= 0){

        currentReview =
            maxIndex;

    }else{

        currentReview--;

    }


    updateReviewCarousel();

    restartReviewTimer();

}



/* ==========================================================
   ARROW BUTTONS
========================================================== */

if(nextReview){

    nextReview.addEventListener(
        "click",
        nextReviewSlide
    );

}


if(prevReview){

    prevReview.addEventListener(
        "click",
        previousReviewSlide
    );

}



/* ==========================================================
   DOTS
========================================================== */

reviewDots.forEach(
    (dot,index) => {

        dot.addEventListener(
            "click",
            () => {

                const maxIndex =
                    getMaxReviewIndex();


                currentReview =
                    Math.min(
                        index,
                        maxIndex
                    );


                updateReviewCarousel();

                restartReviewTimer();

            }
        );

    }
);



/* ==========================================================
   AUTOPLAY
========================================================== */

function startReviewTimer(){

    stopReviewTimer();


    if(
        reviewCards.length <=
        getVisibleCards()
    ){

        return;

    }


    reviewTimer =
        setInterval(
            () => {

                const maxIndex =
                    getMaxReviewIndex();


                if(
                    currentReview >=
                    maxIndex
                ){

                    currentReview = 0;

                }else{

                    currentReview++;

                }


                updateReviewCarousel();

            },
            6000
        );

}



function stopReviewTimer(){

    if(reviewTimer){

        clearInterval(
            reviewTimer
        );

        reviewTimer = null;

    }

}



function restartReviewTimer(){

    stopReviewTimer();

    startReviewTimer();

}



/* ==========================================================
   PAUSE ON HOVER
========================================================== */

if(reviewsCarousel){

    reviewsCarousel.addEventListener(
        "mouseenter",
        stopReviewTimer
    );


    reviewsCarousel.addEventListener(
        "mouseleave",
        startReviewTimer
    );

}



/* ==========================================================
   TOUCH / SWIPE
========================================================== */

if(reviewsCarousel){

    reviewsCarousel.addEventListener(
        "touchstart",
        event => {

            const touch =
                event.changedTouches[0];


            touchStartX =
                touch.clientX;


            touchStartY =
                touch.clientY;


            stopReviewTimer();

        },
        {
            passive:true
        }
    );


    reviewsCarousel.addEventListener(
        "touchend",
        event => {

            const touch =
                event.changedTouches[0];


            const endX =
                touch.clientX;


            const endY =
                touch.clientY;


            const deltaX =
                touchStartX -
                endX;


            const deltaY =
                touchStartY -
                endY;


            /*
             * Reagujeme pouze na
             * horizontální gesto.
             */

            if(
                Math.abs(deltaX) >
                Math.abs(deltaY) &&
                Math.abs(deltaX) > 45
            ){

                if(deltaX > 0){

                    nextReviewSlide();

                }else{

                    previousReviewSlide();

                }

            }


            startReviewTimer();

        },
        {
            passive:true
        }
    );

}



/* ==========================================================
   RESIZE
========================================================== */

let resizeTimer = null;


window.addEventListener(
    "resize",
    () => {

        clearTimeout(
            resizeTimer
        );


        resizeTimer =
            setTimeout(
                () => {

                    const maxIndex =
                        getMaxReviewIndex();


                    if(
                        currentReview >
                        maxIndex
                    ){

                        currentReview =
                            maxIndex;

                    }


                    updateReviewCarousel();

                    restartReviewTimer();

                },
                150
            );

    }
);



/* ==========================================================
   INITIALIZE
========================================================== */

window.addEventListener(
    "load",
    () => {

        updateReviewCarousel();

        startReviewTimer();

    }
);