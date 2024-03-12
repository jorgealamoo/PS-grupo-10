const usersDatabase = [
    { username: 'usuario1', password: 'contraseña1' },
    { username: 'usuario2', password: 'contraseña2' },
    // Agrega más usuarios según sea necesario
]

function loginUser(username, password) {
    // Busca el usuario en la base de datos
    const user = usersDatabase.find(u => u.username === username && u.password === password);

    // Comprueba si se encontró un usuario
    return user !== undefined;
}


// Función para manejar el evento de inicio de sesión desde el botón en el HTML
function handleLogin() {
    // Obtiene los valores del nombre de usuario y la contraseña desde los campos de entrada del formulario
    const usernameInput = document.getElementById('user_name').value;
    const passwordInput = document.getElementById('password').value;

    if (loginUser(usernameInput, passwordInput)) {
        window.location.href = '../MapPage/map.html';
    } else {
        alert('Nombre de usuario o contraseña incorrectos');
    }
}


// Función para manejar el evento cuando se presiona Enter en el campo de contraseña
document.getElementById("password").addEventListener("keyup", function(event) {
    if (event.key === "Enter") {
        handleLogin();
    }
});

/////////////////////////////////////////////////////////////////


// URL del endpoint
const apiUrl = 'http://localhost:3000/api/fetchData/prueba';

// Función para hacer la solicitud y manejar la respuesta
async function fetchData() {
    try {
        const response = await fetch('http://localhost:3000/api/fetchData/prueba');
        const data = await response.json();

        data.forEach(elenent => {
            console.log(elenent);
        })
    } catch (error) {
        console.error('Error al obtener datos: ', error);
    }
}

// Llamar a la función para obtener los datos
fetchData();