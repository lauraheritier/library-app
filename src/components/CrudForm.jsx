import React, { useState, useEffect, useForm } from "react";
import ValueList from "./ValueList";
import Form from 'react-bootstrap/Form';
import FloatingLabel from 'react-bootstrap/FloatingLabel';
import { Row, Col, Button } from 'react-bootstrap';

const CrudForm = ({ actionType, item, itemType, action, mainTitle }) => {
    /**itemTypes:
     * 1: Books
     * 2: Members
     * 3: Employees
     */
    /**
     * actions:
     * true: edit
     * false: create
     */
    const [dat, setDat] = useState({
        first_name: '',
        last_name: '',
        telephone: '',
        email: '',
        dni: '',
        address: '',
        member_id: ''
    })

    const handleInputChange = (event) => {
        // console.log(event.target.name)
        // console.log(event.target.value)
        setDat({
            ...dat,
            [event.target.name]: event.target.value
        })
    }
    const handleSubmit = (event) => {
        event.preventDefault()
        console.log('enviando datos...' + dat.first_name + ' ' + dat.last_name);
    }
    let content;
    if (itemType === 1) {
            content = (
                <>
                    <h2>{mainTitle}</h2>
                    <Form onSubmit={handleSubmit}>
                        <Row className="g-2">
                            <Col md>
                                <Form.Group className="mb-3" controlId="formBasicTitle">
                                    <FloatingLabel
                                        controlId="floatingTitle"
                                        label="Título"
                                        className="mb-3">
                                        <Form.Control type="text" placeholder="Ingresá un título" />
                                    </FloatingLabel>
                                </Form.Group>
                            </Col>
                            <Col md>
                                <Form.Group className="mb-3" controlId="formBasicISBN">
                                    <FloatingLabel
                                        controlId="floatingISBN"
                                        label="ISBN"
                                        className="mb-3">
                                        <Form.Control type="text" placeholder="Ingresá el ISBN" />
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
                                        <ValueList dataType="publishers" isAuthor={false} />
                                    </FloatingLabel>
                                </Form.Group>
                            </Col>
                            <Col md>
                                <Form.Group className="mb-3" controlId="formBasicCategories">
                                    <FloatingLabel
                                        controlId="floatingCategories"
                                        label="Categoría"
                                        className="mb-3">
                                        <ValueList dataType="categories" isAuthor={false} />
                                    </FloatingLabel>
                                </Form.Group>
                            </Col>
                            <Col md>
                                <Form.Group className="mb-3" controlId="formBasicAuthors">
                                    <FloatingLabel
                                        controlId="floatingAuthors"
                                        label="Autor"
                                        className="mb-3">
                                        <ValueList dataType="authors" isAuthor={true} />
                                    </FloatingLabel>
                                </Form.Group>
                            </Col>
                        </Row>
                        <Row className="g-1">
                            <Col md></Col>
                            <Col md></Col>
                            <Col md>
                                <Form.Group className="mb-3" controlId="formBasicState">
                                    <Form.Check label="Prestado" type="checkbox" />
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
                    <h2>{mainTitle}</h2>
                    <Form onSubmit={handleSubmit}>
                        <Row className="g-2">
                            <Col md>
                                <Form.Group className="mb-3" controlId="formBasicName">
                                    <FloatingLabel
                                        controlId="floatingName"
                                        label="Nombre"
                                        className="mb-3">
                                        <Form.Control name="first_name" type="text" placeholder="Ingresá el nombre" defaultValue={!action ? item.first_name : ''} onChange={handleInputChange} />
                                    </FloatingLabel>
                                </Form.Group>
                            </Col>
                            <Col md>
                                <Form.Group className="mb-3" controlId="formBasicSurname">
                                    <FloatingLabel
                                        controlId="floatingSurname"
                                        label="Apellido"
                                        className="mb-3">
                                        <Form.Control name="last_name" type="text" placeholder="Ingresá el apellido" defaultValue={!action ? item.last_name : ''} onChange={handleInputChange} />
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
                                        <Form.Control name="telephone" type="number" placeholder="Ingresá el teléfono" defaultValue={!action ? item.telephone : ''} onChange={handleInputChange} />
                                    </FloatingLabel>
                                </Form.Group>
                            </Col>
                            <Col md>
                                <Form.Group className="mb-3" controlId="formBasicMail">
                                    <FloatingLabel
                                        controlId="floatingMail"
                                        label="E-mail"
                                        className="mb-3">
                                        <Form.Control name="email" type="email" placeholder="Ingresá el e-mail" defaultValue={!action ? item.email : ''} onChange={handleInputChange} />
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
                                        <Form.Control name="dni" type="number" placeholder="Ingresá el DNI" defaultValue={!action ? item.dni : ''} onChange={handleInputChange} />
                                    </FloatingLabel>
                                </Form.Group>
                            </Col>
                            <Col md>
                                <Form.Group className="mb-3" controlId="formBasicAddress">
                                    <FloatingLabel
                                        controlId="floatingAddress"
                                        label="Dirección"
                                        className="mb-3">
                                        <Form.Control name="address" type="text" placeholder="Ingresá la dirección" defaultValue={!action ? item.address : ''} onChange={handleInputChange} />
                                    </FloatingLabel>
                                </Form.Group>
                            </Col>
                        </Row>
                        <Row className="g-1">
                            <Col md>
                                {
                                    itemType === 2 ?
                                        <Form.Group className="mb-3" controlId="formBasicMembership">
                                            <FloatingLabel
                                                controlId="floatingMembership"
                                                label="Nro. de socio"
                                                className="mb-3">
                                                <Form.Control name="member_id" type="number" placeholder="Ingresá el número de socio" defaultValue={!action ? item.membership_id : ''} onChange={handleInputChange} />
                                            </FloatingLabel>
                                        </Form.Group>
                                        :
                                        ""
                                }
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
export default CrudForm;