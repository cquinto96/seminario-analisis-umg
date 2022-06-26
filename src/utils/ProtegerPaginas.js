// import { useAuth } from "./ProveedorAutenticacion";
// import { Redirect } from 'react-router-dom'


const ProtegerPaginas = ({ children }) => {
    // const { user } = useAuth();

    // if (!user) return <Redirect to="/login" />;
    return <>{children}</>;
}

export default ProtegerPaginas;