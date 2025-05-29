import { createContext, useContext, useState, useEffect } from "react";
import { useRouter } from "next/router";
import jwtDecode from 'jwt-decode';

const AuthContext = createContext();

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(null);
    const router = useRouter();

    useEffect(() => {
        const storedToken = localStorage.getItem('malvader_token');
        if(storedToken) {
            try {
                const decoded = jwtDecode(storedToken);
                setUser(decoded);
                setToken(storedToken);
            } catch (error) {
                logout();
            }
        }
    }, []);

    const login = (token) => {
        localStorage.setItem('malvader_token', token);
        const decoded = jwtDecode(token);
        setUser(decoded);
        setToken(token);
    };

    const logout = () => {
        localStorage.removeItem('malvader_token');
        setUser(null);
        setToken(null);
        router.push('/auth/login');
    };

    return (
        <AuthContext.Provider value={{user, token, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
}

export const useAuth = () => useContext(AuthContext);