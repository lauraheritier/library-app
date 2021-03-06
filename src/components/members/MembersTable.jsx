import React, { useState, useEffect } from "react";
import { Table, Button, Modal, Form, Row, Col, Alert, Spinner } from 'react-bootstrap';
import service from '../../services/webService';
import MembersCrudForm from './MembersCrudForm';
import { FaFilter, FaChevronLeft } from 'react-icons/fa';
import hooks from '../../hooks/components.hooks';

const MembersTable = ({ item, objectType, handleObjectType, actionType }) => {
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
    const handleClose = () => setShow(false);
    const [show, setShow] = useState(false);
    const [objectToRemove, setObjectToRemove] = useState([]);
    const [filterObject, setFilterObject] = useState('');
    const [showAlert, setShowAlert] = useState(false);
    const [alertText, setAlertText] = useState('');
    const [alertVariant, setAlertVariant] = useState('');
    const [isLoading, data, unfilteredData, setData] = hooks.useGetHelperObjects('members', false);
    const tableId = document.getElementById('data-table-table');


    useEffect(() => {
    }, [isLoading])

    function handleCreate(param) {
        setIsCreate(true);
        setAction(3);
        handleObjectType(3, 2, 'Nuevo contacto', 'members');
    }

    function handleEdit(i) {
        setIsCreate(false);
        setAction(2);
        setIndex(i);
        handleObjectType(2, 2, 'Editar contacto', 'members');
    }

    function handleShow(param) {
        setShow(true);
        setObjectToRemove(param);

    }
    function filterOnChange(e) {
        let results;
        setFilterObject(e.target.value);
        results = hooks.useFilterOnChange(filterObject, 'members', data);
        if (e.target.value != '' && results.length !== 0) {
            setData(results);
        } else {
            setData(unfilteredData);
        }
    }

    const handleDelete = async () => {
        let result;
        setShow(false);
        setIsCreate(false);
        result = await service.updateIsActive('members', objectToRemove);
        if (result) {
            setAlertVariant('success');
            setAlertText("El contacto fue eliminado correctamente.");
        } else {
            setAlertVariant('danger');
            setAlertText("No se pudo eliminar al contacto.");
        }
        setShowAlert(true);
        setTimeout(() => {
            setShowAlert(false);
        }, 5000);
        refreshView();
    }
    function refreshView() {
        service.getAll('members')
            .then(response => {
                setData(response.data);
            })
    }

    function refreshView() {
        service.getAll('members')
            .then(response => {
                setData(response.data);
            })
    }

    if (isLoading) {
        content = (
            <div className="loading-content">
                <Spinner animation="grow" variant="warning"/>
                <span>Un momento...</span>
            </div>
        )
    }
    if (actionType == 1 && !isLoading) {
        content = (
            <>
                <div className="text-right">
                    <Button variant="info" onClick={() => { handleCreate(objectType) }}>Nuevo contacto</Button>
                </div>
                {
                    data.length !== 0 ?
                        <>
                            <div className="text-right">
                                <Button disabled={data.length === 0} onClick={() => { hooks.handleReport(tableId, true, 'I') }}>Generar inventario</Button>
                            </div>
                            <div className="filters-container container-fluid">
                                <Form key="test">
                                    <Row className="g-2">
                                        <Col md className="flex-filter-container">
                                            <FaFilter />
                                            <Form.Control size="sm" type="text" name="filter" placeholder="Filtrar por nombre, apellido, email o dni" onChange={filterOnChange} />
                                        </Col>
                                    </Row>
                                </Form>
                            </div>
                            <Table striped bordered hover id='data-table-table'>
                                <thead>
                                    <tr>
                                        <th>#</th>
                                        <th>Nombre</th>
                                        <th>Apellido</th>
                                        <th>E-mail</th>
                                        <th>Tel??fono</th>
                                        <th>Direcci??n</th>
                                        <th>DNI</th>
                                        <th>C??digo</th>
                                        <th>Acciones</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {
                                        data.map((dat, index) => {

                                            return (<tr key={index}>
                                                <td>{index + 1}</td>
                                                <td>{dat.first_name}</td>
                                                <td>{dat.last_name}</td>
                                                <td>{dat.email}</td>
                                                <td>{dat.telephone}</td>
                                                <td>{dat.address}</td>
                                                <td>{dat.dni}</td>
                                                <td>{dat.membership_id}</td>
                                                <td className="action-td"><Button id={index} variant="success" onClick={() => { handleEdit(dat.id) }}>Editar</Button>
                                                    <Button id={dat.id} variant="danger" onClick={() => { handleShow(dat.id) }}>Eliminar</Button></td>
                                            </tr>)
                                        })
                                    }
                                </tbody>
                            </Table>
                            <Modal show={show} onHide={handleClose} onExited={refreshView}>
                                <Modal.Header closeButton>
                                    <Modal.Title>Eliminar empleado</Modal.Title>
                                </Modal.Header>
                                <Modal.Body>??Realmente desea eliminar el empleado?</Modal.Body>
                                <Modal.Footer>
                                    <Button variant="secondary" onClick={handleClose}>
                                        No
                                    </Button>
                                    <Button variant="primary" onClick={handleDelete}>
                                        S??
                                    </Button>
                                </Modal.Footer>
                            </Modal>
                            <Alert variant={alertVariant} show={showAlert} onClose={() => setShowAlert(false)} dismissible>
                                <p>
                                    {alertText}
                                </p>
                            </Alert>
                        </>
                        : ''}
            </>
        );

    } else {
        content =
            <>
                <MembersCrudForm data={data} item={index} itemType={objectType} isCreate={isCreate} actionType={action} handleObjectType={handleObjectType} />
                <div className="text-left">
                    <a href="#" onClick={() => { setAction(1); handleObjectType(1, objectType, 'Mis contactos', 'members'); refreshView(); }}><FaChevronLeft /> Volver</a>
                </div>
            </>
    }

    return content;
}
export default MembersTable;