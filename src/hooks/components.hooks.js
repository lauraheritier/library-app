import React, { useState, useEffect } from "react";
import service from '../services/webService';
import ReactDOM from 'react-dom';
import { Page, Text, View, Document, StyleSheet, PDFViewer } from '@react-pdf/renderer';
import {
    FaBook,
    FaConnectdevelop,
    FaGlobeAmericas,
    FaFilm,
    FaGamepad,
    FaMusic,
    FaReadme,
    FaNewspaper,
    FaRegCreditCard
} from 'react-icons/fa';
import XLSX from 'xlsx';
import helper from '../helpers/formatDate.helper';
import App from '../App';
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

    return [result, setResult, isLoading];
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
            selectedItem1Id = item._id;
        });
    }
    if (item2 !== null) {
        item2 = [item2];
        item2.map((item, index) => {
            selectedItem2Description = item.description;
            selectedItem2Id = item._id;
        });
    }
    if (item3 !== null) {
        item3 = [item3];
        item3.map((item, index) => {
            selectedItem3Description = item.description;
            selectedItem3Id = item._id;
        });
    }
    console.log("el selected id para los publishers", selectedItem2Id);
    return [selectedItem1Description, selectedItem2Description, selectedItem3Description,
        selectedItem1Id, selectedItem2Id, selectedItem3Id
    ];
}

//Retrieve all items 
export function useGetHelperObjects(item) {
    const [results, setResults] = useState([]);
    const [unfilteredData, setUnfilteredData] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    useEffect(() => {
        const fetchData = () => {
            if (item !== null) {
                service.getAll(item)
                        .then(response => {
                            setUnfilteredData(response.data);
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
    }, []);
    //  console.log("el response data", result);
    console.log("el loading", isLoading);

    return [isLoading, results, unfilteredData, setResults, setUnfilteredData];
}

export function useClearFields(item, isUpdate) {
    if (item === 'books') {
        document.getElementsByName("title")[0].value = '';
        document.getElementsByName("isbn")[0].value = '';
        document.getElementsByName("sample")[0].value = 1;
        document.getElementsByName("author")[0].value = '';
        document.getElementsByName("publisher")[0].value = '';
        document.getElementsByName("category")[0].value = '';
        document.getElementsByName("support")[0].value = '';
        document.getElementsByName("read")[0].checked = false;
    }
    if (item === 'borrowings') {
        if (!isUpdate) {
            document.getElementsByName('member')[0].value = '';
            document.getElementsByName('book')[0].value = '';
        }
        document.getElementsByName('toDate')[0].value = helper.formatDate(null, true, false);
    }
    if (item === 'categories') {
        document.getElementById('category-description').value = '';
    }
    if (item === 'supports') {
        document.getElementById('support-description').value = '';
    }
    if (item === 'publishers') {
        document.getElementById('publisher-description').value = '';
        document.getElementsByName('url')[0].value = '';
    }
    if (item === 'members') {
        document.getElementsByName('first_name')[0].value = '';
        document.getElementsByName('last_name')[0].value = '';
        document.getElementsByName('telephone')[0].value = '';
        document.getElementsByName('email')[0].value = '';
        document.getElementsByName('dni')[0].value = '';
        document.getElementsByName('address')[0].value = '';
    }

}

export function useCreateOrUpdate(dataType, isCreate, item, props) {
    console.log("Como está el isCreate", isCreate);
    if (!isCreate) {
        console.log("pasó x el is create común??")
        if (dataType === 'borrowings') {
            console.log("pasa por datatype borrowings", item, "y las props", props);
            service.giveBack(dataType, item, true);
            service.create(dataType, props);
            return true;
        }
        return service.update(dataType, item, props)

    } else {
        console.log("va a entrar al sendpost request", props);
        return sendPostRequest(dataType, props);
    }
}

const sendPostRequest = async(dataType, props) => {
    let result = false;
    try {
        const resp = await service.create(dataType, props);
        console.log("manda true", resp);
        console.log("recurso guardado muy bien");
        result = true;
    } catch (err) {
        result = false;
    }
    console.log("como es el result", result);
    return result;
}

export function handleReport(tableId, removeColumn, range) {
    console.log("pasa por handlereport");
    console.log("el table id", tableId);
    const sheet = XLSX.utils.table_to_sheet(tableId);
    console.log("la hoja de cálculo", sheet);
    if (removeColumn) {
        let object = sheet,
            key;
        for (key in object) {
            if (key.startsWith(range)) {
                delete(sheet[key]);
            }
        }
    }
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, sheet, 'Hoja 1');
    XLSX.writeFile(workbook, 'inventario.xlsx');
}

export function useFilterOnChange(filterObject, dataType, data) {
    let results;
    if (dataType === 'books') {
        results = data.filter(function(f) {
            let isbnString = f.isbn + '';
            let samplesString = f.sample + '';
            let availableSamplesString = f.availableSamples + '';
            let item1 = [f.category];
            let item2 = [f.publisher];
            let item3 = [f.support];
            let catDesc;
            let pubDesc;
            let supDesc;
            let tagsArray = [];
           f.tags.forEach(tag => tagsArray.push(tag.text));
            let filtered = tagsArray.filter(function(str) {return str.includes(filterObject.toLowerCase())});
            (item1).map(cat => catDesc = cat.description);
            (item2).map(pub => pubDesc = pub.description);
            (item3).map(sup => supDesc = sup.description);
            let uniqueTag = '';
            tagsArray.map((d, idx) => { if ((d.toLowerCase()).includes(filterObject.toLowerCase())) { return uniqueTag = d.toLowerCase();}});
                        
            return ((f.title).toLowerCase()).includes(filterObject.toLowerCase()) ||
                (f.author.toLowerCase()).includes(filterObject.toLowerCase()) ||
                (isbnString.toLowerCase()).includes(filterObject.toLowerCase()) ||
                (uniqueTag.toLowerCase()).includes(filterObject.toLowerCase()) ||
               (samplesString.toLowerCase()).includes(filterObject.toLowerCase()) ||
                (availableSamplesString.toLowerCase()).includes(filterObject.toLowerCase()) ||
                (catDesc.toLowerCase()).includes(filterObject.toLowerCase()) ||
                (supDesc.toLowerCase()).includes(filterObject.toLowerCase()) ||
                (pubDesc.toLowerCase()).includes(filterObject.toLowerCase())

        });
    }
    if (dataType === 'borrowings') {
        results = data.filter(function(f) {
            let members = [f.member];
            let books = [f.book];
            let name;
            let memberId;
            let bookTitle;
            (members).map(m => {
                name = m.first_name + ' ' + m.last_name;
                memberId = m.membership_id + '';
            });
            (books).map(b => bookTitle = b.title);

            return ((memberId.toLowerCase()).includes(filterObject.toLowerCase())) ||
                (name.toLowerCase()).includes(filterObject.toLowerCase()) ||
                (bookTitle.toLowerCase()).includes(filterObject.toLowerCase())

        });
    }
    if (dataType === 'categories' || dataType === 'supports' || dataType === 'publishers') {
        results = data.filter(function(dat) {
            return ((dat.description).toLowerCase()).includes(filterObject.toLowerCase());
        });
    }    
    if (dataType === 'members') {
        results = data.filter(function(dat) {
            let dniString = dat.dni + '';
            return ((dat['last_name']).toLowerCase()).includes(filterObject.toLowerCase()) ||
                (dat['first_name'].toLowerCase()).includes(filterObject.toLowerCase()) ||
                (dniString.toLowerCase()).includes(filterObject.toLowerCase()) ||
                (dat['membership_id'].toLowerCase()).includes(filterObject.toLowerCase()) ||
                ((dat['email']).toLowerCase()).includes(filterObject.toLowerCase());
        });
    }
    return results;
}

export function useHandleReturn(borrowId, returnBook) {
    let result;
    console.log("el borrow id con el return book", borrowId, returnBook);
    service.updateAvailableResources('books', returnBook, true, true);
    console.log("pasó por ahí, ahora pasa x giveback");
    result = service.giveBack('borrowings', borrowId, true);
    return result;
}

export function setReactIcons(description) {
    let result;
    switch (description) {
        case 'Libro':
            result = < FaBook / > ;
            break;
        case 'Recuso electrónico':
            result = < FaConnectdevelop / > ;
            break;
        case 'Material cartográfico':
            result = < FaGlobeAmericas / > ;
            break;
        case 'Película':
            result = < FaFilm / >
                break;
        case 'Juego':
            result = < FaGamepad / >
                break;
        case 'Grabación':
            result = < FaMusic / >
                break;
        case 'Revista':
            result = < FaReadme / >
                break;
        case 'Periódico':
            result = < FaNewspaper / >
                break;
        default:
            result = < FaRegCreditCard / >
                break;
    }
    return result;
}



const exportedHooks = {
    useGetDataById,
    useSortSelectedOptionsToUpdate,
    useGetHelperObjects,
    useClearFields,
    useCreateOrUpdate,
    setReactIcons,
    handleReport,
    useFilterOnChange,
    useHandleReturn
}


export default exportedHooks;