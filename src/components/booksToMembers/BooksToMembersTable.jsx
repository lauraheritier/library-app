import React, { useState, useEffect, useCallback } from "react";
import { Table, Button, Modal } from 'react-bootstrap';
import service from '../../services/webService';
import BooksToMembersCrudForm from './BooksToMembersCrudForm';


const BooksToMembersTable = ({ item, objectType, handleObjectType, handleActionType, actionType }) => {
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
    const[returnBook, setReturnBook] = useState(false);
    const getData = (item) => {
        console.log("el data type antes de ir al service", item);
        service.getAll('booksToMembers')
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
    function handleReturn(param) {
        setIsCreate(false);
        setReturnBook(true);
    }
    function handleCreate(param) {
        setIsCreate(true);
        setAction(3);
        handleObjectType(3, 7, 'Nuevo préstamo', 'booksToMembers');

    }
    function handleRenewal(i) {
        setIsCreate(false);
        setAction(2);
        console.log("¿dónde está el index? ", i.target, " el objectType: ", objectType);
        setIndex(i);
        console.log("el id ", i);
        handleObjectType(2, 7, 'Editar préstamo', 'booksToMembers');
    }
    function goBack(action, object) {
        setAction(action);
        handleObjectType(action, object, 'Préstamos', 'booksToMembers');
        refreshView();
    }
    const refreshView = useCallback(() => {
        getData();
    }, []);
    if (actionType == 1) {
        content = (
            <>
                <div className="text-right">
                   <Button variant="info" onClick={handleCreate}>Nuevo préstamo</Button>
                </div>
                {
                    data.length !== 0 ?
                        <>
                            <Table striped bordered hover>
                                <thead>
                                    <tr>
                                        <th>#</th>
                                        <th>Libro</th>
                                        <th>Socio</th>
                                        <th>Desde</th>
                                        <th>Hasta</th>
                                        <th>Acciones</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {
                                        data.map((dat, index) => {
                                            let books = [dat.book];
                                            let members = [dat.member];
                                           return (<tr key={dat.id}>
                                                <td>{index}</td>
                                                {books.map(book =><td>{book.title}</td>)}
                                                {members.map(member =><td>{member.first_name} {member.last_name}</td>)}
                                                <td>{dat.fromDate}</td>
                                                <td>{dat.toDate}</td>
                                                <td><Button id={index} variant="success" onClick={() => { handleRenewal(dat.id) }}>Renovar</Button>
                                                    <Button id={dat.dni} variant="danger" onClick={() => { handleReturn(dat.id) }}>Devolver</Button></td>

                                            </tr>)
                                        })
                                    }
                                </tbody>
                            </Table>                            
                        </>
                        : ''
                }</>
        );
    } else {
        content =
            <>
                <BooksToMembersCrudForm data={data} item={index} returnBook={returnBook}
                itemType={objectType} isCreate={isCreate} actionType={action} handleObjectType={handleObjectType} />
                <div className="text-left">
                    <a href="#" onClick={() => { goBack(1, objectType) }}>Volver</a>
                </div>
            </>
    }




    return content;
}
export default BooksToMembersTable;