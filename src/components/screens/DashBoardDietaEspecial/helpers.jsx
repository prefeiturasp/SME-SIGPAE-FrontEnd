export const extrairStatusDaSolicitacaoURL = (urlParaSeparar) => {
  let arrayDeStrings = urlParaSeparar.split("/");
  return arrayDeStrings[arrayDeStrings.length - 1];
};
