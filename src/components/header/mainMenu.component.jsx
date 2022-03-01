import React, { useState, useEffect } from "react";
import { Container, Nav } from 'react-bootstrap';

const MainMenu = ({ keyWithFocus, handleSelect }) => {

    let content= (
        <>
         <div className="nav-pills-container header-pills">
                <Nav className="nav" activeKey={keyWithFocus} onSelect={(e) => {handleSelect(e)}}>
                  <Nav.Item>
                        <Nav.Link eventKey="1">
                            Recursos
                        </Nav.Link>
                    </Nav.Item>
                    <Nav.Item>
                        <Nav.Link eventKey="2">
                            Mis contactos
                        </Nav.Link>
                    </Nav.Item>                    
                    <Nav.Item>
                        <Nav.Link eventKey="4">
                            Préstamos
                        </Nav.Link>
                    </Nav.Item>
                </Nav>
            </div>
        </>
    );
return content;
}
export default MainMenu;
