import React, { useState, useEffect } from "react";
import ValueList from "./ValueList";

const CrudForm = ({ dataType, action, mainTitle }) => {
    /**dataTypes:
     * 1: Books
     * 2: Members
     * 3: Employees
     */
    /**
     * actions:
     * true: edit
     * false: create
     */
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

    if (dataType === 1) {
        content = (
            <>
                <h2>{mainTitle}</h2>
                <form>
                    <div >
                        <label>Titulo</label>
                        <input type="text" />
                    </div>
                    <div >
                        <label>ISBN</label>
                        <input type="text" />
                    </div>
                    <div>
                        <label>Editorial</label>
                        <ValueList dataType="publishers" isAuthor={false} />
                    </div>
                    <div>
                        <label>Categoría</label>
                        <ValueList dataType="categories" isAuthor={false} />
                    </div>
                    <div >
                        <label>Autor</label>
                        <ValueList dataType="authors" isAuthor={true} />
                    </div>
                    <div >
                        <label>Estado</label>
                        <input type="checkbox" value="Prestado" />
                    </div>
                </form>
            </>
        );
    } else {
        content = (
            <>
                <h2>{mainTitle}</h2>
                <form>
                    <div >
                        <label>Nombre</label>
                        <input type="text" />
                    </div>
                    <div >
                        <label>Apellido</label>
                        <input type="text" />
                    </div>
                    <div >
                        <label>Teléfono</label>
                        <input type="number" />
                    </div>
                    <div >
                        <label>E-mail</label>
                        <input type="mail" />
                    </div>
                    <div >
                        <label>DNI</label>
                        <input type="number" />
                    </div>
                    <div >
                        <label>Direccion</label>
                        <input type="text" />
                    </div>
                    {
                        dataType === 2 ?
                            <div >
                                <label>Nro de socio</label>
                                <input type="number" />
                            </div>
                            :
                            ""
                    }
                </form>
            </>
        );
    }
    return content;
}
export default CrudForm;