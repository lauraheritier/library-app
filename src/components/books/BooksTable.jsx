import React, { useState, useEffect } from "react";
import { Button, Modal, Card, Form, Col, Row, Table, Spinner, Alert } from 'react-bootstrap';
import service from '../../services/webService';
import BooksCrudForm from './BooksCrudForm';
import { FaFilter, FaChevronLeft } from 'react-icons/fa';
import hooks from '../../hooks/components.hooks';


const BooksTable = ({ item, objectType, handleObjectType, actionType }) => {
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
    const handleClose = () => setShow(false);
    const [show, setShow] = useState(false);
    const [objectToRemove, setObjectToRemove] = useState([]);
    const [filterObject, setFilterObject] = useState('');
    const [showAlert, setShowAlert] = useState(false);
    const [alertText, setAlertText] = useState('');
    const [alertVariant, setAlertVariant] = useState('');
    const [isLoading, resources, unfilteredData, setResources] = (hooks.useGetHelperObjects('books', false));
    const tableId = document.getElementById('data-table');

    useEffect(() => {

    }, [isLoading])

    function handleCreate(e) {
        setIsCreate(true);
        setAction(3);
        handleObjectType(3, 1, 'Nuevo recurso', 'books');
    }
    function handleEdit(i) {
        setIsCreate(false);
        setAction(2);
        setIndex(i);
        handleObjectType(2, 1, 'Editar recurso', 'books');
    }
    const handleDelete = async () => {
        let result;
        setShow(false);
        setIsCreate(false);
        result = await service.updateAvailableResources('books', objectToRemove, false, false);
        if (result) {
            setAlertVariant('success');
            setAlertText("El recurso fue eliminado correctamente.");
        } else {
            setAlertVariant('danger');
            setAlertText("No se pudo eliminar el recurso.");
        }
        setShowAlert(true);
        setTimeout(() => {
            setShowAlert(false);
        }, 5000);
        refreshView();
    }

    function filterOnChange(event) {
        let results;
        setFilterObject(event.target.value);
        results = hooks.useFilterOnChange(filterObject, 'books', resources);
        if (event.target.value != '' && results.length !== 0) {
            setResources(results);
        } else {
            setResources(unfilteredData);
        }
    }

    function refreshView() {
        service.getAll('books')
            .then(response => {
                setResources(response.data);
            })
    }

    let table = (
        <Table id="data-table">
            <thead>
                <tr>
                    <th>#</th>
                    <th>Título</th>
                    <th>Autor</th>
                    <th>Categoría</th>
                    <th>Editorial</th>
                    <th>Soporte</th>
                    <th>ISBN</th>
                    <th>Solo consulta en biblioteca</th>

                </tr>
            </thead>
            <tbody>
                {
                    resources.map((d, idx) => {
                        let bookId = d.id.slice(0, 6);
                        let cats = [d.category];
                        let sups = [d.support];
                        let pubs = [d.publisher]
                        return (
                            <tr key={d.id}>
                                <td>{bookId}</td>
                                <td>{d.title}</td>
                                <td>{d.author}</td>
                                {cats.map(cat => <td>{cat.description}</td>)}
                                {pubs.map(pub => <td>{pub.description}</td>)}
                                {sups.map(sup => <td>{sup.description}</td>)}
                                <td>{d.isbn ? d.isbn : 'N/A'}</td>
                                <td>{d.libraryOnly ? 'Sí' : 'No'}</td>
                            </tr>
                        )
                    })
                }
            </tbody>
        </Table>
    )

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
                <div className="resources-link-container">
                    <div className="link-container">
                        <a href="#" onClick={() => { handleObjectType(1, 4, 'Categorías', 'categories'); }}>Categorías</a>
                        <a href="#" onClick={() => { handleObjectType(1, 5, 'Editoriales', 'publishers'); }}>Editoriales</a>
                        <a href="#" onClick={() => { handleObjectType(1, 6, 'Soportes', 'supports'); }}>Soportes</a>
                    </div>
                    <div className="btn-containers">
                        <Button variant="info" onClick={handleCreate}>Nuevo recurso</Button>
                        <Button disabled={resources.length === 0} variant="info" onClick={() => { hooks.handleReport(tableId, false) }}>Generar inventario</Button>
                    </div>
                </div>
                {
                    <>

                        <div className="filters-container container-fluid">
                            <Form key="test">
                                <Row className="g-2">
                                    <Col md className="flex-filter-container">
                                        <FaFilter />
                                        <Form.Control size="sm" type="text" name="filter" placeholder="Filtrar por autor, título, ISBN..." onChange={filterOnChange} />
                                    </Col>
                                </Row>
                            </Form>
                        </div>
                        <div className="cards-container">
                            {
                                resources.map((dat, index) => {
                                    let book_id = dat.id.slice(0, 6);
                                    let cats = [dat.category];
                                    let pubs = [dat.publisher];
                                    let sups = [dat.support];
                                    let supportDescription;
                                    sups.map((sup, index) => {
                                        return supportDescription = sup.description;
                                    });

                                    return (

                                        <Card key={dat.id}>
                                            <Card.Header as="h5"><span key={dat.id + index}>{book_id} - {dat.title}</span>
                                                <span>
                                                    <Button variant="success" key={dat.id + index + 2} onClick={() => { handleEdit(dat.id) }}>Editar</Button>
                                                    <Button variant="danger" key={dat.id + index + 3} onClick={() => { setShow(true); setObjectToRemove(dat.id) }}>Eliminar</Button>
                                                </span>
                                            </Card.Header>
                                            <Card.Body>
                                                <div className="card-text">
                                                    <Card.Title key={dat.id + index + 4}><span className="react-icon-container"> {hooks.setReactIcons(supportDescription, '.react-icon-container')}</span> {supportDescription} </Card.Title>
                                                    {dat.libraryOnly ? <span className="only-library" key={dat.id + index + 5}>Solo consulta en biblioteca</span> : ''}
                                                </div>
                                                <Card.Text>
                                                    <span className="col-title">Autor:</span> <span className="col-desc" key={dat.id + index + 6}>{dat.author}</span>
                                                </Card.Text>
                                                <Card.Text>
                                                    {cats.map(cat => <><span className="col-title" >Categoría:</span> <span className="col-desc" key={dat.id + index + 7}>{cat.description}</span></>)}
                                                </Card.Text>
                                                <Card.Text>
                                                    {pubs.map(pub => <><span className="col-title" >Editorial:</span> <span className="col-desc" key={dat.id + index + 8}>{pub.description}</span></>)}
                                                </Card.Text>
                                                <Card.Text>
                                                    <span><span className="col-title">Ejemplares totales:</span> <span className="col-desc" key={dat.id + index + 9}>{dat.sample}</span></span>
                                                    <span> <span className="col-title">Ejemplares disponibles:</span> <span className="col-desc" key={dat.id + index + 10}>{dat.availableSamples}</span></span>
                                                </Card.Text>


                                                {supportDescription === 'Libro' ?
                                                    <Card.Text>
                                                        <span className="col-title">ISBN:</span><span className="col-desc" key={dat.id + book_id + index + 11}>{dat.isbn}</span>
                                                    </Card.Text>
                                                    : ''}

                                            </Card.Body>
                                        </Card>)
                                })
                            }
                        </div>
                        <Modal key={index + 13} show={show} onHide={handleClose} onExited={refreshView}>
                            <Modal.Header closeButton>
                                <Modal.Title>Eliminar recurso</Modal.Title>
                            </Modal.Header>
                            <Modal.Body>¿Realmente desea eliminar el recurso?</Modal.Body>
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
                }</>
        );
    } else {
        content =
            <>
                <BooksCrudForm data={resources} item={index} itemType={objectType} isCreate={isCreate} actionType={action} handleObjectType={handleObjectType} />
                <div className="text-left">
                    <a href="#" onClick={() => { setAction(1); handleObjectType(1, objectType, 'Recursos', 'books'); refreshView() }}><FaChevronLeft /> Volver</a>
                </div>
            </>
    }
    return [content, table];
}
export default BooksTable;