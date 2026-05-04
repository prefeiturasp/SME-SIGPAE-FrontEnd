import moment from "moment";

export const obterLimitesMes = (
  mesAno: string,
): { minDate: Date | null; maxDate: Date | null } => {
  if (!mesAno || !/^\d{2}\/\d{4}$/.test(mesAno)) {
    return { minDate: null, maxDate: null };
  }

  const [mes, ano] = mesAno.split("/").map(Number);
  const minDate = new Date(ano, mes - 1, 1);
  const maxDate = new Date(ano, mes, 0);

  return { minDate, maxDate };
};

export const formataDataISOparaDDMMYYYY = (
  dataISO: string | null,
): string | undefined => {
  if (!dataISO) return undefined;
  const data = moment(dataISO, ["YYYY-MM-DD", "DD/MM/YYYY"]);
  if (!data.isValid()) return undefined;
  return data.format("DD/MM/YYYY");
};
