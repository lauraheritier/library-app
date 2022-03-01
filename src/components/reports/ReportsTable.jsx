import React, { useState, useEffect } from "react";
import { Table, Button, ListGroup, Form, ListGroupItem } from 'react-bootstrap';
import service from '../../services/webService';
import { FaFileExcel, FaInfo } from 'react-icons/fa';
import hooks from '../../hooks/components.hooks';

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
    const [key, setKey] = useState(-1);
    const [perMember, setPerMember] = useState([]);
    const [isLoading, data, unfilteredData, setData] = hooks.useGetHelperObjects('borrowings', false);

    function countReadBooks() {
        let groupArray = [];
        let read;

        data.map(d => {
            groupArray.push(d.book);
        })
        if (groupArray.length == 0) return null;
        read = groupArray.filter(function (f) {
            return f.read;

        })
        console.log("el book read", read);
        return read;
    }

    function groupByMember() {
        const groups = data.reduce((groups, info) => {
            const memb = [info.member];
            let oneMember;
            memb.map(m => {return oneMember = m._id});
            if (!groups[oneMember]) {
                groups[oneMember] = [];
            }
            groups[oneMember].push(info);
            return groups;
        }, {});
        //console.log("memberGroups: ", groups);
        const groupArrays = Object.keys(groups).map((oneMember) => {
            return [
                groups[oneMember]
            ];
        });

     //   console.log(groupArrays);

        return groupArrays;
    }


    function groupByDate() {
        // this gives an object with dates as keys
        const groups = data.reduce((groups, info) => {
            const date = info.fromDate.split('T')[0];
            const newDate = new Date(date);
            const month = newDate.getMonth() + 1;
            const year = newDate.getFullYear();
            const finalDate = [year, month].join('/');
            if (!groups[finalDate]) {
                groups[finalDate] = [];
            }
            groups[finalDate].push(info);
            console.log("los groups", groups);
            console.log("el info", info);
            return groups;
        }, {});

        // Edit: to add it in the array format instead
        const groupArrays = Object.keys(groups).map((finalDate) => {
            return {
                finalDate,
                borrowings: groups[finalDate]
            };
        });

        return groupArrays;
    }

    const getMostRequestedResources = (elarray) => {
        console.log("formato de los datos", data);
        let bookArray = [];
        elarray.map((d) => {
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
        return maxEl;
    }

    let body;

    if (key == '1') {
        let res = groupByDate();
        body = (
            res !== null && res.length !== 0 ?
            <>
                <Table id="data-by-date" striped bordered hover>
                    <thead>
                        <tr>
                            <th colSpan='3'> <h5>Recurso más consultado por mes</h5></th>
                        </tr>
                        <tr>
                            <th>#</th>
                            <th>Mes</th>
                            <th>Título</th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            res.map((m, idx) => {
                                let mostRequested;
                                res.map((a) => {
                                    mostRequested = getMostRequestedResources(a.borrowings);
                                    return mostRequested;
                                });
                                console.log("most requested", mostRequested);
                                let resource;
                                [mostRequested].map(m => {
                                    resource = m.title;
                                    return resource;
                                })
                                console.log("el resource", resource);
                                return (
                                    <tr>
                                        <td>{idx + 1}</td>
                                        <td>{m.finalDate}</td>
                                        <td>{resource}</td>
                                    </tr>
                                )
                            })
                        }
                    </tbody>
                </Table>
                <div className="text-right">
                    <Button variant="success" className="btn" onClick={() => { hooks.handleReport(document.getElementById('data-by-date'), false) }}><FaFileExcel /> Generar informe</Button>
                </div>
            </>
            :
            <p>No hay datos para mostrar.</p>
        );
    }
    if (key == '2') {
let result = groupByMember();
console.log("result", result);
body = (
    result !== null && result.length !== 0 ? 
    <>
     <Table id="member-table" striped bordered hover>
                        <thead>
                            <tr>
                                <th colSpan='3'> <h5>Préstamos totales por socio</h5></th>
                            </tr>
                            <tr>
                                <th>#</th>
                                <th>Socio</th>
                                <th>Cantidad de préstamos</th>
                            </tr>
                        </thead>
                        <tbody>
                            {
                                result.map((m, idx) => {
                                    let name;
                                    let count;
                                    for(var i = 0; i < m.length; i++) {
                                        for(var j = 0; j < m[i].length; j++) {
                                            let oneObject = m[i][j];
                                            count = m[i].length;
                                            let oneMember = [oneObject.member]
                                            oneMember.map(m => {name = m.first_name + ' ' + m.last_name; return name})
                                        }
                                    }
                                    return (
                                        <tr>
                                            <td>{idx + 1}</td>
                                            <td>{name}</td>
                                            <td>{count}</td>
                                        </tr>
                                    )
                                })
                            }
                        </tbody>
                    </Table>
                    <div className="text-right">
                        <Button variant="success" className="btn" onClick={() => { hooks.handleReport(document.getElementById('member-table'), false) }}><FaFileExcel /> Generar informe</Button>
                    </div>
    </>
    :
    <p>No hay datos para mostrar.</p>
);
    }
    if (key == '3') {
        let result = countReadBooks();
        body = (
            result !== null && result.length !== 0 ?
                <>
                    <Table id="library-table" striped bordered hover>
                        <thead>
                            <tr>
                                <th colSpan='4'> <h5>Recursos de solo lectura: {result.length}</h5></th>
                            </tr>
                            <tr>
                                <th>#</th>
                                <th>Título</th>
                                <th>Autor</th>
                                <th>Solo consulta en biblioteca</th>
                            </tr>
                        </thead>
                        <tbody>
                            {
                                result.map((m, idx) => {
                                    console.log(result);
                                    return (
                                        <tr>
                                            <td>{idx + 1}</td>
                                            <td>{m.title}</td>
                                            <td>{m.author}</td>
                                            <td>Sí</td>
                                        </tr>
                                    )
                                })
                            }
                        </tbody>
                    </Table>
                    <div className="text-right">
                        <Button variant="success" className="btn" onClick={() => { hooks.handleReport(document.getElementById('library-table'), false) }}><FaFileExcel /> Generar informe</Button>
                    </div>
                </>
                : <p>No hay datos para mostrar.</p>
        );
    }

    content = (
        <div>
            <ListGroup defaultActiveKey='-1' activeKey={key} className='list-group-container' onSelect={(k) => setKey(k)}>
                <ListGroupItem eventKey="1" title='Recurso más prestado por mes'>
                    <span>Recurso más consultado por mes</span>
                </ListGroupItem>
                <ListGroupItem eventKey="2" title='Préstamos totales por socio'>
                    <span>Préstamos totales por socio</span>
                </ListGroupItem>
                <ListGroupItem eventKey="3" title='Solo consulta en biblioteca'>
                    <span>Recursos totales de 'solo consulta en biblioteca'</span>
                </ListGroupItem>
            </ListGroup>
        </div>
    );
    return [content, body];
}

export default ReportsTable;