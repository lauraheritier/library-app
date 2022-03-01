import React, { useState, useEffect, useForm } from "react";
import { Form, Alert, Spinner, Row, Col, Button } from 'react-bootstrap';
import FloatingLabel from 'react-bootstrap/FloatingLabel';
import { Formik } from 'formik';
import hooks from '../../hooks/components.hooks';
import supportsValidator from '../../validators/supports.validator';

const SupportsCrudForm = ({ item, handleObjectType, isCreate }) => {
    /**itemTypes:
     * 1: Books
     * 2: Members
     * 4: Categories
     * 5: Publishers
     * 6: Supports
     *
     * isCreate:
     * true: create
     * false: edit
     */
    const [alertVariant, setAlertVariant] = useState('');
    const [alertText, setAlertText] = useState('');
    const [result, setResult, isLoading] = (!isCreate ? hooks.useGetDataById('supports', item) : '');
    const [show, setShow] = useState(false);
    const [action, setAction] = useState('');
    const [data, setData] = useState([]);

    useEffect(() => {
        if (!isCreate && !isLoading) {
            setData(result);
        }
    }, [isLoading])

    const sendData = async (props) => {
        let result;
        if (!isCreate) {
            result = await hooks.useCreateOrUpdate('supports', isCreate, item, props);
            if (result) {
                setAlertVariant('success');
                setAlertText("El soporte fue actualizado correctamente.");
            } else {
                setAlertVariant('danger');
                setAlertText("Ocurrió un error al actualizar el soporte.");
            }
        } else {
            result = await hooks.useCreateOrUpdate('supports', isCreate, null, props);
            if (result) {
                setAlertVariant('success');
                setAlertText("El soporte fue creado correctamente.");
            } else {
                setAlertVariant('danger');
                setAlertText("Ocurrió un error al crear el soporte.");
            }
        }
        hooks.useClearFields('supports', false);
        setShow(true);
        setTimeout(() => {
            setShow(false);
        }, 5000);
    }

    let content;
    if (!isCreate && isLoading) {
        content = content = (
            <div className="loading-content">
                <Spinner animation="grow" variant="warning"/>
                <span>Un momento...</span>
            </div>
        )
    } else {
        const validate = supportsValidator.supportsValidator();
        content = (
            <>
                <Formik
                    initialValues={{
                        description: !isCreate ? data.description : ''
                    }}
                    validationSchema={validate}
                    onChange={(event) => {
                        setData({
                            ...data,
                            [event.target.name]: event.target.value
                        });
                    }
                    }
                    onSubmit={(data, { setSubmitting }) => {

                        // When button submits form and form is in the process of submitting, submit button is disabled
                        setSubmitting(true);

                        // Simulate submitting to database, shows us values submitted, resets form
                        setTimeout(() => {
                            sendData(data);
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
                            <Row className="g-12">
                                <Col md>
                                    <Form.Group className="mb-3" controlId="formBasicDescription">
                                        <FloatingLabel
                                            controlId="support-description"
                                            label="Descripción"
                                            className={touched.description && errors.description ? "error" : null}>
                                            <Form.Control type="text" name="description" placeholder="Ingresá el nombre del soporte" defaultValue={!isCreate ? data.description : ''} onChange={handleChange} />
                                            {touched.description && errors.description ? (
                                                <div className="error-message">{errors.description}</div>
                                            ) : null}
                                        </FloatingLabel>
                                    </Form.Group>
                                </Col>
                            </Row>
                            <div className="btns-container">
                                <Button variant="success" type="submit">
                                    Submit
                                </Button>
                                <Button variant="danger" type="button" onClick={() => { setAction(1); handleObjectType(1, 6, 'Soportes', 'supports'); }}>
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
export default SupportsCrudForm;