import React, { useState, useEffect, useForm } from "react";
import Form from 'react-bootstrap/Form';
import FloatingLabel from 'react-bootstrap/FloatingLabel';
import { Row, Col, Button, Alert } from 'react-bootstrap';
import service from '../../services/webService';
import { Formik } from 'formik';
import * as Yup from 'yup';
import hooks from '../../hooks/components.hooks';


const BooksCrudForm = ({ item, itemType, isCreate, handleObjectType }) => {
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
    let content;

    const [dat, setDat] = useState({
        title: '',
        category: '',
        publisher: '',
        author: '',
        isbn: '',
        libraryOnly: false,
        support: '',
        sample: 1
    });
    const [action, setAction] = useState('');
    const [show, setShow] = useState(false);
    const [alertVariant, setAlertVariant] = useState('');
    const [alertText, setAlertText] = useState('');
    const [result, loading] = (!isCreate ? hooks.useGetDataById('books', item) : '');
    const [selectedItem1Description, selectedItem2Description, selectedItem3Description,
        selectedItem1Id, selectedItem2Id, selectedItem3Id] = (hooks.useSortSelectedOptionsToUpdate(dat.category, dat.publisher, dat.support));
    const [isLoading, cats] = (hooks.useGetHelperObjects('categories'));
    const [isLoading2, pubs] = (hooks.useGetHelperObjects('publishers'));
    const [isLoading1, sups] = (hooks.useGetHelperObjects('supports'));
    const [publishers, setPublishers] = useState([]);
    const [categories, setCategories] = useState([]);
    const [supports, setSupports] = useState([]);

    const sendData = async (props) => {
        let result = await hooks.useCreateOrUpdate('books', isCreate, item, props);
        if (result) {
            setAlertVariant('success');
            if (isCreate) {
                setAlertText("El recurso fue añadido a la biblioteca correctamente.");
            } else {
                setAlertText("El recurso fue actualizado correctamente.");
            }
        } else {
            setAlertVariant('danger');
            if (!isCreate) {
                setAlertText("Ya existe un recurso con ese ISBN.");
            } else {
                setAlertText("Ocurrió un error al actualizar el recurso.");
            }
        }
        hooks.useClearFields('books');
        setShow(true);
    }
    useEffect(() => {
        setCategories(cats);
        setPublishers(pubs);
        setSupports(sups);

        if (!isCreate && !loading) {
            setDat(result);
        }
    }, [!isCreate ? loading : isLoading, isLoading1, isLoading2]);

    function goBack(action, object) {
        setAction(action);
        handleObjectType(action, object, 'Recursos', 'books');
    }
    // Schema for yup
    const validationSchema = Yup.object().shape({
        title: Yup.string()
            .min(2, "*Names must have at least 2 characters")
            .max(100, "*Names can't be longer than 100 characters")
            .required("*Name is required"),
        author: Yup.string()
            .max(100, "*Email must be less than 100 characters")
            .required("*Email is required"),
        category: Yup.string()
            .required("*Category required"),
        support: Yup.string()
            .required("*Support required"),
        publisher: Yup.string()
            .required("*Publisher required"),
        sample: Yup.number()
            .required('*Ejemplares es obligatorio')
            .positive("*entry shold be > than 0")
            .integer("*input integer value")
    });

    if ((!isCreate && loading) || isLoading && isLoading1 && isLoading2) {
        content = <p>ESPERE UN MOMENTO POR FAVOR.</p>
    } else {
        content = (
            <>
                <Formik
                    initialValues={{
                        title: dat.title,
                        category: dat.category,
                        publisher: dat.publisher,
                        author: dat.author,
                        isbn: dat.isbn,
                        libraryOnly: dat.libraryOnly,
                        support: dat.support,
                        sample: dat.title
                    }}
                    validationSchema={validationSchema}
                    onChange={(event) => {
                        setDat({
                            ...dat,
                            [event.target.name]: event.target.value
                        });
                    }}
                    onSubmit={(dat, { setSubmitting }) => {

                        // When button submits form and form is in the process of submitting, submit button is disabled
                        setSubmitting(true);

                        // Simulate submitting to database, shows us values submitted, resets form
                        setTimeout(() => {
                            sendData(dat);
                            setSubmitting(false);
                        }, 500);
                    }}
                >
                    {({ values,
                        errors,
                        touched,
                        handleChange,
                        handleBlur,
                        handleSubmit,
                        isSubmitting }) => (
                        <Form onSubmit={handleSubmit}>
                            <Row className="g-2">
                                <Col md>
                                    <Form.Group className="mb-3" controlId="formBasicTitle">
                                        <FloatingLabel
                                            controlId="floatingTitle"
                                            label="Título"
                                            className={touched.title && errors.title ? "error" : null}>
                                            <Form.Control
                                                type="text" name="title" placeholder="Ingresá un título" defaultValue={!isCreate ? dat.title : values.title} onChange={handleChange} onBlur={handleBlur} />
                                            {touched.title && errors.title ? (
                                                <div className="error-message">{errors.title}</div>
                                            ) : null}
                                        </FloatingLabel>
                                    </Form.Group>
                                </Col>
                                <Col md>
                                    <Form.Group className="mb-3" controlId="formBasicISBN">
                                        <FloatingLabel
                                            controlId="floatingISBN"
                                            label="ISBN"
                                            className="mb-3">
                                            <Form.Control type="text" disabled={!isCreate && dat.isbn !== ''} name="isbn" placeholder="Ingresá el ISBN" defaultValue={!isCreate ? dat.isbn : values.isbn} onChange={handleChange} onBlur={handleBlur} />
                                        </FloatingLabel>
                                    </Form.Group>
                                </Col>
                            </Row>
                            <Row className="g-12">
                                <Col md>
                                    <Form.Group className="mb-3" controlId="formBasicSample">
                                        <FloatingLabel
                                            controlId="floatingSample"
                                            label="Ejemplares totales"
                                            className={touched.sample && errors.sample ? "error" : null}>
                                            <Form.Control
                                                type="number" name="sample" placeholder="Ingresá la cantidad de ejemplares totales" defaultValue={!isCreate ? dat.sample : values.sample} onChange={handleChange} onBlur={handleBlur} />
                                            {touched.sample && errors.sample ? (
                                                <div className="error-message">{errors.sample}</div>
                                            ) : null}
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
                                            className={touched.publisher && errors.publisher ? "error" : null}>
                                            {isCreate ?
                                                <Form.Select aria-label='publishers' name="publisher"
                                                    onChange={handleChange} onBlur={handleBlur}>
                                                    <option value='-1'>Seleccioná una editorial</option>
                                                    {
                                                        publishers.map((pub, index) => {
                                                            return <option key={index}
                                                                value={pub.id}>{pub.description}</option>
                                                        })
                                                    }
                                                </Form.Select>
                                                :
                                                <Form.Select aria-label='publishers' name="publisher"
                                                    defaultValue={selectedItem2Id} onChange={handleChange} onBlur={handleBlur}>
                                                    <option value={selectedItem2Id}>{selectedItem2Description}</option>
                                                    {
                                                        publishers.map((pub, index) => {
                                                            return <option key={index}
                                                                value={pub.id}>{pub.description}</option>
                                                        })
                                                    }
                                                </Form.Select>
                                            }
                                            {touched.publisher && errors.publisher ? (
                                                <div className="error-message">{errors.publisher}</div>
                                            ) : null}
                                        </FloatingLabel>
                                    </Form.Group>
                                </Col>
                                <Col md>
                                    <Form.Group className="mb-3" controlId="formBasicCategories">
                                        <FloatingLabel
                                            controlId="floatingCategories"
                                            label="Categoría"
                                            className={touched.category && errors.category ? "error" : null}>

                                            {isCreate ?
                                                <Form.Select aria-label='categories' name="category"
                                                    onChange={handleChange} onBlur={handleBlur} >
                                                    <option value='-1'>Seleccioná una categoría</option>

                                                    {
                                                        categories.map((cat, index) => {
                                                            return <option key={index}
                                                                value={cat.id}>{cat.description}</option>
                                                        })
                                                    }
                                                </Form.Select>
                                                :

                                                <Form.Select aria-label='categories' name="category"
                                                    defaultValue={selectedItem1Id} onChange={handleChange} onBlur={handleBlur} >
                                                    <option value={selectedItem1Id}>{selectedItem1Description}</option>
                                                    {
                                                        categories.map((cat, index) => {
                                                            return <option key={index}
                                                                value={cat.id}>{cat.description}</option>
                                                        })
                                                    }
                                                </Form.Select>
                                            }
                                            {touched.category && errors.category ? (
                                                <div className="error-message">{errors.category}</div>
                                            ) : null}
                                        </FloatingLabel>
                                    </Form.Group>
                                </Col>
                                <Col md>
                                    <Form.Group className="mb-3" controlId="formBasicSupports">
                                        <FloatingLabel
                                            controlId="floatingSupports"
                                            label="Soporte"
                                            className={touched.support && errors.support ? "error" : null}>
                                            {isCreate ?
                                                <>
                                                    <Form.Select aria-label='supports' name="support"
                                                        onChange={handleChange} onBlur={handleBlur} >
                                                        <option value='-1'>Seleccioná un soporte</option>
                                                        {
                                                            supports.map((sup, index) => {
                                                                return <option key={index}
                                                                    value={sup.id}>{sup.description}</option>
                                                            })
                                                        }
                                                    </Form.Select>
                                                </>
                                                :

                                                <Form.Select aria-label='supports' name="support"
                                                    defaultValue={selectedItem3Id} onChange={handleChange} onBlur={handleBlur} >
                                                    <option value={selectedItem3Id}>{selectedItem3Description}</option>
                                                    {
                                                        supports.map((sup, index) => {
                                                            return <option key={index}
                                                                value={sup.id}>{sup.description}</option>
                                                        })
                                                    }
                                                </Form.Select>
                                            }
                                            {touched.support && errors.support ? (
                                                <div className="error-message">{errors.support}</div>
                                            ) : null}
                                        </FloatingLabel>
                                    </Form.Group>
                                </Col>
                                <Col md>
                                    <Form.Group className="mb-3" controlId="formBasicAuthors">
                                        <FloatingLabel
                                            controlId="floatingAuthors"
                                            label="Autor"
                                            className={touched.author && errors.author ? "error" : null}>
                                            <Form.Control
                                                type="text" name="author" defaultValue={!isCreate ? dat.author : values.author} onChange={handleChange} onBlur={handleBlur} />
                                            {touched.author && errors.author ? (
                                                <div className="error-message">{errors.author}</div>
                                            ) : null}
                                        </FloatingLabel>
                                    </Form.Group>
                                </Col>
                            </Row>
                            <Row className="g-1">
                                <Col md></Col>
                                <Col md></Col>
                                <Col md className="borrowed-check">
                                    <Form.Group className="mb-3" controlId="formBasicLibrarOnly">
                                        <Form.Check label="Solo consulta en biblioteca" name="libraryOnly" type="checkbox" checked={dat.libraryOnly}
                                            defaultValue={dat.libraryOnly} onChange={(e) => { setDat({ ...dat, libraryOnly: e.currentTarget.checked }) }} />
                                    </Form.Group>
                                </Col>
                            </Row>
                            <div className="btns-container">
                                <Button variant="success" type="submit">
                                    Submit
                                </Button>
                                <Button variant="danger" type="button" onClick={() => { goBack(1, 1) }}>
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
export default BooksCrudForm;