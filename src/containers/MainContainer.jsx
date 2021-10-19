import React, { useState, useEffect } from "react";
import { Container, Nav } from 'react-bootstrap';
import BooksTable from "../components/books/BooksTable";
import CategoriesTable from "../components/categories/CategoriesTable";
import PublishersTable from "../components/publishers/PublishersTable";
import MembersTable from "../components/members/MembersTable";
import EmployeesTable from "../components/employees/EmployeesTable";
import BorrowingsTable from "../components/borrowings/BorrowingsTable";
import SupportsTable from "../components/supports/SupportsTable";
import ReportsTable from "../components/reports/ReportsTable";

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
        } else if (obj === 7) {
            setkeyWithFocus(4);
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

    function refreshView() {
        
    }

    useEffect(() => {
    }, [])

    const handleSelect = (e) => {
        switch (e) {
            case "0": setMainTitle("Biblioteca"); setkeyWithFocus(0); setObjectType(0); setActionType(0);
                break;
            case "1": setObjectType(1); setMainTitle("Recursos"); setDataType("books"); setkeyWithFocus(1); setActionType(1); refreshView();
                break;
            case "2": setObjectType(2); setMainTitle("Socios"); setDataType("members"); setkeyWithFocus(2); setActionType(1); refreshView();
                console.log("caso 2-el object tipe: ", objectType, " el actionType ", actionType);
                break;
            case "3": setObjectType(3); setMainTitle("Empleados"); setDataType("employees"); setkeyWithFocus(3); setActionType(1); refreshView();
                console.log("caso 3-el object tipe: ", objectType, " el actionType ", actionType);
                break;
            case "4": setObjectType(7); setMainTitle("Préstamos"); setDataType("borrowings"); setkeyWithFocus(4); setActionType(1); refreshView();
                break;
            case "5": setObjectType(8); setMainTitle("Informes"); setDataType("reports"); setkeyWithFocus(5); setActionType(1); refreshView();
                break;
            default:
                console.log("pasaaaaaaa");
                break;
        }
        setActionType(1);
    };

   /* if (objectType == 0 || actionType == 0) {
        body = (
            <p>¡Bienvenidos!</p>
        )
    }*/
    if (objectType === 1) {
        body = (
            <div className="container-body">
            <h2>{mainTitle}</h2>
            <BooksTable item={'books'} actionType={actionType} objectType={objectType}
                mainTitle={mainTitle} handleObjectType={handleObjectType} handleActionType={handleActionType} />
       </div>
        )
    }
    if (objectType === 2) {
        body = (
            <div className="container-body">
            <h2>{mainTitle}</h2>
            <MembersTable item={'categories'} actionType={actionType} objectType={objectType}
                mainTitle={mainTitle} handleObjectType={handleObjectType} handleActionType={handleActionType} />
       </div>
       )
    }
    if (objectType === 3) {
        body = (
            <div className="container-body">
            <h2>{mainTitle}</h2>
            <EmployeesTable item={'categories'} actionType={actionType} objectType={objectType}
                mainTitle={mainTitle} handleObjectType={handleObjectType} handleActionType={handleActionType} />
       </div>
        )
    }
    if (objectType === 4) {
        body = (
            <div className="container-body">
            <h2>{mainTitle}</h2>
            <CategoriesTable item={'categories'} actionType={actionType} objectType={objectType}
                mainTitle={mainTitle} handleObjectType={handleObjectType} handleActionType={handleActionType} />
        
        </div>)
    }
    if (objectType === 5) {
        body = (
            <div className="container-body">
            <h2>{mainTitle}</h2>
            <PublishersTable item={'publishers'} actionType={actionType} objectType={objectType}
                mainTitle={mainTitle} handleObjectType={handleObjectType} handleActionType={handleActionType} />
        </div>
        )
    }
    if (objectType === 6) {
        body = (
            <div className="container-body">
            <h2>{mainTitle}</h2>
            <SupportsTable item={'supports'} actionType={actionType} objectType={objectType}
                mainTitle={mainTitle} handleObjectType={handleObjectType} handleActionType={handleActionType} />
       </div>
        )
    }

    if (objectType === 7) {
        body = (
            <div className="container-body">
            <h2>{mainTitle}</h2>
            <BorrowingsTable item={'borrowings'} actionType={actionType} objectType={objectType}
                mainTitle={mainTitle} handleObjectType={handleObjectType} handleActionType={handleActionType} />
       </div>
        )
    }

    if (objectType === 8) {
        body = (
            <div className="container-body">
            <h2>{mainTitle}</h2>
            <ReportsTable item={'borrowings'} actionType={actionType} objectType={objectType}
                mainTitle={mainTitle} handleObjectType={handleObjectType} handleActionType={handleActionType} />
        </div>
        )
    }


    content = (
        <>
            <div className="nav-pills-container">
                <Nav className="flex-column nav" activeKey={keyWithFocus} onSelect={handleSelect}>
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
                    <Nav.Item>
                        <Nav.Link eventKey="5">
                            Informes
                        </Nav.Link>
                    </Nav.Item>
                </Nav>
            </div>




            {
                body
            }

        </>
    );
    return content;
}
export default MainContainer;