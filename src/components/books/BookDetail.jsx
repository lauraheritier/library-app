import React, { useState, useEffect, Image } from "react";
import { Button, Modal, Card, Form, Col, Row, Table, Spinner, Alert } from 'react-bootstrap';
import service from '../../services/webService';
import BooksCrudForm from './BooksCrudForm';
import { FaFilter, FaChevronLeft, FaEye, FaEyeSlash, FaEllipsisV, FaPen, FaBoxes, FaFileExport, FaBars, FaBookReader } from 'react-icons/fa';
import hooks from '../../hooks/components.hooks';
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

    useEffect(() => {

    }, [isLoading])

    
    function handleEdit(i) {
        setIsCreate(false);
        setAction(2);
        setIndex(i);
        handleObjectType(2, 1, 'Editar recurso', 'books');
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

                        <div className="filters-container container-fluid">
                            <div>
                                <nav className="navbar" >
                                    <a onClick={() => setToggleMenu(!toggleMenu)} type="button" data-toggle="collapse" data-target="#navbarToggleExternalContent" aria-controls="navbarToggleExternalContent" aria-expanded="false" aria-label="Toggle navigation">
                                        <FaEllipsisV />
                                    </a>
                                    <a onMouseOut={() => setToggleMenu(false)} className={toggleMenu ? 'show' : 'collapse'} id="navbarToggleExternalContent" >
                                        <div className="ellipsis-container">
                                            <a href="#" onClick={() => { setToggleMenu(!toggleMenu); handleObjectType(1, 4, 'Categorías', 'categories'); }}><FaBars />Categorías</a>
                                            <a href="#" onClick={() => { setToggleMenu(!toggleMenu); handleObjectType(1, 5, 'Editoriales', 'publishers'); }}><FaBookReader /> Editoriales</a>
                                            <a href="#" onClick={() => { setToggleMenu(!toggleMenu); handleObjectType(1, 6, 'Soportes', 'supports'); }}><FaBoxes /> Soportes</a>
                                           </div>
                                    </a>
                                </nav>
                            </div>
                        </div>
                        <div className="cards-container container" onClick={() => setToggleMenu(false)}>
                                                           
                                        <div className="book-container">
                                            <div className="thumbnail">
                                                <img src={data.thumbnail ? data.thumbnail : noImg} />
                                                <div className="article-code">
                                                {data.location}{data.category.categoryCode}-{data.bookCode}
                                            </div>
                                            </div>
                                            
                                            <div className="article-details">
                                                <p className="article-title">{data.title} {data.read ? <FaEye/> : <FaEyeSlash/>}</p>
                                                 <p className="article-author"><i>{data.author}</i></p>
                                                <p>{data.isbn}</p>
                                                <p>{data.category.description}</p>
                                                <p>{data.support.description}</p>
                                                <p>{data.publisher.description}</p>
                                                <p>rating</p>
                                                <p>{data.notes}</p>
                                                {data.tags.map(tag => <p className="badge bg-light text-dark">{tag.text}</p>)}
                                                <p>{data.location}</p>
                                            </div>
                                        </div>
                                    
                                
                            
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