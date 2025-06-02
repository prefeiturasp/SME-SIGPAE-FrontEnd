export const formataMotivos = (motivos) => {
  let motivosFormatados = [];
  motivos.forEach((motivo) => {
    motivosFormatados.push({ uuid: motivo.id, nome: motivo.descricao });
  });
  return motivosFormatados;
};
