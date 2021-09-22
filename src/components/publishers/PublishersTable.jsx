import React, { useState, useEffect, useCallback } from "react";
import { Table, Button, Modal, Form, Row, Col } from 'react-bootstrap';
import PublishersCrudForm from './PublishersCrudForm';
import service from '../../services/webService';
import { FaFilter, FaChevronLeft } from 'react-icons/fa';


const PublishersTable = ({ item, objectType, handleObjectType, handleActionType, actionType }) => {
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
    const [filteredObject, setFilteredObject] = useState('');
    const [unfilteredData, setUnfilteredData] = useState([]);

    const getData = () => {
        service.getAll('publishers')
            .then(response => {
                setData(response.data);
                setUnfilteredData(response.data);
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
        handleObjectType(3, 5, 'Nueva editorial', 'publishers');
    }
    function handleEdit(i) {
        console.log("PRIMERO PASA X EL EDIT!");
        setIsCreate(false);
        setAction(2);
        console.log("¿dónde está el index? ", i.target, " el objectType: ", objectType);
        setIndex(i);
        console.log("el id ", i);
        handleObjectType(2, 5, 'Editar editorial', 'publishers');
    }
    function handleShow(param) {
        setShow(true);
        console.log("el id a borrar", param);
        setObjectToRemove(param);

    }
    function filterOnChange(e) {
        setFilteredObject(e.target.value);
        console.log("el e target value", e.target.value);
        let results = data.filter(function (dat) {
            return ((dat['description']).toLowerCase()).includes(filteredObject.toLowerCase());
        });
        console.log("los resultados filtrados", results);
        if (e.target.value != '' && results.length !== 0) {
            setData(results);
        } else {
            setData(unfilteredData);
        }
    }
    function handleDelete(e) {
        setIsCreate(false);
        setRemove(true);
        console.log("Delete?", remove, " el id", objectToRemove);
        service.updateIsActive('publishers', objectToRemove);
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
                    <Button variant="info" onClick={handleCreate}>Nueva editorial</Button>
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
                            <Table striped bordered hover>
                                <thead>
                                    <tr>
                                        <th>#</th>
                                        <th>Nombre</th>
                                        <th>Sitio web</th>
                                        <th>Acciones</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {
                                        data.map((dat, idx) => {

                                            return (<tr key={idx}>
                                                <td>{idx +1}</td>
                                                <td>{dat.description}</td>
                                                <td>{dat.url}</td>
                                                <td className="action-td"><Button id={index} variant="success" onClick={() => { handleEdit(dat.id) }}>Editar</Button>
                                                    <Button id={dat.id} variant="danger" onClick={() => { handleShow(dat.id) }}>Eliminar</Button></td>

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
                            <div className="text-left">
                                <a href="#" onClick={() => { goBack(1, 1, 'books') }}><FaChevronLeft/> Volver</a>
                            </div>
                        </>
                        : ''
                }
            </>)
    } else {
        content =
            <>
                <PublishersCrudForm data={data} item={index} itemType={5} isCreate={isCreate} actionType={action} />
                <div className="text-left">
                    <a href="#" onClick={() => { goBack(1, 5, 'publishers') }}><FaChevronLeft/> Volver</a>
                </div>
            </>
    }




    return content;
}
export default PublishersTable;