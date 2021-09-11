import React, { useState, useEffect } from "react";
import { Table, Button } from 'react-bootstrap';
import service from '../../services/webService';
import CategoriesCrudForm from './CategoriesCrudForm';

const CategoriesTable = ({ item, objectType, handleObjectType, handleActionType, actionType }) => {
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

    const [isCreate, setIsCreate] = useState();
    const [action, setAction] = useState(1);
    const [index, setIndex] = useState(0);
    const [data, setData] = useState([]);
    const getData = (item) => {
        console.log("el data type antes de ir al service", item, " y el action: ", action);
        service.getAll(item)
            .then(response => {
                setData(response.data);
                console.log("los datos: ", response.data);
            })
            .catch(e => {
                console.log("ERROR!!! ", e);
            });
    };

    useEffect(() => {
        if (item != null) {
            getData(item);
        }
    }, [])
    function handleCreate(e) {
        setIsCreate(true);
        setAction(3);
        handleObjectType(action, 4, 'Nueva categoría', 'categories');
console.log("el is create: ", isCreate, " action ", action);
    }
    function handleEdit(i) {
        setIsCreate(false);
        setAction(2);
        console.log("¿dónde está el index? ", i, " el objectType: ", objectType);
        setIndex(i);
        handleObjectType(action, 4, 'Editar categoría', 'categories');
        handleActionType(action);
    }
    function handleDelete(e) {
        setIsCreate(false);
        console.log("Delete?");
    }

    function goBack(action, object, apiName) {
        setAction(action);
        handleObjectType(action, object, 'Libros', apiName);
    }

    if (actionType == 1) {
        content = (
            <>
                <div className="text-right">
                    <Button variant="info" onClick={handleCreate}>Nuevo</Button>
                </div>
                {
                    data.length !== 0 ?
                        <>
                            <Table striped bordered hover>
                                <thead>
                                    <tr>
                                        <th>#</th>
                                        <th>Descripción</th>
                                        <th>Acciones</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {
                                        data.map((dat, index) => {

                                            return (<tr key={index}>
                                                <td>{index}</td>
                                                <td>{dat.description}</td>
                                                <td><Button id={index} variant="success" onClick={() => { handleEdit(dat.id) }}>Editar</Button>
                                                    <Button id={dat.id} variant="danger" onClick={handleDelete}>Eliminar</Button></td>

                                            </tr>)
                                        })
                                    }
                                </tbody>
                            </Table>
                            <div className="text-left">
                                <a href="#" onClick={() => { goBack(1, 1, 'books') }}>Volver</a>
                            </div>
                        </>
                        : ''
                }

            </>)
    } else {
        content =
            <>
                <CategoriesCrudForm data={data} item={index} itemType={4} isCreate={isCreate} actionType={action} />
                <div className="text-left">
                    <a href="#" onClick={() => { goBack(1, 4, 'categories') }}>Volver</a>
                </div>
            </>
    }




    return content;
}
export default CategoriesTable;