import React, { useState, useEffect } from "react";
import service from '../services/webService';

//Retrieve one item (to update)
export function useGetDataById(dataType, item) {
    const [result, setResult] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    useEffect(() => {
        const fetchData = () => {
            console.log("el data type antes de ir al service", item, dataType);
            service.get(dataType, item)
                .then(response => {
                    setResult(response.data);
                    if (result !== [])
                        setIsLoading(false)

                    // return result;
                })
                .catch(e => {
                    console.log("ERROR!!! ", e);
                });
        }
        fetchData();
        //  console.log("el result en el hook", result);
    }, [isLoading]);
    console.log("el response data", result);
    console.log("el loading", isLoading);

    return [result, isLoading];
}

export function useSortSelectedOptionsToUpdate(item1, item2, item3) {
    let selectedItem1Description;
    let selectedItem2Description;
    let selectedItem3Description;
    let selectedItem1Id;
    let selectedItem2Id;
    let selectedItem3Id;

    if (item1 !== null) {
        item1 = [item1];
        item1.map((item, index) => {
            selectedItem1Description = item.description;
            selectedItem1Id = item.id;
        });
    }
    if (item2 !== null) {
        item2 = [item2];
        item2.map((item, index) => {
            selectedItem2Description = item.description;
            selectedItem2Id = item.id;
        });
    }
    if (item3 !== null) {
        item3 = [item3];
        item3.map((item, index) => {
            selectedItem3Description = item.description;
            selectedItem3Id = item.id;
        });
    }

    return [selectedItem1Description, selectedItem2Description, selectedItem3Description,
        selectedItem1Id, selectedItem2Id, selectedItem3Id];
}


export function useGetHelperObjects(item) {
    const [results, setResults] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    useEffect(() => {
        const fetchData = () => {
            if (item !== null) {
                service.getAll(item)
                    .then(response => {
                        setResults(response.data);
                        if (results !== []) {
                            console.log("los results items: ", results, "y los items ", item)
                            setIsLoading(false)
                        }
                    })
                    .catch(e => {
                        console.log("ERROR!!! ", e);
                    });
            }
        }
        fetchData();
        //  console.log("el result en el hook", result);
    }, [isLoading]);
    //  console.log("el response data", result);
    console.log("el loading", isLoading);

    return [isLoading, results];
}

export function useClearFields(item) {
    if (item === 'books') {
        document.getElementsByName("title")[0].value = '';
        document.getElementsByName("isbn")[0].value = '';
        document.getElementsByName("sample")[0].value = 1;
        document.getElementsByName("author")[0].value = '';
        document.getElementsByName("publisher")[0].value = '-1';
        document.getElementsByName("category")[0].value = '-1';
        document.getElementsByName("support")[0].value = '-1';
        document.getElementsByName("libraryOnly")[0].checked = false;
    }
}

export function useCreateOrUpdate(dataType, isCreate, item, props) {
    if (!isCreate) {        
      return  service.update(dataType, item, props)

    } else {
     return sendPostRequest(dataType, props);
    }    
    //useClearFields('books');
 //  console.log("qué devuelve el result gral", result);    
  //  return result;
    
}

const sendPostRequest = async (dataType, props) => {
    let result = false;
    try {
        const resp = await service.create(dataType, props);
        console.log("manda true", resp);
        console.log("recurso guardado muy bien");
        result = true;
    }
    catch (err) {
        result = false;
    }
    console.log("como es el result", result);
    return result;
}

const exportedObject = {
    useGetDataById,
    useSortSelectedOptionsToUpdate,
    useGetHelperObjects,
    useClearFields,
    useCreateOrUpdate
}


export default exportedObject;