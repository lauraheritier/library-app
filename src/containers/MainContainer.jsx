import React, { useState, useEffect } from "react";
import { Container, Nav } from 'react-bootstrap';
import BooksTable from "../components/books/BooksTable";
import CategoriesTable from "../components/categories/CategoriesTable";
import PublishersTable from "../components/publishers/PublishersTable";
import MembersTable from "../components/members/MembersTable";
import EmployeesTable from "../components/employees/EmployeesTable";
import BooksToMembersTable from "../components/booksToMembers/BooksToMembersTable";
import SupportsTable from "../components/supports/SupportsTable";

const MainContainer = () => {
    /**dataTypes:
     * 1: Books
     * 2: Members
     * 3: Employees
     * 4: Categories
     * 5: Publishers
     * 6: Supports
     * 7: Borrowings
     * 
     * action types:
     * 1: view
     * 2: edit
     * 3: create
     * 4: back
     */
    let content;
    let body;
    const [objectType, setObjectType] = useState(0);
    const [mainTitle, setMainTitle] = useState("Biblioteca");
    const [dataType, setDataType] = useState("books");
    const [keyWithFocus, setkeyWithFocus] = useState(0);
    const [actionType, setActionType] = useState(0);
    async function handleObjectType(action, obj, title, apiName) {
        setActionType(action);
        console.log("valor a cambiar: ", action);
        setDataType(apiName);
        console.log("el data type ", dataType);
        setObjectType(obj);
        console.log("el action type", actionType);
        if (obj === 4 || obj === 5 || obj === 6) {
            setkeyWithFocus(1);
        } else {
            setkeyWithFocus(obj);
        }
        setMainTitle(title);


        console.log("valor cambiado: ", objectType, " y el data type: ", dataType, " y el action type ", action);

    }
    function handleActionType(action) {
        console.log("una acción!!!!!!!!!!!! ", action);
        setActionType(action);
        console.log("Acción seteadaaaa", actionType);
    }

    useEffect(() => {
    }, [])

    const handleSelect = (e) => {
        switch (e) {
            case "0": setMainTitle("Biblioteca"); setkeyWithFocus(0); setObjectType(0); setActionType(0);
                break;
            case "1": setObjectType(1); setMainTitle("Recursos"); setDataType("books"); setkeyWithFocus(1); setActionType(1); console.log("y ahora pasa x acá");
                console.log("caso 1-el object tipe: ", objectType, " el actionType ", actionType);
                break;
            case "2": setObjectType(2); setMainTitle("Socios"); setDataType("members"); setkeyWithFocus(2); setActionType(1);
                console.log("caso 2-el object tipe: ", objectType, " el actionType ", actionType);
                break;
            case "3": setObjectType(3); setMainTitle("Empleados"); setDataType("employees"); setkeyWithFocus(3); setActionType(1);
                console.log("caso 3-el object tipe: ", objectType, " el actionType ", actionType);
                break;
            case "4": setObjectType(7); setMainTitle("Préstamos"); setDataType("booksToMembers"); setkeyWithFocus(4); setActionType(1);
                break;
            default:
                console.log("pasaaaaaaa");
                break;

        }
    };

    if (objectType == 0 || actionType == 0) {
        body = (
            <p>¡Bienvenidos!</p>
        )
    }
    if (objectType === 1) {
        body = (
            <BooksTable item={'books'} actionType={actionType} objectType={objectType}
                mainTitle={mainTitle} handleObjectType={handleObjectType} handleActionType={handleActionType} />
        )
    }
    if (objectType === 2) {
        body = (
            <MembersTable item={'categories'} actionType={actionType} objectType={objectType}
                mainTitle={mainTitle} handleObjectType={handleObjectType} handleActionType={handleActionType} />
        )
    }
    if (objectType === 3) {
        body = (
            <EmployeesTable item={'categories'} actionType={actionType} objectType={objectType}
                mainTitle={mainTitle} handleObjectType={handleObjectType} handleActionType={handleActionType} />
        )
    }
    if (objectType === 4) {
        body = (
            <CategoriesTable item={'categories'} actionType={actionType} objectType={objectType}
                mainTitle={mainTitle} handleObjectType={handleObjectType} handleActionType={handleActionType} />
        )
    }
    if (objectType === 5) {
        body = (
            <PublishersTable item={'publishers'} actionType={actionType} objectType={objectType}
                mainTitle={mainTitle} handleObjectType={handleObjectType} handleActionType={handleActionType} />
        )
    }
    if (objectType === 6) {
        body = (
            <SupportsTable item={'supports'} actionType={actionType} objectType={objectType}
                mainTitle={mainTitle} handleObjectType={handleObjectType} handleActionType={handleActionType} />
        )
    }

    if (objectType === 7) {
        body = (
            <BooksToMembersTable item={'booksToMembers'} actionType={actionType} objectType={objectType}
                mainTitle={mainTitle} handleObjectType={handleObjectType} handleActionType={handleActionType} />
        )
    }


    content = (
        <>
            <Container>
                <h1>{mainTitle}</h1>
                <Nav variant="pills" activeKey={keyWithFocus} onSelect={handleSelect}>
                    <Nav.Item>
                        <Nav.Link eventKey="0">
                            Inicio
                        </Nav.Link>
                    </Nav.Item>
                    <Nav.Item>
                        <Nav.Link eventKey="1">
                            Recursos
                        </Nav.Link>
                    </Nav.Item>
                    <Nav.Item>
                        <Nav.Link eventKey="2">
                            Socios
                        </Nav.Link>
                    </Nav.Item>
                    <Nav.Item>
                        <Nav.Link eventKey="3">
                            Empleados
                        </Nav.Link>
                    </Nav.Item>
                    <Nav.Item>
                        <Nav.Link eventKey="4">
                            Préstamos
                        </Nav.Link>
                    </Nav.Item>
                </Nav>
            </Container>




            {
                body
            }

        </>
    );
    return content;
}
export default MainContainer;