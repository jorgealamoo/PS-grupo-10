// Call checkAuth function when the dashboard page is loaded
document.addEventListener('DOMContentLoaded', checkAuth);



document.addEventListener('DOMContentLoaded', async function() {
    var dataJSON = null
    async function fetchDocument() {
        try {
            const userId = localStorage.getItem('viewAccountId');
            const response = await fetch('http://localhost:3000/api/getDocument/usuario/' + userId);
            if (!response.ok) {
                throw new Error('Failed to fetch document');
            }
            const data = await response.json();
            dataJSON = data
            return data;
        } catch (error) {
            console.error('Error fetching document:', error.message);
            return null;
        }
    }

    async function fetchPublicationData(publicationID) {
        try {
            const response = await fetch('http://localhost:3000/api/getDocument/publicacion/' + publicationID);
            if (!response.ok) {
                throw new Error('Failed to fetch document');
            }
            const data = await response.json();
            return data;
        } catch (error) {
            console.error('Error fetching document:', error.message);
            return null;
        }
    }

    async function fetchImage(documentData) {
        try {
            const response = await fetch('http://localhost:3000/api/getImage/' + documentData['photoPerfil']);
            if (!response.ok) {
                throw new Error('Failed to fetch image');
            }
            const data = await response.json();
            return data.imageUrl;
        } catch (error) {
            console.error('Error fetching image:', error.message);
            return null;
        }
    }

    async function fetchPublicationImage(image) {
        try {
            const response = await fetch('http://localhost:3000/api/getImage/' + image);
            if (!response.ok) {
                throw new Error('Failed to fetch image');
            }
            const data = await response.json();
            return data.imageUrl;
        } catch (error) {
            console.error('Error fetching image:', error.message);
            return null;
        }
    }

    async function displayDocumentData() {
        const userId = localStorage.getItem('userId');
        const viewingID = localStorage.getItem('viewAccountId');

        if (userId == viewingID) {
            window.location.href = "../Account/account.html"
        }

        const documentData = await fetchDocument();
        if (documentData) {
            console.log(documentData);
            console.log(documentData['nombre']);
            // Update the name element's text content
            document.getElementById('name').innerHTML = "<b>" + documentData['usuario'] + "<b>";
            document.getElementById('seguidores').innerHTML = "<b>" + "Seguidores: " + documentData['lista_seguidores'].length + "<b>";
            console.log(documentData['lista_seguidores'])
            console.log(documentData['lista_siguiendo'])
            document.getElementById('siguiendo').innerHTML = "<b>" + "Siguiendo: " + documentData['lista_siguiendo'].length + "<b>";

            const imageUrl = await fetchImage(documentData);

            const profileImages = document.querySelectorAll('#user_img');

            // Iterate over each element
            if (profileImages.length > 0) {
                // Get the last ProfileImage element from the NodeList
                const lastProfileImage = profileImages[profileImages.length - 1];

                // Set the src attribute of the last ProfileImage element to the fetched image URL
                lastProfileImage.src = imageUrl;
            }


            const userId = localStorage.getItem('userId');
            if (dataJSON["lista_seguidores"].includes(userId)) {
                followButton.textContent = "Following";
            } else {
                followButton.textContent = "Follow";
            }


            //List element in page
            const listaPublicaciones = document.getElementById("listaPublicaciones");

            //Show Publications
            const lst_publications = documentData['lista_publicaciones']
            var count = 0

            for (publication in lst_publications) {
                fetchPublicationData(lst_publications[count])
                    .then(data => {
                        if (data) {
                            // Handle the data here
                            console.log(data);

                            const li = document.createElement("li");
                            const a = document.createElement("a");

                            const img = document.createElement("img");
                            console.log(data["lista_imagenes"][0])

                            fetchPublicationImage(data["lista_imagenes"][0])
                                .then(image => {
                                    if (image) {
                                        img.src = image
                                        img.alt = data["nombre"];
                                        img.id = data["id"]
                                    } else {
                                        // Handle the case where data is null
                                        console.log('Image not found');
                                    }
                                })
                                .catch(error => {
                                    console.error('Error:', error.message);
                                });

                            const span = document.createElement("span");
                            span.textContent = data["nombre"];

                            a.appendChild(img);
                            a.appendChild(span);
                            li.appendChild(a);
                            listaPublicaciones.appendChild(li);
                        } else {
                            // Handle the case where data is null
                            console.log('Publication data is null');
                        }
                    })
                    .catch(error => {
                        console.error('Error:', error.message);
                    });
                count += 1
            }

        }
    }



    // Get reference to the <ul> element
    const listaPublicaciones = document.getElementById("listaPublicaciones");

    // Add event listener to the <ul> element
    listaPublicaciones.addEventListener("click", function(event) {
        // Get the clicked element
        const clickedElement = event.target;

        //Only click on images
        if (clickedElement.tagName === "IMG") {
            localStorage.setItem('currentPublication', clickedElement.id);
            window.location.href = "../Publication/publication.html"
        }
    });



    async function updateUser() {
        try {
            const apiUrl = 'http://localhost:3000/api/changeDoc/usuario/' + dataJSON["id"] + '';
            const response = await fetch(apiUrl, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(dataJSON)
            });

            if (!response.ok) {
                throw new Error('Failed to update document');
            }

            const responseData = await response.json();
            console.log('Response:', responseData);
            console.log("SUCCESS");
            document.getElementById('seguidores').innerHTML = "<b>" + "Seguidores: " + dataJSON['lista_seguidores'].length + "<b>";
        } catch (error) {
            console.error('Error updating document:', error.message);
        }
    }


    // Get the button element by its class name
    var followButton = document.querySelector(".FollowButton");

    // Define a function to toggle the button text
    function toggleFollow() {
        const userId = localStorage.getItem('userId');
        if (followButton.textContent === "Follow") {
            var lista = dataJSON["lista_seguidores"];
            lista.push(userId);
            dataJSON["lista_seguidores"] = lista;
            updateUser();
            followButton.textContent = "Following";
        } else {
            try {
                if (!dataJSON["lista_seguidores"]) {
                    throw new Error('Property "lista_seguidores" does not exist in dataJSON');
                }

                const index = dataJSON["lista_seguidores"].indexOf(userId);
                if (index !== -1) {
                    dataJSON["lista_seguidores"].splice(index, 1);
                    console.log(`User ${userId} removed from lista_seguidores`);
                    updateUser();
                    followButton.textContent = "Follow";
                } else {
                    console.log(`User ${userId} not found in lista_seguidores`);
                }

                return dataJSON;
            } catch (error) {
                console.error('Error removing user from lista_seguidores:', error.message);
                return null;
            }
        }
    }

// Add click event listener to the button to call the toggleFollow function
    followButton.addEventListener("click", toggleFollow);



    // Call the displayDocumentData function to execute
    displayDocumentData();
});