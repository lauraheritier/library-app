import http from "../http-common";
import serpApi from "../http-api";

const getAll = (dataType) => {
    console.log("un data type para el getAll", dataType);
  return http.get(`/${dataType}`);
};

const get = (dataType, id) => {
  console.log("pasa por el get solo");
  return http.get(`/${dataType}/${id}`);
};

const getQuote = (author, title, isbn) => {
  
  
  return serpApi.get(`/serpApi/${author}/${title}/${isbn}`);
}


const create = (dataType, data) => {
  return http.post(`/${dataType}`, data);
};

const update = (dataType, id, data) => {
    console.log("los datos en axios: ", data);
  return http.put(`/${dataType}/${id}`, data);
};

const giveBack = (dataType, id, cancelled) => {
  return http.put(`/${dataType}/${id}/${cancelled}`);
}

const updateIsActive = (dataType, id) => {
  return http.put(`/${dataType}/${id}/isActive`)
}

const updateAvailableResources = (dataType, id, data, returnBack) => {
  console.log("pasó x el updateavailable");
  return http.put(`/${dataType}/${id}/${data}/${returnBack}`)
 
}

const remove = (dataType, id) => {
  return http.delete(`/${dataType}/${id}`);
};

const getReadBooks = (dataType) => {
  return http.get(`/${dataType}/readBooks`);
}
  const removeAll = (dataType) => {
  return http.delete(`/${dataType}`);
};


const borrowingsPerMember = (dataType, member, group) => {
  return http.get(`/${dataType}/${member}/${group}`);
}




const exportedObject = {
  getAll,
  get,
  create,
  update,
  remove,
  removeAll,
  getReadBooks,
  updateAvailableResources,
  giveBack,
  updateIsActive,
  borrowingsPerMember,
  getQuote
}


export default exportedObject;