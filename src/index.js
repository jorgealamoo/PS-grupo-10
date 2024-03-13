// index.js

import { signInWithGoogle } from './auth.js';

document.getElementById('googleLogin').addEventListener('click', async function() {
    try {
        const user = await signInWithGoogle();
        console.log('El usuario ha iniciado sesión correctamente:', user);
        alert('Inicio de sesión exitoso con Google');
    } catch (error) {
        console.error('Error al iniciar sesión con Google:', error);
        alert('Error al iniciar sesión con Google: ' + error.message);
    }
});
