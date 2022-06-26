import React, { Component } from "react";
import { auth, filtrarUsuario } from '../utils/firebase';
import AlertPopper from "components/AlertPopper";
import { signInWithEmailAndPassword } from "firebase/auth";

class IniciarSesion extends Component {
    constructor(props) {
        super(props);
        this.state = {
            usuario: {},
            respuesta: ""
        }
        this.cambiosFormulario = this.cambiosFormulario.bind(this);
        this.eventoFormulario = this.eventoFormulario.bind(this);
        this.iniciarSesion = this.iniciarSesion.bind(this);
    }

    async iniciarSesion(correo, contrasena) {
        return await signInWithEmailAndPassword(auth, correo, contrasena);
    }

    cambiosFormulario(event) {
        this.setState(data => (
            {
                usuario: {
                    ...data.usuario,
                    [event.target.name]: event.target.value
                }
            }));
    }

    async eventoFormulario(event) {
        event.preventDefault();
        this.setState({
            respuesta: ""
        });
        try {
            var nombreUsuario = this.state.usuario.nombre.toLowerCase().trim().concat('@gmail.com');
            var response = await this.iniciarSesion(nombreUsuario, this.state.usuario.contrasena);
            if (response) {
                let usuarioRespuesta = response.user;
                var permisos = await filtrarUsuario(usuarioRespuesta.uid);
                permisos.forEach((data) => {
                    const { id } = data.data();
                    if (usuarioRespuesta.uid === id) {
                        usuarioRespuesta = data.data();
                    }
                });
                if (usuarioRespuesta !== null) {
                    if (usuarioRespuesta.tipoUsuario === 'A') {
                        this.props.history.push('/admin/users')
                    } else {
                        this.props.history.push('/app');
                    }
                }
                this.setState({
                    usuario: {
                        nombre: "",
                        contrasena: ""
                    }
                });
            }
        } catch (error) {
            this.setState({
                respuesta: "Error al autenticar"
            });
        }
    }

    componentWillUnmount() {
        this.setState({
            usuario: {
                nombre: "",
                contrasena: ""
            },
            respuesta: ""
        })
    }

    render() {
        return (
            <>
                <main>
                    <section className="relative pb-20 w-full h-full py-40 min-h-screen bg-white">

                        <div className="container text-center mx-auto px-4 h-full">
                            <div className="flex content-center items-center justify-center h-full">
                                <div className="w-full lg:w-4/12 px-4">
                                    <div className="relative flex flex-col min-w-0 break-words w-full mb-6 ">
                                    {this.state.respuesta && <AlertPopper color="indigo" message={this.state.respuesta} />}
                                        <div className="rounded-t mb-0 px-6 py-6">
                                            <div className="text-center mb-3">
                                                <h6 className="text-blueGray-800 text-3xl font-bold">
                                                    Iniciar sesi&oacute;n
                                                </h6>
                                            </div>
                                        </div>
                                        <div className="flex-auto px-4 lg:px-10 py-10 pt-0">
                                            <form onSubmit={this.eventoFormulario}>
                                                <div className="relative w-full mb-3">
                                                    <label
                                                        className="block text-blueGray-800 text-left text-sm font-bold mb-2"
                                                        htmlFor=""
                                                    >
                                                        Usuario
                                                    </label>
                                                    <input
                                                        name="nombre"
                                                        value={this.state.usuario.nombre}
                                                        type="text"
                                                        className="border-1 px-3 py-3 border-blueGray-800 text-blueGray-600 rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
                                                        placeholder="Usuario"
                                                        onChange={this.cambiosFormulario}
                                                    />
                                                </div>

                                                <div className="relative w-full mb-3">
                                                    <label
                                                        className="block text-left text-blueGray-800 text-sm font-bold mb-2"
                                                        htmlFor="grid-password"
                                                    >
                                                        Contraseña
                                                    </label>
                                                    <input
                                                        name="contrasena"
                                                        value={this.state.usuario.contrasena}
                                                        type="password"
                                                        className="border-1 px-3 py-3 border-blueGray-800 text-blueGray-600 rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
                                                        placeholder="Contraseña"
                                                        onChange={this.cambiosFormulario}
                                                    />
                                                </div>
                                                <div className="text-center mt-6">
                                                    <button
                                                        disabled={!this.state.usuario.nombre || !this.state.usuario.contrasena}
                                                        className="bg-indigo-300 text-white hover:bg-indigo-400 text-sm font-bold px-6 py-3 rounded shadow hover:shadow-2xl outline-none focus:outline-none mr-1 mb-1 w-full ease-linear transition-all duration-150"
                                                    >
                                                        Iniciar sesi&oacute;n
                                                    </button>
                                                </div>
                                            </form>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </section>
                </main>
            </>
        );
    }
}

export default IniciarSesion;