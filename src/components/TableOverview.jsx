import React, { useState, useEffect } from "react";
import { Table, Button } from 'react-bootstrap';
import MainContainer from "../containers/MainContainer";
import CrudForm from './CrudForm';

const TableOverview = ({ item, objectType, mainTitle }) => {
    /**objectTypes:
     * 1: Books
     * 2: Members
     * 3: Employees
     */
    /**
     * actions:
     * true: edit
     * false: create
     */
    /**
     * action types:
     * 1: view
     * 2: edit
     * 3: create
     * 4: back
     */
    /**
     * form titles:
     * "Socio"
     * "Empleado"
     * "Libro"
     */
    let content;

    const [action, setAction] = useState(false);
    const [actionType, setActionType] = useState(1);
    const [formTitle, setFormTitle] = useState("");
    const [index, setIndex] = useState(0);
    function handleCreate(e) {
        setAction(true);
        setActionType(3);
        if (objectType == 1) {
            setFormTitle("Nuevo libro")
        } else if (objectType == 2) {
            setFormTitle("Nuevo socio");
        } else {
            setFormTitle("Nuevo empleado");
        }

    }
    function handleEdit(e) {
        setAction(false);
        setActionType(2);
        setIndex(e.target.id);
        console.log("el target id ", e.target.id);
        if (objectType == 1) {
            setFormTitle("Editar libro")
        } else if (objectType == 2) {
            setFormTitle("Editar socio");
        } else {
            setFormTitle("Editar empleado");
        }
    }
    function handleDelete(e) {
        setAction(false);
        console.log("Delete?");
    }
    if (actionType == 1) {
            if (objectType === 1) {
                content = (
                    <>
                        <Button variant="info" onClick={handleCreate}>Nuevo </Button>
                        <h2>{mainTitle}</h2>
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
                                <tr >
                                    <td>1</td>
                                    <td>Cien años de soledad</td>
                                    <td>123456789</td>
                                    <td>Gabriel García Márquez</td>
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
                        <Button variant="info" onClick={handleCreate}>Nuevo </Button>
                        <h2>{mainTitle}</h2>
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

                                        return (<tr key={dat.dni + index}>
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
                                    }


                                    )
                                }
                            </tbody>
                        </Table>
                    </>
                );
            }
        } else {
            content =
                <CrudForm data={item} item={item[index]} itemType={objectType} action={action} mainTitle={formTitle} actionType={actionType} />
        }
    



    return content;
}
export default TableOverview;