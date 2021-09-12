import React, { useState, useEffect, useCallback } from "react";
import { Table, Button, Modal } from 'react-bootstrap';
import MembersCrudForm from './MembersCrudForm';
import service from '../../services/webService';

const MembersTable = ({ item, objectType, handleObjectType, handleActionType, actionType }) => {
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
    const [action, setAction] = useState(1);
    const [index, setIndex] = useState(0);
    const [data, setData] = useState([]);
    const handleClose = () => setShow(false);
    const [show, setShow] = useState(false);
    const [remove, setRemove] = useState('');
    const [objectToRemove, setObjectToRemove] = useState([]);

    const getData = () => {
        service.getAll('members')
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
    function handleCreate(param) {
        setIsCreate(true);
        setAction(3);
        handleObjectType(3, 2, 'Nuevo socio', 'members');
    }
    function handleEdit(i) {
        setIsCreate(false);
        setAction(2);
        console.log("¿dónde está el index? ", i.target, " el objectType: ", objectType);
        setIndex(i);
        console.log("el id ", i);
        handleObjectType(2, 2, 'Editar socio', 'members');
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
        service.remove('members', objectToRemove);
        setShow(false);
    }
    function goBack(action, object) {
        setAction(action);
        handleObjectType(action, object, 'Socios', 'members');
        refreshView();
    }
    const refreshView = useCallback(() => {
        getData();
    }, []);

    if (actionType == 1) {
        content = (
            <>
                <div className="text-right">
                    <Button variant="info" onClick={() => { handleCreate(objectType) }}>Nuevo socio</Button>
                </div>
                {
                    data.length !== 0 ?
                        <>
                            <Table striped bordered hover>
                                <thead>
                                    <tr>
                                        <th>Nombre</th>
                                        <th>Apellido</th>
                                        <th>E-mail</th>
                                        <th>Teléfono</th>
                                        <th>Dirección</th>
                                        <th>DNI</th>
                                        <th>No. de socio</th>
                                        <th>Acciones</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {
                                        data.map((dat, index) => {
                                            return (<><tr key={index}>
                                                <td>{dat.first_name}</td>
                                                <td>{dat.last_name}</td>
                                                <td>{dat.email}</td>
                                                <td>{dat.telephone}</td>
                                                <td>{dat.address}</td>
                                                <td>{dat.dni}</td>
                                                <td>{dat.membership_id}</td>
                                                <td><Button id={index} variant="success" onClick={() => { handleEdit(dat.id) }}>Editar</Button>
                                                    <Button id={dat.id} variant="danger" onClick={() => { handleShow(dat.id) }}>Eliminar</Button></td>

                                            </tr>

                                            </>)
                                        })
                                    }
                                </tbody>
                            </Table>
                            <Modal show={show} onHide={handleClose} onExited={refreshView}>
                                <Modal.Header closeButton>
                                    <Modal.Title>Eliminar socio</Modal.Title>
                                </Modal.Header>
                                <Modal.Body>¿Realmente desea eliminar el socio?</Modal.Body>
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
                        : ''}
            </>
        );

    } else {
        content =
            <>
                <MembersCrudForm data={data} item={index} itemType={objectType} isCreate={isCreate} actionType={action} />
                <div className="text-left">
                    <a href="#" onClick={() => { goBack(1, objectType) }}>Volver</a>
                </div>
            </>
    }




    return content;
}
export default MembersTable;