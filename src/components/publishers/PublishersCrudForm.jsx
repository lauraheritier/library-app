import React, { useState, useEffect, useForm } from "react";
import Form from 'react-bootstrap/Form';
import FloatingLabel from 'react-bootstrap/FloatingLabel';
import { Row, Col, Button } from 'react-bootstrap';
import service from '../../services/webService';

const PublishersCrudFrom = ({ item, itemType, isCreate }) => {
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
    const [dat, setDat] = useState({
        description: '',
        url: ''
    });

    function getDataById(item) {
        console.log("el data type antes de ir al service", itemType);
        service.get('publishers', item)
            .then(response => {
                setDat(response.data);
                console.log("los datos: ", response.data);
            })
            .catch(e => {
                console.log("ERROR!!! ", e);
            });
    }
    useEffect(() => {
        if (!isCreate) {
            getDataById(item);
        }
    }, [])
    function sendData(props) {
        if (!isCreate) {
            console.log("is create?", isCreate);
            service.update('publishers', item, props);
        } else {
            console.log("pasa x acá con sus props ", props);
            service.create('publishers', props);
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
        console.log('enviando datos...' + dat);
        sendData(dat);
    }
    let content;

    content = (
        <>
            <Form onSubmit={handleSubmit}>
                <Row className="g-2">
                    <Col md>
                        <Form.Group className="mb-3" controlId="formBasicName">
                            <FloatingLabel
                                controlId="floatingName"
                                label="Nombre"
                                className="mb-3">
                                <Form.Control type="text" name="description" placeholder="Ingresá la editorial" defaultValue={!isCreate ? dat.description : ''} onChange={handleInputChange} />
                            </FloatingLabel>
                        </Form.Group>
                    </Col>
                    <Col md>
                        <Form.Group className="mb-3" controlId="formBasicUrl">
                            <FloatingLabel
                                controlId="floatingUrl"
                                label="Sitio web"
                                className="mb-3">
                                <Form.Control type="text" name="url" placeholder="Ingresá el sitio web de la editorial" defaultValue={!isCreate ? dat.url : ''} onChange={handleInputChange} />
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
export default PublishersCrudFrom;