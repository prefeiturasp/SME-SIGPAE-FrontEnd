export const ErrorHandlerFunction = (err) => {
  if (err instanceof Error) {
    let data;
    const responseError = err;
    if (responseError.response) {
      data = {
        data: responseError.response.data,
        status: responseError.response.status,
      };
    } else {
      data = { data: "Error during request", status: 500 };
    }
    return data;
  }
};
