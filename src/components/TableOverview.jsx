import React, { useState, useEffect } from "react";
import { Table, Container, Row, Col, Button } from 'react-bootstrap';
import CrudFrom from './CrudForm';

const TableOverview = ({ objectType, mainTitle }) => {
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
    let content;

const [action, setAction] = useState(true);
function handleClick(e) {

}
function handleEdit(e) {
  content = <CrudForm itemType={objectType} action={action} mainTitle={`Editar ${objectType}`} />
  return content;
}
function handleDelete(e) {
    setAction(false);
    content = <CrudForm itemType={objectType} action={action} mainTitle={`Eliminar ${objectType}`} />
    return content;
}
    if (objectType === 1) {
        content = (
            <>
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
                        <tr>
                            <td>1</td>
                            <td>Cien años de soledad</td>
                            <td>123456789</td>
                            <td>Gabriel García Márquez</td>
                            <td><Button onClick={handleEdit}>Editar</Button> 
                            <Button onClick={handleDelete}>Eliminar</Button></td>
                        </tr>
                        
                    </tbody>
                </Table>
            </>
        );
    } else {
        content = (
            <>
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
                            {objectType == 2 ? <th>No. de socio</th> : ""}
                            <th>Acciones</th>                            
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>Lautaro</td>
                            <td>González</td>
                            <td>123456789</td>
                            <td>Obispo Trejo 1134</td>
                            <td>32040404</td>
                            {objectType == 2 ? <td>123456789</td> : ""}
                            <td><Button onClick={handleEdit}>Editar</Button> 
                            <Button onClick={handleDelete}>Eliminar</Button></td>
                        </tr>                        
                    </tbody>
                </Table>
            </>
        );
    }
    return content;
}
export default TableOverview;