async function loadAllPublication() {
    const  response = await fetch('http://localhost:3000/api/fetchData/publicacion/')
        .then(response =>{
            if(!response.ok){
                throw new Error('Network response was not ok');
            }
            return response.json();
        });
    return response;
}

async function loadMapInToList(publicationMap) {
    const response = await fetch(`http://localhost:3000/api/changeDoc/listas/publicaciones`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(publicationMap)
    });
}

async function updatePublicationList(){
    let publicationMap = {}
    const publications = await loadAllPublication();
    for (const publication of publications) {
        publicationMap[publication.publication_id] = publication.nombre;
    }
    await loadMapInToList({publicaciones:publicationMap});
}

updatePublicationList();