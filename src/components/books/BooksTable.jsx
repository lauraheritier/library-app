import React, { useState, useEffect, Image } from "react";
import { Button, Modal, Card, Form, Col, Row, Table, Spinner, Alert } from 'react-bootstrap';
import service from '../../services/webService';
import BooksCrudForm from './BooksCrudForm';
import { FaFilter, FaChevronLeft, FaEye, FaEyeSlash, FaEllipsisV, FaPen, FaBoxes, FaFileExport, FaBars, FaBookReader, FaTimes } from 'react-icons/fa';
import hooks from '../../hooks/components.hooks';
import BookDetail from "./BookDetail";
import noImg from "./no-img.png";
import { Page, Text, View, Document, StyleSheet, usePDF, PDFDownloadLink } from '@react-pdf/renderer';

const BooksTable = ({ item, objectType, handleObjectType, actionType }) => {
    /**objectTypes:
     * 1: Books
     * 2: Members
     * 3: Employees
     */
    /**
     * isCreate:
     * true: create
     * false: edit
     */
    /**
     * action types:
     * 1: view
     * 2: edit
     * 3: create
     * 4: back
     * 5: view single
     */
    let content;
    const [isCreate, setIsCreate] = useState(false);
    const [action, setAction] = useState(isCreate ? 3 : 1);
    const [index, setIndex] = useState(0);
    const handleClose = () => setShow(false);
    const [show, setShow] = useState(false);
    const [objectToRemove, setObjectToRemove] = useState([]);
    const [filterObject, setFilterObject] = useState('');
    const [showAlert, setShowAlert] = useState(false);
    const [alertText, setAlertText] = useState('');
    const [alertVariant, setAlertVariant] = useState('');
    const [isLoading, resources, unfilteredData, setResources] = (hooks.useGetHelperObjects('books', false));
    const tableId = document.getElementById('data-table');
    const [toggleMenu, setToggleMenu] = useState(false);
    const [singleBook, setSingleBook] = useState({});
    // Create styles
    const styles = StyleSheet.create({
        page: {
            display: 'flex',
            flexDirection: 'row',
            flexWrap: 'wrap',
            margin: 10,
            justifyContent: 'flex-start',
            
            '@media max-width: 400': {
                width: 300,
            },
            '@media orientation: landscape': {
                width: 400,
            },

        },
        section: {
            margin: 0,
            padding: 4,
            fontSize: 8,
            border: '1px dashed #323232',
            textTransform: 'uppercase',
            textAlign: 'center',
            width: '16%',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center;'
        }
    });

    // Create Document Component


    const MyDoc = (
        <Document>
            <Page size="A4" style={styles.page}>

                {
                    resources.map((r, idx) => {

                        return (<View style={styles.section}><Text>{r.location + '' + r.category.categoryCode + '-' + r.bookCode}</Text></View>)


                    })
                }

            </Page>
        </Document>
    )




    useEffect(() => {

    }, [isLoading])

    function handleCreate(e) {
        setIsCreate(true);
        setAction(3);
        handleObjectType(3, 1, 'Nuevo recurso', 'books');
    }
    function handleEdit(i) {
        setIsCreate(false);
        setAction(2);
        setIndex(i);
        handleObjectType(2, 1, 'Editar recurso', 'books');
    }
    function handleView(i, object) {
        setIsCreate(false);
        setAction(5);
        setIndex(i);
        setSingleBook(object);
        handleObjectType(5, 1, 'Ver recurso', 'books');
    }
    const handleDelete = async () => {
        let result;
        setShow(false);
        setIsCreate(false);
        result = await service.updateAvailableResources('books', objectToRemove, false, false);
        if (result) {
            setAlertVariant('success');
            setAlertText("El recurso fue eliminado correctamente.");
        } else {
            setAlertVariant('danger');
            setAlertText("No se pudo eliminar el recurso.");
        }
        setShowAlert(true);
        setTimeout(() => {
            setShowAlert(false);
        }, 5000);
        refreshView();
    }

    function filterOnChange(event) {
        let results;
        setFilterObject(event.target.value);
        results = hooks.useFilterOnChange(filterObject, 'books', resources);
        if (event.target.value != '' && results.length !== 0) {
            console.log("los resultados", results);
            setResources(results);
        } else {
            setResources(unfilteredData);
        }
    }

    function refreshView() {
        service.getAll('books')
            .then(response => {
                setResources(response.data);
            })
    }
    function viewBook(item) {
        handleObjectType(3, 1, "libro");
    }
    const [instance, updateInstance] = usePDF({ document: MyDoc });

    let table = (
        <Table id="data-table">
            <thead>
                <tr>
                    <th>#</th>
                    <th>Título</th>
                    <th>Autor</th>
                    <th>Categoría</th>
                    <th>Editorial</th>
                    <th>Soporte</th>
                    <th>ISBN</th>
                    <th>Ubicación</th>
                    <th >Cantidad de páginas</th>
                    <th>Notas</th>
                    <th>Palabras clave</th>

                </tr>
            </thead>
            <tbody>
                {
                    resources.map((d, idx) => {
                        let cats = [d.category];
                        let sups = [d.support];
                        let pubs = [d.publisher];
                        let catCode = '';
                        cats.map(cat => { return catCode = cat.categoryCode });
                        return (
                            <tr key={d.id}>
                                <td>{d.location}{catCode}-{d.bookCode}</td>
                                <td>{d.title}</td>
                                <td>{d.author}</td>
                                {cats.map(cat => <td>{cat.description}</td>)}
                                {pubs.map(pub => <td>{pub.description}</td>)}
                                {sups.map(sup => <td>{sup.description}</td>)}
                                <td>{d.isbn ? d.isbn : 'N/A'}</td>
                                <td>{d.location}</td>
                                <td>{d.pages}</td>
                                <td>{d.notes}</td>
                                <td>{

                                    d.tags.map(tag => {
                                        let lastItem = d.tags[d.tags.length - 1];
                                        if (tag === lastItem) {
                                            return tag.text;
                                        } else {
                                            return tag.text + ', ';
                                        }
                                    })

                                }</td>

                            </tr>
                        )
                    })
                }
            </tbody>
        </Table>
    )

    if (isLoading) {
        content = (
            <div className="loading-content">
                <Spinner animation="grow" variant="warning" />
                <span>Un momento...</span>
            </div>
        )
    }

    if (actionType == 1 && !isLoading) {
        console.log(actionType);
        content = (
            <>

                {
                    <>

                        <div className="filters-container container-fluid">
                            <div className="flex-filter-container">
                                <FaFilter />
                                <Form.Control size="sm" type="text" name="filter" placeholder="Filtrar por autor, título, ISBN, palabra clave..." onChange={filterOnChange} />
                            </div>
                            <div>
                                <nav className="navbar" >
                                    <a onClick={() => setToggleMenu(!toggleMenu)} type="button" data-toggle="collapse" data-target="#navbarToggleExternalContent" aria-controls="navbarToggleExternalContent" aria-expanded="false" aria-label="Toggle navigation">
                                        <FaEllipsisV />
                                    </a>
                                    <a className={toggleMenu ? 'show' : 'collapse'} id="navbarToggleExternalContent" >
                                        <div className="ellipsis-container">
                                            <a href="#" className="close-panel" onClick={() => setToggleMenu(!toggleMenu)}>Cerrar <FaTimes /></a>
                                            <a href="#" onClick={() => { setToggleMenu(!toggleMenu); handleObjectType(1, 4, 'Categorías', 'categories'); }}><FaBars />Categorías</a>
                                            <a href="#" onClick={() => { setToggleMenu(!toggleMenu); handleObjectType(1, 5, 'Editoriales', 'publishers'); }}><FaBookReader /> Editoriales</a>
                                            <a href="#" onClick={() => { setToggleMenu(!toggleMenu); handleObjectType(1, 6, 'Soportes', 'supports'); }}><FaBoxes /> Soportes</a>
                                            <Button variant="link" onClick={(e) => { setToggleMenu(!toggleMenu); handleCreate(e) }}><FaPen /> Nuevo recurso</Button>
                                            <Button disabled={resources.length === 0} variant="link" onClick={() => { setToggleMenu(!toggleMenu); hooks.handleReport(tableId, false) }}><FaFileExport /> Generar inventario</Button>
                                            <PDFDownloadLink document={MyDoc} fileName="somename.pdf">{({ blob, url, loading, error }) =>
                                                loading ? 'Cargando códigos de recursos...' : 'Imprimir etiquetas'
                                            }</PDFDownloadLink>
                                        </div>
                                    </a>
                                </nav>
                            </div>
                        </div>
                        <div className="cards-container container" onClick={() => setToggleMenu(false)}>
                            {
                                resources.map((dat, index) => {
                                    let cats = [dat.category];
                                    let pubs = [dat.publisher];
                                    let sups = [dat.support];
                                    let supportDescription;
                                    console.log("los datos de un libro", dat);

                                    sups.map((sup, index) => {
                                        return supportDescription = sup.description;
                                    });
                                    return (
                                        <div className="book-container" onClick={() => { handleView(dat.id, dat) }}>
                                            <div className="thumbnail">
                                                <img src={dat.thumbnail ? dat.thumbnail : noImg} />
                                                <div className="article-code">
                                                    {dat.location}{dat.category.categoryCode}-{dat.bookCode}
                                                </div>
                                            </div>

                                            <div className="article-details">
                                                <p className="article-title">{dat.title} {dat.read ? <FaEye /> : <FaEyeSlash />}</p>
                                                <div className="rating-container"><p className="article-author"><i>{dat.author}</i></p><p>rating</p></div>
                                                <p>{dat.isbn}</p>
                                                {dat.tags.map(tag => <p className="badge bg-light text-dark">{tag.text}</p>)}

                                            </div>
                                        </div>
                                    )
                                })
                            }
                        </div>
                        <Modal key={index + 13} show={show} onHide={handleClose} onExited={refreshView}>
                            <Modal.Header closeButton>
                                <Modal.Title>Eliminar recurso</Modal.Title>
                            </Modal.Header>
                            <Modal.Body>¿Realmente desea eliminar el recurso?</Modal.Body>
                            <Modal.Footer>
                                <Button variant="secondary" onClick={handleClose} key={index + 14}>
                                    No
                                </Button>
                                <Button variant="primary" onClick={handleDelete} key={index + 15}>
                                    Sí
                                </Button>
                            </Modal.Footer>
                        </Modal>
                        <Alert variant={alertVariant} show={showAlert} onClose={() => setShowAlert(false)} dismissible>
                            <p>
                                {alertText}
                            </p>
                        </Alert>
                    </>
                }</>
        );
    } else if (actionType == 5) {
        console.log("Pasa x el action type correcto ", actionType, " el index es ", index, " el data es ", singleBook);
        content = <BookDetail item={index} data={singleBook} />
    } else {
        console.log(actionType);
        content =
            <>
                <BooksCrudForm data={resources} item={index} itemType={objectType} isCreate={isCreate} actionType={action} handleObjectType={handleObjectType} />
                <div className="text-left">
                    <a href="#" onClick={() => { setAction(1); handleObjectType(1, objectType, 'Recursos', 'books'); refreshView() }}><FaChevronLeft /> Volver</a>
                </div>
            </>
    }






    return [content, table];
}
export default BooksTable;