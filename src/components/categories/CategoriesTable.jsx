import React, { useState, useEffect, useCallback } from "react";
import { Table, Button, Modal } from 'react-bootstrap';
import service from '../../services/webService';
import CategoriesCrudForm from './CategoriesCrudForm';

const CategoriesTable = ({ item, objectType, handleObjectType, handleActionType, actionType }) => {
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

    const [isCreate, setIsCreate] = useState();
    const [action, setAction] = useState(1);
    const [index, setIndex] = useState(0);
    const [data, setData] = useState([]);
    const handleClose = () => setShow(false);
    const [show, setShow] = useState(false);
    const [remove, setRemove] = useState('');
    const [objectToRemove, setObjectToRemove] = useState([]);
    
    const getData = () => {
        console.log("el data type antes de ir al service", item, " y el action: ", action);
        service.getAll('categories')
            .then(response => {
                setData(response.data);
                console.log("los datos: ", response.data);
            })
            .catch(e => {
                console.log("ERROR!!! ", e);
            });
    };

    useEffect(() => {
         getData();
     
    }, [])
    function handleCreate(e) {
        setIsCreate(true);
        setAction(3);
        handleObjectType(3, 4, 'Nueva categoría', 'categories');
console.log("el is create: ", isCreate, " action ", action);
    }
    function handleEdit(i) {
        setIsCreate(false);
        setAction(2);
        console.log("¿dónde está el index? ", i, " el objectType: ", objectType);
        setIndex(i);
        handleObjectType(2, 4, 'Editar categoría', 'categories');
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
        service.updateIsActive('categories', objectToRemove);
        setShow(false);
        refreshView();
    }

    function goBack(action, object, apiName) {
        setAction(action);
        handleObjectType(action, object, 'Libros', apiName);
        refreshView();
    }
    const refreshView = useCallback(() => {
        getData();
    }, []);

    if (actionType == 1) {
        content = (
            <>
                <div className="text-right">
                    <Button variant="info" onClick={handleCreate}>Nuevo</Button>
                </div>
                {
                    data.length !== 0 ?
                        <>
                            <Table striped bordered hover>
                                <thead>
                                    <tr>
                                        <th>#</th>
                                        <th>Descripción</th>
                                        <th>Acciones</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {
                                        data.map((dat, index) => {

                                            return (<tr key={index}>
                                                <td>{index}</td>
                                                <td>{dat.description}</td>
                                                <td className="action-td"><Button id={index} variant="success" onClick={() => { handleEdit(dat.id) }}>Editar</Button>
                                                    <Button id={dat.id} variant="danger" onClick={() => { handleShow(dat.id) }}>Eliminar</Button></td>

                                            </tr>)
                                        })
                                    }
                                </tbody>
                            </Table>
                            <div className="text-left">
                                <a href="#" onClick={() => { goBack(1, 1, 'books') }}>Volver</a>
                            </div>
                            <Modal key={index + 13} show={show} onHide={handleClose} onExited={refreshView}>
                            <Modal.Header closeButton>
                                <Modal.Title>Eliminar categoría</Modal.Title>
                            </Modal.Header>
                            <Modal.Body>¿Realmente desea eliminar la categoría?</Modal.Body>
                            <Modal.Footer>
                                <Button variant="secondary" onClick={handleClose} key={index + 14}>
                                    No
                                </Button>
                                <Button variant="primary" onClick={handleDelete} key={index + 15}>
                                    Sí
                                </Button>
                            </Modal.Footer>
                        </Modal>
                        </>
                        : ''
                }

            </>)
    } else {
        content =
            <>
                <CategoriesCrudForm data={data} item={index} itemType={4} isCreate={isCreate} actionType={action} />
                <div className="text-left">
                    <a href="#" onClick={() => { goBack(1, 4, 'categories') }}>Volver</a>
                </div>
            </>
    }




    return content;
}
export default CategoriesTable;