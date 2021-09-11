import React, { useState, useEffect, useForm } from "react";
import Form from 'react-bootstrap/Form';
import FloatingLabel from 'react-bootstrap/FloatingLabel';
import { Row, Col, Button } from 'react-bootstrap';
import service from '../../services/webService';

const CategoriesCrudForm = ({ item, itemType, isCreate }) => {
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
    //const[checked, setChecked]=useState(false);
    const [dat, setDat] = useState({
        description: ''
    });

    function getDataById(item) {
        console.log("el data type antes de ir al service", itemType);
        service.get('categories', item)
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
            service.update('categories', item, props);
        } else {
            console.log("pasa x acá con sus props ", props);
            service.create('categories', props);
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
        console.log('enviando datos...' + dat.description);
        sendData(dat);
    }
    let content;

    content = (
        <>
            <Form onSubmit={handleSubmit}>
                <Row className="g-12">
                    <Col md>
                        <Form.Group className="mb-3" controlId="formBasicDescription">
                            <FloatingLabel
                                controlId="floatingDescription"
                                label="Descripción"
                                className="mb-3">
                                <Form.Control type="text" name="description" placeholder="Ingresá el nombre de la categoría" defaultValue={!isCreate ? dat.description : ''} onChange={handleInputChange} />
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
export default CategoriesCrudForm;