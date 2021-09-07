import React, { useState, useEffect } from "react";
import { Table, Button } from 'react-bootstrap';
import MainContainer from "../containers/MainContainer";
import CrudForm from './CrudForm';

const TableOverview = ({ item, objectType, handleObjectType, handleActionType, actionType }) => {
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
    function handleCreate(e) {
        setIsCreate(true);
        setAction(3);
        handleActionType(action);
        if (objectType == 1) {
            handleObjectType(objectType, objectType, 'Nuevo libro');
        } else if (objectType == 2) {
            handleObjectType(objectType, objectType, 'Nuevo socio');
        } else {
            handleObjectType(objectType, objectType, 'Nuevo empleado');
        }
    }
    function handleEdit(e) {
        setIsCreate(false);
        setAction(2);
        handleActionType(2);
         setIndex(e.target.id);
        console.log("el target id ", e.target.id);
        if (objectType == 1) {
            handleObjectType(objectType, objectType, 'Editar libro');
        } else if (objectType == 2) {
            handleObjectType(objectType, objectType, 'Editar socio');
        } else {
            handleObjectType(objectType, objectType, 'Editar empleado');
        }
    }
    function handleDelete(e) {
        setIsCreate(false);
        console.log("Delete?");
    }
    function goBack(action, object) {
        setAction(action);
        if(object == 1) {
            handleObjectType(action, object, 'Libros');
        }
        if(object == 2) {
            handleObjectType(action, object, 'Socios');
        }
        if(object == 3) {
            handleObjectType(action, object, 'Empleados');
        }
    }

    if (actionType == 1) {
        if (objectType === 1) {
            content = (
                <>
                    <div className="text-right">
                        <Button variant="info" onClick={handleCreate}>Nuevo </Button>
                    </div>
                    <Table striped bordered hover>
                        <thead>
                            <tr>
                                <th>#</th>
                                <th>Título</th>
                                <th>ISBN</th>
                                <th>Autor</th>
                                <th>Categoría</th>
                                <th>Editorial</th>
                                <th>Acciones</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr key="librito" >
                                <td>1</td>
                                <td>Cien años de soledad</td>
                                <td>123456789</td>
                                <td>Gabriel García Márquez</td>
                                <td>Novela</td>
                                <td>Colombia</td>
                                <td><Button variant="success" onClick={handleEdit}>Editar</Button>
                                    <Button variant="danger" onClick={handleDelete}>Eliminar</Button></td>
                            </tr>

                        </tbody>
                    </Table>
                </>
            );
        } else {
            content = (
                <>
                    <div className="text-right">
                        <Button variant="info" onClick={handleCreate}>Nuevo </Button>
                    </div>
                    <Table striped bordered hover>
                        <thead>
                            <tr>
                                <th>Nombre</th>
                                <th>Apellido</th>
                                <th>E-mail</th>
                                <th>Teléfono</th>
                                <th>Dirección</th>
                                <th>DNI</th>
                                {objectType == 2 ? <th>No. de socio</th> : null}
                                <th>Acciones</th>
                            </tr>
                        </thead>
                        <tbody>
                            {
                                item.map((dat, index) => {

                                    return (<tr key={index}>
                                        <td>{dat.first_name}</td>
                                        <td>{dat.last_name}</td>
                                        <td>{dat.telephone}</td>
                                        <td>{dat.email}</td>
                                        <td>{dat.address}</td>
                                        <td>{dat.dni}</td>
                                        {objectType == 2 ? <td>{dat.membership_id}</td> : null}
                                        <td><Button id={index} variant="success" onClick={handleEdit}>Editar</Button>
                                            <Button id={dat.dni} variant="danger" onClick={handleDelete}>Eliminar</Button></td>

                                    </tr>)
                                })
                            }
                        </tbody>
                    </Table>                                          
                </>
            );
        }
    } else {
        content =
            <>
                <CrudForm data={item} item={item[index]} itemType={objectType} isCreate={isCreate} actionType={action} />
                <div className="text-left">
                    <a href="#" onClick={() => { goBack(1, objectType) }}>Volver</a>
                    </div>   
            </>
    }




    return content;
}
export default TableOverview;