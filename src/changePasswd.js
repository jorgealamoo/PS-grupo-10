// auth.js
import { getAuth, updatePassword } from 'firebase/auth';
import { app } from './firebaseConfig.js'; // Importa la instancia de la app de Firebase desde otro archivo


export async function changePasswordUser(email, newPassword) {
    try {
        const auth = getAuth(app);
        await updatePassword(auth.currentUser, newPassword);
        return true; // Password changed successfully
    } catch (error) {
        throw error;
    }
}