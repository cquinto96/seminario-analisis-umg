import { BrowserRouter, Route, Switch } from "react-router-dom";
import { Component } from "react";

import "@fortawesome/fontawesome-free/css/all.min.css";
import "assets/styles/tailwind.css";

import { ProveedorAutenticacion } from "./utils/ProveedorAutenticacion";
import AppBar from "components/AppBar.js";
import ProtegerPaginas from "utils/ProtegerPaginas";
import Navegacion from 'components/Navegacion';
import Maquinarias from 'pages/Maquinarias';
import Clientes from 'pages/Clientes';
import Productos from 'pages/Productos';
import Proveedores from 'pages/Proveedores';
import IniciarSesion from "pages/IniciarSesion";
import Empresas from "pages/Empresas";
import Sucursales from "pages/Sucursales";
import Usuarios from "pages/Usuarios";
import Alquileres from "pages/Alquileres";
import Pedidos from "pages/Pedidos";
import Facturas from "pages/Facturas";

class App extends Component {
    render() {
        return (
            <BrowserRouter>
                <ProveedorAutenticacion>
                    <Switch>
                        <Route path="/login" component={IniciarSesion} />
                        <ProtegerPaginas>
                            <Navegacion />
                            <div className="md:ml-64 bg-white">
                                <AppBar />
                                <div className="px-4 lg:mt-32 md:px-10 mx-auto w-full">
                                    <Route path="/usuarios" exact component={Usuarios} />
                                    <Route path="/usuarios/permisos" exact component={Permissions} />
                                    <Route path="/empresas" exact component={Empresas} />
                                    <Route path="/sucursales" exact component={Sucursales} />
                                    <Route path="/maquinarias" exact component={Maquinarias} />
                                    <Route path="/clientes" exact component={Clientes} />
                                    <Route path="/productos" exact component={Productos} />
                                    <Route path="/proveedores" exact component={Proveedores} />
                                    <Route path="/alquileres" exact component={Alquileres} />
                                    <Route path="/pedidos" exact component={Pedidos} />
                                    <Route path="/facturas" exact component={Facturas} />
                                </div>
                            </div>
                        </ProtegerPaginas>
                    </Switch>
                </ProveedorAutenticacion >
            </BrowserRouter >
        )
    }
}

export default App;