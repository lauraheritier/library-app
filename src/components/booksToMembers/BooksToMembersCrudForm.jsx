import React, { useState, useEffect, useForm } from "react";
import Form from 'react-bootstrap/Form';
import FloatingLabel from 'react-bootstrap/FloatingLabel';
import { Row, Col, Button } from 'react-bootstrap';
import service from '../../services/webService';

const BooksToMembersCrudForm = ({ item, itemType, isCreate, handleObjectType }) => {
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
        category: { description: '' },
        publisher: { description: '' },
        borrowed: '',
        author: '',
        isbn: ''
    });
    
   
    
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
        })
    }
    const handleSubmit = (event) => {
        event.preventDefault()
        console.log('enviando datos...' + dat.title);
        sendData(dat);
    }
    useEffect(() => {
        if(!isCreate) {
            getDataById(item);
        }
       
            
    }, [])

    function goTo(param) {
        handleObjectType(1, 6, 'Préstamos', 'booksToMembers');       
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
                                </FloatingLabel>
                        </Form.Group>
                    </Col>
                    <Col md>
                        <Form.Group className="mb-3" controlId="formBasicCategories">
                            <FloatingLabel
                                controlId="floatingCategories"
                                label="Categoría"
                                className="mb-3">
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
                {!isCreate ? 
                <Row className="g-1">
                    <Col md></Col>
                    <Col md></Col>
                    <Col md>
                        <Form.Group className="mb-3" controlId="formBasicState">
                            <Form.Check label="Prestado" name="borrowed" type="checkbox"
                                checked={dat.borrowed} disabled />
                        </Form.Group>
                    </Col>
                    {(dat.borrowed === true) ? <a href="#" onClick={() => { goTo(dat.id) }}>Ver préstamo</a> : ''}
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
export default BooksToMembersCrudForm;