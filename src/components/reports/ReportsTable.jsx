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
    const [books, setBooks] = useState([]);
    const [mostRequestedResource, setMostRequestedResource] = useState([]);
    const [groupByStat, setGroupByStat] = useState([]);

    const getData = () => {
        service.getAll('reports')
            .then(response => {
                setData(response.data);
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


    //list of borrowings ordered by status
    const groupByStatus = data.reduce((groups, item) => {
        const group = (groups[item.cancelled] || []);
        group.push(item);
        groups[item.cancelled] = group;

      return groups;
    }, {});

    const getMostRequestedResources = () => {
        let bookArray = [];
        data.map((d) => {
            bookArray.push(d.book)
        });

        if (bookArray.length == 0) return null;
        var modeMap = {};
        var maxEl = bookArray[0],
            maxCount = 1;
        for (var i = 0; i < bookArray.length; i++) {
            var el = bookArray[i]._id;
            if (modeMap[el] == null) modeMap[el] = 1;
            else modeMap[el]++;
            if (modeMap[el] > maxCount) {
                maxEl = bookArray[i];
                maxCount = modeMap[el];
            }
        }
        console.log("recurso más solicitado", maxEl);
        setMostRequestedResource(maxEl);
        return maxEl;


    }

    useEffect(() => {
        getData();
        //  getMembers()
        // getLibraryOnly();
        //getDocumentsPerMember();
    }, []);

    function handleSelect(e) {
        //   console.log("los datos", data);
        setKey(e);

        /*switch (key) {
            case '1': service.getAll('reports');
                break;
            case '2': getDocumentsPerMember();
                break;
            case '3': service.getLibraryOnly('reports');
                break;
                case '4': getMostRequestedResources();
                break;
                case '7': groupByStatus;
                break;
            default: service.getAll('members');
                break;
        }*/
      //  console.log("los datos", groupByStatus, "los cancelled", groupByStatus.true.length, "los prestados todavía ", groupByStatus.false.length);
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

    let body;

    if (key == '1') {

    }
    if (key == '2') {

    }
    if (key == '3') {

    }
    if (key == '4') {
        getMostRequestedResources();
        let resourceId = (mostRequestedResource._id).slice(0, 6);
        body = (
            <Table id="data-table-table" striped bordered hover>
                <thead>
                    <tr>
                        <th colSpan='8'> <h5>Recurso más consultado</h5></th>
                    </tr>
                    <tr>
                        <th>#</th>
                        <th>Título</th>
                    </tr>
                </thead>
                <tbody>
                    <tr key={mostRequestedResource._id}>
                        <td>{resourceId}</td>
                        <td>{mostRequestedResource.title}</td>
                    </tr>
                </tbody>
            </Table>
        );


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
                    </ListGroup>
            </div>
            {
                key !== -1 ?
                    <>

                        {body}

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