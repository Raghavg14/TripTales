import { useContext } from "react";

import { NavLink, useNavigate } from "react-router-dom";
import { AuthContext } from "../../Context/auth-context";

import "./NavLinks.css";

export default function NavLinks(props) {
  const navigate = useNavigate();
  const auth = useContext(AuthContext);
  return (
    <ul className="nav-links">
      <li>
        <NavLink to="/">ALL USERS</NavLink>
      </li>
      {auth.isLoggedIn && (
        <li>
          <NavLink to={`/${auth.userId}/places`}>MY PLACES</NavLink>
        </li>
      )}
      {auth.isLoggedIn && (
        <li>
          <NavLink to="/places/new">ADD PLACES</NavLink>
        </li>
      )}
      {!auth.isLoggedIn && (
        <li>
          <NavLink to="/auth">LOGIN</NavLink>
        </li>
      )}
      {auth.isLoggedIn && (
        <li>
          <button
            onClick={() => {
              auth.logout();
              navigate("/auth"); // Separate the logout and navigation calls
            }}
          >
            LOGOUT
          </button>
        </li>
      )}
    </ul>
  );
}
