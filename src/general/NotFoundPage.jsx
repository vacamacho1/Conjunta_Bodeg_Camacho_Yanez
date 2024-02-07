import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faExclamationTriangle } from "@fortawesome/free-solid-svg-icons";
import { Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

const NotFoundPage = ({ userName }) => {
  const navigate = useNavigate();

  return (
    <div
      className="d-flex flex-column justify-content-center align-items-center"
      style={{ height: "100vh" }}
    >
      <FontAwesomeIcon icon={faExclamationTriangle} size="3x" />
      <h1 className="mt-3">404 - Página no encontrada</h1>
      <p>Lo sentimos, la página que estás buscando no existe.</p>
      <Button variant="primary" onClick={() => navigate(userName ? "/home" : "/")}>
        Volver al inicio
      </Button>
    </div>
  );
};

export default NotFoundPage;
