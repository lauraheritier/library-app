import React, { useState, useEffect } from "react";
import { Container, Nav } from 'react-bootstrap';
import BooksTable from "../components/books/BooksTable";
import CategoriesTable from "../components/categories/CategoriesTable";
import PublishersTable from "../components/publishers/PublishersTable";
import MembersTable from "../components/members/MembersTable";
import BorrowingsTable from "../components/borrowings/BorrowingsTable";
import SupportsTable from "../components/supports/SupportsTable";
import ReportsTable from "../components/reports/ReportsTable";
import MainMenu from "../components/header/mainMenu.component";
import FooterMenu from "../components/footer/footer.component";
import BookDetail from "../components/books/BookDetail";

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
     * 5: view single
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

    async function handleSelect(e) {
        switch (e) {
            case "0": setMainTitle("Biblioteca"); setkeyWithFocus(0); setObjectType(0); setActionType(0);
                break;
            case "1": setObjectType(1); setMainTitle("Recursos"); setDataType("books"); setkeyWithFocus(1); setActionType(1); refreshView();
                break;
            case "2": setObjectType(2); setMainTitle("Mis contactos"); setDataType("members"); setkeyWithFocus(2); setActionType(1); refreshView();
                console.log("caso 2-el object tipe: ", objectType, " el actionType ", actionType);
                break;
            case "4": setObjectType(7); setMainTitle("Préstamos"); setDataType("borrowings"); setkeyWithFocus(4); setActionType(1); refreshView();
                break;
            case "5": setObjectType(8); setMainTitle("Informes"); setDataType("reports"); setkeyWithFocus(5); setActionType(1); refreshView();
                break;
            case "6": setObjectType(4); setMainTitle("Categorías"); setDataType("categories"); setkeyWithFocus(6); setActionType(1); refreshView();
                break;
            case "7": setObjectType(5); setMainTitle("Editoriales"); setDataType("publishers"); setkeyWithFocus(7); setActionType(1); refreshView();
                break;
            case "8": setObjectType(6); setMainTitle("Soportes"); setDataType("supports"); setkeyWithFocus(8); setActionType(1); refreshView();
                break;
            default:
                console.log("pasaaaaaaa");
                break;
        }
        setActionType(1);
    };

    if (objectType === 1) {
        body = (
            <div className="container-body">
                <BooksTable item={'books'} actionType={actionType} objectType={objectType}
                    mainTitle={mainTitle} handleObjectType={handleObjectType} handleActionType={handleActionType} />
            </div>
        )
    }
    if (objectType === 2) {
        body = (
            <div className="container-body">
                <MembersTable item={'members'} actionType={actionType} objectType={objectType}
                    mainTitle={mainTitle} handleObjectType={handleObjectType} handleActionType={handleActionType} />
            </div>
        )
    }
    if (objectType === 4) {
        body = (
            <div className="container-body">
                <CategoriesTable item={'categories'} actionType={actionType} objectType={objectType}
                    mainTitle={mainTitle} handleObjectType={handleObjectType} handleActionType={handleActionType} />

            </div>)
    }
    if (objectType === 5) {
        body = (
            <div className="container-body">
                <PublishersTable item={'publishers'} actionType={actionType} objectType={objectType}
                    mainTitle={mainTitle} handleObjectType={handleObjectType} handleActionType={handleActionType} />
            </div>
        )
    }
    if (objectType === 6) {
        body = (
            <div className="container-body">
                <SupportsTable item={'supports'} actionType={actionType} objectType={objectType}
                    mainTitle={mainTitle} handleObjectType={handleObjectType} handleActionType={handleActionType} />
            </div>
        )
    }
    if (objectType === 7) {
        body = (
            <div className="container-body">
                <BorrowingsTable item={'borrowings'} actionType={actionType} objectType={objectType}
                    mainTitle={mainTitle} handleObjectType={handleObjectType} handleActionType={handleActionType} />
            </div>
        )
    }
    if (objectType === 8) {
        body = (
            <div className="container-body">
                <ReportsTable item={'borrowings'} actionType={actionType} objectType={objectType}
                    mainTitle={mainTitle} handleObjectType={handleObjectType} handleActionType={handleActionType} />
            </div>
        )
    }
    if(objectType === 0) {
        body = (
            <>
            <FooterMenu activeKey={keyWithFocus} handleSelect={handleSelect} />
                           
            </>
        )
    }
   


    content = (
        <>
            <MainMenu activeKey={keyWithFocus} handleSelect={handleSelect} />
            {
                body                
            }           
        </>
    );
    return content;
}
export default MainContainer;