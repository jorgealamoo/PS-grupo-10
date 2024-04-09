function cargarTemplate(url, selector) {
    fetch(url)
        .then(response => {
            return response.text();
        })
        .then(data => {
            let container = document.querySelector(selector);
            container.innerHTML = data;
            if (selector === "#desktopHeader") {
                loadProfilePhoto("ProfileImageHEADER");
                let currentPageUrl = window.location.href;
                currentPageUrl = ".." + currentPageUrl.substring(44);
                const navLinks = document.querySelectorAll("#nav-bar a");
                navLinks.forEach(function (link) {
                    if (link.getAttribute("href") === currentPageUrl) {
                        link.style.textDecoration = "underline";
                        link.style.color = "green";
                    }
                });
            }
        })
        .catch(error => {
            console.error('Error al cargar el template:', error);
        });
}
