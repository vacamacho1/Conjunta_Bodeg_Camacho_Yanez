import React, { useState } from "react";
import { getAuth, updatePassword, EmailAuthProvider, reauthenticateWithCredential } from "firebase/auth";
import { Card, Button, Form, Toast, InputGroup, Alert } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";
import "./Change-password.css";
import Loading from "../../general/Loading";

const ChangePassword = () => {
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [currentPassword, setCurrentPassword] = useState("");
  const [toasts, setToasts] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const addToast = (message) => {
    const newToast = { id: Date.now(), message };
    setToasts((prevToasts) => [...prevToasts, newToast]);
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    setIsLoading(true); 

    if (newPassword !== confirmPassword) {
      addToast("Las contraseñas nuevas no coinciden.");
      setIsLoading(false);
      return;
    }

    const auth = getAuth();
    const user = auth.currentUser;
    const credential = EmailAuthProvider.credential(
      user.email,
      currentPassword
    );

    reauthenticateWithCredential(user, credential)
      .then(() => {
        updatePassword(user, newPassword)
          .then(() => {
            addToast("Contraseña cambiada con éxito.");
          })
          .catch((error) => {
            console.error(error);
            addToast("Error al cambiar la contraseña: " + error.message);
          })
          .finally(() => {
            setIsLoading(false); 
          });
      })
      .catch((error) => {
        console.error(error);
        addToast("La contraseña actual es incorrecta: " + error.message);
        setIsLoading(false); 
      });
  };

  if (isLoading) {
    return <Loading />;
  }

  return (
    <div className="d-flex justify-content-center align-items-center mt-5">
      <Card style={{ width: "24rem", boxShadow: "0 4px 8px rgba(0,0,0,0.1)" }}>
        <Card.Body>
          <Card.Title>Cambiar Contraseña</Card.Title>
          {message && <Alert variant="success">{message}</Alert>}
          <Form onSubmit={handleChangePassword}>
            <Form.Group className="mb-3" controlId="currentPassword">
              <Form.Label>Contraseña Actual</Form.Label>
              <InputGroup>
                <Form.Control
                  type={showPassword ? "text" : "password"}
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  required
                />
                <InputGroup.Text onClick={() => setShowPassword(!showPassword)}>
                  <FontAwesomeIcon icon={showPassword ? faEyeSlash : faEye} />
                </InputGroup.Text>
              </InputGroup>
            </Form.Group>

            <Form.Group className="mb-3" controlId="newPassword">
              <Form.Label>Nueva Contraseña</Form.Label>
              <InputGroup>
                <Form.Control
                  type={showConfirmPassword ? "text" : "password"}
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  required
                />
                <InputGroup.Text onClick={() => setShowPassword(!showConfirmPassword)}>
                  <FontAwesomeIcon icon={showConfirmPassword ? faEyeSlash : faEye} />
                </InputGroup.Text>
              </InputGroup>
            </Form.Group>

            <Form.Group className="mb-3" controlId="confirmPassword">
              <Form.Label>Confirmar Nueva Contraseña</Form.Label>
              <InputGroup>
                <Form.Control
                  type={showConfirmPassword ? "text" : "password"}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                />
                <InputGroup.Text
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  <FontAwesomeIcon
                    icon={showConfirmPassword ? faEyeSlash : faEye}
                  />
                </InputGroup.Text>
              </InputGroup>
            </Form.Group>

            <Button variant="primary" type="submit" disabled={isLoading}>
              Cambiar Contraseña
            </Button>
          </Form>
        </Card.Body>
      </Card>

      <div
        className="toast-container position-fixed bottom-0 end-0 p-3"
        style={{
          zIndex: 1051,
          display: "flex",
          flexDirection: "column-reverse",
        }}
      >
        {toasts.map((toast) => (
          <Toast
            key={toast.id}
            onClose={() =>
              setToasts((toasts) => toasts.filter((t) => t.id !== toast.id))
            }
            show={true}
            delay={5000}
            autohide
          >
            <Toast.Header>
              <strong className="me-auto">Notificación</strong>
            </Toast.Header>
            <Toast.Body>{toast.message}</Toast.Body>
          </Toast>
        ))}
      </div>
    </div>
  );
};

export default ChangePassword;
