import React, { useState, useEffect, useForm } from "react";
import ValueList from "./ValueList";
import Form from 'react-bootstrap/Form';
import FloatingLabel from 'react-bootstrap/FloatingLabel';
import { Row, Col, Button } from 'react-bootstrap';
import service from '../services/member.service';

const CrudForm = ({ item, itemType, isCreate }) => {
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
        description: '',
        url: '',
        category: { description: ''},
        publisher: {description: ''},
        borrowed: '',
        author: '',
        isbn: '',
        first_name: '',
        last_name: '',
        telephone: '',
        email: '',
        dni: '',
        address: '',
        member_id: ''
    });
    let result;
    
    function getDataById(item) {
        console.log("el data type antes de ir al service", itemType);
        switch (itemType) {
            case 1: {result = "books"};
                break;
            case 2: {result = "members"};
                break;
            case 3: {result = "employees"};
                break;
            case 4: {result = "categories"};
                break;
            case 5: {result = "publishers"};
                break;
            default:
                console.log("no hay nada, solo el olvido.");
        }
        console.log("el item type tipo resultado: ", result);
        service.get(result, item)
            .then(response => {
                setDat(response.data);
                console.log("los datos: ", response.data);
            })
            .catch(e => {
                console.log("ERROR!!! ", e);
            });
    }
    useEffect(() => {
        getDataById(item);
    }, [])
    function sendData(props) {
        switch (itemType) {
            case 1: {result = "books"};
                break;
            case 2: {result = "members"};
                break;
            case 3: {result = "employees"};
                break;
            case 4: {result = "categories"};
                break;
            case 5: {result = "publishers"};
                break;
            default:
                console.log("no hay nada, solo el olvido.");
        }
        if(!isCreate) {
            service.update(result, item, props);
        } else {
            console.log("pasa x acá con sus props ", props);
            service.create(result, props);
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
            borrowed: event.target.checked,
            [event.target.name]: event.target.value
        })
        console.log("how about the borrowed??? ", dat.borrowed);      
        
        
    }
    const handleSubmit = (event) => {
        event.preventDefault()
        console.log('enviando datos...' + dat);
        sendData(dat);
    }
    let content;
    if (itemType === 1) {
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
                                    <ValueList dataType="publishers" name="publisher" defaultValue={!isCreate ? dat.publisher : ''} onChange={handleInputChange} />
                                </FloatingLabel>
                            </Form.Group>
                        </Col>
                        <Col md>
                            <Form.Group className="mb-3" controlId="formBasicCategories">
                                <FloatingLabel
                                    controlId="floatingCategories"
                                    label="Categoría"
                                    className="mb-3">
                                    <ValueList dataType="categories" name="category" defaultValue={!isCreate ? dat.category : ''} onChange={handleInputChange} />
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
                    <Row className="g-1">
                        <Col md></Col>
                        <Col md></Col>
                        <Col md>
                            <Form.Group className="mb-3" controlId="formBasicState">
                                <Form.Check label="Prestado" name="borrowed" type="checkbox"
                                defaultValue = {!isCreate ? dat.borrowed : false}
                                checked={dat.borrowed == false ? false : true}
                                  onChange={handleInputChange} />
                            </Form.Group>
                        </Col>
                    </Row>
                    <Button variant="primary" type="submit">
                        Submit
                    </Button>
                </Form>
            </>
        );
    } else if (itemType == 4) {
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
    } else if (itemType == 5) {
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
                                    <Form.Control type="text" name="url" placeholder="Ingresá el sitio web de la editorial" defaultValue = {!isCreate ? dat.url : ''} onChange={handleInputChange}/>
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
                    <Row className="g-1">
                        <Col md>
                            {
                                itemType === 2 ?
                                    <Form.Group className="mb-3" controlId="formBasicMembership">
                                        <FloatingLabel
                                            controlId="floatingMembership"
                                            label="Nro. de socio"
                                            className="mb-3">
                                            <Form.Control name="member_id" type="number" placeholder="Ingresá el número de socio" defaultValue={!isCreate ? item.membership_id : ''} onChange={handleInputChange} />
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