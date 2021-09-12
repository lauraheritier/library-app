import React, { useState, useEffect, useCallback } from "react";
import { Table, Button, Modal } from 'react-bootstrap';
import service from '../../services/webService';
import BooksCrudForm from './BooksCrudForm';


const BooksTable = ({ item, objectType, handleObjectType, handleActionType, actionType }) => {
    /**objectTypes:
     * 1: Books
     * 2: Members
     * 3: Employees
     */
    /**
     * isCreate:
     * true: create
     * false: edit
     */
    /**
     * action types:
     * 1: view
     * 2: edit
     * 3: create
     * 4: back
     */
    let content;
    const [isCreate, setIsCreate] = useState(false);
    const [action, setAction] = useState(isCreate ? 3 : 1);
    const [index, setIndex] = useState(0);
    const [data, setData] = useState([]);
    const handleClose = () => setShow(false);
    const [show, setShow] = useState(false);
    const [remove, setRemove] = useState('');
    const [objectToRemove, setObjectToRemove] = useState([]);

    const getData = (item) => {
        console.log("el data type antes de ir al service", item);
        service.getAll(item)
            .then(response => {
                setData(response.data);

            })
            .catch(e => {
                console.log("ERROR!!! ", e);
            });
    };

    useEffect(() => {
        getData(item);

    }, [])

    function handleCreate(param) {
        setIsCreate(true);
        setAction(3);
        // handleActionType(action);
        console.log("pasando los parámetros al handleObjectType desde el handleCreate", action);
        handleObjectType(3, 1, 'Nuevo libro', 'books');
    }
    function handleEdit(i) {
        setIsCreate(false);
        setAction(2);
        console.log("¿dónde está el index? ", i.target, " el objectType: ", objectType);
        setIndex(i);
        console.log("el id ", i);
        handleObjectType(2, 1, 'Editar libro', 'books');
    }
    function handleShow(param) {
        setShow(true);
        console.log("el id a borrar", param);
        setObjectToRemove(param);

    }
    function handleDelete(e) {
        setIsCreate(false);
        setRemove(true);
        console.log("Delete?", remove, " el id", objectToRemove);
        service.remove('books', objectToRemove);
        setShow(false);
    }
    function goTo(param) {
        if (param == 4) {
            handleObjectType(1, 4, 'Categorías', 'categories');
        } else {
            handleObjectType(1, 5, 'Editoriales', 'publishers');
        }
    }
    function goBack(action, object) {
        setAction(action);
        handleObjectType(action, object, 'Libros', 'books');
        refreshView();
    }
    const refreshView = useCallback(() => {
        getData();
    }, []);

    if (actionType == 1) {
        content = (
            <>
                <div className="text-right">
                    <a href="#" onClick={() => { goTo(4) }}>Categorías</a>
                    <a href="#" onClick={() => { goTo(5) }}>Editoriales</a>
                    <Button variant="info" onClick={handleCreate}>Nuevo libro</Button>
                </div>
                {console.log("el item ", item)}
                {

                    data.length !== 0 ?
                        <>
                            <Table striped bordered hover>
                                <thead>
                                    <tr>
                                        <th>#</th>
                                        <th>Título</th>
                                        <th>ISBN</th>
                                        <th>Autor</th>
                                        <th>Categoría</th>
                                        <th>Editorial</th>
                                        <th>Disponible</th>
                                        <th>Acciones</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {
                                        data.map((dat, index) => {
                                            let book_id = dat.id.slice(0, 6);
                                            let disponible = (!dat.borrowed ? 'Sí' : 'No');
                                            let cats = [dat.category];
                                            let pubs = [dat.publisher];
                                            return (<tr key={dat.id}>
                                                <td key={book_id}>{book_id}</td>
                                                <td key={dat.title}>{dat.title}</td>
                                                <td key={dat.isbn}>{dat.isbn}</td>
                                                <td key={dat.author + dat.title}>{dat.author}</td>
                                                {cats.map(cat => <td key={cat.id + book_id}>{cat.description}</td>)}
                                                {pubs.map(pub => <td key={pub.id + book_id}>{pub.description}</td>)}
                                                <td key={dat.title + disponible}>{disponible}</td>
                                                <td><Button id={index} variant="success" onClick={() => { handleEdit(dat.id) }}>Editar</Button>
                                                    <Button id={dat.dni} variant="danger" onClick={() => { handleShow(dat.id) }}>Eliminar</Button></td>

                                            </tr>)
                                        })
                                    }

                                </tbody>
                            </Table>
                            <Modal show={show} onHide={handleClose} onExited={refreshView}>
                                <Modal.Header closeButton>
                                    <Modal.Title>Eliminar libro</Modal.Title>
                                </Modal.Header>
                                <Modal.Body>¿Realmente desea eliminar el libro?</Modal.Body>
                                <Modal.Footer>
                                    <Button variant="secondary" onClick={handleClose}>
                                        No
                                    </Button>
                                    <Button variant="primary" onClick={handleDelete}>
                                        Sí
                                    </Button>
                                </Modal.Footer>
                            </Modal>
                        </>
                        : ''
                }</>
        );
    } else {
        content =
            <>
                <BooksCrudForm data={data} item={index} itemType={objectType} isCreate={isCreate} actionType={action} handleObjectType={handleObjectType} />
                <div className="text-left">
                    <a href="#" onClick={() => { goBack(1, objectType) }}>Volver</a>
                </div>
            </>
    }




    return content;
}
export default BooksTable;