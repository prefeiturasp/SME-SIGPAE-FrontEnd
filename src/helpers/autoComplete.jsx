export const getListaFiltradaAutoComplete = (
  lista,
  valorFiltro,
  regex = "iu"
) => {
  if (valorFiltro) {
    const reg = new RegExp(valorFiltro, regex);
    const listaUnica = Array.from(new Set(lista));
    return listaUnica.filter((e) => reg.test(e));
  }
  return [];
};
