import React, { Component } from "react";

import { auth, db } from "../utils/firebase";
import { getDocs, collection, addDoc, doc, deleteDoc } from 'firebase/firestore'
import AlertPopper from "components/AlertPopper";
import { createUserWithEmailAndPassword } from "firebase/auth";

class Usuarios extends Component {
  constructor(props) {
    super(props);
    this.state = {
      usuarios: [],
      respuesta: "",
      usuario: {},
    }

    this.crearUsuario = this.crearUsuario.bind(this);
    this.eliminarUsuario = this.eliminarUsuario.bind(this);
    this.cambiosFormulario = this.cambiosFormulario.bind(this);
    this.eventoFormulario = this.eventoFormulario.bind(this);
  }

  async crearUsuario(email, contrasena) {
    return await createUserWithEmailAndPassword(auth, email, contrasena)
  }

  async eliminarUsuario(info, event) {
    if (info.id !== null) {
      if (info.id.length > 0) {
        const ref = doc(db, "usuarios", info.id)
        await deleteDoc(ref);
        var nuevaLista = this.state.usuarios.filter(usuario => usuario.id !== info.id);
        this.setState({
          usuarios: nuevaLista,
          respuesta: "Información eliminada exitosamente"
        });
      }
    }

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
    })

    try {
      var nombreUsuario = this.state.usuario.nombre.toLowerCase().trim().concat('@gmail.com');
      var { user: { uid } } = await this.crearUsuario(nombreUsuario, this.state.usuario.contrasena);
      if (uid && uid.length > 0) {
        var {
          nombre,
          direccion,
          telefono,
          tipoUsuario
        } = this.state.usuario;
        var id = uid;
        var refs = collection(db, "usuarios");
        var tipoUsuarioChar = tipoUsuario === "Operativo" ? 'O' : 'A'
        var dataRequest = {
          nombre,
          direccion,
          telefono,
          tipoUsuario: tipoUsuarioChar,
          id,
        }
        var response = await addDoc(refs, dataRequest);
        if (response && response.id.length > 0) {
          var nuevaLista = [...this.state.usuarios, dataRequest];
          this.setState({
            usuarios: nuevaLista,
            usuario: {},
            respuesta: "Usuario creado"
          })
        }
      }

    } catch (error) {
      this.setState({
        respuesta: "Error al crear usuario"
      })
    }

  }

  componentDidMount() {
    getDocs(collection(db, "usuarios")).then(response => {
      let listadoUsuarios = [];
      for (const value of response.docs) {
        var usuario = {
          id: value.id,
          info: value.data()
        }
        listadoUsuarios.push(usuario)
      }
      this.setState({
        usuarios: listadoUsuarios
      });
    }).catch(error => {
      this.setState({
        usuarios: [],
        respuesta: "Error al consultar datos"
      });
    })
  }

  componentWillUnmount() {
    this.setState({
      usuarios: []
    })
  }

  render() {
    return (
      <>
        <h6 className="text-blueGray-800 text-2xl mb-2 font-bold">Usuario</h6>
        <div className="relative flex flex-col min-w-0 break-words w-full mb-6 shadow-2xl border-indigo-500 rounded-lg bg-white border-0">
          <div className="flex-auto px-4 lg:px-10 py-10 pt-0">
            <form className="w-full py-10" onSubmit={this.eventoFormulario}>
              <h6 className="text-blueGray-700 text-sm mt-3 mb-6 font-bold ">
                Informaci&oacute;n de usuario
              </h6>
              {this.state.respuesta && <AlertPopper color="indigo" message={this.state.respuesta} />}
              <div className="flex flex-wrap items-center -mx-3 mb-6">
                <div className="w-full md:w-1/2 px-3 mb-6 md:mb-0">
                  <label
                    className="block  tracking-wide text-gray-700 text-xs font-bold mb-2"
                    htmlFor="grid-first-name">
                    Nombre
                  </label>
                  <input
                    className="appearance-none block w-full bg-gray-200 text-gray-700 border rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white"
                    id="grid-first-name"
                    name="nombre"
                    value={this.state.usuario.nombre}
                    onChange={this.cambiosFormulario}
                    type="text"
                    placeholder="edwin"
                  />
                </div>
                <div className="w-full md:w-1/2 px-3">
                  <label className="block  tracking-wide text-gray-700 text-xs font-bold mb-2" htmlFor="grid-last-name">
                    Contraseña
                  </label>
                  <input
                    className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                    id="grid-password"
                    name="contrasena"
                    value={this.state.usuario.contrasena}
                    type="password"
                    onChange={this.cambiosFormulario}
                    placeholder="******************"
                  />
                </div>
              </div>
              <div className="flex flex-wrap -mx-3 mb-6">
                <div className="w-full px-3">
                  <label
                    className="block tracking-wide text-gray-700 text-xs font-bold mb-2"
                    htmlFor="grid-password">
                    Dirección
                  </label>
                  <input
                    className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                    id="grid-direccion"
                    type="text"
                    name="direccion"
                    value={this.state.usuario.direccion}
                    onChange={this.cambiosFormulario}
                    placeholder="Zona 16"
                  />
                  <p className="text-gray-600 text-xs italic">Escriba la Dirección del usuario</p>
                </div>
              </div>
              <div className="flex flex-wrap -mx-3 mb-2">
                <div className="w-full md:w-1/3 px-3 mb-6 md:mb-0">
                  <label className="block  tracking-wide text-gray-700 text-xs font-bold mb-2" htmlFor="grid-city">
                    Telefono
                  </label>
                  <input
                    className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                    id="grid-city"
                    type="text"
                    name="telefono"
                    value={this.state.usuario.telefono}
                    onChange={this.cambiosFormulario}
                    placeholder="2885-5420"
                  />
                </div>
                <div className="w-full md:w-1/3 px-3 mb-6 md:mb-0">
                  <label className="block  tracking-wide text-gray-700 text-xs font-bold mb-2" htmlFor="grid-state">
                    Tipo de usuario
                  </label>
                  <div className="relative">
                    <select
                      className="block appearance-none w-full bg-gray-200 border border-gray-200 text-gray-700 py-3 px-4 pr-8 rounded leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                      id="grid-state"
                      name="tipoUsuario"
                      value={this.state.usuario.tipoUsuario}
                      onChange={this.cambiosFormulario}
                    >
                      <option>Administrador</option>
                      <option>Operativo</option>
                    </select>
                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                      <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" /></svg>
                    </div>
                  </div>
                </div>
              </div>
              <button
                disabled={!this.state.usuario.nombre || !this.state.usuario.contrasena}
                className="bg-indigo-300 text-white hover:bg-indigo-400 mt-6 font-bold text-xs px-4 py-2 rounded shadow hover:shadow-2xl outline-none"
              >
                Crear
              </button>
            </form>

          </div>
        </div>
        {/* listado */}
        <div className="flex flex-wrap">
          <div className="w-full px-4">
            <div
              className={
                "relative flex flex-col min-w-0 break-words w-full mb-6 shadow-lg rounded bg-indigo-400 text-white"
              }
            >
              <div className="rounded-t mb-0 px-4 py-3 border-0">
                <div className="flex flex-wrap items-center">
                  <div className="w-full px-4 flex-grow flex">
                    <div className="w-1/2 text-left">
                      <h3
                        className={
                          "font-semibold text-lg text-white"
                        }
                      >
                        Usuarios
                      </h3>
                    </div>
                  </div>
                </div>
              </div>
              <div className="block w-full overflow-x-auto">
                <table className="items-center w-full border-collapse ">
                  <thead>
                    <tr className="bg-white text-blueGray-800">
                      <th
                        className={
                          "px-6 align-middle border border-solid py-3 text-xs border-l-0 border-r-0 whitespace-nowrap font-semibold text-left"

                        }
                      >
                        Usuario
                      </th>
                      <th
                        className={
                          "px-6 align-middle border border-solid py-3 text-xs border-l-0 border-r-0 whitespace-nowrap font-semibold text-left"
                        }
                      >
                        Tipo de usuario
                      </th>
                      <th
                        className={
                          "px-6 align-middle border border-solid py-3 text-xs border-l-0 border-r-0 whitespace-nowrap font-semibold text-left"
                        }
                      >
                        Dirección
                      </th>
                      <th
                        className={
                          "px-6 align-middle border border-solid py-3 text-xs border-l-0 border-r-0 whitespace-nowrap font-semibold text-left"
                        }
                      >
                        Telefono
                      </th>
                      <th
                        className={
                          "px-6 align-middle border border-solid py-3 text-xs border-l-0 border-r-0 whitespace-nowrap font-semibold text-left"
                        }
                      >
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {this.state.usuarios.map((usuario, posicion) => {
                      return (
                        <tr
                          className=""
                          key={posicion}
                        >
                          <td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4">
                            {usuario.info.nombre}
                          </td>
                          <td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4">
                            {usuario.info.tipoUsuario === 'A' ? 'Administrador' : 'Operativo'}
                          </td>
                          <td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4">
                            {usuario.info.direccion}
                          </td>
                          <td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4">
                            {usuario.info.telefono}
                          </td>
                          <td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4">
                            <div className="w-1/2" >
                              <button onClick={this.eliminarUsuario.bind(this, usuario)} >
                                <i className="fas fa-ban text-red-500"></i>
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </>
    )
  }
}

export default Usuarios;
