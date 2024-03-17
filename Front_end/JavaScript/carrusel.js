let slideIndex = 1;
let componentId;

function showSlides(n) {
    const slides = document.querySelectorAll(componentId);
    if (n > slides.length) {
        slideIndex = 1;
    }
    if (n < 1) {
        slideIndex = slides.length;
    }
    for (let i = 0; i < slides.length; i++) {
        slides[i].style.display = 'none';
    }
    slides[slideIndex - 1].style.display = 'block';
}

function moveCarousel(n) {
    showSlides(slideIndex += n);
}

function initCarousel(componentID) {
    componentId = componentID;
    showSlides(slideIndex);
}



