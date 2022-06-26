import React, { Component } from 'react';
import AlertPopper from 'components/AlertPopper';

import { getDocs, collection, doc, deleteDoc, addDoc, query, where } from 'firebase/firestore';
import { db } from "../utils/firebase";

import { v4 as uuid } from 'uuid';

class Alquileres extends Component {
    constructor(props) {
        super(props);
        this.state = {
            alquileres: [],
            filtradoListadoAlquileres: [],
            filtradoDetalleMaquinarias: [],
            respuesta: "",
            alquiler: {},
            empresas: [],
            clientes: [],
            maquinarias: [],
            detalle: [],
        }
        this.cambiosFormulario = this.cambiosFormulario.bind(this);
        this.renderizarListadoEmpresas = this.renderizarListadoEmpresas.bind(this);
        this.renderizarListadoClientes = this.renderizarListadoClientes.bind(this);
        this.obtenerEmpresas = this.obtenerEmpresas.bind(this);
        this.renderizarListadoMaquinarias = this.renderizarListadoMaquinarias.bind(this);
        this.obtenerMaquinaria = this.obtenerMaquinaria.bind(this);
        this.obtenerClientes = this.obtenerClientes.bind(this);
        this.filtrarPorEmpresa = this.filtrarPorEmpresa.bind(this);
        this.filtrarPorCliente = this.filtrarPorCliente.bind(this);
        this.eliminarAlquiler = this.eliminarAlquiler.bind(this);
        this.eliminarDetalle = this.eliminarDetalle.bind(this);
        this.agregarItem = this.agregarItem.bind(this);
        this.quitarUnidad = this.quitarUnidad.bind(this);
        this.quitarItem = this.quitarItem.bind(this);
        this.eventoFormulario = this.eventoFormulario.bind(this);
        this.filtrarMaquinaAlquiler = this.filtrarMaquinaAlquiler.bind(this);
    }

    cambiosFormulario(event) {
        this.setState(data => (
            {
                alquiler: {
                    ...data.alquiler,
                    [event.target.name]: event.target.value
                }
            }));
        if (event.target.name === "codigoEmpresa") {
            this.obtenerMaquinaria(event.target.value);
        }
    }

    filtrarPorEmpresa(event) {
        var codigoEmpresa = event.target.value;
        this.obtenerClientesV(codigoEmpresa)
    }


    filtrarPorCliente(event) {
        var codigoCliente = event.target.value;
        var nuevaLista = this.state.alquileres.filter((alquiler) => alquiler.info.codigoCliente === codigoCliente);
        this.setState({
            filtradoListadoAlquileres: nuevaLista
        });
    }



    async eliminarAlquiler(info, event) {
        event.preventDefault();
        if (info.id !== null) {
            if (info.id.length > 0) {
                const ref = doc(db, "alquileres", info.id)
                await deleteDoc(ref);
                var nuevaLista = this.state.alquileres.filter(alquiler => alquiler.id !== info.id);
                this.setState({
                    alquileres: nuevaLista,
                    filtradoListadoAlquileres: nuevaLista,
                    alquiler: {},
                    respuesta: "Información eliminada exitosamente"
                });
            }
        }
    }

    async eliminarDetalle(info, event) {
        event.preventDefault();
        if (info.id !== null) {
            if (info.id.length > 0) {
                const ref = doc(db, "detalle_alquileres", info.id)
                await deleteDoc(ref);
                var nuevaLista = this.state.filtradoDetalleMaquinarias.filter(alquiler => alquiler.id !== info.id);
                this.setState({
                    filtradoDetalleMaquinarias: nuevaLista,
                    respuesta: "Información eliminada exitosamente"
                });
            }
        }
    }


    filtrarMaquinaAlquiler(data, event) {
        event.preventDefault();
        window.location.href = "#detalle"
        if (data.info !== null) {
            if (data.info.codigoAlquiler.length > 0) {
                var queryFiltro = query(collection(db, "detalle_alquileres"), where("codigoAlquiler", "==", data.info.codigoAlquiler));
                getDocs(queryFiltro).then(response => {
                    let listado = [];
                    for (const value of response.docs) {
                        var detalle = {
                            id: value.id,
                            info: value.data()
                        }
                        listado.push(detalle)
                    }
                    this.setState({
                        filtradoDetalleMaquinarias: listado
                    });
                }).catch(error => {
                    this.setState({
                        filtradoDetalleMaquinarias: [],
                        respuesta: "Error al consultar datos"
                    })
                })
            }
        }
    }

    obtenerEmpresas() {
        this.setState({
            clientes: []
        })
        if (this.state.empresas.length === 0) {
            getDocs(collection(db, "empresas")).then(response => {
                let listado = [];
                for (const value of response.docs) {
                    listado.push(value.data())
                }
                this.setState({
                    empresas: listado,
                    clientes: [],
                });
            }).catch(error => {
                this.setState({
                    empresas: [],
                    clientes: [],
                    respuesta: "Error al consultar datos"
                })
            })
        }
    }

    obtenerClientes() {
        var codigoEmpresa = this.state.alquiler.codigoEmpresa;
        var queryFiltro = query(collection(db, "clientes"), where("codigoEmpresa", "==", codigoEmpresa));
        getDocs(queryFiltro).then(response => {
            let listado = [];
            for (const value of response.docs) {
                listado.push(value.data())
            }
            this.setState({
                clientes: listado
            });
        }).catch(error => {
            this.setState({
                clientes: [],
                respuesta: "Error al consultar datos"
            })
        })
    }

    obtenerClientesV(codigoEmpresa) {
        var queryFiltro = query(collection(db, "clientes"), where("codigoEmpresa", "==", codigoEmpresa));
        getDocs(queryFiltro).then(response => {
            let listado = [];
            for (const value of response.docs) {
                listado.push(value.data())
            }
            this.setState({
                clientes: listado
            });
        }).catch(error => {
            this.setState({
                clientes: [],
                respuesta: "Error al consultar datos"
            })
        })
    }

    obtenerMaquinaria(codigoEmpresa) {
        var queryFiltro = query(collection(db, "maquinarias"), where("codigoEmpresa", "==", codigoEmpresa));
        getDocs(queryFiltro).then(response => {
            let listado = [];
            for (const value of response.docs) {
                listado.push(value.data())
            }
            this.setState({
                maquinarias: listado
            });
        }).catch(error => {
            this.setState({
                maquinarias: [],
                respuesta: "Error al consultar datos"
            })
        })
    }

    renderizarListadoEmpresas() {
        return this.state.empresas.length > 0
            && this.state.empresas.map((item, i) => {
                return (
                    <option key={i} value={item.codigoEmpresa}>{item.nombre}</option>
                )
            });
    }

    renderizarListadoClientes() {
        return this.state.clientes.length > 0
            && this.state.clientes.map((item, i) => {
                return (
                    <option key={i} value={item.codigoCliente}>{item.nombre}</option>
                )
            });
    }

    renderizarListadoMaquinarias() {
        return this.state.maquinarias.length > 0
            && this.state.maquinarias.map((item, i) => {
                return (
                    <li onClick={() => {
                        var unidad = 1;
                        var { codigoMaquina, nombre, precio } = item;
                        var detalleItem = {
                            codigoMaquina, nombre, precio, unidad
                        }
                        this.setState({
                            detalle: [...this.state.detalle, detalleItem]
                        })
                    }} className='shadow-2xl border-indigo-500 rounded-lg bg-indigo-400 p-4 mb-6' key={i} value={item.codigoMaquina}>{item.nombre}</li>
                )
            });
    }

    async eventoFormulario(event) {
        event.preventDefault();
        this.setState({
            respuesta: ""
        })
        try {

            var alquiler = {
                codigoCliente: this.state.alquiler.codigoCliente,
                fecha: this.state.alquiler.fecha,
                codigoAlquiler: uuid()
            }

            var detalleAlq = [...this.state.detalle]

            var refs = collection(db, "alquileres");

            var refsDetalle = collection(db, "detalle_alquileres");
            var response = await addDoc(refs, alquiler);
            for (const detalle of detalleAlq) {
                var envio = {
                    ...detalle,
                    codigoAlquiler: alquiler.codigoAlquiler
                }
                await addDoc(refsDetalle, envio);
            }
            if (response && response.id.length > 0) {
                const valores = {
                    id: response.id,
                    info: alquiler
                }
                var nuevaLista = [...this.state.alquileres, valores];
                this.setState({
                    alquileres: nuevaLista,
                    filtradoListadoAlquileres: nuevaLista,
                    alquiler: {
                        fecha: '',
                        detalle: [],
                        maquinarias: [],
                    },
                    respuesta: "Alquiler creado"
                })
            }
        } catch (error) {
            this.setState({
                respuesta: "Error al crear cliente"
            })
        }
    }

    agregarItem(posicion, event) {
        event.preventDefault();
        var nuevaLista = [...this.state.detalle];
        nuevaLista[posicion].unidad += 1
        this.setState({
            detalle: nuevaLista
        })
    }


    quitarUnidad(posicion, event) {
        event.preventDefault();
        var nuevaLista = [...this.state.detalle];
        nuevaLista[posicion].unidad -= 1
        this.setState({
            detalle: nuevaLista
        })
    }

    quitarItem(data, event) {
        event.preventDefault();
        var nuevaLista = this.state.detalle.filter(item => item.codigoMaquina !== data.codigoMaquina);
        this.setState({
            detalle: nuevaLista,
        });
    }

    componentDidMount() {
        getDocs(collection(db, "alquileres")).then(response => {
            let listado = [];
            for (const value of response.docs) {
                var detalle = {
                    id: value.id,
                    info: value.data()
                }
                listado.push(detalle)
            }
            this.setState({
                alquileres: listado,
                filtradoListadoAlquileres: listado
            })
        }).catch(error => {
            this.setState({
                alquileres: [],
                respuesta: "Error al consultar datos"
            })
        })
    }

    componentWillUnmount() {
        this.setState({
            alquileres: [],
            filtradoListadoAlquileres: [],
            respuesta: ""
        })
    }

    render() {
        return (
            <>
                <h6 className="text-blueGray-800 text-2xl mb-2 font-bold">Alquiler</h6>
                <div className="relative flex flex-col min-w-0 break-words w-full mb-6 shadow-2xl border-indigo-500 rounded-lg bg-white border-0">
                    <div className="flex-auto px-4 lg:px-10 py-10 pt-0">
                        <form className="w-full py-10" onSubmit={this.eventoFormulario}>
                            <h6 className="text-blueGray-700 text-sm mt-3 mb-6 font-bold ">
                                Información del alquiler
                            </h6>
                            {this.state.respuesta && <AlertPopper color="indigo" message={this.state.respuesta} />}
                            <div className="flex flex-wrap items-center -mx-3 mb-6">
                                <div className="w-full md:w-1/3 px-3 mb-6 md:mb-0">
                                    <label
                                        className="block  tracking-wide text-gray-700 text-xs font-bold mb-2"
                                        htmlFor="grid-first-name">
                                        Fecha
                                    </label>
                                    <input
                                        className="appearance-none block w-full bg-gray-200 text-gray-700 border rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white"
                                        name="fecha"
                                        value={this.state.alquiler.fecha}
                                        onChange={this.cambiosFormulario}
                                        type="date"
                                        placeholder="Edwin Perez"
                                    />
                                </div>

                                <div className="w-full md:w-1/3 px-3 mb-6 md:mb-0">
                                    <label className="block  tracking-wide text-gray-700 text-xs font-bold mb-2" htmlFor="grid-city">
                                        Empresa
                                    </label>
                                    <div className="relative">
                                        <select
                                            className="block appearance-none w-full bg-gray-200 border border-gray-200 text-gray-700 py-3 px-4 pr-8 rounded leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                                            id="grid-state"
                                            name="codigoEmpresa"
                                            value={this.state.alquiler.codigoEmpresa}
                                            onChange={this.cambiosFormulario}
                                            onClick={this.obtenerEmpresas}
                                        >
                                            {this.renderizarListadoEmpresas()}
                                        </select>
                                        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                                            <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" /></svg>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="flex flex-wrap -mx-3 mb-2">
                                <div className="w-full md:w-1/3 px-3 mb-6 md:mb-0">
                                    <label className="block tracking-wide text-gray-700 text-xs font-bold mb-2" htmlFor="grid-state">
                                        Cliente
                                    </label>
                                    <div className="relative">
                                        <select
                                            className="block appearance-none w-full bg-gray-200 border border-gray-200 text-gray-700 py-3 px-4 pr-8 rounded leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                                            id="grid-state"
                                            name="codigoCliente"
                                            value={this.state.alquiler.codigoCliente}
                                            onChange={this.cambiosFormulario}
                                            onClick={this.obtenerClientes}
                                        >
                                            {this.renderizarListadoClientes()}
                                        </select>
                                        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                                            <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" /></svg>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="flex flex-wrap -mx-3 mb-2">
                                <div className="w-full px-3 mb-6 md:mb-0">
                                    <label className="block tracking-wide text-gray-700 text-xs font-bold mb-2" htmlFor="grid-state">
                                        Maquinaria
                                    </label>
                                    <ul className='h-64 overflow-visible'>
                                        {this.renderizarListadoMaquinarias()}
                                    </ul>
                                </div>
                            </div>

                            <div
                                className={
                                    "relative flex flex-col min-w-0 break-words w-full mb-6"
                                }
                            >
                                <div className="block w-full overflow-x-auto mt-6">
                                    <table className="items-center w-full border-collapse ">
                                        <thead>
                                            <tr className="bg-white text-blueGray-800">
                                                <th
                                                    className={
                                                        "px-6 align-middle border border-solid py-3 text-xs border-l-0 border-r-0 whitespace-nowrap font-semibold text-left"

                                                    }
                                                >
                                                    Maquina
                                                </th>
                                                <th
                                                    className={
                                                        "px-6 align-middle border border-solid py-3 text-xs border-l-0 border-r-0 whitespace-nowrap font-semibold text-left"
                                                    }
                                                >
                                                    Unidades
                                                </th>
                                                <th
                                                    className={
                                                        "px-6 align-middle border border-solid py-3 text-xs border-l-0 border-r-0 whitespace-nowrap font-semibold text-left"
                                                    }
                                                >
                                                    Precio
                                                </th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {this.state.detalle.map((item, posicion) => {
                                                return (
                                                    <tr
                                                        className=""
                                                        key={posicion}
                                                    >
                                                        <td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4">
                                                            {item.nombre}
                                                        </td>
                                                        <td className="border-t-0 px-6 flex align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4">
                                                            <div className="w-1/3 m-2" >
                                                                <button onClick={this.agregarItem.bind(this, posicion)} >
                                                                    <i className="fas fa-plus"></i>
                                                                </button>
                                                            </div>
                                                            <div className="w-1/3 m-2" >
                                                                {item.unidad}
                                                            </div>

                                                            <div className="w-1/3 m-2" >
                                                                <button onClick={this.quitarUnidad.bind(this, posicion)} >
                                                                    <i className="fas fa-minus "></i>
                                                                </button>
                                                            </div>
                                                        </td>
                                                        <td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4">
                                                            {item.precio}
                                                        </td>
                                                        <td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4">
                                                            <div className="w-1/2" >
                                                                <button onClick={this.quitarItem.bind(this, item)} >
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



                            <button
                                disabled={!this.state.detalle.length > 0 || !this.state.alquiler.codigoCliente || !this.state.alquiler.fecha}
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
                                                Alquileres
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
                                        {this.renderizarListadoEmpresas()}
                                    </select>
                                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                                        <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" /></svg>
                                    </div>
                                </div>
                                <label className="block  tracking-wide text-white text-xs font-bold mb-2" htmlFor="grid-state">
                                    Clientes
                                </label>
                                <div className="relative">
                                    <select
                                        className="block appearance-none w-full text-gray-700 py-3 px-4 pr-8 rounded leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                                        id="grid-state"
                                        onChange={this.filtrarPorCliente}
                                    >
                                        {this.renderizarListadoClientes()}
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
                                                Fecha
                                            </th>
                                            <th
                                                className={
                                                    "px-6 align-middle border border-solid py-3 text-xs border-l-0 border-r-0 whitespace-nowrap font-semibold text-left"
                                                }
                                            >
                                                Ver maquinaria
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
                                        {this.state.filtradoListadoAlquileres.map((alquiler, posicion) => {
                                            return (
                                                <tr
                                                    className=""
                                                    key={posicion}
                                                >
                                                    <td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4">
                                                        {alquiler.info.fecha}
                                                    </td>
                                                    <td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4">
                                                        <button onClick={this.filtrarMaquinaAlquiler.bind(this, alquiler)} >
                                                            <i className="fas fa-arrow-down"></i>
                                                        </button>
                                                    </td>
                                                    <td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4">
                                                        <div className="w-1/2" >
                                                            <button onClick={this.eliminarAlquiler.bind(this, alquiler)} >
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


                <div
                    id='detalle'
                    className={
                        "relative flex flex-col min-w-0 break-words w-full mb-6"
                    }
                >
                    <h3
                        className={
                            "font-semibold text-lg"
                        }
                    >
                        Detalle de alquiler
                    </h3>
                    <div className="block w-full overflow-x-auto mt-6">
                        <table className="items-center w-full border-collapse ">
                            <thead>
                                <tr className="bg-white text-blueGray-800">
                                    <th
                                        className={
                                            "px-6 align-middle border border-solid py-3 text-xs border-l-0 border-r-0 whitespace-nowrap font-semibold text-left"

                                        }
                                    >
                                        Maquina
                                    </th>
                                    <th
                                        className={
                                            "px-6 align-middle border border-solid py-3 text-xs border-l-0 border-r-0 whitespace-nowrap font-semibold text-left"
                                        }
                                    >
                                        Unidades
                                    </th>
                                    <th
                                        className={
                                            "px-6 align-middle border border-solid py-3 text-xs border-l-0 border-r-0 whitespace-nowrap font-semibold text-left"
                                        }
                                    >
                                        Precio
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {this.state.filtradoDetalleMaquinarias.map((item, posicion) => {
                                    return (
                                        <tr
                                            className=""
                                            key={posicion}
                                        >
                                            <td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4">
                                                {item.info.nombre}
                                            </td>
                                            <td className="border-t-0 px-6 flex align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4">
                                                {item.info.unidad}
                                            </td>
                                            <td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4">
                                                {item.info.precio}
                                            </td>
                                            <td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4">
                                                <div className="w-1/2" >
                                                    <button onClick={this.eliminarDetalle.bind(this, item)} >
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
            </>
        );
    }
}

export default Alquileres;