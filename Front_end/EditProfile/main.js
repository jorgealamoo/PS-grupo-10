// Call checkAuth function when the dashboard page is loaded
document.addEventListener('DOMContentLoaded', checkAuth);



document.addEventListener('DOMContentLoaded', async function() {
    const updateButton = document.getElementById('saveBtn');
    var dataJSON = null

    function toggleChangePassword() {
        var container = document.getElementById('changePasswordContainer');
        container.classList.toggle('active');
    }


    async function fetchDocument() {    //javier.obarreiro@gmai.com
        try {
            const userId = localStorage.getItem('userId');
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

    async function displayDocumentData() {
        const documentData = await fetchDocument();
        if (documentData) {
            console.log(documentData);
            console.log(documentData['nombre']);
            // Update the name element's text content
            document.getElementById('name').placeholder = documentData['nombre'];
            document.getElementById('username').placeholder = documentData['usuario'];

            const imageUrl = await fetchImage(documentData);

            const profileImages = document.querySelectorAll('#ProfileImage');

            // Iterate over each element
            if (profileImages.length > 0) {
                // Get the last ProfileImage element from the NodeList
                const lastProfileImage = profileImages[profileImages.length - 1];

                // Set the src attribute of the last ProfileImage element to the fetched image URL
                lastProfileImage.src = imageUrl;
            }
        }
    }

    updateButton.addEventListener('click', async function() {
        try {
            //Comprobar cambio de datos
            if (document.getElementById('username').value === "" && document.getElementById('name').value === "") {
                return;  //<---- Exit
            } else if (document.getElementById('name').value != "") {
                dataJSON['nombre'] = document.getElementById('name').value
                console.log("Cambio de Nombre");
            } else if (document.getElementById('username').value != "") {
                dataJSON['usuario'] = document.getElementById('username').value
                console.log("Cambio de Usuario");
            }


            const apiUrl = 'http://localhost:3000/api/changeDoc/usuario/' + dataJSON['userID'] + '';

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
            location.href = "../Account/account.html"; // Recargar la página
        } catch (error) {
            console.error('Error updating document:', error.message);
        }
    });


    //--------------------------- Change Profile Image ---------------------------
    document.getElementById('ProfileImageUpload').addEventListener('change', function() {
        // Get the file
        const file = this.files[0];

        // Create FormData object to send as multipart form data
        const formData = new FormData();
        formData.append('file', file);

        // Send the file to the API
        uploadImage(formData)
            .then(fileName => {
                console.log('Uploaded file:', fileName);
                // You can handle the response here
            })
            .catch(error => {
                console.error('Error uploading file:', error);
                // Handle error
            });
    });

    function uploadImage(formData) {
        return new Promise((resolve, reject) => {
            fetch('http://localhost:3000/api/uploadImage', {
                method: 'POST',
                body: formData
            })
                .then(response => {
                    if (!response.ok) {
                        throw new Error('Network response was not ok');
                    }
                    return response.json();
                })
                .then(data => {
                    resolve(data.fileName); // Assuming your API returns the file name
                    updateImage(data.fileName);
                })
                .catch(error => {
                    reject(error);
                });
        });
    }

    async function updateImage(imageName) {
        try {
            const apiUrl = 'http://localhost:3000/api/changeDoc/usuario/' + dataJSON['userID'] + '';

            dataJSON['photoPerfil'] = imageName.toString()

            const response = await fetch(apiUrl, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(dataJSON)
            });

            if (!response.ok) {
                throw new Error('Failed to update Image');
            }

            const responseData = await response.json();
            console.log('Response:', responseData);
            location.reload(); // Recargar la página
        } catch (error) {
            console.error('Error updating document:', error.message);
        }
    }


    // Call the displayDocumentData function to execute
    displayDocumentData();
});