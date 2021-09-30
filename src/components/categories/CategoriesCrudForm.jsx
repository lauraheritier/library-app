import React, { useState, useEffect } from "react";
import { Form, Alert, Spinner, Row, Col, Button } from 'react-bootstrap';
import FloatingLabel from 'react-bootstrap/FloatingLabel';
import { Formik } from 'formik';
import hooks from '../../hooks/components.hooks';
import categoriesValidator from '../../validators/categories.validator';

const CategoriesCrudForm = ({ item, itemType, isCreate, handleObjectType }) => {
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
    const [alertVariant, setAlertVariant] = useState('');
    const [alertText, setAlertText] = useState('');
    const [result, setResult, isLoading] = (!isCreate ? hooks.useGetDataById('categories', item) : '');
    const [show, setShow] = useState(false);
    const [action, setAction] = useState('');
    const[data, setData] = useState([]);

    useEffect(() => {
        if (!isCreate && !isLoading) {
            setData(result);
        }
    }, [isLoading])

    const sendData = async (props) => {
        let result;
        if (!isCreate) {
            result = await hooks.useCreateOrUpdate('categories', isCreate, item, props);
            if (result) {
                setAlertVariant('success');
                setAlertText("La categoría fue actualizada correctamente.");                
            } else {
                setAlertVariant('danger');
                setAlertText("Ocurrió un error al actualizar la categoría.");                
            }            
        } else {
            result = await hooks.useCreateOrUpdate('categories', isCreate, null, props);
            if (result) {
                setAlertVariant('success');
                setAlertText("La categoría fue creada correctamente.");                
            } else {
                setAlertVariant('danger');
                setAlertText("Ocurrió un error al crear la categoría.");                
            }   
        }
        hooks.useClearFields('categories', false);
        setShow(true);
        setTimeout(() => {
            setShow(false);
        }, 5000);
    }


let content;
if (!isCreate && isLoading) {
    content = content = (
        <div className="loading-content">
            <Spinner animation="grow" />
            <span>Un momento...</span>
        </div>
    )
}
else {
    const validate = categoriesValidator.categoriesValidator();
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
                                    controlId="category-description"
                                        label="Descripción"
                                        className={touched.description && errors.description ? "error" : null}>
                                        <Form.Control type="text" name="description" placeholder="Ingresá el nombre de la categoría" defaultValue={!isCreate ? data.description : ''} onChange={handleChange} />
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
                                <Button variant="danger" type="button" onClick={() => { setAction(1); handleObjectType(1, 4, 'Categorías', 'categories'); }}>
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
export default CategoriesCrudForm;