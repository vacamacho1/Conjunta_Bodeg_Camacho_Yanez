import { useState } from "react";
import { auth } from "../../api/firebase-config";
import {
  signInWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup,
} from "firebase/auth";
import { Card, Button, Modal, Form, Alert } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { isEmail } from "validator"; // Importa la función isEmail de validator

const Login = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorAlert, setErrorAlert] = useState(null);

  const signInWithGoogle = () => {
    const provider = new GoogleAuthProvider();
    signInWithPopup(auth, provider)
      .then((result) => {
        const credential = GoogleAuthProvider.credentialFromResult(result);
        const token = credential.accessToken;
        if (token) {
          const user = result.user;

          setUser({
            displayName: user.displayName,
            email: user.email,
            photoURL: user.photoURL,
          });
          setShowModal(true);

          localStorage.setItem("userToken", token);
          navigate("/home");
        }
      })
      .catch((error) => {
        console.error("Error al iniciar sesión con Google:", error.message);
        setErrorAlert(
          "Error al iniciar sesión con Google. Por favor, inténtalo de nuevo."
        );
      });
  };

  const handleSignInWithEmailAndPassword = async (e) => {
    e.preventDefault();
    if (!isEmail(email)) {
      setErrorAlert("Por favor, ingresa un correo electrónico válido.");
      return;
    }
    if (password.length < 6) {
      setErrorAlert("La contraseña debe tener al menos 6 caracteres.");
      return;
    }

    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = userCredential.user;

      if (user) {
        const token = await user.getIdToken();

        if (token) {
          setUser({
            displayName: user.displayName || "Usuario sin nombre",
            email: user.email,
            photoURL: user.photoURL,
          });
          setShowModal(true);
          localStorage.setItem("userToken", token);
          setErrorAlert(null);
          navigate("/home");
        }
      }
    } catch (error) {
      console.error("Error al iniciar sesión:", error.message);
      setErrorAlert("Usuario o contraseña incorrectos.");
    }
  };

  return (
    <div
      className="d-flex justify-content-center align-items-center"
      style={{ minHeight: "100vh" }}
    >
      <Card style={{ width: "300px" }}>
        <Card.Body>
          <Card.Title className="text-center mb-4">Iniciar Sesión</Card.Title>
          {errorAlert && <Alert variant="danger">{errorAlert}</Alert>}
          <Form onSubmit={handleSignInWithEmailAndPassword}>
            <Form.Group className="mb-3" controlId="formBasicEmail">
              <Form.Label>Correo Electrónico</Form.Label>
              <Form.Control
                type="email"
                placeholder="Ingresa tu correo"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </Form.Group>

            <Form.Group className="mb-3" controlId="formBasicPassword">
              <Form.Label>Contraseña</Form.Label>
              <Form.Control
                type="password"
                placeholder="Contraseña"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </Form.Group>

            <Button variant="primary" type="submit" className="w-100 mb-2">
              Entrar
            </Button>
          </Form>
          <Button variant="danger" className="w-100" onClick={signInWithGoogle}>
            Iniciar sesión con Google
          </Button>
        </Card.Body>
      </Card>

      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Datos del Usuario</Modal.Title>
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

export default Login;
