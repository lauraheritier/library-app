import React, { useState, useEffect } from "react";
import { Table, Button, Modal, Form, Row, Col, Alert, Spinner } from 'react-bootstrap';
import service from '../../services/webService';
import CategoriesCrudForm from './CategoriesCrudForm';
import { FaFilter, FaChevronLeft } from 'react-icons/fa';
import hooks from '../../hooks/components.hooks';

const CategoriesTable = ({ item, objectType, handleObjectType, actionType }) => {
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
    const [isLoading, data, unfilteredData, setData] = hooks.useGetHelperObjects('categories', false);

    useEffect(() => {
    }, [isLoading])

    function handleCreate(e) {
        setIsCreate(true);
        setAction(3);
        handleObjectType(3, 4, 'Nueva categoría', 'categories');
    }
    function handleEdit(i) {
        setIsCreate(false);
        setAction(2);
        setIndex(i);
        handleObjectType(2, 4, 'Editar categoría', 'categories');
    }
    function handleShow(param) {
        setShow(true);
        setObjectToRemove(param);
    }
    function filterOnChange(e) {
        let results;
        setFilterObject(e.target.value);
        results = hooks.useFilterOnChange(filterObject, 'categories', data);
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
        result = await service.updateIsActive('categories', objectToRemove);
        if (result) {
            setAlertVariant('success');
            setAlertText("La categoría fue eliminada correctamente.");
        } else {
            setAlertVariant('danger');
            setAlertText("No se pudo eliminar la categoría.");
        }
        setShowAlert(true);
        setTimeout(() => {
            setShowAlert(false);
        }, 5000);
        refreshView();
    }

    function refreshView() {
        service.getAll('categories')
            .then(response => {
                setData(response.data);
            })
    }
    if (isLoading) {
        content = (
            <div className="loading-content">
                <Spinner animation="grow" />
                <span>Un momento...</span>
            </div>
        )
    }

    if (actionType == 1 && !isLoading) {
        content = (
            <>
                <div className="text-right">
                    <Button variant="info" onClick={handleCreate}>Nuevo</Button>
                </div>
                {
                    data.length !== 0 ?
                        <>
                            <div className="filters-container container-fluid">
                                <Form key="test">
                                    <Row className="g-2">
                                        <Col md className="flex-filter-container">
                                            <FaFilter />
                                            <Form.Control size="sm" type="text" name="filter" placeholder="Filtrar por descripción" onChange={filterOnChange} />
                                        </Col>
                                    </Row>
                                </Form>
                            </div>
                            <Table id="data-table-table" striped bordered hover>
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
                                                <td>{index + 1}</td>
                                                <td>{dat.description}</td>
                                                <td className="action-td"><Button id={index} variant="success" onClick={() => { handleEdit(dat.id) }}>Editar</Button>
                                                    <Button id={dat.id} variant="danger" onClick={() => { handleShow(dat.id) }}>Eliminar</Button></td>

                                            </tr>)
                                        })
                                    }
                                </tbody>
                            </Table>
                            <div className="text-left">
                                <a href="#" onClick={() => { setAction(1); handleObjectType(1, 1, 'Libros', 'books'); refreshView(); }}><FaChevronLeft /> Volver</a>
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
                            <Alert variant={alertVariant} show={showAlert} onClose={() => setShowAlert(false)} dismissible>
                                <p>
                                    {alertText}
                                </p>
                            </Alert>
                        </>
                        : ''
                }

            </>)
    } else {
        content =
            <>
                <CategoriesCrudForm data={data} item={index} itemType={4} isCreate={isCreate} actionType={action} handleObjectType={handleObjectType} />
                <div className="text-left">
                    <a href="#" onClick={() => { setAction(1); handleObjectType(1, 4, 'Categorías', 'categories'); refreshView(); }}><FaChevronLeft /> Volver</a>
                </div>
            </>
    }




    return content;
}
export default CategoriesTable;