import React, { useState, useEffect } from "react";
import Form from 'react-bootstrap/Form';
import service from '../services/member.service';

const ValueList = ({ dataType}) => {
    let content;
    const [data, setData] = useState([]);    

    const getData = () => {
        console.log("el data type antes de ir al service", dataType);
        service.getAll(dataType)
        .then(response => {
            setData(response.data);
            console.log("los datos del data type: ", response.data);
        })
        .catch(e => {
            console.log("ERROR!!! ", e);
        });
    };
    useEffect(() => {
        getData();
    }, [])

    content = (
        <Form.Control as="select" aria-label={dataType}>
            {
                data.map((item, index) => {
                    return  <option key={index} value={item.id}>{item.description}</option>                    
                })
            }
        </Form.Control>
    )

    return content;
}
export default ValueList;