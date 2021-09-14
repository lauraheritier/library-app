import React, { useState, useEffect, useCallback } from "react";
import { Button, Modal, Card, CardGroup } from 'react-bootstrap';
import service from '../../services/webService';
import BooksCrudForm from './BooksCrudForm';


const BooksTable = ({ item, objectType, handleObjectType, handleActionType, actionType }) => {
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
     */
    let content;
    const [isCreate, setIsCreate] = useState(false);
    const [action, setAction] = useState(isCreate ? 3 : 1);
    const [index, setIndex] = useState(0);
    const [data, setData] = useState([]);
    const handleClose = () => setShow(false);
    const [show, setShow] = useState(false);
    const [remove, setRemove] = useState('');
    const [objectToRemove, setObjectToRemove] = useState([]);

    const getData = () => {
        console.log("el data type antes de ir al service", item);
        service.getAll(item)
            .then(response => {
                setData(response.data);

            })
            .catch(e => {
                console.log("ERROR!!! ", e);
            });
    };

    useEffect(() => {
        getData();

    }, [])

    function handleCreate(param) {
        setIsCreate(true);
        setAction(3);
        // handleActionType(action);
        console.log("pasando los parámetros al handleObjectType desde el handleCreate", action);
        handleObjectType(3, 1, 'Nuevo recurso', 'books');
    }
    function handleEdit(i) {
        setIsCreate(false);
        setAction(2);
        console.log("¿dónde está el index? ", i.target, " el objectType: ", objectType);
        setIndex(i);
        console.log("el id ", i);
        handleObjectType(2, 1, 'Editar recurso', 'books');
    }
    function handleShow(param) {
        setShow(true);
        console.log("el id a borrar", param);
        setObjectToRemove(param);

    }
    function handleDelete(e) {
        setIsCreate(false);
        setRemove(true);
        console.log("Delete?", remove, " el id", objectToRemove);
        service.remove('books', objectToRemove);
        setShow(false);
    }
    function goTo(param) {
        if (param == 4) {
            handleObjectType(1, 4, 'Categorías', 'categories');
        } else if (param === 5) {
            handleObjectType(1, 5, 'Editoriales', 'publishers');
        } else {
            handleObjectType(1, 6, 'Soportes', 'supports');
        }
    }
    function goBack(action, object) {
        setAction(action);
        handleObjectType(action, object, 'Recursos', 'books');
        refreshView();
    }
    const refreshView = useCallback(() => {
        getData();
    }, []);

    if (actionType == 1) {
        content = (
            <>
                <div className="text-right">
                    <a href="#" onClick={() => { goTo(4) }}>Categorías</a>
                    <a href="#" onClick={() => { goTo(5) }}>Editoriales</a>
                    <a href="#" onClick={() => { goTo(6) }}>Soportes</a>
                    <Button variant="info" onClick={handleCreate}>Nuevo recurso</Button>
                </div>
                {

                    data.length !== 0 ?
                        <>
                            <div className="cards-container">
                                {
                                    data.map((dat, index) => {
                                        let book_id = dat.id.slice(0, 6);
                                        let cats = [dat.category];
                                        let pubs = [dat.publisher];
                                        let sups = [dat.support];
                                        let supportDescription;
                                        sups.map((sup, index) => {
                                            return supportDescription = sup.description;
                                        });

                                        return (

                                            <Card key={dat.id}>
                                                <Card.Header as="h5"><span key={dat.id+index}>{book_id} - {dat.title}</span>
                                                    <span>
                                                        <Button variant="success" key={dat.id+index+2} onClick={() => { handleEdit(dat.id) }}>Editar</Button>
                                                        <Button variant="danger" key={dat.id+index+3} onClick={() => { handleShow(dat.id) }}>Eliminar</Button>
                                                    </span>
                                                </Card.Header>
                                                <Card.Body>
                                                    <div className="card-text">
                                                    <Card.Title key={dat.id+index+4}>{supportDescription} </Card.Title>
                                                    {dat.libraryOnly ? <span className="only-library" key={dat.id+index+5}>Solo consulta en biblioteca</span> : ''}
                                                   </div>
                                                    <Card.Text>
                                                        <span className="col-title">Autor:</span> <span className="col-desc" key={dat.id+index+6}>{dat.author}</span>
                                                    </Card.Text>
                                                    <Card.Text>
                                                        {cats.map(cat => <><span className="col-title" >Categoría:</span> <span className="col-desc" key={dat.id+index+7}>{cat.description}</span></>)}
                                                    </Card.Text>
                                                    <Card.Text>
                                                        {pubs.map(pub => <><span className="col-title" >Editorial:</span> <span className="col-desc" key={dat.id+index+8}>{pub.description}</span></>)}
                                                    </Card.Text>
                                                    <Card.Text>
                                                        <span><span className="col-title">Ejemplares totales:</span> <span className="col-desc" key={dat.id+index+9}>{dat.sample}</span></span>
                                                        <span> <span className="col-title">Ejemplares prestados:</span> <span className="col-desc" key={dat.id+index+10}>{dat.sample}</span></span>
                                                    </Card.Text>

                                                    
                                                    {supportDescription === 'Libro' ?
                                                        <Card.Text>
                                                            <span className="col-title">ISBN:</span><span className="col-desc" key={dat.id + book_id+index+11}>{dat.isbn}</span>
                                                        </Card.Text>
                                                        : ''}

                                                </Card.Body>
                                            </Card>)
                                    })
                                }
                            </div>
                            <Modal key={index+13} show={show} onHide={handleClose} onExited={refreshView}>
                                <Modal.Header closeButton>
                                    <Modal.Title>Eliminar libro</Modal.Title>
                                </Modal.Header>
                                <Modal.Body>¿Realmente desea eliminar el libro?</Modal.Body>
                                <Modal.Footer>
                                    <Button variant="secondary" onClick={handleClose} key={index+14}>
                                        No
                                    </Button>
                                    <Button variant="primary" onClick={handleDelete} key={index+15}>
                                        Sí
                                    </Button>
                                </Modal.Footer>
                            </Modal>
                        </>
                        : ''
                }</>
        );
    } else {
        content =
            <>
                <BooksCrudForm data={data} item={index} itemType={objectType} isCreate={isCreate} actionType={action} handleObjectType={handleObjectType} />
                <div className="text-left">
                    <a href="#" onClick={() => { goBack(1, objectType) }}>Volver</a>
                </div>
            </>
    }




    return content;
}
export default BooksTable;