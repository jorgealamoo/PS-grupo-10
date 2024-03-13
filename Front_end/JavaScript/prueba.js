const crearUsuario = async (nombreUsuario, contraseña) => {
    try {
        // Realizar una solicitud POST al endpoint /api/signup para crear un nuevo usuario
        const response = await fetch('http://localhost:3000/api/signup', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ username: 1234, password: 1234, email: 1234 })
        });

        if (!response.ok) {
            // Manejar errores de respuesta
            const errorMessage = await response.json();
            throw new Error(errorMessage.error);
        }

        // Convertir la respuesta a JSON
        const data = await response.json();

        // Mostrar mensaje de éxito y el ID de usuario
        console.log('Usuario creado exitosamente. ID de usuario:', data.userId);

        // Llamar a la función para iniciar sesión con las credenciales recién creadas
        iniciarSesion(nombreUsuario, contraseña);
    } catch (error) {
        console.error('Error al crear usuario:', error.message);
    }
};

const iniciarSesion = async (nombreUsuario, contraseña) => {
    try {
        // Realizar una solicitud POST al endpoint /api/login con las credenciales del usuario
        const response = await fetch('http://localhost:3000/api/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ username: 1234, password: 1234 })
        });

        if (!response.ok) {
            // Manejar errores de respuesta
            const errorMessage = await response.json();
            throw new Error(errorMessage.error);
        }

        // Convertir la respuesta a JSON
        const data = await response.json();

        // Mostrar mensaje de éxito y el ID de usuario
        console.log('Inicio de sesión exitoso. ID de usuario:', data.userId);
    } catch (error) {
        console.error('Error al iniciar sesión:', error.message);
    }
};

// Ejemplo de uso: crear un nuevo usuario y luego iniciar sesión con las credenciales del nuevo usuario
crearUsuario('nuevoUsuario', 'contraseña');
