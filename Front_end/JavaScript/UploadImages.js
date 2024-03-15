async function uploadImageToAPI(image) {
    const url = 'http://localhost:3000/api/uploadImage';
    const formData = new FormData();

    // Agregar la imagen al FormData
    formData.append('file', image, image.name);

    try {
        const response = await fetch(url, {
            method: 'POST',
            body: formData
        });

        if (!response.ok) {
            throw new Error('Error al subir la imagen ' + image.name + ': ' + response.statusText);
        }

        // Parsear la respuesta para obtener el nombre de la imagen
        const responseData = await response.json();
        const imageName = responseData.fileName;

        return imageName;
    } catch (error) {
        // Manejar errores
        console.error('Error al subir la imagen ' + image.name + ': ' + error.message);
        return null;
    }
}

async function uploadAllImagesToAPI(images) {
    const imagesToUpload = Object.values(images);
    const successfulUploads = [];

    for (const image of imagesToUpload) {
        try {
            const imageName = await uploadImageToAPI(image);
            if (imageName !== null) {
                successfulUploads.push(imageName);
            }
        } catch (error) {
            console.error('Error al subir una imagen:', error.message);
        }
    }
    return successfulUploads;
}

export {uploadAllImagesToAPI};