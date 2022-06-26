import React, { Component } from "react";

import Opciones from "components/Opciones.js";
import { signOut } from "firebase/auth";
import { auth } from "utils/firebase";

class AppBar extends Component {
  constructor(props) {
    super(props);
    this.logout = this.logout.bind(this);
  }

  async logout() {
    return await signOut(auth);
  }

  render() {
    return (
      <>
        <nav className="left-0 w-full bg-transparent md:flex-row md:flex-nowrap md:justify-start flex items-center p-4">
          <div className="w-full mx-auto items-center flex justify-between md:flex-nowrap flex-wrap md:px-10 px-4">

            <ul className="flex-col md:flex-row list-none items-center hidden md:flex">
              <Opciones logout={this.logout} />
            </ul>
          </div>
        </nav>
      </>
    );
  }
}

export default AppBar;