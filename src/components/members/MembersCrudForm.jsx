import React, { useState, useEffect, useForm } from "react";
import Form from 'react-bootstrap/Form';
import FloatingLabel from 'react-bootstrap/FloatingLabel';
import { Row, Col, Button } from 'react-bootstrap';
import service from '../../services/webService';

const MembersCrudForm = ({ item, itemType, isCreate }) => {
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
  //  let createId;
  //  const [newId, setNewId] = useState(createId);
    const [dat, setDat] = useState({
        first_name: '',
        last_name: '',
        telephone: '',
        email: '',
        dni: '',
        address: '',
        membership_id: ''
    });
    function getDataById() {
        console.log("el data type antes de ir al service", itemType);
        service.get('members', item)
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
            getDataById();
        }
    }, [])
    function sendData(props) {
        if (!isCreate) {
            console.log("is create?", isCreate);
            service.update("members", item, props);
        } else {
          //  console.log("new id: ", newId, " create id: ", createId)
            console.log("pasa x acá con su nuevo id ", dat.membership_id);
            service.create("members", props);
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
   if(isCreate) {
       let result = dat.dni;
    setDat({
        ...dat,
        membership_id: 'S-'+ result
    });
   }
        
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
                                <Form.Control name="first_name" type="text" placeholder="Ingresá el nombre" defaultValue={!isCreate ? dat.first_name : ''} onChange={handleInputChange} />
                            </FloatingLabel>
                        </Form.Group>
                    </Col>
                    <Col md>
                        <Form.Group className="mb-3" controlId="formBasicSurname">
                            <FloatingLabel
                                controlId="floatingSurname"
                                label="Apellido"
                                className="mb-3">
                                <Form.Control name="last_name" type="text" placeholder="Ingresá el apellido" defaultValue={!isCreate ? dat.last_name : ''} onChange={handleInputChange} />
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
                                <Form.Control name="telephone" type="number" placeholder="Ingresá el teléfono" defaultValue={!isCreate ? dat.telephone : ''} onChange={handleInputChange} />
                            </FloatingLabel>
                        </Form.Group>
                    </Col>
                    <Col md>
                        <Form.Group className="mb-3" controlId="formBasicMail">
                            <FloatingLabel
                                controlId="floatingMail"
                                label="E-mail"
                                className="mb-3">
                                <Form.Control name="email" type="email" placeholder="Ingresá el e-mail" defaultValue={!isCreate ? dat.email : ''} onChange={handleInputChange} />
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
                                <Form.Control name="dni" type="number" placeholder="Ingresá el DNI" defaultValue={!isCreate ? dat.dni : ''} onChange={handleInputChange} />
                            </FloatingLabel>
                        </Form.Group>
                    </Col>
                    <Col md>
                        <Form.Group className="mb-3" controlId="formBasicAddress">
                            <FloatingLabel
                                controlId="floatingAddress"
                                label="Dirección"
                                className="mb-3">
                                <Form.Control name="address" type="text" placeholder="Ingresá la dirección" defaultValue={!isCreate ? dat.address : ''} onChange={handleInputChange} />
                            </FloatingLabel>
                        </Form.Group>
                    </Col>
                </Row>
                {
                    !isCreate ?
                        <Row className="g-1">
                            <Col md>

                                <Form.Group className="mb-3" controlId="formBasicMembership">
                                    <FloatingLabel
                                        controlId="floatingMembership"
                                        label="Nro. de socio"
                                        className="mb-3">
                                        <Form.Control disabled name="membership_id" type="text" placeholder="Ingresá el número de socio" defaultValue={!isCreate ? dat.membership_id : ''} />
                                    </FloatingLabel>
                                </Form.Group>
                            </Col>
                        </Row> : ''
                }
                <Button variant="primary" type="submit">
                    Submit
                </Button>
            </Form>
        </>
    );


    return content;
}
export default MembersCrudForm;