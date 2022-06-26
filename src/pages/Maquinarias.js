import React, { Component } from "react";
import AlertPopper from 'components/AlertPopper';

import { getDocs, collection, doc, deleteDoc, addDoc } from 'firebase/firestore';
import { db } from "../utils/firebase";

import { v4 as uuid } from 'uuid';

class Maquinarias extends Component {
    constructor(props) {
        super(props);
        this.state = {
            maquinarias: [],
            filtradoListadoMaquinarias: [],
            respuesta: "",
            maquinaria: {},
            empresas: [],
        }
        this.cambiosFormulario = this.cambiosFormulario.bind(this);
        this.obtenerEmpresas = this.obtenerEmpresas.bind(this);
        this.filtrarPorEmpresa = this.filtrarPorEmpresa.bind(this);
        this.eliminarMaquinaria = this.eliminarMaquinaria.bind(this);
        this.renderizarListado = this.renderizarListado.bind(this);
        this.eventoFormulario = this.eventoFormulario.bind(this);
    }

    cambiosFormulario(event) {
        this.setState(data => (
            {
                maquinaria: {
                    ...data.maquinaria,
                    [event.target.name]: event.target.value
                }
            }));
    }

    filtrarPorEmpresa(event) {
        var codigoEmpresa = event.target.value;
        var nuevaLista = this.state.maquinarias.filter((maquinaria) => maquinaria.info.codigoEmpresa === codigoEmpresa);
        this.setState({
            filtradoListadoMaquinarias: nuevaLista
        });
    }

    async eliminarMaquinaria(info, event) {
        if (info.id !== null) {
            if (info.id.length > 0) {
                const ref = doc(db, "maquinarias", info.id)
                await deleteDoc(ref);
                var nuevaLista = this.state.maquinarias.filter(maquinaria => maquinaria.id !== info.id);
                this.setState({
                    maquinarias: nuevaLista,
                    filtradoListadoMaquinarias: nuevaLista,
                    maquinaria: {},
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

    async eventoFormulario(event) {
        event.preventDefault();
        this.setState({
            respuesta: ""
        });
        try {
            var maquinaria = {
                ...this.state.maquinaria,
                codigoMaquina: uuid()
            }
            var refs = collection(db, "maquinarias");
            var response = await addDoc(refs, maquinaria);
            if (response && response.id.length > 0) {
                const valores = {
                    id: response.id,
                    info: maquinaria
                }
                var nuevaLista = [...this.state.maquinarias, valores];
                this.setState({
                    maquinarias: nuevaLista,
                    filtradoListadoMaquinarias: nuevaLista,
                    maquinaria: {
                        nombre: '',
                        codigoEmpresa: '',
                        cantidad: 0.00,
                        precio: 0.00,
                        codigoMaquina: ''
                    },
                    respuesta: "Maquina creada"
                })
            }
        } catch (error) {
            this.setState({
                respuesta: "Error al crear maquina"
            })
        }
    }

    componentDidMount() {
        getDocs(collection(db, "maquinarias")).then(response => {
            let listado = [];
            for (const value of response.docs) {
                var maquinaria = {
                    id: value.id,
                    info: value.data()
                }
                listado.push(maquinaria)
            }
            this.setState({
                maquinarias: listado,
                filtradoListadoMaquinarias: listado
            })
        }).catch(error => {
            this.setState({
                maquinarias: [],
                respuesta: "Error al consultar datos"
            })
        })
    }

    componentWillUnmount() {
        this.setState({
            maquinarias: [],
            filtradoListadoMaquinarias: [],
            respuesta: ""
        })
    }

    render() {
        return (
            <>
                <h6 className="text-blueGray-800 text-2xl mb-2 font-bold">Maquinaria</h6>
                <div className="relative flex flex-col min-w-0 break-words w-full mb-6 shadow-2xl border-indigo-500 rounded-lg bg-white border-0">
                    <div className="flex-auto px-4 lg:px-10 py-10 pt-0">
                        <form className="w-full py-10" onSubmit={this.eventoFormulario}>
                            <h6 className="text-blueGray-700 text-sm mt-3 mb-6 font-bold ">
                                Información de la maquina
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
                                        value={this.state.maquinaria.nombre}
                                        onChange={this.cambiosFormulario}
                                        type="text"
                                        placeholder="Excavadora"
                                    />
                                </div>

                                <div className="w-full md:w-1/2 px-3 mb-6 md:mb-0">
                                    <label
                                        className="block  tracking-wide text-gray-700 text-xs font-bold mb-2"
                                        htmlFor="grid-first-name">
                                        Empresa
                                    </label>
                                    <div className="relative py-3 mb-3 ">
                                        <select
                                            className="block appearance-none w-full bg-gray-200 border border-gray-200 text-gray-700 py-3 px-4 pr-8 rounded leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                                            id="grid-state"
                                            name="codigoEmpresa"
                                            value={this.state.maquinaria.codigoEmpresa}
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
                            <div className="flex flex-wrap -mx-3 mb-2">
                                <div className="w-full md:w-1/3 px-3 mb-6 md:mb-0">
                                    <label className="block  tracking-wide text-gray-700 text-xs font-bold mb-2" htmlFor="grid-state">
                                        Tipo de maquina
                                    </label>
                                    <div className="relative">
                                        <select
                                            className="block appearance-none w-full bg-gray-200 border border-gray-200 text-gray-700 py-3 px-4 pr-8 rounded leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                                            id="grid-state"
                                            name="tipoMaquinaria"
                                            value={this.state.maquinaria.tipoMaquinaria}
                                            onChange={this.cambiosFormulario}

                                        >
                                            <option>Excavadora</option>
                                            <option>Dragas</option>
                                            <option>Tractores</option>
                                            <option>Cargadores</option>
                                        </select>
                                        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                                            <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" /></svg>
                                        </div>
                                    </div>
                                </div>
                                <div className="w-full md:w-1/3 px-3 mb-6 md:mb-0">
                                    <label className="block  tracking-wide text-gray-700 text-xs font-bold mb-2" htmlFor="grid-state">
                                        Cantidad
                                    </label>
                                    <input
                                        className="appearance-none block w-full bg-gray-200 text-gray-700 border rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white"
                                        name="cantidad"
                                        value={this.state.maquinaria.cantidad}
                                        onChange={this.cambiosFormulario}
                                        type="number"
                                        onKeyDown={(event) => {
                                            if (event.key === '-') {
                                                event.preventDefault();
                                            }
                                        }}
                                        placeholder="0.00"
                                    />
                                </div>
                                <div className="w-full md:w-1/3 px-3 mb-6 md:mb-0">
                                    <label className="block  tracking-wide text-gray-700 text-xs font-bold mb-2" htmlFor="grid-state">
                                        Precio
                                    </label>
                                    <input
                                        className="appearance-none block w-full bg-gray-200 text-gray-700 border rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white"
                                        name="precio"
                                        value={this.state.maquinaria.precio}
                                        onChange={this.cambiosFormulario}
                                        onKeyDown={(event) => {
                                            if (event.key === '-') {
                                                event.preventDefault();
                                            }
                                        }}
                                        type="number"
                                        placeholder="0.00"
                                    />
                                </div>
                            </div>
                            <button
                                disabled={!this.state.maquinaria.nombre || !this.state.maquinaria.codigoEmpresa || !this.state.maquinaria.tipoMaquinaria}
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
                                                Maquinarias
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
                                                Tipo de maquina
                                            </th>
                                            <th
                                                className={
                                                    "px-6 align-middle border border-solid py-3 text-xs border-l-0 border-r-0 whitespace-nowrap font-semibold text-left"
                                                }
                                            >
                                                Cantidad
                                            </th>
                                            <th
                                                className={
                                                    "px-6 align-middle border border-solid py-3 text-xs border-l-0 border-r-0 whitespace-nowrap font-semibold text-left"
                                                }
                                            >
                                                Precio
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
                                        {this.state.filtradoListadoMaquinarias.map((maquinaria, posicion) => {
                                            return (
                                                <tr
                                                    className=""
                                                    key={posicion}
                                                >
                                                    <td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4">
                                                        {maquinaria.info.nombre}
                                                    </td>
                                                    <td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4">
                                                        {maquinaria.info.tipoMaquinaria}
                                                    </td>
                                                    <td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4">
                                                        {maquinaria.info.cantidad}
                                                    </td>

                                                    <td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4">
                                                        {maquinaria.info.precio}
                                                    </td>

                                                    <td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4">
                                                        <div className="w-1/2" >
                                                            <button onClick={this.eliminarMaquinaria.bind(this, maquinaria)} >
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

export default Maquinarias;