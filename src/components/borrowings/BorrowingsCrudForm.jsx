import React, { useState, useEffect, useForm } from "react";
import Form from 'react-bootstrap/Form';
import FloatingLabel from 'react-bootstrap/FloatingLabel';
import { Row, Col, Button, Alert, Spinner } from 'react-bootstrap';
import service from '../../services/webService';
import helper from '../../helpers/formatDate.helper';
import { Formik } from 'formik';
import borrowingsValidator from '../../validators/borrowings.validator';
import hooks from '../../hooks/components.hooks';

const BorrowingsCrudForm = ({ item, itemType, isCreate, fixedFromDate, fixedToDate, handleObjectType }) => {
    /**itemTypes:
     * 1: Books
     * 2: Members
     * 3: Employees
     * 4: Categories
     * 5: Publishers
     * 6: Supports
     * 7: Borrowings
     *
     * isCreate:
     * true: create
     * false: edit
     */
    let content;
    let selectedBook;
    let selectedMember;
    const [show, setShow] = useState(false);
    const [alertVariant, setAlertVariant] = useState('');
    const [alertText, setAlertText] = useState('');
    const [action, setAction] = useState('');
    const [result, setResult, isLoadingBorrowings] = (!isCreate ? hooks.useGetDataById('borrowings', item) : '');
    const [isLoadingResources, srcs] = (hooks.useGetHelperObjects('books'));
    const [isLoadingMembers, membs] = (hooks.useGetHelperObjects('members'));    

    const sendData = async (props) => {
        console.log("pasa  xacá y las dates: ", props);
        let endResult;
        if (isCreate) {
            service.updateAvailableResources('books', props.book, true, false).then(response => {
                if (response.data) {
                    endResult = hooks.useCreateOrUpdate('borrowings', isCreate, item, props);
                }
                try {
                    if (endResult) {
                        setAlertVariant('success');
                        setAlertText("El préstamo fue añadido correctamente.");
                    } else {
                        setAlertVariant('danger');
                        setAlertText("No se pudo actualizar el préstamo. Verifique la cantidad de ejemplares disponibles.");
                    }
                }
                catch (err) {
                    console.log("ERRORRR");
                }
            });
            hooks.useClearFields('borrowings', false);
        } else {
            endResult = hooks.useCreateOrUpdate('borrowings', isCreate, result.id, props);
            console.log("para pro el update", endResult);

            if (endResult) {
                console.log("pasó x acá el end result q está en true");

                setAlertVariant('success');
                setAlertText("El préstamo fue actualizado correctamente.");
            }
            else {
                setAlertVariant('danger');
                setAlertText("Ocurrió un error al actualizar el préstamo.");
            }
            hooks.useClearFields('borrowings', true);
        }
        
        setShow(true);
            setTimeout(() => {
                setShow(false);
            }, 5000);
    }

    useEffect(() => {
       
    }, [!isCreate ? isLoadingBorrowings : isLoadingResources, isLoadingMembers]);


    if ((!isCreate && isLoadingBorrowings) || isLoadingResources && isLoadingMembers) {
        content = content = (
            <div className="loading-content">
                <Spinner animation="grow" variant="warning"/>
                <span>Un momento...</span>
            </div>
        )
    } else {
        if (!isCreate) {
            selectedBook = [result.book];
            selectedMember = [result.member];
            const validate = borrowingsValidator.borrowingsValidator(false);
            content = (
                <>
                    <div className="container outdated-info">
                        {selectedBook.map(book => <span>Libro: {book.title}</span>)}
                        {selectedMember.map(member => <span>Contacto: {member.membership_id}</span>)}
                        <span>Desde: {fixedFromDate}</span>
                        <span>Hasta: {fixedToDate}</span>
                    </div>
                    <Formik
                        initialValues={{
                            book: result.book,
                            member: result.member,
                            fromDate: result.fromDate,
                            toDate: result.toDate
                        }}
                        validationSchema={validate}
                        onChange={(event) => {
                            setResult({
                                ...result,
                                [event.target.name]: event.target.value
                            });
                        }}
                        onSubmit={(result, { setSubmitting }) => {

                            // When button submits form and form is in the process of submitting, submit button is disabled
                            setSubmitting(true);
                            console.log("pasa x el onsubmit", result);
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
                                <Row className="g-3">
                                    <Col md>
                                        <Form.Group className="mb-3" controlId="formBasicfromDate">
                                            <FloatingLabel
                                                controlId="floatingFromDate"
                                                label="Desde"
                                                className="mb-3">
                                                <Form.Control type="date" disabled name="fromDate" defaultValue={helper.formatDate(null, true, false)} />
                                            </FloatingLabel>
                                        </Form.Group>
                                    </Col>
                                    <Col md>
                                        <Form.Group className="mb-3" controlId="formBasictoDate">
                                            <FloatingLabel
                                                controlId="floatingToDate"
                                                label="Hasta"
                                                className={touched.toDate && errors.toDate ? "error" : null}>
                                                <Form.Control type="date" name="toDate" defaultValue={helper.formatDate(null, true, false)} onChange={handleChange} />
                                                {touched.toDate && errors.toDate ? (
                                                    <div className="error-message">{errors.toDate}</div>
                                                ) : null}
                                            </FloatingLabel>
                                        </Form.Group>
                                    </Col>
                                </Row>
                                <div className="btns-container">
                                    <Button variant="success" type="submit">
                                        Submit
                                    </Button>
                                    <Button variant="danger" type="button" onClick={() => { setAction(1); handleObjectType(1, 7, 'Préstamos', 'borrowings'); }}>
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
        } else {
            const validate = borrowingsValidator.borrowingsValidator(true);
            content = (
                <>
                    <Formik
                        initialValues={{
                            book: '',
                            member: '',
                            fromDate: helper.formatDate(null, true, false),
                            toDate: helper.formatDate(null, true, false)
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
                            <>
                                <Form onSubmit={handleSubmit}>
                                    <Row className="g-3">
                                        <Col md>
                                            <Form.Group className="mb-3" controlId="formBasicBooks">
                                                <FloatingLabel
                                                    controlId="floatingBooks"
                                                    label="Libro"
                                                    className={touched.book && errors.book ? "error" : null}>
                                                    <Form.Select aria-label='books' name="book"
                                                        onChange={handleChange}>
                                                        <option value=''>Seleccioná un recurso</option>
                                                        {
                                                            srcs.map((b, index) => {
                                                                return <option key={index}
                                                                    value={b.id}>{b.title}</option>
                                                            })
                                                        }
                                                    </Form.Select>
                                                    {touched.book && errors.book ? (
                                                        <div className="error-message">{errors.book}</div>
                                                    ) : null}
                                                </FloatingLabel>
                                            </Form.Group>
                                        </Col>
                                        <Col md>
                                            <Form.Group className="mb-3" controlId="formBasicMembers">
                                                <FloatingLabel
                                                    controlId="floatingMembers"
                                                    label="Contacto"
                                                    className={touched.member && errors.member ? "error" : null}>
                                                    <Form.Select aria-label='members' name="member"
                                                        onChange={handleChange} >
                                                        <option value=''>Seleccioná un contacto</option>

                                                        {
                                                            membs.map((m, index) => {
                                                                return <option key={index}
                                                                    value={m.id}>{m.first_name} {m.last_name}</option>
                                                            })
                                                        }
                                                    </Form.Select>
                                                    {touched.member && errors.member ? (
                                                        <div className="error-message">{errors.member}</div>
                                                    ) : null}
                                                </FloatingLabel>
                                            </Form.Group>
                                        </Col>
                                        <Col md>
                                            <Form.Group className="mb-3" controlId="formBasicfromDate">
                                                <FloatingLabel
                                                    controlId="floatingFromDate"
                                                    label="Desde"
                                                    className="mb-3">
                                                    <Form.Control type="date" disabled name="fromDate" value={helper.formatDate(null, true, true)} />
                                                </FloatingLabel>
                                            </Form.Group>
                                        </Col>
                                        <Col md>
                                            <Form.Group className="mb-3" controlId="formBasictoDate">
                                                <FloatingLabel
                                                    controlId="floatingToDate"
                                                    label="Hasta"
                                                    className={touched.toDate && errors.toDate ? "error" : null}>
                                                    <Form.Control type="date" name="toDate" defaultValue={helper.formatDate(null, true, false)} onChange={handleChange} />
                                                    {touched.toDate && errors.toDate ? (
                                                        <div className="error-message">{errors.toDate}</div>
                                                    ) : null}
                                                </FloatingLabel>
                                            </Form.Group>
                                        </Col>
                                    </Row>
                                    <div className="btns-container">
                                        <Button variant="success" type="submit">
                                            Submit
                                        </Button>
                                        <Button variant="danger" type="button" onClick={() => { setAction(1); handleObjectType(1, 7, 'Préstamos', 'borrowings'); }}>
                                            Cancel
                                        </Button>
                                    </div>
                                </Form>
                            </>
                        )}
                    </Formik>

                    <Alert variant={alertVariant} show={show} onClose={() => setShow(false)} dismissible>
                        <p>
                            {alertText}
                        </p>
                    </Alert>
                </>
            )
        }
    }


    return content;
}
export default BorrowingsCrudForm;