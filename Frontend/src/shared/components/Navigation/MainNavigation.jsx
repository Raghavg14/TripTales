import { Link } from "react-router-dom";
import { useState } from "react";

import NavLinks from "./NavLinks";
import SideDrawer from "./SideDrawer";
import MainHeader from "./MainHeader";
import Backdrop from "../UIElements/Backdrop";

import "./MainNavigation.css";

export default function MainNavigation(props) {
  const [showDrawer, setShowDrawer] = useState(false);

  const ShowDrawerHandler = () => {
    setShowDrawer((prevState) => !prevState);
  };

  return (
    <>
      {showDrawer && <Backdrop onClick={ShowDrawerHandler} />}
      <SideDrawer show={showDrawer} onClick={ShowDrawerHandler}>
        <nav className="main-navigation__drawer-nav">
          <NavLinks />
        </nav>
      </SideDrawer>

      <MainHeader>
        <button
          className="main-navigation__menu-btn"
          onClick={ShowDrawerHandler}
        >
          <span />
          <span />
          <span />
        </button>
        <h1 className="main-navigation__title">
          <Link to="/">TripTales</Link>
        </h1>
        <nav className="main-navigation__header-nav">
          <NavLinks />
        </nav>
      </MainHeader>
    </>
  );
}
