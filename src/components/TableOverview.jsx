import React, { useState, useEffect } from "react";
import { Table, Button } from 'react-bootstrap';
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
    function handleCreate(param) {
        setIsCreate(true);
        setAction(3);
        handleActionType(action);
        console.log("el param ", param);
        switch (param) {
            case 1: handleObjectType(1, 1, 'Nuevo libro');
                break;
            case 2: handleObjectType(2, 2, 'Nuevo socio');
                break;
            case 3: handleObjectType(3, 3, 'Nuevo empleado');
                break;
            case 4: handleObjectType(4, 4, 'Nueva categoría');
                break;
            case 5: handleObjectType(5, 5, 'Nueva editorial');
            default: console.log("NADA");
        }
    }
    function handleEdit(i) {
        setIsCreate(false);
        setAction(2);        
        console.log("¿dónde está el index? ", i.target, " el objectType: ", objectType);
       setIndex(i);
        console.log("el id ", i);
        switch (objectType) {
            case 1: handleObjectType(1, 1, 'Editar libro');
                break;
            case 2: handleObjectType(2, 2, 'Editar socio');
                break;
            case 3: handleObjectType(3, 3, 'Editar empleado');
                break;
            case 4: handleObjectType(4, 4, 'Editar categoría');
                break;
            case 5: handleObjectType(5, 5, 'Editar editorial');
            default: console.log("NADA");
        }
        handleActionType(2);
    }
    function handleDelete(e) {
        setIsCreate(false);
        console.log("Delete?");
    }
    function goTo(param) {
        if (param == 4) {
            handleObjectType(action, 4, 'Categorías');
        } else {
            handleObjectType(action, 5, 'Editoriales');
        }
    }
    function goBack(action, object) {
        setAction(action);
        if (object == 1) {
            handleObjectType(action, object, 'Libros');
        }
        if (object == 2) {
            handleObjectType(action, object, 'Socios');
        }
        if (object == 3) {
            handleObjectType(action, object, 'Empleados');
        }
        if (object == 4 || object == 5) {
            handleObjectType(action, 1, 'Libros');
        }
    }

    if (actionType == 1) {
        if (objectType === 1) {
            content = (
                <>
                    <div className="text-right">
                        <a href="#" onClick={() => { goTo(4) }}>Categorías</a>
                        <a href="#" onClick={() => { goTo(5) }}>Editoriales</a>
                        <Button variant="info" onClick={() => { handleCreate(1) }}>Nuevo libro</Button>
                    </div>
                    {console.log("el item ", item)}
                    {

                        item.length !== 0 ?
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
                                        item.map((dat, index) => {

                                            return (<tr key={index}>
                                                <td>{index}</td>
                                                <td>{dat.title}</td>
                                                <td>{dat.isbn}</td>
                                                <td>{dat.author}</td>
                                                <td>{dat.category}</td>
                                                <td>{dat.publisher}</td>
                                                <td>{dat.borrowed}</td>
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
        } else if (objectType == 2) {
            content = (
                <>
                    <div className="text-right">
                        <Button variant="info" onClick={() => { handleCreate(objectType) }}>Nuevo</Button>
                    </div>
                    {console.log("el item ", item)}
                    {
                        item.length !== 0 ?
                            <Table striped bordered hover>
                                <thead>
                                    <tr>
                                        <th>Nombre</th>
                                        <th>Apellido</th>
                                        <th>E-mail</th>
                                        <th>Teléfono</th>
                                        <th>Dirección</th>
                                        <th>DNI</th>
                                        <th>No. de socio</th>
                                        <th>Acciones</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {
                                        item.map((dat, index) => {

                                            return (<tr key={index}>
                                                <td>{dat.first_name}</td>
                                                <td>{dat.last_name}</td>
                                                <td>{dat.email}</td>
                                                <td>{dat.telephone}</td>
                                                <td>{dat.address}</td>
                                                <td>{dat.dni}</td>
                                                <td>{dat.membership_id}</td>
                                                <td><Button id={index} variant="success" onClick={handleEdit}>Editar</Button>
                                                    <Button id={dat.dni} variant="danger" onClick={handleDelete}>Eliminar</Button></td>

                                            </tr>)
                                        })
                                    }
                                </tbody>
                            </Table>
                            : ''}
                </>
            );
        } else if (objectType == 3) {
            content = (
                <>
                    <div className="text-right">
                        <Button variant="info" onClick={() => { handleCreate(objectType) }}>Nuevo</Button>
                    </div>
                    {console.log("el item ", item)}
                    {
                        item.length !== 0 ?
                            <Table striped bordered hover>
                                <thead>
                                    <tr>
                                        <th>Nombre</th>
                                        <th>Apellido</th>
                                        <th>E-mail</th>
                                        <th>Teléfono</th>
                                        <th>Dirección</th>
                                        <th>DNI</th>
                                        <th>Acciones</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {
                                        item.map((dat, index) => {

                                            return (<tr key={index}>
                                                <td>{dat.first_name}</td>
                                                <td>{dat.last_name}</td>
                                                <td>{dat.email}</td>
                                                <td>{dat.telephone}</td>
                                                <td>{dat.address}</td>
                                                <td>{dat.dni}</td>
                                                 <td><Button id={index} variant="success" onClick={handleEdit}>Editar</Button>
                                                    <Button id={dat.dni} variant="danger" onClick={handleDelete}>Eliminar</Button></td>

                                            </tr>)
                                        })
                                    }
                                </tbody>
                            </Table>
                            : ''}
                </>
            );
        } else if (objectType == 4) {
            content = (
                <>
                    <div className="text-right">
                        <Button variant="info" onClick={() => { handleCreate(objectType) }}>Nuevo</Button>
                    </div>
                    {console.log("el item ", item)}
                    {
                        item.length !== 0 ?
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
                                        item.map((dat, index) => {

                                            return (<tr key={index}>
                                                <td>{index}</td>
                                                <td>{dat.description}</td>
                                                <td><Button id={index} variant="success" onClick={handleEdit}>Editar</Button>
                                                    <Button id={dat.dni} variant="danger" onClick={handleDelete}>Eliminar</Button></td>

                                            </tr>)
                                        })
                                    }
                                </tbody>
                            </Table>
                            <div className="text-left">
                            <a href="#" onClick={() => { goBack(1, 1) }}>Volver</a>
                        </div>
                        </>
                            : ''
                    }
                    
                </>)
        } else if (objectType == 5) {
            content = (
                <>
                    <div className="text-right">
                        <Button variant="info" onClick={() => { handleCreate(objectType) }}>Nuevo</Button>
                    </div>
                    {console.log("el item ", item)}
                    {
                        item.length !== 0 ?
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
                            item.map((dat, index) => {

                                return (<tr key={index}>
                                    <td>{index}</td>
                                    <td>{dat.description}</td>
                                    <td>{dat.url}</td>
                                    <td><Button id={index} variant="success" onClick={handleEdit}>Editar</Button>
                                        <Button id={dat.dni} variant="danger" onClick={handleDelete}>Eliminar</Button></td>

                                </tr>)
                            })
                        }
                    </tbody>
                </Table>
                <div className="text-left">
                <a href="#" onClick={() => { goBack(1, 1) }}>Volver</a>
            </div>
            </>
                            : ''
                    }

                </>)
        } 
    } else {
        content =
            <>
                <CrudForm data={item} item={index} itemType={objectType} isCreate={isCreate} actionType={action} />
                <div className="text-left">
                    <a href="#" onClick={() => { goBack(1, objectType) }}>Volver</a>
                </div>
            </>
    }




    return content;
}
export default TableOverview;