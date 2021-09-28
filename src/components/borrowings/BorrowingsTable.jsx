import React, { useState, useEffect } from "react";
import { Table, Button, Modal, Col, Row, Form, Alert, Spinner } from 'react-bootstrap';
import { formatDate } from "../../helpers/formatDate.helper";
import service from '../../services/webService';
import BorrowingsCrudForm from './BorrowingsCrudForm';
import { FaFilter, FaChevronLeft } from 'react-icons/fa';
import XLSX from 'xlsx';
import hooks from '../../hooks/components.hooks';

const BorrowingsTable = ({ item, objectType, handleObjectType, handleActionType, actionType }) => {
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
    //const [data, setData] = useState([]);
    const [returnBook, setReturnBook] = useState('');
    const [borrowId, setBorrowId] = useState('');
    const [show, setShow] = useState(false);
    const handleClose = () => setShow(false);
    const [fixedFromDate, setFixedFromDate] = useState('');
    const [fixedToDate, setFixedToDate] = useState('');
    //const [unfilteredData, setUnfilteredData] = useState([]);
    const [filterObject, setFilterObject] = useState('');
    const tableId = document.getElementById('data-table-table');
    const [showAlert, setShowAlert] = useState(false);
    const[alertText, setAlertText] = useState('');
    const[alertVariant, setAlertVariant] = useState('');
    const [isLoading, data, unfilteredData, setData] = hooks.useGetHelperObjects('borrowings', false);

    useEffect(() => {
      
    }, [isLoading]);

    const handleReturn = async () => {
        let result;
        setShow(false);
        result = await hooks.useHandleReturn(borrowId, returnBook);
        console.log("el result del hook", result);
        if (result) {
            setAlertVariant('success');
            setAlertText("El recurso fue devuelto correctamente.");
        } else {
            setAlertVariant('danger');
            setAlertText("No se pudo devolver el recurso.");
        }
        setShowAlert(true);
            setTimeout(() => {
                setShowAlert(false);
            }, 5000);
        refreshView();
    }
    function handleShow(bookId, borrowingId) {
        setShow(true);
        setIsCreate(false);
        setReturnBook(bookId._id);
        setBorrowId(borrowingId);
    }
    function handleCreate(param) {
        setIsCreate(true);
        setAction(3);
        handleObjectType(3, 7, 'Nuevo préstamo', 'borrowings');

    }
    function filterOnChange(event) {
        let results;
        setFilterObject(event.target.value);
        results = hooks.useFilterOnChange(filterObject, 'borrowings', data);
        if (event.target.value != '' && results.length !== 0) {
            setData(results);
        } else {
            setData(unfilteredData);
        }        
    }
    function handleRenewal(i, fixFromDate, fixToDate) {
        setIsCreate(false);
        setAction(2);
        setIndex(i);
        console.log("el id ", i);
        handleObjectType(2, 7, 'Renovar préstamo', 'borrowings');
        setFixedFromDate(fixFromDate);
        setFixedToDate(fixToDate);
    }

    function refreshView() {
        service.getAll('borrowings')
            .then(response => {
                setData(response.data);
            })
    }
    if(isLoading) {
        content = content = (
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
                        <Button variant="info" onClick={handleCreate}>Nuevo préstamo</Button>
                        <Button onClick={() => { hooks.handleReport(tableId, true, 'G') }}>Generar inventario</Button>
                    </div>
                    {
                        data.length !== 0 ?
                            <>
                                <div className="filters-container container-fluid">
                                    <Form key="test">
                                        <Row className="g-2">
                                            <Col md className="flex-filter-container">
                                                <FaFilter />
                                                <Form.Control size="sm" type="text" name="filter" placeholder="Filtrar por libro o socio" onChange={filterOnChange}></Form.Control>
                                            </Col>
                                        </Row>
                                    </Form>
                                </div>
                                <Table id="data-table-table" striped bordered hover>
                                    <thead>
                                        <tr>
                                            <th>#</th>
                                            <th>Recurso</th>
                                            <th>Socio</th>
                                            <th>Desde</th>
                                            <th>Hasta</th>
                                            <th>Estado</th>
                                            <th>Acciones</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {
                                            data.map((dat, index) => {
                                                let books = [dat.book];
                                                let members = [dat.member];
                                                return (<tr key={dat.id}>
                                                    <td>{index + 1}</td>
                                                    {books.map(book => <td>{book.title}</td>)}
                                                    {members.map(member => <td>{member.first_name} {member.last_name} <br />{member.membership_id}</td>)}
                                                    <td>{formatDate(dat.fromDate, false, true)}</td>
                                                    <td>{formatDate(dat.toDate, false, true)}</td>
                                                    <td>{dat.cancelled ? 'Devuelto' : 'Activo'}</td>
                                                    <td><Button id={index} variant="success" disabled={dat.cancelled} onClick={() => { handleRenewal(dat.id, formatDate(dat.fromDate, false, true), formatDate(dat.toDate, false, true)) }}>Renovar</Button>
                                                        <Button id={dat.dni} variant="danger" disabled={dat.cancelled} onClick={() => { handleShow(dat.book, dat.id) }}>Devolver</Button></td>
                                                </tr>)
                                            })
                                        }
                                    </tbody>
                                </Table>
                                <Modal key={index + 13} show={show} onHide={handleClose} onExited={refreshView}>
                                    <Modal.Header closeButton>
                                        <Modal.Title>Devolver recurso</Modal.Title>
                                    </Modal.Header>
                                    <Modal.Body>¿Realmente desea devolver el recurso?</Modal.Body>
                                    <Modal.Footer>
                                        <Button variant="secondary" onClick={handleClose} key={index + 14}>
                                            No
                                        </Button>
                                        <Button variant="primary" onClick={handleReturn} key={index + 15}>
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
                    }</>
            );
        } else {
            content =
                <>
                    <BorrowingsCrudForm data={data} item={index} fixedFromDate={fixedFromDate} fixedToDate={fixedToDate}
                        itemType={objectType} isCreate={isCreate} actionType={action} handleObjectType={handleObjectType} />
                    <div className="text-left">
                        <a href="#" onClick={() => { setAction(1); handleObjectType(1, objectType, 'Préstamos', 'borrowings'); refreshView(); }}> <FaChevronLeft /> Volver</a>
                    </div>
                </>
        }
    
    
    return content;
}
export default BorrowingsTable;