import React, { useState, useEffect, useForm } from "react";
import Form from 'react-bootstrap/Form';
import FloatingLabel from 'react-bootstrap/FloatingLabel';
import { Row, Col, Button } from 'react-bootstrap';
import service from '../../services/webService';

const BooksCrudForm = ({ item, itemType, isCreate, handleObjectType }) => {
    /**itemTypes:
     * 1: Books
     * 2: Members
     * 3: Employees
     * 4: Categories
     * 5: Publishers
     *
     * isCreate:
     * true: create
     * false: edit
     */
    let content;

    const [dat, setDat] = useState({
        title: '',
        category: '',
        publisher: '',
        borrowed: (isCreate ? false : ''),
        author: '',
        isbn: ''
    });
    const [publishers, setPublishers] = useState([]);
    const [categories, setCategories] = useState([]);
    function getDataById(item) {
        console.log("el data type antes de ir al service", itemType);
        service.get('books', item)
            .then(response => {
                setDat(response.data);
            })
            .catch(e => {
                console.log("ERROR!!! ", e);
            });
    }

    function getPublishers() {
        service.getAll('publishers')
            .then(response => {
                setPublishers(response.data);

            })
            .catch(e => {
                console.log("ERROR!!! ", e);
            });
        console.log("los publishers", publishers);
    }
    function getCategories() {
        service.getAll('categories')
            .then(response => {
                setCategories(response.data);

            })
            .catch(e => {
                console.log("ERROR!!! ", e);
            });
        console.log("las cats", categories);
    }

    function sendData(props) {
        if (!isCreate) {
            console.log("is create?", isCreate);
            service.update('books', item, props);
        } else {
            console.log("pasa x acá con sus props ", props);
            service.create('books', props);
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
        console.log('enviando datos...' + dat.title);
        sendData(dat);
    }
    useEffect(() => {
        console.log("es is create o NO? ", isCreate);
        if (!isCreate) {
            getDataById(item);
        }
        getPublishers();
        getCategories();

    }, [])    

    function goTo(param) {
        handleObjectType(1, 6, 'Préstamos', 'booksToMembers');
    }
    let cats;
    let pubs;
    let selectedCat;
    let selectedCatId;
    let selectedPub;
    let selectedPubId;
    if (!isCreate) {
        cats = [dat.category];
        pubs = [dat.publisher];
        cats.map((cat, index) => {
            return selectedCat = cat.description;
        });
        cats.map((cat, index) => {
            return selectedCatId = cat.id;
        });
        pubs.map((pub, index) => {
            return selectedPub = pub.description;
        });
        pubs.map((pub, index) => {
            return selectedPubId = pub.id;
        });
    }
    content = (
        <>

            <Form onSubmit={handleSubmit}>
                <Row className="g-2">
                    <Col md>
                        <Form.Group className="mb-3" controlId="formBasicTitle">
                            <FloatingLabel
                                controlId="floatingTitle"
                                label="Título"
                                className="mb-3">
                                <Form.Control type="text" name="title" placeholder="Ingresá un título" defaultValue={!isCreate ? dat.title : ''} onChange={handleInputChange} />
                            </FloatingLabel>
                        </Form.Group>
                    </Col>
                    <Col md>
                        <Form.Group className="mb-3" controlId="formBasicISBN">
                            <FloatingLabel
                                controlId="floatingISBN"
                                label="ISBN"
                                className="mb-3">
                                <Form.Control type="text" name="isbn" placeholder="Ingresá el ISBN" defaultValue={!isCreate ? dat.isbn : ''} onChange={handleInputChange} />
                            </FloatingLabel>
                        </Form.Group>
                    </Col>
                </Row>
                <Row className="g-3">
                    <Col md>
                        <Form.Group className="mb-3" controlId="formBasicPublishers">
                            <FloatingLabel
                                controlId="floatingPublishers"
                                label="Editorial"
                                className="mb-3">
                                {isCreate ?
                                    <Form.Select aria-label='publishers' name="publisher" required
                                        onChange={handleInputChange}>
                                        <option>Seleccioná una editorial</option>
                                        {
                                            publishers.map((pub, index) => {
                                                return <option key={index}
                                                    value={pub.id}>{pub.description}</option>
                                            })
                                        }
                                    </Form.Select>
                                    :
                                    <Form.Select aria-label='publishers' name="publisher" required
                                        defaultValue={selectedPubId} onChange={handleInputChange}>
                                        <option value={selectedPubId}>{selectedPub}</option>
                                        {
                                            publishers.map((pub, index) => {
                                                return <option key={index}
                                                    value={pub.id}>{pub.description}</option>
                                            })
                                        }
                                    </Form.Select>
                                }
                            </FloatingLabel>
                        </Form.Group>
                    </Col>
                    <Col md>
                        <Form.Group className="mb-3" controlId="formBasicCategories">
                            <FloatingLabel
                                controlId="floatingCategories"
                                label="Categoría"
                                className="mb-3">
                                {isCreate ?
                                    <Form.Select aria-label='categories' name="category" required
                                        onChange={handleInputChange} >
                                        <option>Seleccioná una categoría</option>

                                        {
                                            categories.map((cat, index) => {
                                                return <option key={index}
                                                    value={cat.id}>{cat.description}</option>
                                            })
                                        }
                                    </Form.Select>
                                    :

                                    <Form.Select aria-label='categories' name="category" required
                                        defaultValue={selectedCatId} onChange={handleInputChange} >
                                        <option value={selectedCatId}>{selectedCat}</option>
                                        {
                                            categories.map((cat, index) => {
                                                return <option key={index}
                                                    value={cat.id}>{cat.description}</option>
                                            })
                                        }
                                    </Form.Select>
                                }
                            </FloatingLabel>
                        </Form.Group>
                    </Col>
                    <Col md>
                        <Form.Group className="mb-3" controlId="formBasicAuthors">
                            <FloatingLabel
                                controlId="floatingAuthors"
                                label="Autor"
                                className="mb-3">
                                <Form.Control type="text" name="author" defaultValue={!isCreate ? dat.author : ''} onChange={handleInputChange} />
                            </FloatingLabel>
                        </Form.Group>
                    </Col>
                </Row>
                {!isCreate && dat.borrowed === true ?
                    <Row className="g-1">
                        <Col md></Col>
                        <Col md></Col>
                        <Col md className="borrowed-check">
                            <Form.Group className="mb-3" controlId="formBasicState">
                                <Form.Check label="Prestado" name="borrowed" type="checkbox"
                                    checked={dat.borrowed} disabled />
                                <a href="#" className="prestamo-link" onClick={() => { goTo(dat.id) }}>Ver préstamo</a>
                            </Form.Group>
                        </Col>
                    </Row>
                    : ''}
                <Button variant="primary" type="submit">
                    Submit
                </Button>
            </Form>
        </>
    );


    return content;
}
export default BooksCrudForm;