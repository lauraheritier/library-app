import React, { useState, useEffect } from "react";
import Form from 'react-bootstrap/Form';

const ValueList = ({ dataType, isAuthor }) => {
    let content;
    const [data, setData] = useState([]);    

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
        getData();
    }, [])

    content = (
        <Form.Control as="select" aria-label={dataType}>
            {
                data.map((item, index) => {
                    if (isAuthor) {
                        return <option key={index} value={index}>{item.first_name} {item.last_name}</option>
                    } else {
                        return  <option key={index} value={index}>{item.description}</option>
                    }
                })
            }
        </Form.Control>
    )

    return content;
}
export default ValueList;