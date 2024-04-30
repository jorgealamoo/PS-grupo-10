async function loadAllPublication(collection) {
    const response = await fetch('http://localhost:3000/api/fetchData/'+collection+'/');
    if (!response.ok) {
        throw new Error('Network response was not ok');
    }
    return response.json();
}

async function loadMapInToList(document,cosas) {
    await fetch('http://localhost:3000/api/changeDoc/listas/'+document, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(cosas)
    });
}

async function updatePublicationList(collection,document,from) {
    const publicationMap = {};
    const publications = await loadAllPublication(from);
    for (const publication of publications) {
        const id = publication.publication_id;
        const nombre = publication.nombre;
        if (nombre in publicationMap) {
            publicationMap[nombre].push(id);
        } else {
            publicationMap[nombre] = [id];
        }
    }
    await loadMapInToList(document,publicationMap);
}
export async function addToList(document, name, id) {
    let data = await fetch('http://localhost:3000/api/getDocument/listas/' + document)
        .then(response =>{
            if (!response){
                throw new Error("no se ha podido encontrar la lista");
            }else {
                return response.json();
            }
        });
    delete data.id;
    if (data.hasOwnProperty(name)){
        data[name].push(id);
    }else{
        data[name] = [id];
    }
    await loadMapInToList(document,data);
}


export async function deleteDocument(collection,document) {
    await fetch(`http://localhost:3000/api/deleteDocument/${collection}/${document}`,{
        method: 'DELETE'
    });
}

export async function deletePulicationFromList(document, name, id) {
    let data = await fetch('http://localhost:3000/api/getDocument/listas/' + document)
        .then(response =>{
            if (!response){
                throw new Error("no se ha podido encontrar la lista");
            }else {
                return response.json();
            }
        });
    delete data.id;
    if(data.hasOwnProperty(name)){
        const index = data[name].indexOf(id);
        if(index !== -1){
            data[name].splice(index,1);
            if (data[name].length === 0){
                delete data[name];
            }
        }
    }else {
        throw Error("No se ha encontrado esa publicacion");
    }
    loadMapInToList(document,data);
}

//await updatePublicationList("listas","publicaciones", "publicacion");
//await addToList("publicaciones","Osorio","ejemplo");
await deletePulicationFromList("publicaciones","Osorio","ejemplo");

