import React, { useState, useEffect, useCallback } from "react";
import { Table, Button, Modal, ListGroup, Form, ListGroupItem } from 'react-bootstrap';
import service from '../../services/webService';
import { FaFileExcel, FaFilePdf } from 'react-icons/fa';
import XLSX from 'xlsx';

const ReportsTable = ({ item, objectType, handleObjectType, handleActionType, actionType }) => {
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
    const [data, setData] = useState([]);
    const [fileName, setFileName] = useState('documento');
    const [key, setKey] = useState(-1);
    const [perMember, setPerMember] = useState([]);
    const [members, setMembers] = useState([]);

    const getMembers = () => {
        service.getAll('members')
            .then(response => {
                setMembers(response.data);
            })
            .catch(e => {
                console.log("ERROR!!! ", e);
            });
    }

    const getLibraryOnly = () => {
        console.log("el data type antes de ir al service", item);
        service.getLibraryOnly('reports')
            .then(response => {
                setData(response.data);
            })
            .catch(e => {
                console.log("ERROR!!! ", e);
            });
    };

    const getDocumentsPerMember = () => {
        service.borrowingsPerMember('reports', true, true)
            .then(response => {
                setPerMember(response.data);
                console.log("los grupos", response.data);
            })
            .catch(e => {
                console.log("ERROR!!! ", e);
            });
    }

    const getMostRequestedResources = () => {

    }

    useEffect(() => {
        //  getMembers()
        // getLibraryOnly();
        //getDocumentsPerMember();
    }, []);

    function handleSelect(e) {
        //   console.log("los datos", data);
        setKey(e);
        switch (key) {
            case '1': service.getAll('reports');
                break;
            case '2': getDocumentsPerMember();
                break;
            case '3': service.getLibraryOnly('reports');
                break;
            default: service.getAll('members');
                break;
        }
         console.log("los member", members);
    }

    function handleExport(exportToExcel) {
        if (exportToExcel) {
            //  const sheet = XLSX.utils.table_to_book(document.getElementById('data-table'), {raw: false});
            const sheet = XLSX.utils.table_to_sheet(document.getElementById('data-table'));
            console.log("la hoja de cálculo", sheet);
            const workbook = XLSX.utils.book_new();
            XLSX.utils.book_append_sheet(workbook, sheet, 'Sheet 1');
            XLSX.writeFile(workbook, `${fileName}.xlsx`);
        }
    }

    content = (
        <>
            <div>
                <ListGroup defaultActiveKey='-1' activeKey={key} className='list-group-container' onSelect={(key) => handleSelect(key)}>
                    <ListGroupItem eventKey="1" title='Recurso más prestado por mes'>
                        <span>Recurso más prestado por mes</span>
                    </ListGroupItem>
                    <ListGroupItem eventKey="2" title='Préstamos totales por socio'>
                        <span>Préstamos totales por socio</span>
                    </ListGroupItem>
                    <ListGroupItem eventKey="3" title='Solo consulta en biblioteca'>
                        <span>Recursos totales de 'solo consulta en biblioteca'</span>
                    </ListGroupItem>
                    <ListGroupItem eventKey="4" title='Autor más elegido'>
                        <span>Autor más elegido</span>
                    </ListGroupItem>
                    <ListGroupItem eventKey="5" title='Inventario de recursos'>
                        <span>Inventario de recursos</span>
                    </ListGroupItem>
                    <ListGroupItem eventKey="6" title='Listado de socios'>
                        <span>Listado de socios</span>
                    </ListGroupItem>
                    <ListGroupItem eventKey="7" title='Listado de empleados'>
                        <span>Listado de empleados</span>
                    </ListGroupItem>
                    <ListGroupItem eventKey="8" title='Préstamos totales'>
                        <span>Préstamos totales ordenados por estado</span>
                    </ListGroupItem>
                </ListGroup>
            </div>
            {
                key !== -1 ?
                    <>
                        <Table>
                            <thead>
                                <tr>
                                    <th>Socio</th>
                                    <th>Cantidad de préstamos</th>
                                </tr>
                            </thead>
                            <tbody>
                                {
                                    perMember.map((dat, index) => {
                                        return (
                                            <tr>
                                        <td>{dat._id}</td>
                                    <td>{dat.count}</td>
                                    </tr>
                                        )

                                    })
                                }
                            </tbody>
                        </Table>
                        <Table id="data-table" striped bordered hover>
                            <thead>
                                <tr>
                                    <th colSpan='8'> <h5>Recursos totales de solo consulta en biblioteca: {data.length}</h5></th>
                                </tr>
                                <tr>
                                    <th>#</th>
                                    <th>Recurso</th>
                                    <th>Autor</th>
                                    <th>ISBN</th>
                                    <th>Categoría</th>
                                    <th>Editor</th>
                                    <th>Soporte</th>
                                </tr>
                            </thead>
                            <tbody>
                                {
                                    data.map((dat, index) => {
                                        let cats = [dat.category];
                                        let pubs = [dat.publisher];
                                        let sups = [dat.support];
                                        let bookId = dat.id.slice(0, 6);

                                        return (
                                            <tr key={index}>
                                                <td>{bookId}</td>
                                                <td>{dat.title}</td>
                                                <td>{dat.author}</td>
                                                <td>{dat.isbn ? dat.isbn : 'N/A'}</td>
                                                {cats.map(cat => <td>{cat.description}</td>)}
                                                {pubs.map(pub => <td>{pub.description}</td>)}
                                                {sups.map(sup => <td>{sup.description}</td>)}
                                            </tr>
                                        )
                                    })
                                }
                            </tbody>
                        </Table>
                        <div className="file-btn-container container">
                            <h6>Exportar datos</h6>
                            <Form.Control type="text" placeholder="Escriba el nombre del archivo" onChange={(e) => setFileName(e.target.value)} defaultValue={fileName} />
                            <Button variant="success" className="btn-sm" onClick={() => { handleExport(true) }}><FaFileExcel /> Excel</Button>
                            <Button variant="danger" className="btn-sm" onClick={() => { handleExport(false) }}><FaFilePdf /> PDF</Button>
                        </div>
                    </>
                    : ''
            }</>
    );
    return content;
}

export default ReportsTable;