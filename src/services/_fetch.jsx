import authService from "./auth";

const authToken = {
  Authorization: `JWT ${authService.getToken()}`,
  "Content-Type": "application/json",
};

export const fetchPatch = (url, body) => {
  let status = 0;
  return fetch(url, {
    method: "PATCH",
    body: JSON.stringify(body),
    headers: authToken,
  })
    .then((res) => {
      status = res.status;
      return res.json();
    })
    .then((data) => {
      return { data: data, status: status };
    })
    .catch((error) => {
      return error.json();
    });
};

export const fetchGet = (url) => {
  let status = 0;
  return fetch(url, {
    method: "GET",
    headers: authToken,
  })
    .then((res) => {
      status = res.status;
      return res.json();
    })
    .then((data) => {
      return { data: data, status: status };
    })
    .catch((error) => {
      return error.json();
    });
};

export const fetchPost = (url, body) => {
  let status = 0;
  return fetch(url, {
    method: "POST",
    body: JSON.stringify(body),
    headers: authToken,
  })
    .then((res) => {
      status = res.status;
      return res.json();
    })
    .then((data) => {
      return { data: data, status: status };
    })
    .catch((error) => {
      return error.json();
    });
};
