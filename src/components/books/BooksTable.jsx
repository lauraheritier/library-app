import React, { useState, useEffect } from "react";
import { Table, Button } from 'react-bootstrap';
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
    const [action, setAction] = useState(1);
    const [index, setIndex] = useState(0);
    const [data, setData] = useState([]);
    const getData = (item) => {
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
        getData(item);
    }, [])

    function handleCreate(param) {
        setIsCreate(true);
        setAction(3);
        handleActionType(action);
        console.log("el param ", param);
        handleObjectType(action, 1, 'Nuevo libro', 'books');

    }
    function handleEdit(i) {
        setIsCreate(false);
        setAction(2);
        console.log("¿dónde está el index? ", i.target, " el objectType: ", objectType);
        setIndex(i);
        console.log("el id ", i);
        handleObjectType(action, 1, 'Editar libro', 'books');
        handleActionType(2);
    }
    function handleDelete(e) {
        setIsCreate(false);
        console.log("Delete?");
    }
    function goTo(param) {
        if (param == 4) {
            handleObjectType(action, 4, 'Categorías', 'categories');
        } else {
            handleObjectType(action, 5, 'Editoriales', 'publishers');
        }
    }
    function goBack(action, object) {
        setAction(action);
        handleObjectType(action, object, 'Libros', 'books');
    }

    if (actionType == 1) {
        content = (
            <>
                <div className="text-right">
                    <a href="#" onClick={() => { goTo(4) }}>Categorías</a>
                    <a href="#" onClick={() => { goTo(5) }}>Editoriales</a>
                    <Button variant="info" onClick={handleCreate}>Nuevo libro</Button>
                </div>
                {console.log("el item ", item)}
                {

                    data.length !== 0 ?
                        <Table striped bordered hover>
                            <thead>
                                <tr>
                                    <th>#</th>
                                    <th>Título</th>
                                    <th>ISBN</th>
                                    <th>Autor</th>
                                    <th>Categoría</th>
                                    <th>Editorial</th>
                                    <th>Disponible</th>
                                    <th>Acciones</th>
                                </tr>
                            </thead>
                            <tbody>
                                {
                                    data.map((dat, index) => {
                                        let book_id = dat.id.slice(0, 6);
                                        let disponible = (!dat.borrowed ? 'Sí' : 'No');
                                        let cats = [dat.category];
                                        let pubs = [dat.publisher];
                                        return (<tr key={dat.id}>
                                            <td>{book_id}</td>
                                            <td>{dat.title}</td>
                                            <td>{dat.isbn}</td>
                                            <td>{dat.author}</td>
                                            {cats.map(cat => <td>{cat.description}</td>)}
                                            {pubs.map(pub => <td>{pub.description}</td>)}
                                            <td>{disponible}</td>
                                            <td><Button id={index} variant="success" onClick={() => { handleEdit(dat.id) }}>Editar</Button>
                                                <Button id={dat.dni} variant="danger" onClick={handleDelete}>Eliminar</Button></td>

                                        </tr>)
                                    })
                                }

                            </tbody>
                        </Table>
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