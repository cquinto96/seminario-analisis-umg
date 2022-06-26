import AlertPopper from 'components/AlertPopper';
import { getDocs, collection, doc, deleteDoc, addDoc } from 'firebase/firestore';
import { v4 as uuid } from 'uuid';
import React, { Component } from "react";

import { db } from "../utils/firebase";

class Empresas extends Component {

    constructor(props) {
        super(props)
        this.state = {
            empresas: [],
            respuesta: "",
            empresa: {}
        }

        this.cambiosFormulario = this.cambiosFormulario.bind(this);
        this.eliminarEmpresa = this.eliminarEmpresa.bind(this);
        this.eventoFormulario = this.eventoFormulario.bind(this);
    }

    cambiosFormulario(event) {
        this.setState(data => (
            {
                empresa: {
                    ...data.empresa,
                    [event.target.name]: event.target.value
                }
            }));
    }

    async eliminarEmpresa(info, event) {
        if (info.id !== null) {
            if (info.id.length > 0) {
                const ref = doc(db, "empresas", info.id)
                await deleteDoc(ref);
                var nuevaLista = this.state.empresas.filter(empresa => empresa.id !== info.id);
                this.setState({
                    empresas: nuevaLista,
                    empresa: {},
                    respuesta: "Información eliminada exitosamente"
                });
            }
        }

    }

    async eventoFormulario(event) {
        event.preventDefault();
        this.setState({
            respuesta: ""
        });
        try {
            var empresa = {
                ...this.state.empresa,
                codigoEmpresa: uuid()
            }
            var refs = collection(db, "empresas");
            var response = await addDoc(refs, empresa);
            if (response && response.id.length > 0) {
                const valores = {
                    id: response.id,
                    info: empresa
                }
                var nuevaLista = [...this.state.empresas, valores];
                this.setState({
                    empresas: nuevaLista,
                    empresa: {},
                    respuesta: "Empresa creada"
                })
            }
        } catch (error) {
            this.setState({
                respuesta: "Error al crear empresa"
            })
        }
    }

    componentDidMount() {
        getDocs(collection(db, "empresas")).then(response => {
            let listado = [];
            for (const value of response.docs) {
                var empresa = {
                    id: value.id,
                    info: value.data()
                }
                listado.push(empresa);
            }
            this.setState({
                empresas: listado
            });
        }).catch(error => {
            this.setState({
                empresas: [],
                respuesta: "Error al consultar datos"
            });
        })
    }

    componentWillUnmount() {
        this.setState({
            empresas: [],
            respuesta: ""
        })
    }

    render() {
        return (
            <>
                <h6 className="text-blueGray-800 text-2xl mb-2 font-bold">Empresa</h6>
                <div className="relative flex flex-col min-w-0 break-words w-full mb-6 shadow-2xl border-indigo-500 rounded-lg bg-white border-0">
                    <div className="flex-auto px-4 lg:px-10 py-10 pt-0">
                        <form className="w-full py-10" onSubmit={this.eventoFormulario}>
                            <h6 className="text-blueGray-700 text-sm mt-3 mb-6 font-bold ">
                                Información de empresa
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
                                        value={this.state.empresa.nombre}
                                        onChange={this.cambiosFormulario}
                                        type="text"
                                        placeholder="Transporte"
                                    />
                                </div>
                                <div className="w-full md:w-1/2 px-3">
                                    <label className="block  tracking-wide text-gray-700 text-xs font-bold mb-2" htmlFor="grid-last-name">
                                        NIT
                                    </label>
                                    <input
                                        className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                                        name="nit"
                                        value={this.state.empresa.nit}
                                        type="text"
                                        onChange={this.cambiosFormulario}
                                        placeholder="99999999-K"
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
                                        value={this.state.empresa.direccion}
                                        onChange={this.cambiosFormulario}
                                        placeholder="Zona 16"
                                    />
                                    <p className="text-gray-600 text-xs italic">Escriba la Dirección de la empresa</p>
                                </div>
                            </div>
                            <div className="flex flex-wrap -mx-3 mb-2">
                                <div className="w-full md:w-1/3 px-3 mb-6 md:mb-0">
                                    <label className="block  tracking-wide text-gray-700 text-xs font-bold mb-2" htmlFor="grid-city">
                                        Teléfono
                                    </label>
                                    <input
                                        className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                                        id="grid-city"
                                        type="text"
                                        name="telefono"
                                        value={this.state.empresa.telefono}
                                        onChange={this.cambiosFormulario}
                                        placeholder="2885-5420"
                                    />
                                </div>
                            </div>
                            <button
                                disabled={!this.state.empresa.nombre || !this.state.empresa.nit}
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
                                                Empresas
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
                                                Nombre
                                            </th>
                                            <th
                                                className={
                                                    "px-6 align-middle border border-solid py-3 text-xs border-l-0 border-r-0 whitespace-nowrap font-semibold text-left"
                                                }
                                            >
                                                NIT
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
                                        {this.state.empresas.map((empresa, posicion) => {
                                            return (
                                                <tr
                                                    className=""
                                                    key={posicion}
                                                >
                                                    <td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4">
                                                        {empresa.info.nombre}
                                                    </td>
                                                    <td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4">
                                                        {empresa.info.nit}
                                                    </td>
                                                    <td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4">
                                                        {empresa.info.direccion}
                                                    </td>
                                                    <td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4">
                                                        {empresa.info.telefono}
                                                    </td>
                                                    <td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4">
                                                        <div className="w-1/2" >
                                                            <button onClick={this.eliminarEmpresa.bind(this, empresa)} >
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

export default Empresas