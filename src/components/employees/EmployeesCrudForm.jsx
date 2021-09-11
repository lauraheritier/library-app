import React, { useEffect, useState } from "react";
import { Button, Col, Row } from 'react-bootstrap';
import FloatingLabel from 'react-bootstrap/FloatingLabel';
import Form from 'react-bootstrap/Form';
import service from '../../services/webService';

const EmployeesCrudForm = ({ item, itemType, isCreate }) => {
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
        first_name: '',
        last_name: '',
        telephone: '',
        email: '',
        dni: '',
        address: ''
    });

    function getDataById(item) {
        console.log("el data type antes de ir al service", itemType);
        service.get('employees', item)
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
            service.update('employees', item, props);
        } else {
            console.log("pasa x acá con sus props ", props);
            service.create('employees', props);
        }

    }
    const handleInputChange = (event) => {
        // console.log(event.target.name)
        // console.log(event.target.value)
        // setChecked(event.target.checked);
        //  console.log("está checked???", checked);
        // setDat({
        //     borrowed: checked
        // });
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
                                <Form.Control name="first_name" type="text" placeholder="Ingresá el nombre" defaultValue={!isCreate ? item.first_name : ''} onChange={handleInputChange} />
                            </FloatingLabel>
                        </Form.Group>
                    </Col>
                    <Col md>
                        <Form.Group className="mb-3" controlId="formBasicSurname">
                            <FloatingLabel
                                controlId="floatingSurname"
                                label="Apellido"
                                className="mb-3">
                                <Form.Control name="last_name" type="text" placeholder="Ingresá el apellido" defaultValue={!isCreate ? item.last_name : ''} onChange={handleInputChange} />
                            </FloatingLabel>
                        </Form.Group>
                    </Col>
                </Row>
                <Row className="g-2">
                    <Col md>
                        <Form.Group className="mb-3" controlId="formBasicPhone">
                            <FloatingLabel
                                controlId="floatingPhone"
                                label="Teléfono"
                                className="mb-3">
                                <Form.Control name="telephone" type="number" placeholder="Ingresá el teléfono" defaultValue={!isCreate ? item.telephone : ''} onChange={handleInputChange} />
                            </FloatingLabel>
                        </Form.Group>
                    </Col>
                    <Col md>
                        <Form.Group className="mb-3" controlId="formBasicMail">
                            <FloatingLabel
                                controlId="floatingMail"
                                label="E-mail"
                                className="mb-3">
                                <Form.Control name="email" type="email" placeholder="Ingresá el e-mail" defaultValue={!isCreate ? item.email : ''} onChange={handleInputChange} />
                            </FloatingLabel>
                        </Form.Group>
                    </Col>
                </Row>
                <Row className="g-2">
                    <Col md>
                        <Form.Group className="mb-3" controlId="formBasicID">
                            <FloatingLabel
                                controlId="floatingID"
                                label="DNI"
                                className="mb-3">
                                <Form.Control name="dni" type="number" placeholder="Ingresá el DNI" defaultValue={!isCreate ? item.dni : ''} onChange={handleInputChange} />
                            </FloatingLabel>
                        </Form.Group>
                    </Col>
                    <Col md>
                        <Form.Group className="mb-3" controlId="formBasicAddress">
                            <FloatingLabel
                                controlId="floatingAddress"
                                label="Dirección"
                                className="mb-3">
                                <Form.Control name="address" type="text" placeholder="Ingresá la dirección" defaultValue={!isCreate ? item.address : ''} onChange={handleInputChange} />
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
export default EmployeesCrudForm;