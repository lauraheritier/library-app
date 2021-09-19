import React, { useState, useEffect, useCallback } from "react";
import { Table, Button, Modal, Tab, Tabs, Form } from 'react-bootstrap';
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
    const[fileName, setFileName] =useState('documento');
    const[key, setKey] = useState(-1);

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

    const getMostRequestedResources = () => {

    }

    useEffect(() => {
        getLibraryOnly();
        getMostRequestedResources();
    }, []);

    function handleSelect(e) {
        console.log("los datos", data);
        setKey(e);
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
                <Tabs defaultActiveKey='-1' activeKey={key} className='mb-3' onSelect={(key) => handleSelect(key)}>
                    <Tab eventKey="1" title='Recurso más prestado por mes'>
                        <h5>Recurso más prestado por mes</h5>
                    </Tab>
                    <Tab eventKey="2" title='Préstamos totales por socio'>
                        <h5>Préstamos totales por socio</h5>
                    </Tab>
                    <Tab eventKey="3" title='Solo consulta en biblioteca'>
                        <h5>Recursos de solo consulta en biblioteca</h5>
                    </Tab>
                    <Tab eventKey="4" title='Autor más elegido'>
                        <h5>Autor más elegido</h5>
                    </Tab>
                    <Tab eventKey="5" title='Inventario de recursos'>
                        <h5>Inventario de recursos</h5>
                    </Tab>
                    <Tab eventKey="6" title='Listado de socios'>
                        <h5>Listado de socios</h5>
                    </Tab>
                    <Tab eventKey="7" title='Listado de empleados'>
                        <h5>Listado de empleados</h5>
                    </Tab>
                </Tabs>
            </div>
            {
                key !== -1 ?
                    <>
                        <Table id="data-table" striped bordered hover>
                            <thead>
                                <tr>
                                    <th>#</th>
                                    <th>Recurso</th>
                                    <th>Autor</th>
                                    <th>ISBN</th>
                                    <th>Categoría</th>
                                    <th>Editor</th>
                                    <th>Soporte</th>
                                    <th>Total</th>
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
                                                <td>{data.length}</td>
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