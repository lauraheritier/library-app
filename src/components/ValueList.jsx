import React, { useState, useEffect } from "react";

const ValueList = ({ dataType, isAuthor }) => {
    const [data, setData] = useState([]);
    let content;    

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
        getData([]);
    })

    content = (
            <select>
                {
                    data.map((dataType, index) => {
                        return <option key={index} value={index}>{dataType.first_name} {dataType.last_name}</option>
                    })
                }
            </select>
        )
        if (!isAuthor) {
        content = (
            <select>
                {
                    data.map((dataType, index) => {
                     return <option key={index} value={index}>{dataType.description}</option>
                    })
                }
            </select>
        )
    }
    return content;
}
export default ValueList;