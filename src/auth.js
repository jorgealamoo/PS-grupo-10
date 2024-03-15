// auth.js
import { getAuth, signInWithPopup, GoogleAuthProvider, FacebookAuthProvider } from 'firebase/auth';
import { app } from './firebaseConfig.js'; // Importa la instancia de la app de Firebase desde otro archivo

export async function signInWithGoogle() {
    try {
        const auth = getAuth(app);
        const provider = new GoogleAuthProvider();
        const result = await signInWithPopup(auth, provider);
        localStorage.setItem('userId', result.user.uid);
        localStorage.setItem('userEmail', result.user.email);
        return result.user;
    } catch (error) {
        throw error;
    }
}

export async function signInWithFacebook() {
    try {
        const auth = getAuth(app);
        const provider = new FacebookAuthProvider();
        const result = await signInWithPopup(auth, provider);
        localStorage.setItem('userId', result.user.uid);
        localStorage.setItem('userEmail', result.user.email);
        return result.user;
    } catch (error) {
        throw error;
    }
}
