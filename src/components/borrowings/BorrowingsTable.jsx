import React, { useState, useEffect, useCallback } from "react";
import { Table, Button, Modal } from 'react-bootstrap';
import { formatDate } from "../../helpers/formatDate.helper";
import service from '../../services/webService';
import BorrowingsCrudForm from './BorrowingsCrudForm';
import helper from '../../helpers/formatDate.helper';

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
    const [data, setData] = useState([]);
    const [returnBook, setReturnBook] = useState('');
    const [borrowId, setBorrowId] = useState('');
    const [show, setShow] = useState(false);
    const handleClose = () => setShow(false);
    const [fixedFromDate, setFixedFromDate] = useState('');
    const[fixedToDate, setFixedToDate] = useState('');
    const getData = () => {
        service.getAll('borrowings')
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
    function handleReturn(e) {
        setShow(false);
        console.log(returnBook, borrowId);
        service.updateAvailableResources('books', returnBook, true, true);
        service.giveBack('borrowings', borrowId, true);
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
    function handleRenewal(i, fixFromDate, fixToDate) {
        setIsCreate(false);
        setAction(2);
        console.log("¿dónde está el index? ", i.target, " el objectType: ", objectType);
        setIndex(i);
        console.log("el id ", i);
        handleObjectType(2, 7, 'Renovar préstamo', 'borrowings');
        setFixedFromDate(fixFromDate);
        setFixedToDate(fixToDate);
    }
    function goBack(action, object) {
        setAction(action);
        handleObjectType(action, object, 'Préstamos', 'borrowings');
        refreshView();
    }
    const refreshView = useCallback(() => {
        getData();
    }, []);
    if (actionType == 1) {
        content = (
            <>
                <div className="text-right">
                    <Button variant="info" onClick={handleCreate}>Nuevo préstamo</Button>
                </div>
                {
                    data.length !== 0 ?
                        <>
                            <Table striped bordered hover>
                                <thead>
                                    <tr>
                                        <th>#</th>
                                        <th>Libro</th>
                                        <th>Socio</th>
                                        <th>Desde</th>
                                        <th>Hasta</th>
                                        <th>Acciones</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {
                                        data.map((dat, index) => {
                                            let books = [dat.book];
                                            let members = [dat.member];
                                            return (<tr key={dat.id}>
                                                <td>{index}</td>
                                                {books.map(book => <td>{book.title}</td>)}
                                                {members.map(member => <td>{member.first_name} {member.last_name} <br/>{member.membership_id}</td>)}
                                                <td>{formatDate(dat.fromDate, false, true)}</td>
                                                <td>{formatDate(dat.toDate, false, true)}</td>
                                                <td><Button id={index} variant="success" onClick={() => { handleRenewal(dat.id, formatDate(dat.fromDate, false, true), formatDate(dat.toDate, false, true)) }}>Renovar</Button>
                                                    <Button id={dat.dni} variant="danger" onClick={() => { handleShow(dat.book, dat.id) }}>Devolver</Button></td>
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
                    <a href="#" onClick={() => { goBack(1, objectType) }}>Volver</a>
                </div>
            </>
    }




    return content;
}
export default BorrowingsTable;