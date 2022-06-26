import React from 'react';

import { filtrarUsuario } from "../utils/firebase";

import { Listbox } from '@headlessui/react';

export const Inventarios = () => {
    let negocio = localStorage.getItem("negocio");
    negocio = JSON.parse(negocio);

    const [inventarios, setInventarios] = React.useState([]);
    const [sucursal, setSucursales] = React.useState([{
        id: '',
        nombre: 'Sucursal'
    }]);
    const [selectedSucursal, setSelectedSucursal] = React.useState(sucursal[0]);
    const [loading, setLoading] = React.useState(true);

    const getSucursales = async () => {

        const tSucursales = [];
        const response = await filtrarUsuario(negocio.codigo, "sucursales", "id_negocio");
        response.forEach((value) => {
            tSucursales.push(value.data());
        });

        setSucursales(tSucursales);
    }


    const getInventarios = async (id) => {
        const values = [];
        const response = await filtrarUsuario(id, "inventarios", "id_sucursal");
        response.forEach((value) => {
            values.push(value.data());
        });

        for (const value of values) {
            const productos =
                await filtrarUsuario(value.id_producto, "productos", "id");
            productos.forEach((element) => {
                const { nombre } = element.data();
                
                value.producto = nombre;
            });
        }
        setLoading(false);
        setInventarios(values);
    }

    const handleChangeSucursal = (data) => {
        getInventarios(data.id)
        setSelectedSucursal(data);
    }

    function getListSucursales() {
        if (sucursal.length > 0) {
            return (
                <div className="border-0 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150">
                    <Listbox onChange={handleChangeSucursal}>
                        <Listbox.Button className="w-full text-left">{selectedSucursal.nombre}</Listbox.Button>
                        <Listbox.Options>
                            {sucursal.map((option, index) => {
                                return (
                                    <Listbox.Option
                                        key={index}
                                        value={option}
                                        className="w-full"
                                    >
                                        {option.nombre}
                                    </Listbox.Option>
                                );
                            })}
                        </Listbox.Options>
                    </Listbox>
                </div>
            );
        }
    }

    React.useEffect(() => {
        getSucursales();
    }, []);

    return (
        <>
            <div className="flex flex-wrap">
                <div className="w-full px-4">
                    <div
                        className="relative flex flex-col min-w-0 break-words w-full mb-6 shadow-lg rounded bg-white"
                    >
                        <div className="rounded-t mb-0 px-4 py-3 border-0">
                            <div className="flex flex-wrap items-center">
                                <div className="w-full px-4 flex-grow flex">
                                    <div className="w-1/2 text-left">
                                        <h3
                                            className="font-semibold text-lg text-blueGray-700"
                                        >
                                            Inventario por sucursal
                                        </h3>
                                    </div>
                                </div>
                            </div>

                            <div
                            >
                                {getListSucursales()}
                            </div>

                        </div>
                        <div className={ "block w-full overflow-x-auto " +
                            (loading ? "animate-pulse": "")
                        }>
                            <table className="items-center w-full bg-transparent border-collapse">
                                <thead>
                                    <tr>
                                        <th
                                            className="px-6 align-middle border border-solid py-3 text-xs border-l-0 border-r-0 whitespace-nowrap font-semibold text-left bg-blueGray-50 text-blueGray-500 border-blueGray-100"
                                        >
                                            Producto
                                        </th>
                                        <th
                                            className="px-6 align-middle border border-solid py-3 text-xs border-l-0 border-r-0 whitespace-nowrap font-semibold text-left bg-blueGray-50 text-blueGray-500 border-blueGray-100"
                                        >
                                            Existencia
                                        </th>
                                        <th
                                            className="px-6 align-middle border border-solid py-3 text-xs border-l-0 border-r-0 whitespace-nowrap font-semibold text-left bg-blueGray-50 text-blueGray-500 border-blueGray-100"
                                        >
                                            Costo unitario
                                        </th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {inventarios.map((data, key) => {
                                        return (<tr className="cursor-pointer" role="row" key={key}>
                                            <td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4">
                                                {data.producto}
                                            </td>
                                            <td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4">
                                                {data.cantidad}
                                            </td>
                                            <td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4">
                                                {data.costo}
                                            </td>
                                        </tr>);
                                    })
                                    }
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}