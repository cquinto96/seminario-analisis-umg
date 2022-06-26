import React from "react";
import {
    onAuthStateChanged
} from "firebase/auth";
import { auth, filtrarUsuario } from "./firebase";

const authContext = React.createContext(null);

export const useAuth = () => {
    const context = React.useContext(authContext);
    if (!context) throw new Error("There is no Auth provider");
    return context;
};

export const ProveedorAutenticacion = ({ children }) => {
    const [user, setUser] = React.useState(null);
    const [permissions, setPermissions] = React.useState(null);
    const [loading, setLoading] = React.useState(true);

    const getPermissions = (uuid) => {
        return filtrarUsuario(uuid);
    }

    React.useEffect(() => {
        const unsubuscribe = onAuthStateChanged(auth, (currentUser) => {
            setUser(currentUser);
            if (currentUser !== null) {
                const user = {
                    id: '',
                    tipoUsuario: '',
                }
                getPermissions(currentUser?.uid).then((data) => {
                    data.forEach((value => {
                        const { tipoUsuario, id } = value.data();
                        user.id = id;
                        user.tipoUsuario = tipoUsuario;
                    }))
                })
                setPermissions(user);
            }
            setLoading(false);
        });
        return () => unsubuscribe();
    }, []);


    return (
        <authContext.Provider
            value={{
                permissions,
                user,
                loading,
            }}
        >
            {children}
        </authContext.Provider>
    );
}