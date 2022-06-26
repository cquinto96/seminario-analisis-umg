import React from "react";
import { createPopper } from "@popperjs/core";
import { Link } from "react-router-dom";

const Opciones = ({ logout }) => {
  // dropdown props
  const [dropdownPopoverShow, setDropdownPopoverShow] = React.useState(false);
  const btnDropdownRef = React.createRef();
  const popoverDropdownRef = React.createRef();
  const openDropdownPopover = () => {
    createPopper(btnDropdownRef.current, popoverDropdownRef.current, {
      placement: "bottom-start",
    });
    setDropdownPopoverShow(true);
  };
  const closeDropdownPopover = () => {
    setDropdownPopoverShow(false);
  };

  const handleLogout = async () => {
    logout();
  }

  return (
    <>
      <button
        className="block"
        ref={btnDropdownRef}
        onClick={(e) => {
          e.preventDefault();
          dropdownPopoverShow ? closeDropdownPopover() : openDropdownPopover();
        }}
      >
        <div className="items-center flex">
          <span className="w-12 h-12 text-sm bg-indigo-400 inline-flex items-center justify-center rounded-full">
          <img
              alt="Usuario"
              className="w-full rounded-full align-middle border-none shadow-lg"
              src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT83_4nYbepKSRjeX5LgJcF8imUzSjkC49iXg&usqp=CAU"
            />
          </span>
        </div>
      </button>
      <div
        ref={popoverDropdownRef}
        className={
          (dropdownPopoverShow ? "block " : "hidden ") +
          "bg-indigo-400 text-base z-50 float-left py-2 list-none text-left rounded shadow-lg min-w-48"
        }
      >
        <div className="h-0 my-2" />
        <Link
          className={
            "text-sm py-2 px-4 font-normal block w-full whitespace-nowrap text-white"
          }
          to='/'
        >
          Home
        </Link>
        <Link
          className={
            "text-sm py-2 px-4 font-normal block w-full whitespace-nowrap text-white"
          }
          onClick={handleLogout}
          to='/login'
        >
          Logout
        </Link>
      </div>
    </>
  );
};

export default Opciones;
