import React, { Component } from "react";
import { Link } from "react-router-dom";
import Opciones from "components/Opciones";

class Navegacion extends Component {
  constructor(props) {
    super(props);
    this.state = {
      expandir: "hidden"
    }
  }

  render() {
    return (
      <>
        <nav className="md:left-0 md:block md:fixed md:top-0 md:bottom-0 md:overflow-y-auto md:flex-row md:flex-nowrap md:overflow-hidden shadow-xl bg-indigo-400 flex flex-wrap items-center justify-between relative md:w-64 z-10 py-4 px-6">
          <div className="md:flex-col md:items-stretch md:min-h-full md:flex-nowrap px-0 flex flex-wrap items-center justify-between w-full mx-auto">
            <button
              className="cursor-pointer text-white md:hidden px-3 py-1 text-xl"
              type="button"
              onClick={() => this.setState({
                expandir: "bg-indigo-400 m-2 py-3 px-6"
              })}
            >
              <i className="fas fa-bars"></i>
            </button>
            <p
              className="md:block text-left md:pb-2 text-white mr-0 inline-block whitespace-nowrap text-sm font-bold p-4 px-0"
            >
              Proyecto seminario
            </p>
            <ul className="md:hidden items-center flex flex-wrap list-none">
              <li className="inline-block relative">
                <Opciones />
              </li>
            </ul>
            <div
              className={
                "md:flex md:flex-col md:items-stretch md:opacity-100 md:relative md:mt-4 md:shadow-none shadow absolute top-0 left-0 right-0 z-40 overflow-y-auto overflow-x-hidden h-auto items-center flex-1 rounded " +
                this.state.expandir
              }
            >
              <div className="md:min-w-full md:hidden block pb-4 mb-4">
                <div className="flex flex-wrap">
                  <div className="w-6/12">
                    <p
                      className="md:block text-left md:pb-2 text-white mr-0 inline-block whitespace-nowrap text-sm  font-bold p-4 px-0"
                    >
                      Proyecto seminario
                    </p>
                  </div>
                  <div className="w-6/12 flex justify-end">
                    <button
                      type="button"
                      className="cursor-pointer text-white md:hidden px-3 py-1 text-xl leading-none"
                      onClick={() => this.setState({
                        expandir: "hidden"
                      })}
                    >
                      <i className="fas fa-times"></i>
                    </button>
                  </div>
                </div>
              </div>

              <ul className="md:flex-col md:min-w-full flex flex-col list-none md:mb-4">
                <li className="items-center">
                  <Link
                    className="text-white hover:text-white text-xs  py-3 font-bold block"
                    to="/usuarios"
                  >
                    Usuarios
                  </Link>
                </li>

                <li className="items-center">
                  <Link
                    className="text-white hover:text-white text-xs  py-3 font-bold block"
                    to="/empresas"
                  >
                    Empresas
                  </Link>
                </li>

                <li className="items-center">
                  <Link
                    className="text-white hover:text-white text-xs  py-3 font-bold block"
                    to="/sucursales"
                  >
                    Sucursales
                  </Link>
                </li>
                <li className="items-center">
                  <Link
                    className={
                      "text-white hover:text-white text-xs  py-3 font-bold block"
                    }
                    to="/clientes"
                  >
                    Clientes
                  </Link>
                </li>

                <li className="items-center">
                  <Link
                    className={
                      "text-white hover:text-white text-xs  py-3 font-bold block"
                    }
                    to="/proveedores"
                  >
                    Proveedores
                  </Link>
                </li>

                <li className="items-center">
                  <Link
                    className={
                      "text-white hover:text-white text-xs  py-3 font-bold block"
                    }
                    to="/productos"
                  >
                    Productos
                  </Link>
                </li>
                <li className="items-center">
                  <Link
                    className={
                      "text-white hover:text-white text-xs  py-3 font-bold block"
                    }
                    to="/maquinarias"
                  >
                    Maquinarias
                  </Link>
                </li>
                <li className="items-center">
                  <Link
                    className={
                      "text-white hover:text-white text-xs  py-3 font-bold block"
                    }
                    to="/alquileres"
                  >
                    Alquiler
                  </Link>
                </li>
                <li className="items-center">
                  <Link
                    className={
                      "text-white hover:text-white text-xs  py-3 font-bold block"
                    }
                    to="/cotizaciones"
                  >
                    Cotizaciones
                  </Link>
                </li>
                <li className="items-center">
                  <Link
                    className={
                      "text-white hover:text-white text-xs  py-3 font-bold block"
                    }
                    to="/pedidos"
                  >
                    Pedidos
                  </Link>
                </li>
                <li className="items-center">
                  <Link
                    className={
                      "text-white hover:text-white text-xs py-3 font-bold block"
                    }
                    to="/facturas"
                  >
                    Facturaci&oacute;n
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        </nav>
      </>
    );
  }
}

export default Navegacion;

