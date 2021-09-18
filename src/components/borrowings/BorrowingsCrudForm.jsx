import React, { useState, useEffect, useForm } from "react";
import Form from 'react-bootstrap/Form';
import FloatingLabel from 'react-bootstrap/FloatingLabel';
import { Row, Col, Button } from 'react-bootstrap';
import service from '../../services/webService';
import helper from '../../helpers/formatDate.helper';

const BorrowingsCrudForm = ({ data, item, itemType, isCreate, handleObjectType, fixedFromDate, fixedToDate }) => {
    /**itemTypes:
     * 1: Books
     * 2: Members
     * 3: Employees
     * 4: Categories
     * 5: Publishers
     * 6: Supports
     * 7: Borrowings
     *
     * isCreate:
     * true: create
     * false: edit
     */
    let content;
    let selectedBook;
    let selectedMember;
    const [books, setBooks] = useState([]);
    const [members, setMembers] = useState([]);
    const [dat, setDat] = useState({
        book: '',
        member: '',
        fromDate: helper.formatDate(null, true, false),
        toDate: helper.formatDate(null, true, false),
        cancelled: false
    });
    function getDataById(item) {
        console.log("el data type antes de ir al service", itemType);
        service.get('borrowings', item)
            .then(response => {
                setDat(response.data);
            })
            .catch(e => {
                console.log("ERROR!!! ", e);
            });
    }

    function getBooks() {
        service.getLibraryOnly('books')
            .then(response => {
                setBooks(response.data);

            })
            .catch(e => {
                console.log("ERROR!!! ", e);
            });
        console.log("los recursos", books);
    }

    function getMembers() {
        service.getAll('members')
            .then(response => {
                setMembers(response.data);

            })
            .catch(e => {
                console.log("ERROR!!! ", e);
            });
        console.log("los socios", members);
    }

    function sendData(props) {
        let resourceId;
        console.log("pasa x acá con sus props ", props);
        resourceId = props.book;
        service.updateAvailableResources('books', resourceId, true, false).then(response => {
            if (response.data) {
                console.log("la rta", response.data);
                service.create('borrowings', props);
            }
        })
            .catch(e => {
                console.log("ERROR!!! ", e);
            });
    }

    const handleInputChange = (event) => {
        setDat({
            ...dat,
            [event.target.name]: event.target.value
        });

    }
    const handleSubmit = (event) => {
        event.preventDefault()
        console.log('enviando datos...');
        if (dat.toDate < dat.fromDate) {
            alert("elegí una fecha correctaaaaa");
        }
        let fixedFromDate = dat.fromDate + 1;
        let fixedToDate = dat.toDate + 1;
        setDat({
            ...dat,
            fromDate: fixedFromDate,
            toDate: fixedToDate
        });
        sendData(dat);
    }
    const handleUpdate = (event) => {
        event.preventDefault();
        if (dat.toDate < dat.fromDate) {
            alert("elegí una fecha correctaaaaa");
        }
        let fixedFromDate = dat.fromDate + 1;
        let fixedToDate = dat.toDate + 1;
        setDat({
            ...dat,
            fromDate: fixedFromDate,
            toDate: fixedToDate
        });
        sendUpdate(dat);
    }
    function sendUpdate(param) {
        service.giveBack('borrowings', param.id, true);
        service.create('borrowings', param);
    }
    useEffect(() => {
        console.log("es is create o NO? ", isCreate);
        if (!isCreate) {
            getDataById(item);
        }
        getBooks();
        getMembers();
    }, []);
    let selBooks = [dat.book];
    let selMembers = [dat.member];

    if (!isCreate) {
        content = (
            <>
                <div className="container outdated-info">
                    {selBooks.map(book => <span>Libro: {book.title}</span>)}
                    {selMembers.map(member => <span>Socio: {member.membership_id}</span>)}
                    <span>Desde: {fixedFromDate}</span>
                    <span>Hasta: {fixedToDate}</span>
                </div>
                <Form onSubmit={handleUpdate}>
                    <Row className="g-3">
                        <Col md>
                            <Form.Group className="mb-3" controlId="formBasicfromDate">
                                <FloatingLabel
                                    controlId="floatingFromDate"
                                    label="Desde"
                                    className="mb-3">
                                    <Form.Control type="date" disabled name="fromDate" value={helper.formatDate(null, true, false)} />
                                </FloatingLabel>
                            </Form.Group>
                        </Col>
                        <Col md>
                            <Form.Group className="mb-3" controlId="formBasictoDate">
                                <FloatingLabel
                                    controlId="floatingToDate"
                                    label="Hasta"
                                    className="mb-3">
                                    <Form.Control type="date" name="toDate" defaultValue={helper.formatDate(null, true, true)} onChange={handleInputChange} />
                                </FloatingLabel>
                            </Form.Group>
                        </Col>
                    </Row>
                    <Button variant="primary" type="submit">
                        Submit
                    </Button>
                </Form>
            </>
        );
    } else {
        content = (
            <>
                <Form onSubmit={handleSubmit}>
                    <Row className="g-3">
                        <Col md>
                            <Form.Group className="mb-3" controlId="formBasicBooks">
                                <FloatingLabel
                                    controlId="floatingBooks"
                                    label="Libro"
                                    className="mb-3">
                                    <Form.Select aria-label='books' name="book" required
                                        onChange={handleInputChange}>
                                        <option>Seleccioná un recurso</option>
                                        {
                                            books.map((b, index) => {
                                                return <option key={index}
                                                    value={b.id}>{b.title}</option>
                                            })
                                        }
                                    </Form.Select>
                                </FloatingLabel>
                            </Form.Group>
                        </Col>
                        <Col md>
                            <Form.Group className="mb-3" controlId="formBasicMembers">
                                <FloatingLabel
                                    controlId="floatingMembers"
                                    label="Socio"
                                    className="mb-3">
                                    <Form.Select aria-label='members' name="member" required
                                        onChange={handleInputChange} >
                                        <option>Seleccioná un socio</option>

                                        {
                                            members.map((m, index) => {
                                                return <option key={index}
                                                    value={m.id}>{m.first_name} {m.last_name}</option>
                                            })
                                        }
                                    </Form.Select>
                                </FloatingLabel>
                            </Form.Group>
                        </Col>
                        <Col md>
                            <Form.Group className="mb-3" controlId="formBasicfromDate">
                                <FloatingLabel
                                    controlId="floatingFromDate"
                                    label="Desde"
                                    className="mb-3">
                                    <Form.Control type="date" disabled name="fromDate" value={helper.formatDate(null, true, true)} />
                                </FloatingLabel>
                            </Form.Group>
                        </Col>
                        <Col md>
                            <Form.Group className="mb-3" controlId="formBasictoDate">
                                <FloatingLabel
                                    controlId="floatingToDate"
                                    label="Hasta"
                                    className="mb-3">
                                    <Form.Control type="date" name="toDate" defaultValue={helper.formatDate(null, true, false)} onChange={handleInputChange} />
                                </FloatingLabel>
                            </Form.Group>
                        </Col>
                    </Row>
                    <Button variant="primary" type="submit">
                        Submit
                    </Button>
                </Form>
            </>
        );
    }


    return content;
}
export default BorrowingsCrudForm;