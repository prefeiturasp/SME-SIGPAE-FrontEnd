export const getListaFiltradaAutoCompleteSelect = (
  lista,
  valorFiltro = "",
  exibirListaCompleta = false,
  regex = "iu"
) => {
  const listaUnica = Array.from(new Set(lista)).map((e) => {
    return { value: e };
  });

  if (valorFiltro) {
    const valorFiltroEscapado = escaparRegex(valorFiltro);
    const reg = new RegExp(valorFiltroEscapado, regex);
    return listaUnica.filter((e) => reg.test(e.value));
  }

  return exibirListaCompleta ? listaUnica : [];
};

function escaparRegex(texto) {
  return texto.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}
