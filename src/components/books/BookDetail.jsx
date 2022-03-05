import React, { useEffect, useState } from "react";
import { Alert, Button, Modal, Nav, Spinner } from 'react-bootstrap';
import { FaChevronLeft, FaEllipsisV, FaEye, FaEyeSlash, FaPen, FaQuoteLeft, FaTimes } from 'react-icons/fa';
import { Rating } from 'react-simple-star-rating';
import uuid from 'react-uuid';
import hooks from '../../hooks/components.hooks';
import service from '../../services/webService';
import externalApiService from '../../services/webServiceExternalAPI';
import BooksCrudForm from './BooksCrudForm';
import noImg from "./no-img.png";

    

const BookDetail = ({ item, objectType, handleObjectType, actionType, data }) => {
    /**objectTypes:
     * 1: Books
     * 2: Members
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
    const [isLoading, resources, unfilteredData, setResources] = (hooks.useGetHelperObjects('books'));
    const tableId = document.getElementById('data-table');
    const [toggleMenu, setToggleMenu] = useState(false);
    const [sectionWithFocus, setSectionWithFocus] = useState('notes');
    
    useEffect(() => {

    }, [isLoading])

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
    function handleShow(param) {
        setShow(true);
        setObjectToRemove(param);
    }
    function handleQuote() {
    externalApiService.getQuote('books', data.bookCode, 'biology');
        
    }

    function refreshView() {
        service.getAll('books')
            .then(response => {
                setResources(response.data);
            })
    }




    if (isLoading) {
        content = (
            <div className="loading-content">
                <Spinner animation="grow" variant="warning" />
                <span>Un momento...</span>
            </div>
        )
    }


    if (!isLoading) {
        content = (
            <>
                {
                    <>

                        <div className="filters-container container-fluid filters-detail">
                            <div>
                                <nav className="navbar" >
                                    <a onClick={() => setToggleMenu(!toggleMenu)} type="button" data-toggle="collapse" data-target="#navbarToggleExternalContent" aria-controls="navbarToggleExternalContent" aria-expanded="false" aria-label="Toggle navigation">
                                        <FaEllipsisV />
                                    </a>
                                    <a className={toggleMenu ? 'show' : 'collapse'} id="navbarToggleExternalContent" >
                                        <div className="ellipsis-container">
                                            <a href="#" className="close-panel" onClick={() => setToggleMenu(!toggleMenu)}>Cerrar <FaTimes /></a>
                                            <a href="#" onClick={() => { setToggleMenu(!toggleMenu); handleQuote() }}><FaQuoteLeft /> Generar cita bibliográfica</a>
                                            <a href="#" onClick={() => { setToggleMenu(!toggleMenu); handleObjectType(2, 1, 'Libros', 'books'); }}><FaPen /> Editar recurso</a>
                                            <a href="#" onClick={() => { setToggleMenu(!toggleMenu); handleShow(data.id) }}><FaTimes /> Eliminar recurso</a>
                                        </div>
                                    </a>
                                </nav>
                            </div>
                        </div>
                        <div className="cards-container container" onClick={() => setToggleMenu(false)}>
                            <div className="book-container">
                                <div className="thumbnail">
                                    <img src={data.thumbnail !== "" ? data.thumbnail : noImg} />
                                    <div>
                                        <Rating size={15} ratingValue={data.rating} initialValue={data.rating} allowHalfIcon readonly={true} />
                                    </div>
                                </div>
                                <div className="article-details">
                                    <div className="article-code-container"> <p className="article-title">{data.title} </p> <div className="article-code">
                                        {data.location}{data.category.categoryCode}-{data.bookCode}
                                    </div></div>
                                    <div className="rating-container"><p className="article-author"><i>{data.author}</i> {data.read ? <FaEye /> : <FaEyeSlash />}</p>

                                    </div>
                                    <p className="article-isbn">{data.isbn}</p>
                                    {data.tags.map(tag => <p className="badge bg-light text-dark">{tag.text}</p>)}

                                </div>
                            </div>
                            <div className="header-pills nav-pills-container detail-pills">
                                <Nav className="nav" activeKey={sectionWithFocus} onSelect={(e) => { setSectionWithFocus(e) }}>
                                    <Nav.Item>
                                        <Nav.Link eventKey="notes">
                                            Notas
                                        </Nav.Link>
                                    </Nav.Item>
                                    <Nav.Item>
                                        <Nav.Link eventKey="details">
                                            Detalles
                                        </Nav.Link>
                                    </Nav.Item>
                                </Nav>
                            </div>

                            <div className="article-details-container">
                                <div className={`article-details-notes ${sectionWithFocus === 'notes' ? 'active-section' : 'disabled-section'}`} >
                                    <p>{data.notes}</p>
                                </div>
                                <div className={`article-details-details ${sectionWithFocus === 'details' ? 'active-section' : 'disabled-section'}`}>
                                    <div><p><small>ISBN</small></p><p><span>{data.isbn ? data.isbn : 'N/A'}</span></p></div>
                                    <div><p><small>Editorial</small></p><p><span>{data.publisher.description}</span></p></div>
                                    <div><p><small>Soporte</small></p><p><span>{data.support.description}</span></p></div>
                                    <div><p><small>Categoría</small></p><p><span>{data.category.description} ({data.category.categoryCode})</span></p></div>
                                    <div><p><small>Repisa</small></p><p><span>{data.location}</span></p></div>
                                    <div><p><small>Ejemplares totales</small></p><p><span>{data.sample}</span></p></div>
                                    <div><p><small>Ejemplares disponibles</small></p><p><span>{data.availableSamples}</span></p></div>
                                </div>
                            </div>


                        </div>
                        <Modal key={uuid()} show={show} onHide={handleClose} onExited={refreshView}>
                            <Modal.Header closeButton>
                                <Modal.Title>Eliminar recurso</Modal.Title>
                            </Modal.Header>
                            <Modal.Body>¿Realmente desea eliminar el recurso?</Modal.Body>
                            <Modal.Footer>
                                <Button variant="secondary" onClick={handleClose} key={uuid()}>
                                    No
                                </Button>
                                <Button variant="warning" onClick={handleDelete} key={uuid()}>
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
    } else {
        content =
            <>
                <BooksCrudForm data={data} item={index} itemType={objectType} isCreate={isCreate} actionType={action} handleObjectType={handleObjectType} />
                <div className="text-left">
                    <a href="#" onClick={() => { setAction(1); handleObjectType(1, objectType, 'Recursos', 'books'); refreshView() }}><FaChevronLeft /> Volver</a>
                </div>
            </>
    }
    return content;
}
export default BookDetail;