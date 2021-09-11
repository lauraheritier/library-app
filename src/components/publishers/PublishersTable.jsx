import React, { useState, useEffect } from "react";
import { Table, Button } from 'react-bootstrap';
import PublishersCrudForm from './PublishersCrudForm';
import service from '../../services/webService';


const PublishersTable = ({ item, objectType, handleObjectType, handleActionType, actionType }) => {
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
    const[data, setData] = useState([]);
    const getData = () => {
       service.getAll('publishers')
            .then(response => {
                setData(response.data);
                console.log("los datos: ", response.data);
            })
            .catch(e => {
                console.log("ERROR!!! ", e);
            });
    };

    useEffect(() => {
        getData();
    }, [])
    function handleCreate(e) {
        setIsCreate(true);
        setAction(3);
        handleObjectType(action, 5, 'Nueva editorial', 'publishers');
    }
    function handleEdit(i) {
        console.log("PRIMERO PASA X EL EDIT!");
        setIsCreate(false);
        setAction(2);
        console.log("¿dónde está el index? ", i.target, " el objectType: ", objectType);
        setIndex(i);
        console.log("el id ", i);
        handleObjectType(action, 5, 'Editar editorial', 'publishers');
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
                    <Button variant="info" onClick={handleCreate}>Nueva editorial</Button>
                </div>
                {
                    data.length !== 0 ?
                        <>
                            <Table striped bordered hover>
                                <thead>
                                    <tr>
                                        <th>#</th>
                                        <th>Nombre</th>
                                        <th>Sitio web</th>
                                        <th>Acciones</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {
                                        data.map((dat, idx) => {

                                            return (<tr key={idx}>
                                                <td>{idx}</td>
                                                <td>{dat.description}</td>
                                                <td>{dat.url}</td>
                                                <td><Button id={index} variant="success" onClick={() =>{handleEdit(dat.id)}}>Editar</Button>
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
                <PublishersCrudForm data={data} item={index} itemType={5} isCreate={isCreate} actionType={action} />
                <div className="text-left">
                <a href="#" onClick={() => { goBack(1, 5, 'publishers') }}>Volver</a>
                </div>
            </>
    }




    return content;
}
export default PublishersTable;