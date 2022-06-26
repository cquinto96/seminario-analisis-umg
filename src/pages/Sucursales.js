import { getDocs, collection, doc, deleteDoc, addDoc } from 'firebase/firestore';
import React, { Component } from "react";
import AlertPopper from 'components/AlertPopper';
import { db } from "../utils/firebase";
import { v4 as uuid } from 'uuid';

class Sucursales extends Component {
    constructor(props) {
        super(props);
        this.state = {
            sucursales: [],
            filtradoListadoSucursales: [],
            respuesta: "",
            sucursal: {},
            empresas: []
        }
        this.cambiosFormulario = this.cambiosFormulario.bind(this);
        this.eliminarSucursal = this.eliminarSucursal.bind(this);
        this.eventoFormulario = this.eventoFormulario.bind(this);
        this.renderizarListado = this.renderizarListado.bind(this);
        this.obtenerEmpresas = this.obtenerEmpresas.bind(this);
        this.filtrarPorEmpresa = this.filtrarPorEmpresa.bind(this);
    }

    cambiosFormulario(event) {
        this.setState(data => (
            {
                sucursal: {
                    ...data.sucursal,
                    [event.target.name]: event.target.value
                }
            }));
    }

    filtrarPorEmpresa(event) {
        var codigoEmpresa = event.target.value;
        var nuevaLista = this.state.sucursales.filter((sucursal) => sucursal.info.codigoEmpresa === codigoEmpresa);
        this.setState({
            filtradoListadoSucursales: nuevaLista
        });

    }

    async eliminarSucursal(info, event) {
        if (info.id !== null) {
            if (info.id.length > 0) {
                const ref = doc(db, "sucursales", info.id)
                await deleteDoc(ref);
                var nuevaLista = this.state.sucursales.filter(sucursal => sucursal.id !== info.id);
                this.setState({
                    sucursales: nuevaLista,
                    filtradoListadoSucursales: nuevaLista,
                    sucursal: {},
                    respuesta: "Información eliminada exitosamente"
                });
            }
        }
    }

    obtenerEmpresas() {
        if (this.state.empresas.length === 0) {
            getDocs(collection(db, "empresas")).then(response => {
                let listado = [];
                for (const value of response.docs) {
                    listado.push(value.data())
                }
                this.setState({
                    empresas: listado
                });
            }).catch(error => {
                this.setState({
                    empresas: [],
                    respuesta: "Error al consultar datos"
                })
            })
        }
    }

    renderizarListado() {
        return this.state.empresas.length > 0
            && this.state.empresas.map((item, i) => {
                return (
                    <option key={i} value={item.codigoEmpresa}>{item.nombre}</option>
                )
            });
    }

    componentDidMount() {
        getDocs(collection(db, "sucursales")).then(response => {
            let listado = [];
            for (const value of response.docs) {
                var sucursal = {
                    id: value.id,
                    info: value.data()
                }
                listado.push(sucursal)
            }
            this.setState({
                sucursales: listado,
                filtradoListadoSucursales: listado
            })
        }).catch(error => {
            this.setState({
                sucursales: [],
                respuesta: "Error al consultar datos"
            })
        })
    }

    async eventoFormulario(event) {
        event.preventDefault();
        this.setState({
            respuesta: ""
        });
        try {
            var sucursal = {
                ...this.state.sucursal,
                codigoSucursal: uuid()
            }
            var refs = collection(db, "sucursales");
            var response = await addDoc(refs, sucursal);
            if (response && response.id.length > 0) {
                const valores = {
                    id: response.id,
                    info: sucursal
                }
                var nuevaLista = [...this.state.sucursales, valores];
                this.setState({
                    sucursales: nuevaLista,
                    filtradoListadoSucursales: nuevaLista,
                    sucursal: {
                        nombre: '',
                        direccion: '',
                        codigoEmpresa: '',
                        telefono: '',
                        codigoSucursal: ''
                    },
                    respuesta: "Sucursal creada"
                })
            }
        } catch (error) {
            this.setState({
                respuesta: "Error al crear sucursal"
            })
        }
    }

    componentWillUnmount() {
        this.setState({
            sucursales: [],
            filtradoListadoSucursales: [],
            respuesta: ""
        })
    }


    render() {
        return (
            <>
                <h6 className="text-blueGray-800 text-2xl mb-2 font-bold">Sucursal</h6>
                <div className="relative flex flex-col min-w-0 break-words w-full mb-6 shadow-2xl border-indigo-500 rounded-lg bg-white border-0">
                    <div className="flex-auto px-4 lg:px-10 py-10 pt-0">
                        <form className="w-full py-10" onSubmit={this.eventoFormulario}>
                            <h6 className="text-blueGray-700 text-sm mt-3 mb-6 font-bold ">
                                Información de sucursal
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
                                        name="nombre"
                                        value={this.state.sucursal.nombre}
                                        onChange={this.cambiosFormulario}
                                        type="text"
                                        placeholder="Central"
                                    />
                                </div>

                                <div className="w-full md:w-1/3 px-3 mb-6 md:mb-0">
                                    <label className="block  tracking-wide text-gray-700 text-xs font-bold mb-2" htmlFor="grid-city">
                                        Teléfono
                                    </label>
                                    <input
                                        className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                                        id="grid-city"
                                        type="text"
                                        name="telefono"
                                        value={this.state.sucursal.telefono}
                                        onChange={this.cambiosFormulario}
                                        placeholder="2885-5420"
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
                                        type="text"
                                        name="direccion"
                                        value={this.state.sucursal.direccion}
                                        onChange={this.cambiosFormulario}
                                        placeholder="Sixtino"
                                    />
                                    <p className="text-gray-600 text-xs italic">Escriba la Dirección de la sucursal</p>
                                </div>
                            </div>
                            <div className="flex flex-wrap -mx-3 mb-2">
                                <div className="w-full md:w-1/3 px-3 mb-6 md:mb-0">
                                    <label className="block  tracking-wide text-gray-700 text-xs font-bold mb-2" htmlFor="grid-state">
                                        Empresa
                                    </label>
                                    <div className="relative">
                                        <select
                                            className="block appearance-none w-full bg-gray-200 border border-gray-200 text-gray-700 py-3 px-4 pr-8 rounded leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                                            id="grid-state"
                                            name="codigoEmpresa"
                                            value={this.state.sucursal.codigoEmpresa}
                                            onChange={this.cambiosFormulario}
                                            onClick={this.obtenerEmpresas}
                                        >
                                            {this.renderizarListado()}
                                        </select>
                                        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                                            <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" /></svg>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <button
                                disabled={!this.state.sucursal.nombre || !this.state.sucursal.codigoEmpresa}
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
                                                Sucursales
                                            </h3>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="w-full md:w-1/3 px-3 mb-6 md:mb-0">
                                <label className="block  tracking-wide text-white text-xs font-bold mb-2" htmlFor="grid-state">
                                    Empresa
                                </label>
                                <div className="relative">
                                    <select
                                        className="block appearance-none w-full text-gray-700 py-3 px-4 pr-8 rounded leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                                        id="grid-state"
                                        onChange={this.filtrarPorEmpresa}
                                        onClick={this.obtenerEmpresas}
                                    >
                                        {this.renderizarListado()}
                                    </select>
                                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                                        <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" /></svg>
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
                                                Nombre
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
                                                Teléfono
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
                                        {this.state.filtradoListadoSucursales.map((sucursal, posicion) => {
                                            return (
                                                <tr
                                                    className=""
                                                    key={posicion}
                                                >
                                                    <td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4">
                                                        {sucursal.info.nombre}
                                                    </td>
                                                    <td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4">
                                                        {sucursal.info.direccion}
                                                    </td>
                                                    <td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4">
                                                        {sucursal.info.telefono}
                                                    </td>
                                                    <td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4">
                                                        <div className="w-1/2" >
                                                            <button onClick={this.eliminarSucursal.bind(this, sucursal)} >
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
        );
    }
}

export default Sucursales;