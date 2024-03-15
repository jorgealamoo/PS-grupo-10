// index.js

import { signInWithGoogle } from './auth.js';

export async function  logGoogle() {
    signInWithGoogle()
        .then(user => {
            // Si la autenticación es exitosa, aquí puedes realizar otras acciones, como redirigir a otra página
            console.log('El usuario ha iniciado sesión correctamente:', user);
            alert('Inicio de sesión exitoso con Google');
        })
        .catch(error => {
            // Manejar errores de autenticación
            console.error('Error al iniciar sesión con Google:', error);
            alert('Error al iniciar sesión con Google: ' + error.message);
        });
}

import {logInUserPassword} from "./authUserPassword.js";

export async function logUserContraseña() {

        const email = document.getElementById('user_name').value;
        const password = document.getElementById('password').value;

        logInUserPassword(email,password)
            .then(user =>{
                console.log('El usuario ha iniciado sesión correctamente con su email:', user);
                alert('Inicio de sesión exitoso con email');
            }).catch (error=>{
            console.error('Error al iniciar sesión con email:', error);
            alert('Error al iniciar sesión con email: ' + error.message);
        });
    }

import {SignUp} from "./signUp.js";
export async function crearUsuario() {
    const emailNuevo = document.getElementById('email').value;
    const passwordNuevo = document.getElementById('password').value;

    SignUp(emailNuevo,passwordNuevo)
        .then(user =>{
            console.log('El usuario ha creado correctamente su cuenta:', user);
            alert('Creación de cuenta exitosa');
        }).catch (error=>{
            console.error('Error al crear la cuenta:', error);
        alert('Error al crear la cuenta: ' + error.message);

    });
}