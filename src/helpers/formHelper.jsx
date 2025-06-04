// lista = state que controla o numero de elementos no form (ex.: form de multiplos contatos, etapas)
// listaChaves = nome das chaves a serem manipuladas no values
// values = objeto values do react-final-form
// indexDeletado = index do elemento deletado
export const deletaValues = (lista, listaChaves, values, indexDeletado) => {
  for (let index = indexDeletado; index < lista.length; index++) {
    listaChaves.forEach((chave) => {
      values[`${chave}_${index}`] = values[`${chave}_${index + 1}`];
    });
  }
};
