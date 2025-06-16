export const retornaHomologacoesComContadorDePaginacoes = (homologacoes) => {
  let listagemTemp = [];
  let listagemPaginacao = [];
  homologacoes.forEach((homolog) => {
    if (listagemTemp.length <= 10) {
      homolog["ativo"] = false;
      listagemTemp.push(homolog);
    } else {
      listagemPaginacao.push(listagemTemp);
      listagemTemp = [homolog];
    }
  });
  if (listagemTemp.length > 1) {
    listagemPaginacao.push(listagemTemp);
  }
  return listagemPaginacao;
};
