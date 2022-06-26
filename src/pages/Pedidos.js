import React, { Component } from 'react';
import AlertPopper from 'components/AlertPopper';

import { getDocs, collection, doc, deleteDoc, addDoc, query, where } from 'firebase/firestore';
import { db } from "../utils/firebase";

import { v4 as uuid } from 'uuid';

class Pedidos extends Component {
    constructor(props) {
        super(props);
        this.state = {
            pedidos: [],
            filtradoListadoPedidos: [],
            filtradoDetalleProductos: [],
            respuesta: "",
            pedido: {},
            empresas: [],
            productos: [],
            detalle: [],
        }
        this.cambiosFormulario = this.cambiosFormulario.bind(this);
        this.renderizarListadoEmpresas = this.renderizarListadoEmpresas.bind(this);
        this.obtenerEmpresas = this.obtenerEmpresas.bind(this);
        this.renderizarListadoProductos = this.renderizarListadoProductos.bind(this);
        this.obtenerProductos = this.obtenerProductos.bind(this);
        this.filtrarPorEmpresa = this.filtrarPorEmpresa.bind(this);
        this.eliminarPedido = this.eliminarPedido.bind(this);
        this.eliminarDetalle = this.eliminarDetalle.bind(this);
        this.agregarItem = this.agregarItem.bind(this);
        this.quitarUnidad = this.quitarUnidad.bind(this);
        this.quitarItem = this.quitarItem.bind(this);
        this.eventoFormulario = this.eventoFormulario.bind(this);
        this.filtrarProductoPedido = this.filtrarProductoPedido.bind(this);
    }

    cambiosFormulario(event) {
        this.setState(data => (
            {
                pedido: {
                    ...data.pedido,
                    [event.target.name]: event.target.value
                }
            }));
        if (event.target.name === "codigoEmpresa") {
            this.obtenerProductos(event.target.value);
        }
    }

    filtrarPorEmpresa(event) {
        var codigoEmpresa = event.target.value;
        var nuevaLista = this.state.pedidos.filter((pedido) => pedido.info.codigoEmpresa === codigoEmpresa);
        this.setState({
            filtradoListadoPedidos: nuevaLista
        });
    }

    async eliminarPedido(info, event) {
        event.preventDefault();
        if (info.id !== null) {
            if (info.id.length > 0) {
                const ref = doc(db, "pedidos", info.id)
                await deleteDoc(ref);
                var nuevaLista = this.state.pedidos.filter(pedido => pedido.id !== info.id);
                this.setState({
                    pedidos: nuevaLista,
                    filtradoListadoPedidos: nuevaLista,
                    pedido: {},
                    respuesta: "Información eliminada exitosamente"
                });
            }
        }
    }

    async eliminarDetalle(info, event) {
        event.preventDefault();
        if (info.id !== null) {
            if (info.id.length > 0) {
                const ref = doc(db, "detalle_pedidos", info.id)
                await deleteDoc(ref);
                var nuevaLista = this.state.filtradoDetalleProductos.filter(detalle => detalle.id !== info.id);
                this.setState({
                    filtradoDetalleProductos: nuevaLista,
                    respuesta: "Información eliminada exitosamente"
                });
            }
        }
    }


    filtrarProductoPedido(data, event) {
        event.preventDefault();
        window.location.href = "#detalle"
        if (data.info !== null) {
            if (data.info.codigoPedido.length > 0) {
                var queryFiltro = query(collection(db, "detalle_pedidos"), where("codigoPedido", "==", data.info.codigoPedido));
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
                        filtradoDetalleProductos: listado
                    });
                }).catch(error => {
                    this.setState({
                        filtradoDetalleProductos: [],
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

    obtenerProductos(codigoEmpresa) {
        var queryFiltro = query(collection(db, "productos"), where("codigoEmpresa", "==", codigoEmpresa));
        getDocs(queryFiltro).then(response => {
            let listado = [];
            for (const value of response.docs) {
                listado.push(value.data())
            }
            this.setState({
                productos: listado
            });
        }).catch(error => {
            this.setState({
                productos: [],
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

    renderizarListadoProductos() {
        return this.state.productos.length > 0
            && this.state.productos.map((item, i) => {
                return (
                    <li onClick={() => {
                        var unidad = 1;
                        var { codigoProducto, nombre, precio } = item;
                        var detalleItem = {
                            codigoProducto, nombre, precio, unidad
                        }
                        this.setState({
                            detalle: [...this.state.detalle, detalleItem]
                        })
                    }} className='shadow-2xl border-indigo-500 rounded-lg bg-indigo-400 p-4 mb-6' key={i} value={item.codigoProducto}>{item.nombre}</li>
                )
            });
    }

    async eventoFormulario(event) {
        event.preventDefault();
        this.setState({
            respuesta: ""
        })
        try {

            var pedido = {
                codigoEmpresa: this.state.pedido.codigoEmpresa,
                fecha: this.state.pedido.fecha,
                nombre: this.state.pedido.nombre,
                direccion: this.state.pedido.direccion,
                codigoPedido: uuid()
            }

            var detalleAlq = [...this.state.detalle]

            var refs = collection(db, "pedidos");

            var refsDetalle = collection(db, "detalle_pedidos");
            var response = await addDoc(refs, pedido);
            for (const detalle of detalleAlq) {
                var envio = {
                    ...detalle,
                    codigoPedido: pedido.codigoPedido
                }
                await addDoc(refsDetalle, envio);
            }
            if (response && response.id.length > 0) {
                const valores = {
                    id: response.id,
                    info: pedido
                }
                var nuevaLista = [...this.state.pedidos, valores];
                this.setState({
                    pedidos: nuevaLista,
                    filtradoListadoPedidos: nuevaLista,
                    pedido: {
                        fecha: '',
                        nombre: '',
                        direccion: '',
                        codigoPedido: '',
                        codigoEmpresa: ''
                    },
                    detalle: [],
                    productos: [],
                    respuesta: "Pedido creado"
                })
            }
        } catch (error) {
            this.setState({
                respuesta: "Error al crear pedido"
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
        var nuevaLista = this.state.detalle.filter(item => item.codigoProducto !== data.codigoProducto);
        this.setState({
            detalle: nuevaLista,
        });
    }

    componentDidMount() {
        getDocs(collection(db, "pedidos")).then(response => {
            let listado = [];
            for (const value of response.docs) {
                var detalle = {
                    id: value.id,
                    info: value.data()
                }
                listado.push(detalle)
            }
            this.setState({
                pedidos: listado,
                filtradoListadoPedidos: listado
            })
        }).catch(error => {
            this.setState({
                pedidos: [],
                respuesta: "Error al consultar datos"
            })
        })
    }

    componentWillUnmount() {
        this.setState({
            pedidos: [],
            filtradoListadoPedidos: [],
            respuesta: ""
        })
    }

    render() {
        return (
            <>
                <h6 className="text-blueGray-800 text-2xl mb-2 font-bold">Pedidos</h6>
                <div className="relative flex flex-col min-w-0 break-words w-full mb-6 shadow-2xl border-indigo-500 rounded-lg bg-white border-0">
                    <div className="flex-auto px-4 lg:px-10 py-10 pt-0">
                        <form className="w-full py-10" onSubmit={this.eventoFormulario}>
                            <h6 className="text-blueGray-700 text-sm mt-3 mb-6 font-bold ">
                                Información del pedido
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
                                        value={this.state.pedido.fecha}
                                        onChange={this.cambiosFormulario}
                                        type="date"
                                        placeholder="01/01/2022"
                                    />
                                </div>
                                <div className="w-full md:w-1/3 px-3 mb-6 md:mb-0">
                                    <label
                                        className="block  tracking-wide text-gray-700 text-xs font-bold mb-2"
                                        htmlFor="grid-first-name">
                                        Nombre
                                    </label>
                                    <input
                                        className="appearance-none block w-full bg-gray-200 text-gray-700 border rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white"
                                        name="nombre"
                                        value={this.state.pedido.nombre}
                                        onChange={this.cambiosFormulario}
                                        type="text"
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
                                            value={this.state.pedido.codigoEmpresa}
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
                                <div className="w-full md:w-1/3 px-3 mb-6 md:mb-0">
                                    <label
                                        className="block  tracking-wide text-gray-700 text-xs font-bold mb-2"
                                        htmlFor="grid-first-name">
                                        Dirección
                                    </label>
                                    <input
                                        className="appearance-none block w-full bg-gray-200 text-gray-700 border rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white"
                                        name="direccion"
                                        value={this.state.pedido.direccion}
                                        onChange={this.cambiosFormulario}
                                        type="text"
                                        placeholder="Sixtino"
                                    />
                                </div>
                            </div>
                            <div className="flex flex-wrap -mx-3 mb-2">
                                <div className="w-full px-3 mb-6 md:mb-0">
                                    <label className="block tracking-wide text-gray-700 text-xs font-bold mb-2" htmlFor="grid-state">
                                        Productos
                                    </label>
                                    <ul className='h-64 overflow-visible'>
                                        {this.renderizarListadoProductos()}
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
                                                    Producto
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
                                disabled={!this.state.detalle.length > 0 || !this.state.pedido.codigoEmpresa || !this.state.pedido.fecha || !this.state.pedido.nombre}
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
                                                Pedidos
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
                                                Ver productos
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
                                        {this.state.filtradoListadoPedidos.map((pedido, posicion) => {
                                            return (
                                                <tr
                                                    className=""
                                                    key={posicion}
                                                >
                                                    <td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4">
                                                        {pedido.info.fecha}
                                                    </td>
                                                    <td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4">
                                                        {pedido.info.nombre}
                                                    </td>
                                                    <td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4">
                                                        {pedido.info.direccion}
                                                    </td>
                                                    <td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4">
                                                        <button onClick={this.filtrarProductoPedido.bind(this, pedido)} >
                                                            <i className="fas fa-arrow-down"></i>
                                                        </button>
                                                    </td>
                                                    <td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4">
                                                        <div className="w-1/2" >
                                                            <button onClick={this.eliminarPedido.bind(this, pedido)} >
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
                        Detalle de pedidos
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
                                        Producto
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
                                {this.state.filtradoDetalleProductos.map((item, posicion) => {
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

export default Pedidos;