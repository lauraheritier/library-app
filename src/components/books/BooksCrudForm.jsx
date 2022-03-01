import React, { useState, useEffect } from "react";
import { render } from 'react-dom';
import FloatingLabel from 'react-bootstrap/FloatingLabel';
import { Row, Col, Button, Alert, Form, Spinner } from 'react-bootstrap';
import { Formik } from 'formik';
import hooks from '../../hooks/components.hooks';
import bookValidator from '../../validators/book.validator';
import FooterMenu from "../footer/footer.component";
import { WithContext as ReactTags } from 'react-tag-input';
import uuid from 'react-uuid';


const BooksCrudForm = ({ item, isCreate, handleObjectType }) => {
    /**itemTypes:
     * 1: Books
     * 2: Members
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
        read: false,
        support: '',
        sample: 1,
        pages: 1,
        thumbnail: '',
        rating: 0,
        notes: '',
        location: '',
        tags: [{id: '', text: ''}],
        bookCode: ''

    });
    const [action, setAction] = useState('');
    const [show, setShow] = useState(false);
    const [alertVariant, setAlertVariant] = useState('');
    const [alertText, setAlertText] = useState('');
    const [result, setResult, isLoadingResources] = (!isCreate ? hooks.useGetDataById('books', item) : '');
    const [selectedItem1Description, selectedItem2Description, selectedItem3Description,
        selectedItem1Id, selectedItem2Id, selectedItem3Id] = (!isCreate ? hooks.useSortSelectedOptionsToUpdate(dat.category, dat.publisher, dat.support) : '');
    const [isLoadingCategories, cats] = (hooks.useGetHelperObjects('categories', false));
    const [isLoadingPublishers, pubs] = (hooks.useGetHelperObjects('publishers', false));
    const [isLoadingSupports, sups] = (hooks.useGetHelperObjects('supports', false));
    const [imgUrl, setImgUrl] = useState('');
    const [reactTags, setReactTags] = useState([]);
    /**tags */
    const KeyCodes = {
        comma: 188,
        enter: 13
    };
    const delimiters = [KeyCodes.comma, KeyCodes.enter];
    const handleDelete = i => {
        setReactTags(reactTags.filter((tag, index) => index !== i));
    };

    const handleAddition = tag => {
        setReactTags([...reactTags, tag]);
    };

  const onClearAll = () => {
    setReactTags([]);
  };

  const onTagUpdate = (i, newTag) => {
    const updatedTags = reactTags.slice();
    updatedTags.splice(i, 1, newTag);
    setReactTags(updatedTags);
  };
    const sendData = async (props) => {
        let result;
        if (!isCreate) {
            result = await hooks.useCreateOrUpdate('books', isCreate, item, props);
        } else {
            result = await hooks.useCreateOrUpdate('books', isCreate, null, props);
        }
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
                setAlertText("Ocurrió un error al actualizar el recurso.");
            } else {
                setAlertText("Ya existe un recurso con el ISBN " + props.isbn + ".");
            }
        }
        hooks.useClearFields('books');
        setShow(true);
        setTimeout(() => {
            setShow(false);
        }, 5000);
    }

    const getThumbnail = async (isbn) => {
        let rsult = "";

        let imageUrl = 'https://www.googleapis.com/books/v1/volumes?q=isbn:' + isbn;
        const res = await fetch(imageUrl);
        const imageBlob = await res.json();


        //const imageObjectURL = URL.createObjectURL(imageBlob);
        console.log("la rta y el image blob", res, imageBlob);
        if (imageBlob.totalItems > 0) {
            rsult = imageBlob.items[0].volumeInfo.imageLinks.thumbnail;
            console.log("la rta!!!!!", rsult);
        }

        return rsult;

    }

    useEffect(() => {
        if (!isCreate && !isLoadingResources) {
            setDat(result);
        }


    }, [!isCreate ? isLoadingResources : isLoadingCategories, isLoadingPublishers, isLoadingSupports]);


    if ((!isCreate && isLoadingResources) || isLoadingCategories && isLoadingPublishers && isLoadingSupports) {
        content = content = (
            <div className="loading-content">
                <Spinner animation="grow" variant="warning" />
                <span>Un momento...</span>
            </div>
        )
    } else {
        let filteredCats;
        let filteredPubs;
        let filteredSups;
        if (!isCreate) {
            filteredCats = cats.filter(function (f) {
                return !(f.id).includes(selectedItem1Id);
            });
            filteredPubs = pubs.filter(function (f) {
                return !(f.id).includes(selectedItem2Id);
            });
            filteredSups = sups.filter(function (f) {
                return !(f.id).includes(selectedItem3Id);
            });
        }

        const validate = bookValidator.bookValidator();
        content = (
            <>
                <Formik
                    initialValues={{
                        title: !isCreate ? result.title : '',
                        category: !isCreate ? result.category : '',
                        publisher: !isCreate ? result.publisher : '',
                        author: !isCreate ? result.author : '',
                        isbn: !isCreate ? result.isbn : '',
                        read: !isCreate ? result.read : false,
                        support: !isCreate ? result.support : '',
                        sample: !isCreate ? result.sample : 1,
                        pages: !isCreate ? result.pages : 1,
                        thumbnail: !isCreate ? result.thumbnail : '',
                        rating: !isCreate ? result.rating : 0,
                        notes: !isCreate ? result.notes : '',
                        tags: !isCreate ? result.tags : '',
                        location: !isCreate ? result.location : '',
                        bookCode: !isCreate ? result.bookCode : ''
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
                        getThumbnail(result.isbn).then(thumbnail => {
                            console.log("lo q trae thumbnail", thumbnail);
                            result.thumbnail = thumbnail;
                        });
                        result.tags = reactTags;
                        
                        
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
                                    <Form.Group className="mb-3" controlId="formBasicTitle">
                                        <FloatingLabel
                                            controlId="floatingTitle"
                                            label="Título"
                                            className={touched.title && errors.title ? "error" : null}>
                                            <Form.Control
                                                type="text" name="title" placeholder="Ingresá un título" defaultValue={!isCreate ? result.title : ''} onChange={handleChange} onBlur={handleBlur} />
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
                                            label="ISBN (opcional)"
                                            className="mb-3">
                                            <Form.Control type="text" disabled={!isCreate && result.isbn !== ''} name="isbn" placeholder="Ingresá el ISBN" defaultValue={!isCreate ? result.isbn : ''} onChange={handleChange} onBlur={handleBlur} />
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
                                                type="number" name="sample" placeholder="Ingresá la cantidad de ejemplares totales" defaultValue={!isCreate ? result.sample : 1} onChange={handleChange} onBlur={handleBlur} />
                                            {touched.sample && errors.sample ? (
                                                <div className="error-message">{errors.sample}</div>
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
                                                type="text" name="author" defaultValue={!isCreate ? result.author : ''} onChange={handleChange} onBlur={handleBlur} />
                                            {touched.author && errors.author ? (
                                                <div className="error-message">{errors.author}</div>
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
                                                    <option value=''>Seleccioná una editorial</option>
                                                    {
                                                        pubs.map((pub, index) => {
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
                                                        filteredPubs.map((pub, index) => {
                                                            return <option key={index}
                                                                value={pub.id}>{pub.description}</option>
                                                        })
                                                    }
                                                    <option value=''>Seleccioná una editorial</option>
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
                                                    <option value=''>Seleccioná una categoría</option>

                                                    {
                                                        cats.map((cat, index) => {
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

                                                        filteredCats.map((cat, index) => {
                                                            return <option key={index}
                                                                value={cat.id}>{cat.description}</option>
                                                        })
                                                    }
                                                    <option value=''>Seleccioná una categoría</option>
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
                                                        <option value=''>Seleccioná un soporte</option>
                                                        {
                                                            sups.map((sup, index) => {
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
                                                        filteredSups.map((sup, index) => {
                                                            return <option key={index}
                                                                value={sup.id}>{sup.description}</option>
                                                        })
                                                    }
                                                    <option value=''>Seleccioná un soporte</option>
                                                </Form.Select>
                                            }
                                            {touched.support && errors.support ? (
                                                <div className="error-message">{errors.support}</div>
                                            ) : null}
                                        </FloatingLabel>
                                    </Form.Group>
                                </Col>
                            </Row>
                            <Row className="g-12">
                                <Col md>
                                    <Form.Group className="mb-3" controlId="formBasicAuthors">
                                        <FloatingLabel
                                            controlId="floatingAuthors"
                                            label="Cantidad de páginas (opcional)"
                                            className={touched.pages && errors.pages ? "error" : null}>
                                            <Form.Control
                                                type="text" name="pages" defaultValue={!isCreate ? result.pages : ''} onChange={handleChange} onBlur={handleBlur} />
                                            {touched.pages && errors.pages ? (
                                                <div className="error-message">{errors.pages}</div>
                                            ) : null}
                                        </FloatingLabel>
                                    </Form.Group>
                                </Col>
                                <Col md>
                                    <Form.Group className="mb-3" controlId="formBasicAuthors">
                                        <FloatingLabel
                                            controlId="floatingAuthors"
                                            label="Estantería"
                                            className={touched.location && errors.location ? "error" : null}>
                                            <Form.Control
                                                type="text" name="location" defaultValue={!isCreate ? result.location : ''} onChange={handleChange} onBlur={handleBlur} />
                                            {touched.location && errors.location ? (
                                                <div className="error-message">{errors.location}</div>
                                            ) : null}
                                        </FloatingLabel>
                                    </Form.Group>
                                </Col>
                            </Row>

                            <Row className="g-12">
                                <Form.Group className="mb-3" controlId="formBasicAuthors">
                                    <FloatingLabel
                                        controlId="floatingAuthors"
                                        label="Notas (opcional)"
                                        className={touched.notes && errors.notes ? "error" : null}>
                                        <Form.Control
                                            as="textarea" name="notes" defaultValue={!isCreate ? result.notes : ''} onChange={handleChange} onBlur={handleBlur} />
                                        {touched.notes && errors.notes ? (
                                            <div className="error-message">{errors.notes}</div>
                                        ) : null}
                                    </FloatingLabel>
                                </Form.Group>
                            </Row>

                            <Row className="g-12">
                                <Col md>
                                    <Form.Group className="mb-3" controlId="formBasicAuthors">
                                        <FloatingLabel
                                            controlId="floatingAuthors"
                                            label="Rating"
                                            className={touched.rating && errors.rating ? "error" : null}>
                                            <Form.Control
                                                type="text" name="rating" defaultValue={!isCreate ? result.rating : ''} onChange={handleChange} onBlur={handleBlur} />
                                            {touched.pages && errors.pages ? (
                                                <div className="error-message">{errors.rating}</div>
                                            ) : null}
                                        </FloatingLabel>
                                    </Form.Group>
                                </Col>
                                <Col md className="borrowed-check">
                                    <Form.Group className="mb-3" controlId="formBasicLibrarOnly">
                                        <Form.Check label="Leído" name="read" type="checkbox" defaultChecked={!isCreate ? result.read : false}
                                            defaultValue={!isCreate ? result.read : false} onChange={handleChange} />
                                    </Form.Group>
                                </Col>
                            </Row>
                            <Row>
                                <ReactTags
                                className="tags-system"
                                    tags={reactTags}
                                    delimiters={delimiters}
                                    handleTagClick={handleDelete}
                                    handleAddition={handleAddition}
                                    inputFieldPosition="top"
                                    placeholder="Palabras clave (opcional)"
                                    allowAdditionFromPaste={true}
                                    onClearAll={onClearAll}
                                    onTagUpdate={onTagUpdate}
                                />
                               </Row>
                            <div className="btns-container">
                                <Button variant="success" type="submit">
                                    Submit
                                </Button>
                                <Button variant="danger" type="button" onClick={() => { setAction(1); handleObjectType(1, 1, 'Recursos', 'books'); }}>
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