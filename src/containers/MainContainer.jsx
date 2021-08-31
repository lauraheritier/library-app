import React, { useState, useEffect } from "react";
import { Container, Nav } from 'react-bootstrap';
import TableOverview from "../components/TableOverview";


const MainContainer = () => {
    /**itemTypes:
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
    const [objectType, setObjectType] = useState(0);
    const [mainTitle, setMainTitle] = useState("Biblioteca");
    const [data, setData] = useState([]);
    const [dataType, setDataType] = useState("members");

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
            case "1": setObjectType(1); setMainTitle("Libros"); setDataType("publishers");
                console.log("caso 1-el object tipe: ", objectType, " el main title ", mainTitle);
                break;
            case "2": setObjectType(2); setMainTitle("Socios"); setDataType("members"); getData();
                console.log("caso 2-el object tipe: ", objectType, " el main title ", mainTitle);
                break;
            case "3": setObjectType(3); setMainTitle("Empleados"); setDataType("employees"); getData();
                console.log("el object tipe: ", objectType, " el main title ", mainTitle);
                break;
            case "4": setObjectType(4); setMainTitle("Préstamos"); setDataType("employees"); getData();
                break;
            default:
                console.log("pasaaaaaaa");

        }
    };

    content = (
        <>
            <Container>
                <h1>{mainTitle}</h1>
                <Nav variant="pills" activeKey="1" onSelect={handleSelect}>
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
            {(objectType !== 0 ? <TableOverview item={data} actionType={1} objectType={objectType} mainTitle={mainTitle} />
                : '')
            }

        </>
    );
    return content;
}
export default MainContainer;