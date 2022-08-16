import axios from "axios";

const instance = axios.create({
  baseURL: "https://shoppe-b-end.herokuapp.com",
});

export default instance;
