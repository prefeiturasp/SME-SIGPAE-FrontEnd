const getDaysArray = (start, end) => {
  let arr = [];
  for (
    let dt = new Date(start);
    dt <= new Date(end);
    dt.setDate(dt.getDate() + 1)
  ) {
    arr.push(new Date(dt).toISOString().split("T")[0]);
  }
  return arr;
};

export const formataValues = (values) => {
  if (values.data_inicial && values.data_final) {
    values.datas_intervalo = getDaysArray(
      values.data_inicial.split("/").reverse().join("-"),
      values.data_final.split("/").reverse().join("-"),
    ).map((data) => ({ data: data }));
  } else if (values.alterar_dia) {
    values.datas_intervalo = getDaysArray(
      values.alterar_dia.split("/").reverse().join("-"),
      values.alterar_dia.split("/").reverse().join("-"),
    ).map((data) => ({ data: data }));
  }
  return values;
};
