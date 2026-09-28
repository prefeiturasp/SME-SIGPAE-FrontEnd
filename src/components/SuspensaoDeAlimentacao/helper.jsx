export const extrairTiposALimentacao = (tiposAlimentacao) => {
  let uuidsTiposAlimentacao = [];
  tiposAlimentacao.forEach((tipoAlimentacao) => {
    uuidsTiposAlimentacao.push(tipoAlimentacao.uuid);
  });
  return uuidsTiposAlimentacao;
};
