import getAxios from "./src/services/_base";

const axios = getAxios();

const response = axios.get("https://postman-echo.com/get");

console.log(response);
