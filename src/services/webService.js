import http from "../http-common";

const getAll = (dataType) => {
    console.log("un data type para el getAll", dataType);
  return http.get(`/${dataType}`);
};

const get = (dataType, id) => {
  return http.get(`/${dataType}/${id}`);
};


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

const getLibraryOnly = (dataType) => {
  return http.get(`/${dataType}/libraryOnly`);
}
  const removeAll = (dataType) => {
  return http.delete(`/${dataType}`);
};


const borrowingsPerMember = (dataType, member, group) => {
  return http.get(`/${dataType}/${member}/${group}`);
}


/**REPORTS */



const exportedObject = {
  getAll,
  get,
  create,
  update,
  remove,
  removeAll,
  getLibraryOnly,
  updateAvailableResources,
  giveBack,
  updateIsActive,
  borrowingsPerMember
}


export default exportedObject;