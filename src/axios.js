import axios from "axios";

const instance = axios.create({
  baseURL: "http://localhost:5001/clone-cee60/us-central1/api", // The API URL / CLOUD FUNCTION
});

export default instance;
