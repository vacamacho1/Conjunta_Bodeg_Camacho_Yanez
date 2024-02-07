import React, { useState, useEffect } from "react";
import { db } from "../../api/firebase-config";
import { collection, getDocs, query, orderBy, limit, startAfter, doc, updateDoc, deleteDoc } from "firebase/firestore";
import { Table, Button, Modal, Form, Badge } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit, faToggleOn, faToggleOff, faTrash } from "@fortawesome/free-solid-svg-icons";

const PAGE_SIZE = 10;

const ItemList = () => {
  const [items, setItems] = useState([]);
  const [lastVisible, setLastVisible] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [currentItem, setCurrentItem] = useState(null);

  useEffect(() => {
    fetchItems();
  }, []);

  const fetchItems = async () => {
    setLoading(true);
    const q = query(collection(db, "items"), orderBy("name"), limit(PAGE_SIZE));
    const querySnapshot = await getDocs(q);
    const lastVisibleItem = querySnapshot.docs[querySnapshot.docs.length - 1];
    setLastVisible(lastVisibleItem);

    const items = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data(), isActive: doc.data().isActive ?? true }));
    setItems(items);
    setLoading(false);
  };

  const fetchMoreItems = async () => {
    if (!lastVisible) return;

    setLoading(true);
    const q = query(
      collection(db, "items"),
      orderBy("name"),
      startAfter(lastVisible),
      limit(PAGE_SIZE)
    );

    const querySnapshot = await getDocs(q);
    const lastVisibleItem = querySnapshot.docs[querySnapshot.docs.length - 1];
    setLastVisible(lastVisibleItem);

    const newItems = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data(), isActive: doc.data().isActive ?? true }));
    setItems(prevItems => [...prevItems, ...newItems]);
    setLoading(false);
  };

  const toggleActiveStatus = async (item) => {
    const itemRef = doc(db, "items", item.id);
    await updateDoc(itemRef, {
      isActive: !item.isActive
    });
    fetchItems(); // Re-fetch items to update the UI
  };

  const startEditItem = (item) => {
    setCurrentItem(item);
    setShowEditModal(true);
  };

  const saveItem = async () => {
    const itemRef = doc(db, "items", currentItem.id);
    await updateDoc(itemRef, {
      ...currentItem
    });
    setShowEditModal(false);
    fetchItems(); // Re-fetch items to update the UI
  };

  const handleEditChange = (e) => {
    setCurrentItem({ ...currentItem, [e.target.name]: e.target.value });
  };

  const confirmDeleteItem = (item) => {
    setCurrentItem(item);
    setShowDeleteModal(true);
  };

  const deleteItem = async () => {
    await deleteDoc(doc(db, "items", currentItem.id));
    setShowDeleteModal(false);
    fetchItems(); // Re-fetch items to update the UI
  };

  return (
    <div className="container mt-5">
      <h2>Listado de Artículos</h2>
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>Nombre</th>
            <th>Cantidad</th>
            <th>Categoría</th>
            <th>Precio</th>
            <th>Estado</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {items.map((item) => (
            <tr key={item.id} style={{ opacity: item.isActive ? 1 : 0.5 }}>
              <td>{item.name}</td>
              <td>{item.quantity}</td>
              <td>{item.category}</td>
              <td>${item.price}</td>
              <td>
                <Badge bg={item.isActive ? "success" : "secondary"}>
                  {item.isActive ? "Activo" : "Inactivo"}
                </Badge>
              </td>
              <td>
                <Button variant="info" size="sm" onClick={() => startEditItem(item)}>
                  <FontAwesomeIcon icon={faEdit} />
                </Button>
                <Button
                  variant="warning"
                  size="sm"
                  onClick={() => toggleActiveStatus(item)}
                  className="ms-2"
                >
                  <FontAwesomeIcon icon={item.isActive ? faToggleOff : faToggleOn} />
                </Button>
                <Button
                  variant="danger"
                  size="sm"
                  onClick={() => confirmDeleteItem(item)}
                  className="ms-2"
                >
                  <FontAwesomeIcon icon={faTrash} />
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
      {loading && <p>Cargando...</p>}
      <Button onClick={fetchMoreItems} disabled={loading}>
        Cargar más
      </Button>

      <Modal show={showEditModal} onHide={() => setShowEditModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Editar Artículo</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>Nombre</Form.Label>
              <Form.Control
                type="text"
                name="name"
                value={currentItem?.name}
                onChange={handleEditChange}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Cantidad</Form.Label>
              <Form.Control
                type="number"
                name="quantity"
                value={currentItem?.quantity}
                onChange={handleEditChange}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Categoría</Form.Label>
              <Form.Control
                type="text"
                name="category"
                value={currentItem?.category}
                onChange={handleEditChange}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Precio</Form.Label>
              <Form.Control
                type="text"
                name="price"
                value={currentItem?.price}
                onChange={handleEditChange}
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowEditModal(false)}>
            Cancelar
          </Button>
          <Button variant="primary" onClick={saveItem}>
            Guardar Cambios
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Confirmar Eliminación</Modal.Title>
        </Modal.Header>
        <Modal.Body>¿Seguro que deseas borrar este artículo?</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowDeleteModal(false)}>
            Cancelar
          </Button>
          <Button variant="danger" onClick={deleteItem}>
            Borrar
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default ItemList;
