export const stringToBoolean = (str) =>
  str === "1" ? true : str === "0" ? false : undefined;
export const booleanToString = (str) =>
  str === true ? "1" : str === false ? "0" : undefined;
export const numberToStringDecimal = (num) => num?.toString().replace(".", ",");
export const numberToStringDecimalMonetario = (num) =>
  num?.toFixed(2).replace(".", ",");
export const stringDecimalToNumber = (str) =>
  str === "0"
    ? Number(str)
    : Number(str?.replaceAll(".", "").replace(",", ".")) || null;
export const stringNaoVaziaOuUndefined = (value) => {
  let valor = value ? value.toString() : undefined;
  return valor && valor.length > 0 ? valor : undefined;
};
