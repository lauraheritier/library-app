import React, { useState, useEffect } from "react";
import { Container, Nav } from 'react-bootstrap';
import TableOverview from "../components/TableOverview";


const MainContainer = () => {
    /**dataTypes:
     * Books
     * Members
     * Employees
     * 
     * action types:
     * 1: view
     * 2: edit
     * 3: create
     * 4: back
     */
    let content;
    const [objectType, setObjectType] = useState(0);
    const [mainTitle, setMainTitle] = useState("Biblioteca");
    const [data, setData] = useState([]);
    const [dataType, setDataType] = useState("members");
    const [keyWithFocus, setkeyWithFocus] = useState(0);
    const [actionType, setActionType] = useState(0);

    function handleObjectType(action, obj, title) {
        console.log("valor a cambiar: ", action);
        setObjectType(obj);
        setkeyWithFocus(obj);
        setMainTitle(title);
        setActionType(action);
        
        console.log("valor cambiado: ", obj);

    }
    function handleActionType(action) {
        console.log("una acción ", action);
        setActionType(action);
        if (action != 1)
            return true;
    }

    const getData = () => {
        fetch(`http://localhost:3000/${dataType}`, {
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            }
        })
            .then(function (response) {
                console.log(response)
                return response.json();
            })
            .then(function (myJson) {
                console.log(myJson);
                setData(myJson);
            });
    }

    useEffect(() => {
    }, [])

    const handleSelect = (e) => {
        switch (e) {
            case "0": setMainTitle("Biblioteca"); setkeyWithFocus(0); setObjectType(0); setActionType(0);
                break;
            case "1": setObjectType(1); setMainTitle("Libros"); setDataType("publishers"); setkeyWithFocus(1); setActionType(1);
                console.log("caso 1-el object tipe: ", objectType, " el actionType ", actionType);
                break;
            case "2": setObjectType(2); setMainTitle("Socios"); setDataType("members"); getData(); setkeyWithFocus(2); setActionType(1);
                console.log("caso 2-el object tipe: ", objectType, " el actionType ", actionType);
                break;
            case "3": setObjectType(3); setMainTitle("Empleados"); setDataType("employees"); getData(); setkeyWithFocus(3); setActionType(1);
                console.log("caso 3-el object tipe: ", objectType, " el actionType ", actionType);
                break;
            case "4": setObjectType(4); setMainTitle("Préstamos"); setDataType("employees"); getData(); setkeyWithFocus(4); setActionType(1);
                break;
            default:
                console.log("pasaaaaaaa");

        }
    };

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
                            Libros
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
            {((objectType !== 0 || actionType == 1) ? <TableOverview item={data} actionType={actionType} objectType={objectType} mainTitle={mainTitle} handleObjectType={handleObjectType} handleActionType={handleActionType} />
                : <p>¡Bienvenidos!</p>)
            }

        </>
    );
    return content;
}
export default MainContainer;