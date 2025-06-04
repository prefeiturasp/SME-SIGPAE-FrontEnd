import {
  usuarioEhEscolaTerceirizadaDiretor,
  usuarioEhEscolaTerceirizada,
  usuarioEhEmpresaTerceirizada,
} from "src/helpers/utilities";

export const getInitalState = (editais) => {
  if (usuarioEhEscolaTerceirizada() || usuarioEhEscolaTerceirizadaDiretor()) {
    return {
      agrupado_por_nome_e_marca: false,
      nome_edital: editais[0],
    };
  } else if (usuarioEhEmpresaTerceirizada()) {
    return {
      agrupado_por_nome_e_marca: false,
    };
  } else {
    return { agrupado_por_nome_e_marca: false };
  }
};

const onlyUnique = (value, index, self) => {
  return self.indexOf(value) === index;
};

export const formataResultado = (produtos) => {
  let resultado = [];
  produtos.forEach((element) => {
    let jaFoiAgrupado = resultado.find((e) => e.nome === element.nome);
    if (jaFoiAgrupado === undefined) {
      let produtosComMesmoNome = produtos.filter(
        (produto) => produto.nome === element.nome
      );
      let marcas = produtosComMesmoNome
        .map((produto) => produto.marca)
        .filter(onlyUnique);
      let editais = produtosComMesmoNome
        .map((produto) => produto.edital)
        .filter(onlyUnique);
      resultado.push({
        nome: element.nome,
        marcas: marcas,
        editais: editais,
      });
    }
  });
  return resultado;
};
