
import { getAuth, signInWithPopup, GoogleAuthProvider,  } from 'firebase/auth';
import { app } from './firebaseConfig.js'; // Importa la instancia de la app de Firebase desde otro archivo

export async function signInWithGoogle() {
    try {
        const auth = getAuth(app);
        const provider = new GoogleAuthProvider();
        const result = await signInWithPopup(auth, provider);
        return result.user;
    } catch (error) {
        throw error;
    }
}
