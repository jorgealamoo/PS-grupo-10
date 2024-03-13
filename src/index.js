// Import the functions you need from the SDKs you need
// index.js

import { signInWithGoogle } from './firebaseAuthentication.js';

document.getElementById('googleLoginButton').addEventListener('click', async function() {
    try {
        const user = await signInWithGoogle();
        console.log('El usuario ha iniciado sesión correctamente:', user);
        alert('Inicio de sesión exitoso con Google');
    } catch (error) {
        console.error('Error al iniciar sesión con Google:', error);
        alert('Error al iniciar sesión con Google: ' + error.message);
    }
});

import { logInUserPassword} from './firebaseAuthenticationUserPassword.js';

document.getElementById('Login').addEventListener('click', async function() {

    try {
        const email = document.getElementById('user_name').value;
        const password = document.getElementById('password').value;
        const user = await logInUserPassword(email, password);
        console.log('El usuario ha iniciado sesión correctamente:', user);
        alert('Inicio de sesión exitoso con usuario y contraseña');
    } catch (error) {
        console.error('Error al iniciar sesión con usuario y contraseña:', error);
        alert('Error al iniciar sesión con usuario y contraseña: ' + error.message);
    }
});