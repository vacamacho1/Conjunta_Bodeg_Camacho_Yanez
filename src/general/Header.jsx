import React from "react";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faUser,
  faSignOutAlt,
  faKey,
  faBoxOpen,
  faPlusSquare,
} from "@fortawesome/free-solid-svg-icons";
import { Dropdown } from "react-bootstrap";

const Header = ({ userName, onLogout }) => {
  const navigate = useNavigate();

  const handleBrandClick = (e) => {
    e.preventDefault();
    navigate("/Home");
  };

  const handleNavigation = (path) => (e) => {
    e.preventDefault();
    navigate(path);
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-light">
      <div className="container-fluid">
        <a className="navbar-brand" href="/" onClick={handleBrandClick}>
          CAMACHOYANEZBODEGA
        </a>
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
          aria-controls="navbarNav"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        {userName && (
          <div className="collapse navbar-collapse" id="navbarNav">
            <ul className="navbar-nav">
              
            </ul>
          </div>
        )}

        <div
          className="collapse navbar-collapse justify-content-end"
          id="navbarNav"
        >
          <ul className="navbar-nav ml-auto">
            {userName ? (
              <>
                <Dropdown>
                  <Dropdown.Toggle variant="light" id="dropdown-basic">
                    <FontAwesomeIcon icon={faUser} /> {userName}
                  </Dropdown.Toggle>

                  <Dropdown.Menu>
                    <Dropdown.Item
                      href="/change-password"
                      onClick={handleNavigation("/change-password")}
                    >
                      <FontAwesomeIcon icon={faKey} /> Cambiar contraseña
                    </Dropdown.Item>
                    <Dropdown.Item onClick={onLogout}>
                      <FontAwesomeIcon icon={faSignOutAlt} /> Cerrar sesión
                    </Dropdown.Item>
                  </Dropdown.Menu>
                </Dropdown>
              </>
            ) : (
              <>
                
              </>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Header;
