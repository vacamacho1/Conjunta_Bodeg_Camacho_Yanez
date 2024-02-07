import React, { useState } from "react";
import { auth } from "../../api/firebase-config";
import {
  createUserWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup,
  updateProfile,
} from "firebase/auth";
import { Card, Button, Form, Modal, Alert } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

const Register = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [showErrorAlert, setShowErrorAlert] = useState(false);
  const [errorAlertMessage, setErrorAlertMessage] = useState("");
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });

  const registerWithGoogle = () => {
    const provider = new GoogleAuthProvider();
    signInWithPopup(auth, provider)
      .then((result) => {
        const credential = GoogleAuthProvider.credentialFromResult(result);
        const token = credential.accessToken;
        if (token) {
          const registeredUser = result.user;

          setUser({
            displayName: registeredUser.displayName,
            email: registeredUser.email,
            photoURL: registeredUser.photoURL,
          });
          setShowModal(true);

          localStorage.setItem("userToken", token);
          navigate("/home");
        }
      })
      .catch((error) => {
        console.error("Error al registrar con Google:", error.message);
        setShowErrorAlert(true);
        setErrorAlertMessage(
          "Error al registrar con Google. Por favor, inténtalo de nuevo."
        );
      });
  };

  const handleRegistration = async (e) => {
    e.preventDefault();
    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        formData.email,
        formData.password
      );
      const user = userCredential.user;

      await updateProfile(user, { displayName: formData.name });

      setUser({
        displayName: user.displayName,
        email: user.email,
        photoURL: user.photoURL,
      });
      setShowModal(true);
      localStorage.setItem("userToken", await user.getIdToken());
      navigate("/home");
    } catch (error) {
      console.error("Error al registrar:", error.message);
      setShowErrorAlert(true);
      setErrorAlertMessage(
        "Error al registrar. Por favor, verifica tus datos e inténtalo de nuevo."
      );
    }
  };

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <div
      className="d-flex justify-content-center align-items-center"
      style={{ minHeight: "100vh" }}
    >
      <Card style={{ width: "300px" }}>
        <Card.Body>
          <Card.Title className="text-center mb-4">Registro</Card.Title>
          {showErrorAlert && (
            <Alert
              variant="danger"
              onClose={() => setShowErrorAlert(false)}
              dismissible
            >
              {errorAlertMessage}
            </Alert>
          )}
          <Form onSubmit={handleRegistration}>
            <Form.Group className="mb-3" controlId="formBasicName">
              <Form.Label>Nombre</Form.Label>
              <Form.Control
                type="text"
                placeholder="Ingresa tu nombre"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                required
              />
            </Form.Group>

            <Form.Group className="mb-3" controlId="formBasicEmail">
              <Form.Label>Correo Electrónico</Form.Label>
              <Form.Control
                type="email"
                placeholder="Ingresa tu correo"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                required
              />
            </Form.Group>

            <Form.Group className="mb-3" controlId="formBasicPassword">
              <Form.Label>Contraseña</Form.Label>
              <Form.Control
                type="password"
                placeholder="Contraseña"
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                required
              />
            </Form.Group>

            <Button variant="primary" type="submit" className="w-100 mb-2">
              Registrar
            </Button>
          </Form>
          <Button
            variant="danger"
            className="w-100"
            onClick={registerWithGoogle}
          >
            Registrar con Google
          </Button>
        </Card.Body>
      </Card>

      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Datos del Usuario Registrado</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {user && (
            <div>
              <p>
                <strong>Nombre:</strong> {user.displayName}
              </p>
              <p>
                <strong>Correo Electrónico:</strong> {user.email}
              </p>
              {/* Puedes agregar más datos del usuario aquí */}
            </div>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="primary" onClick={() => setShowModal(false)}>
            Aceptar
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default Register;
