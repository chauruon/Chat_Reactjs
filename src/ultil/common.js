import axios from "axios";
import { TOKEN_ADMIN } from "../constant";

export const FETCH_API = async (uri,method,data = null) => {
  let config = {
    method: method,
    url:uri,
    headers: { 
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${TOKEN_ADMIN}`
    },
    data: data
  };
  await axios(config)
  .then(function (response) {
    if (response.status === 200 && response.data !== null ) {
      data = response?.data;
    }
  })
  .catch(function (error) {
    console.debug(`CALL API ERROR: `,error.message);
  });
  return data;
}

export const FETCH_API_CLIENT = async (uri,method,tokenClient,paramData = null) => {
  let data;
  let config = {
    method: method,
    url:uri,
    headers: { 
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${tokenClient}`
    },
    data: paramData
  };
  await axios(config)
  .then(function (response) {
    if (response.data !== null ) {
      data = response?.data;
    }
  })
  .catch(function (error) {
    console.debug(`CALL API ERROR: `,error.message);
  });
  return data;
}
