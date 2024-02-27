let slideIndex = 1;

function showSlides(n,componentID) {
    const slides = document.querySelectorAll(componentID);
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
    showSlides(slideIndex,componentID);
}
