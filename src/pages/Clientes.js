import React, { Component } from "react";
import AlertPopper from 'components/AlertPopper';

import { getDocs, collection, doc, deleteDoc, addDoc } from 'firebase/firestore';
import { db } from "../utils/firebase";

import { v4 as uuid } from 'uuid';

class Clientes extends Component {
    constructor(props) {
        super(props)
        this.state = {
            clientes: [],
            filtradoListadoClientes: [],
            respuesta: "",
            cliente: {},
            empresas: []
        }
        this.cambiosFormulario = this.cambiosFormulario.bind(this);
        this.eliminarCliente = this.eliminarCliente.bind(this);
        this.eventoFormulario = this.eventoFormulario.bind(this);
        this.renderizarListado = this.renderizarListado.bind(this);
        this.obtenerEmpresas = this.obtenerEmpresas.bind(this);
        this.filtrarPorEmpresa = this.filtrarPorEmpresa.bind(this);
    }

    cambiosFormulario(event) {
        this.setState(data => (
            {
                cliente: {
                    ...data.cliente,
                    [event.target.name]: event.target.value
                }
            }));
    }

    filtrarPorEmpresa(event) {
        var codigoEmpresa = event.target.value;
        var nuevaLista = this.state.clientes.filter((cliente) => cliente.info.codigoEmpresa === codigoEmpresa);
        this.setState({
            filtradoListadoClientes: nuevaLista
        });

    }

    async eliminarCliente(info, event) {
        if (info.id !== null) {
            if (info.id.length > 0) {
                const ref = doc(db, "clientes", info.id)
                await deleteDoc(ref);
                var nuevaLista = this.state.clientes.filter(sucursal => sucursal.id !== info.id);
                this.setState({
                    clientes: nuevaLista,
                    filtradoListadoClientes: nuevaLista,
                    cliente: {},
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
        getDocs(collection(db, "clientes")).then(response => {
            let listado = [];
            for (const value of response.docs) {
                var cliente = {
                    id: value.id,
                    info: value.data()
                }
                listado.push(cliente)
            }
            this.setState({
                clientes: listado,
                filtradoListadoClientes: listado
            })
        }).catch(error => {
            this.setState({
                clientes: [],
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
            var cliente = {
                ...this.state.cliente,
                codigoCliente: uuid()
            }
            var refs = collection(db, "clientes");
            var response = await addDoc(refs, cliente);
            if (response && response.id.length > 0) {
                const valores = {
                    id: response.id,
                    info: cliente
                }
                var nuevaLista = [...this.state.clientes, valores];
                this.setState({
                    clientes: nuevaLista,
                    filtradoListadoClientes: nuevaLista,
                    cliente: {
                        nombre: '',
                        codigoEmpresa: '',
                        telefono: '',
                        codigoCliente: ''
                    },
                    respuesta: "Cliente creada"
                })
            }
        } catch (error) {
            this.setState({
                respuesta: "Error al crear cliente"
            })
        }
    }

    componentWillUnmount() {
        this.setState({
            clientes: [],
            filtradoListadoClientes: [],
            respuesta: ""
        })
    }

    render() {
        return (
            <>
                <h6 className="text-blueGray-800 text-2xl mb-2 font-bold">Cliente</h6>
                <div className="relative flex flex-col min-w-0 break-words w-full mb-6 shadow-2xl border-indigo-500 rounded-lg bg-white border-0">
                    <div className="flex-auto px-4 lg:px-10 py-10 pt-0">
                        <form className="w-full py-10" onSubmit={this.eventoFormulario}>
                            <h6 className="text-blueGray-700 text-sm mt-3 mb-6 font-bold ">
                                Información del cliente
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
                                        value={this.state.cliente.nombre}
                                        onChange={this.cambiosFormulario}
                                        type="text"
                                        placeholder="Edwin Perez"
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
                                        value={this.state.cliente.telefono}
                                        onChange={this.cambiosFormulario}
                                        placeholder="4852-2115"
                                    />
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
                                            value={this.state.cliente.codigoEmpresa}
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
                                disabled={!this.state.cliente.nombre || !this.state.cliente.codigoEmpresa}
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
                                                Clientes
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
                                        {this.state.filtradoListadoClientes.map((cliente, posicion) => {
                                            return (
                                                <tr
                                                    className=""
                                                    key={posicion}
                                                >
                                                    <td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4">
                                                        {cliente.info.nombre}
                                                    </td>
                                                    <td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4">
                                                        {cliente.info.telefono}
                                                    </td>
                                                    <td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4">
                                                        <div className="w-1/2" >
                                                            <button onClick={this.eliminarCliente.bind(this, cliente)} >
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

export default Clientes;