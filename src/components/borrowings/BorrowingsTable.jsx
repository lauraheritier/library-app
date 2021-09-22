import React, { useState, useEffect, useCallback } from "react";
import { Table, Button, Modal, Col, Row, Form } from 'react-bootstrap';
import { formatDate } from "../../helpers/formatDate.helper";
import service from '../../services/webService';
import BorrowingsCrudForm from './BorrowingsCrudForm';
import { FaFilter, FaChevronLeft } from 'react-icons/fa';
import XLSX from 'xlsx';

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
    const [fixedToDate, setFixedToDate] = useState('');
    const [unfilteredData, setUnfilteredData] = useState([]);
    const [filterObject, setFilterObject] = useState('');
    const getData = () => {
        service.getAll('borrowings')
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
    }, []);
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
    function filterOnChange(event) {
        let results;
        setFilterObject(event.target.value);
        results = data.filter(function (f) {
            let members = [f.member];
            let books = [f.book];
            let name;
            let memberId;
            let bookTitle;
            (members).map(m => { name = m.first_name + ' ' + m.last_name; memberId = m.membership_id + ''; });
            (books).map(b => bookTitle = b.title);

            return ((memberId.toLowerCase()).includes(filterObject.toLowerCase())) ||
                (name.toLowerCase()).includes(filterObject.toLowerCase()) ||
                (bookTitle.toLowerCase()).includes(filterObject.toLowerCase())

        });
        console.log("los resultados filtrados", results);
        if (event.target.value != '' && results.length !== 0) {
            setData(results);
        } else {
            setData(unfilteredData);
        }
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
    function handleReport(e) {
        //  const sheet = XLSX.utils.table_to_book(document.getElementById('data-table'), {raw: false});
        const sheet = XLSX.utils.table_to_sheet(document.getElementById('data-table'));
        console.log("la hoja de cálculo", sheet);
        //Object.keys(sheet).every(i => { console.log("LA I", i); return delete(i.startsWith('F'))});
        //   delete(sheet.startsWith('F'));
        let object = sheet, key;
        for (key in object) {
            if (key.startsWith("G")) {
                delete (sheet[key]);
            }
        }
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, sheet, 'Sheet 1');
        console.log("el workbook", workbook, " la sheet", sheet);
        XLSX.writeFile(workbook, 'inventario.xlsx');

    }
    const refreshView = useCallback(() => {
        getData();
    }, []);
    if (actionType == 1) {
        content = (
            <>
                <div className="text-right">
                    <Button variant="info" onClick={handleCreate}>Nuevo préstamo</Button>
                    <Button onClick={handleReport}>Inventario</Button>
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
                            <Table id="data-table" striped bordered hover>
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
                    <a href="#" onClick={() => { goBack(1, objectType) }}> <FaChevronLeft /> Volver</a>
                </div>
            </>
    }




    return content;
}
export default BorrowingsTable;