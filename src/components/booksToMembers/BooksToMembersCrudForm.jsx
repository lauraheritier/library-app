import React, { useState, useEffect, useForm } from "react";
import Form from 'react-bootstrap/Form';
import FloatingLabel from 'react-bootstrap/FloatingLabel';
import { Row, Col, Button } from 'react-bootstrap';
import service from '../../services/webService';

const BooksToMembersCrudForm = ({ item, itemType, isCreate, returnBook, handleObjectType }) => {
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

    const [dat, setDat] = useState({
        book: '',
        member: '',
        fromDate: '',
        toDate: '',
        cancelled: false
    });
    const [books, setBooks] = useState([]);
    const [members, setMembers] = useState([]);
    function getDataById(item) {
        console.log("el data type antes de ir al service", itemType);
        service.get('booksToMembers', item)
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
        if (!isCreate) {
            console.log("is create?", isCreate);
            service.update('booksToMembers', item, props);
        } else {
            console.log("pasa x acá con sus props ", props);
            service.create('booksToMembers', props);
        }

    }
    const handleInputChange = (event) => {
        setDat({
            ...dat,
            [event.target.name]: event.target.value
        });
    }
    const handleSubmit = (event) => {
        event.preventDefault()
        console.log('enviando datos...' + dat.id);
        sendData(dat);
    }
    useEffect(() => {
        console.log("es is create o NO? ", isCreate);
        if (!isCreate) {
            getDataById(item);
        }
        getBooks();
        getMembers();

    }, [])


    let resources;
    let membs;
    let selectedBook;
    let selectedMember;
    let selectedBookId;
    let selectedMemberId;
    if (!isCreate) {
        resources = [dat.book];
        membs = [dat.member];
        resources.map((resource, index) => {
            return selectedBook = resource.title;
            selectedBookId = resource.id;
        });
        membs.map((m, index) => {
            return selectedMemberId = m.id;
            selectedMember = m.last_name
        });
    }
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
                                {isCreate ?
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
                                    :
                                    <Form.Select aria-label='books' name="book" required
                                        defaultValue={selectedBookId} onChange={handleInputChange}>
                                        <option value={selectedBookId}>{selectedBook}</option>
                                        {
                                            books.map((b, index) => {
                                                return <option key={index}
                                                    value={b.id}>{b.title}</option>
                                            })
                                        }
                                    </Form.Select>
                                }
                            </FloatingLabel>
                        </Form.Group>
                    </Col>
                    <Col md>
                        <Form.Group className="mb-3" controlId="formBasicMembers">
                            <FloatingLabel
                                controlId="floatingMembers"
                                label="Socio"
                                className="mb-3">
                                {isCreate ?
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
                                    :

                                    <Form.Select aria-label='members' name="member" required
                                        defaultValue={selectedMemberId} onChange={handleInputChange} >
                                        <option value={selectedMemberId}>{selectedMember}</option>
                                        {
                                            members.map((m, index) => {
                                                return <option key={index}
                                                    value={m.id}>{m.first_name} {m.last_name}</option>
                                            })
                                        }
                                    </Form.Select>
                                }
                            </FloatingLabel>
                        </Form.Group>
                    </Col>
                    <Col md>
                        <Form.Group className="mb-3" controlId="formBasicfromDate">
                            <FloatingLabel
                                controlId="floatingFromDate"
                                label="Desde"
                                className="mb-3">
                                <Form.Control type="date" name="fromDate" defaultValue={!isCreate ? dat.fromDate : ''} onChange={handleInputChange} />
                            </FloatingLabel>
                        </Form.Group>
                    </Col>
                    <Col md>
                        <Form.Group className="mb-3" controlId="formBasictoDate">
                            <FloatingLabel
                                controlId="floatingToDate"
                                label="Hasta"
                                className="mb-3">
                                <Form.Control type="date" name="toDate" defaultValue={!isCreate ? dat.toDate : ''} onChange={handleInputChange} />
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


    return content;
}
export default BooksToMembersCrudForm;