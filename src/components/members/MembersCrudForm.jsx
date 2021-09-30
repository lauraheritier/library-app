import React, { useState, useEffect } from "react";
import { Form, Alert, Spinner, Row, Col, Button } from 'react-bootstrap';
import FloatingLabel from 'react-bootstrap/FloatingLabel';
import { Formik } from 'formik';
import hooks from '../../hooks/components.hooks';
import usersValidator from '../../validators/users.validator';

const MembersCrudForm = ({ item, itemType, isCreate, handleObjectType }) => {
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
    const [alertVariant, setAlertVariant] = useState('');
    const [alertText, setAlertText] = useState('');
    const [result, setResult, isLoading] = (!isCreate ? hooks.useGetDataById('members', item) : '');
    const [show, setShow] = useState(false);
    const [action, setAction] = useState('');


    useEffect(() => {

    }, [isLoading])

    const sendData = async (props) => {
        let result;
        if (!isCreate) {
            result = await hooks.useCreateOrUpdate('members', isCreate, item, props);
            if (result) {
                setAlertVariant('success');
                setAlertText("El socio fue actualizado correctamente.");
            } else {
                setAlertVariant('danger');
                setAlertText("Ocurrió un error al actualizar el socio.");
            }
        } else {
            result = await hooks.useCreateOrUpdate('members', isCreate, null, props);
            if (result) {
                setAlertVariant('success');
                setAlertText("El socio fue creado correctamente.");
            } else {
                setAlertVariant('danger');
                setAlertText("Ocurrió un error al crear el socio.");
            }
        }
        hooks.useClearFields('members', false);
        setShow(true);
        setTimeout(() => {
            setShow(false);
        }, 5000);
    }


    let content;
    if (isLoading) {
        content = content = (
            <div className="loading-content">
                <Spinner animation="grow" />
                <span>Un momento...</span>
            </div>
        )
    }
    else {
        const validate = usersValidator.usersValidator();
        content = (
            <>
                <Formik
                    initialValues={{
                        first_name: !isCreate ? result.first_name : '',
                        last_name: !isCreate ? result.last_name : '',
                        telephone: !isCreate ? result.telephone : '',
                        email: !isCreate ? result.email : '',
                        dni: !isCreate ? result.dni : '',
                        address: !isCreate ? result.address : '',
                        membership_id: !isCreate ? result.membership_id : ''
                    }}
                    validationSchema={validate}
                    onChange={(event) => {
                        setResult({
                            ...result,
                            [event.target.name]: event.target.value
                        });
                    }
                    }
                    onSubmit={(result, { setSubmitting }) => {

                        // When button submits form and form is in the process of submitting, submit button is disabled
                        setSubmitting(true);

                        // Simulate submitting to database, shows us values submitted, resets form
                        setTimeout(() => {
                            sendData(result);
                            setSubmitting(false);
                        }, 500);
                    }}
                >
                    {({ errors,
                        touched,
                        handleChange,
                        handleBlur,
                        handleSubmit
                    }) => (
                        <Form onSubmit={handleSubmit}>
                            <Row className="g-2">
                                <Col md>
                                    <Form.Group className="mb-3" controlId="formBasicName">
                                        <FloatingLabel
                                            controlId="floatingName"
                                            label="Nombre"
                                            className={touched.first_name && errors.first_name ? "error" : null}>
                                            <Form.Control name="first_name" type="text" placeholder="Ingresá el nombre" defaultValue={!isCreate ? result.first_name : ''} onChange={handleChange} />
                                            {touched.first_name && errors.first_name ? (
                                                <div className="error-message">{errors.first_name}</div>
                                            ) : null}
                                        </FloatingLabel>
                                    </Form.Group>
                                </Col>
                                <Col md>
                                    <Form.Group className="mb-3" controlId="formBasicSurname">
                                        <FloatingLabel
                                            controlId="floatingSurname"
                                            label="Apellido"
                                            className={touched.last_name && errors.last_name ? "error" : null}>
                                            <Form.Control name="last_name" type="text" placeholder="Ingresá el apellido" defaultValue={!isCreate ? result.last_name : ''} onChange={handleChange} />
                                            {touched.last_name && errors.last_name ? (
                                                <div className="error-message">{errors.last_name}</div>
                                            ) : null}
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
                                            className={touched.telephone && errors.telephone ? "error" : null}>
                                            <Form.Control name="telephone" type="number" placeholder="Ingresá el teléfono" defaultValue={!isCreate ? result.telephone : ''} onChange={handleChange} />
                                            {touched.telephone && errors.telephone ? (
                                                <div className="error-message">{errors.telephone}</div>
                                            ) : null}
                                        </FloatingLabel>
                                    </Form.Group>
                                </Col>
                                <Col md>
                                    <Form.Group className="mb-3" controlId="formBasicMail">
                                        <FloatingLabel
                                            controlId="floatingMail"
                                            label="E-mail"
                                            className={touched.email && errors.email ? "error" : null}>
                                            <Form.Control name="email" type="email" placeholder="Ingresá el e-mail" defaultValue={!isCreate ? result.email : ''} onChange={handleChange} />
                                            {touched.email && errors.email ? (
                                                <div className="error-message">{errors.email}</div>
                                            ) : null}
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
                                            className={touched.dni && errors.dni ? "error" : null}>
                                            <Form.Control disabled={!isCreate && result.dni !== ''} name="dni" type="number" placeholder="Ingresá el DNI" defaultValue={!isCreate ? result.dni : ''} onChange={handleChange} />
                                            {touched.dni && errors.dni ? (
                                                <div className="error-message">{errors.dni}</div>
                                            ) : null}
                                        </FloatingLabel>
                                    </Form.Group>
                                </Col>
                                <Col md>
                                    <Form.Group className="mb-3" controlId="formBasicAddress">
                                        <FloatingLabel
                                            controlId="floatingAddress"
                                            label="Dirección"
                                            className={touched.address && errors.address ? "error" : null}>
                                            <Form.Control name="address" type="text" placeholder="Ingresá la dirección" defaultValue={!isCreate ? result.address : ''} onChange={handleChange} />
                                            {touched.address && errors.address ? (
                                                <div className="error-message">{errors.address}</div>
                                            ) : null}
                                        </FloatingLabel>
                                    </Form.Group>
                                </Col>
                                {!isCreate ?
                                    <Col md>
                                        <Form.Group className="mb-3" controlId="formBasicMembership">
                                            <FloatingLabel
                                                controlId="floatingMembership"
                                                label="Número de socio"
                                                className="mb-3">
                                                <Form.Control disabled name="membership_id" type="text" defaultValue={result.membership_id} />
                                            </FloatingLabel>
                                        </Form.Group>
                                    </Col>
                                    :
                                    null
                                }

                            </Row>
                            <div className="btns-container">
                                <Button variant="success" type="submit">
                                    Submit
                                </Button>
                                <Button variant="danger" type="button" onClick={() => { setAction(1); handleObjectType(1, 2, 'Socios', 'members'); }}>
                                    Cancel
                                </Button>
                            </div>
                        </Form>
                    )}
                </Formik>
                <Alert variant={alertVariant} show={show} onClose={() => setShow(false)} dismissible>
                    <p>
                        {alertText}
                    </p>
                </Alert>
            </>
        );
    }
    return content;
}
export default MembersCrudForm;