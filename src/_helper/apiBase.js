import Axios from 'axios';
import Cookies from 'js-cookie';

// Api Headers
function setHeader() {
  const _headers = {
    headers: {
      'Content-Type': 'application/json',
    },
  };
  if (Cookies.get('token')) {
    _headers['headers']['Authorization'] = `Bearer ${Cookies.get('token')}`;
  }
  return _headers;
}
function mutipartHeader() {
  const _headers = {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  };
  if (Cookies.get('token')) {
    _headers['headers']['Authorization'] = `Bearer ${Cookies.get('token')}`;
  }
  return _headers;
}

// API fetch Base
export async function fetcher(method, url, params) {
  try {
    let response;

    if (method == 'GET') {
      const updateHeader = setHeader();
      updateHeader['params'] = params;
      response = await Axios.get(`${process.env.BASE_API_URL}${url}`, updateHeader);
    } else {
      response = await Axios.post(`${process.env.BASE_API_URL}${url}`, params, setHeader());
    }

    if (response.data.status == 1) {
      return successResponse(response.data);
    } else {
      return errorResponse(response.data);
    }
  } catch (err) {
    return errorResponse({ resultMessage: err });
  }
}

export async function filesFetch(method, url, params) {
  try {
    let response;
    if (method == 'GET') {
      const updateHeader = mutipartHeader();
      updateHeader['params'] = params;
      response = await Axios.get(`${process.env.BASE_API_URL}${url}`, updateHeader);
    } else {
      const formData = new FormData();
      Object.keys(params).forEach((key) => formData.append(key, params[key]));
      response = await Axios.post(`${process.env.BASE_API_URL}${url}`, formData, mutipartHeader());
    }
    if (response.data.status == 1) {
      return successResponse(response.data);
    } else {
      return errorResponse(response.data);
    }
  } catch (err) {
    return errorResponse({ resultMessage: err });
  }
}

function successResponse(response) {
  return {
    status: true,
    data: response?.result,
    message: response?.message,
  };
}

function errorResponse(response) {
  return {
    status: false,
    data: null,
    message: response.resultMessage.response.data.message,
  };
}
