import React, { useState, useEffect } from "react";
import { Container, Nav } from 'react-bootstrap';
import TableOverview from "../components/TableOverview";
import service from '../services/member.service';


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
        if(obj == 4 || obj == 5) {
            setkeyWithFocus(1);
        } else {
            setkeyWithFocus(obj);
        }
        setMainTitle(title);
       setActionType(action);
        
        console.log("valor cambiado: ", objectType);

    }
    const handleActionType = (action) => {
        console.log("una acción!!!!!!!!!!!! ", action);
        setActionType(action);
        console.log("Acción seteadaaaa", actionType);
    }
const getData = () => {
    console.log("el data type antes de ir al service", dataType);
    service.getAll(dataType)
    .then(response => {
        setData(response.data);
        console.log("los datos: ", response.data);
    })
    .catch(e => {
        console.log("ERROR!!! ", e);
    });
};

    useEffect(() => {
    }, [])

    const handleSelect = (e) => {
        switch (e) {
            case "0": setMainTitle("Biblioteca"); setkeyWithFocus(0); setObjectType(0); setActionType(0);
                break;
            case "1": setObjectType(1); setMainTitle("Libros"); setDataType("books"); setkeyWithFocus(1); setActionType(1); console.log("y ahora pasa x acá");
                console.log("caso 1-el object tipe: ", objectType, " el actionType ", actionType);
                break;
            case "2": setObjectType(2); setMainTitle("Socios"); setDataType("members"); setkeyWithFocus(2); setActionType(1);
                console.log("caso 2-el object tipe: ", objectType, " el actionType ", actionType);
                break;
            case "3": setObjectType(3); setMainTitle("Empleados"); setDataType("employees"); setkeyWithFocus(3); setActionType(1);
                console.log("caso 3-el object tipe: ", objectType, " el actionType ", actionType);
                break;
            case "6": setObjectType(6); setMainTitle("Préstamos"); setDataType("employees");setkeyWithFocus(4); setActionType(1);
                break;
            default:
                console.log("pasaaaaaaa");

        }
        getData();
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