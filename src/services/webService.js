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

const remove = (dataType, id) => {
  return http.delete(`/${dataType}/${id}`);
};

const removeAll = (dataType) => {
  return http.delete(`/${dataType}`);
};

const findByLastName = (dataType, last_name) => {
  return http.get(`/${dataType}?last_name=${last_name}`);
};

const exportedObject = {
  getAll,
  get,
  create,
  update,
  remove,
  removeAll,
  findByLastName
}


export default exportedObject;