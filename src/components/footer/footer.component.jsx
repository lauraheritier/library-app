import React, { useState, useEffect } from "react";
import { Container, Nav } from 'react-bootstrap';

const FooterMenu = ({ keyWithFocus, handleSelect, mainTitle }) => {

    let content= (
        <>
         <div className="footer nav-pills-container">
                <Nav className="nav" activeKey={keyWithFocus} onSelect={(e) => {handleSelect(e)}}>
                  <Nav.Item>
                        <Nav.Link eventKey="5">
                            Informes
                        </Nav.Link>
                    </Nav.Item>                    
                </Nav>
            </div>
        </>
    );
return content;
}
export default FooterMenu;
