import { AuthProvider } from "@/frontend/contexts/AuthContext";
import '../styles/globals.css';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToasitfy.css';

export default function App({ Component, pageProps }) {
    return (
        <AuthProvider>
            <Component {...pageProps} />
            <ToastContainer position="bottom-right" />
        </AuthProvider>
    );
}