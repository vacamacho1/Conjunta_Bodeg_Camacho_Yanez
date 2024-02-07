import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faWarehouse, faChartLine, faCogs } from '@fortawesome/free-solid-svg-icons';
import { Button, Card, CardGroup } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { faShop } from '@fortawesome/free-solid-svg-icons/faShop';

const HomePage = () => {
  const navigate = useNavigate();

  return (
    <div className="container mt-5">
      <h1 className="text-center mb-4">
        Inventario de Bodega</h1>
      <div className="text-center">
        <FontAwesomeIcon icon={faShop} size="6x" className="mb-3" />
       
        <br></br><br></br><br></br><br></br>
        <Button variant="primary" onClick={() => navigate('/login')}>Iniciar Sesión</Button>
        <Button variant="outline-secondary" className="ms-3" onClick={() => navigate('/register')}>Registrarse</Button>
      </div>

      
    </div>
  );
};

export default HomePage;
