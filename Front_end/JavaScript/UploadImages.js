async function uploadAllImagesToAPI(imageList) {
    const successfulUploads = [];

    // Iterar sobre cada imagen en la lista
    for (const imageDataURL of imageList) {
        try {
            // Cargar la imagen a la API
            const uploadedImageName = await uploadImageToAPI(imageDataURL);
            if (uploadedImageName !== null) {
                successfulUploads.push(uploadedImageName);
            }
        } catch (error) {
            console.error('Error al subir una imagen:', error.message);
        }
    }
    return successfulUploads;
}

async function uploadImageToAPI(imageDataURL) {
    const url = 'http://localhost:3000/api/uploadImage';
    const formData = new FormData();

    // Convertir el Data URL en un Blob
    const blob = dataURLtoBlob(imageDataURL);

    // Agregar la imagen al FormData
    formData.append('file', blob, 'image.png'); // Puedes ajustar el nombre del archivo según tu preferencia

    try {
        const response = await fetch(url, {
            method: 'POST',
            body: formData
        });

        if (!response.ok) {
            throw new Error('Error al subir la imagen: ' + response.statusText);
        }

        // Parsear la respuesta para obtener el nombre de la imagen
        const responseData = await response.json();
        const imageName = responseData.fileName;

        return imageName;
    } catch (error) {
        // Manejar errores
        console.error('Error al subir la imagen:', error.message);
        return null;
    }
}

// Función para convertir un Data URL en un Blob
function dataURLtoBlob(dataURL) {
    const arr = dataURL.split(',');
    const mime = arr[0].match(/:(.*?);/)[1];
    const bstr = atob(arr[1]);
    let n = bstr.length;
    const u8arr = new Uint8Array(n);
    while (n--) {
        u8arr[n] = bstr.charCodeAt(n);
    }
    return new Blob([u8arr], { type: mime });
}
export { uploadAllImagesToAPI };