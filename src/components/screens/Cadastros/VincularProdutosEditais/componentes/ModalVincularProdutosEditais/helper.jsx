export const formataEditais = (editais) => {
  let editais_string = "";
  for (let index = 0; index < editais.length; index++) {
    if (index !== 0) {
      editais_string = `${editais_string};${editais[index]}`;
    } else {
      editais_string = editais[index];
    }
  }
  return editais_string;
};

export const formatarOpcoes = (produtosEditais) => {
  const treeData = [];
  let produtosFormatados = [];
  for (let index = 0; index < produtosEditais.length; index++) {
    const produtoEdital = produtosEditais[index];
    if (!produtosFormatados.includes(produtoEdital.produto.nome)) {
      produtosFormatados.push(produtoEdital.produto.nome);
      let listaNomesIguais = produtosEditais.filter(
        (pe) => pe.produto.nome === produtoEdital.produto.nome
      );
      let marcasFabricantes = listaNomesIguais.map((pe) => {
        return {
          title: pe.marca.nome,
          value: pe.uuid,
          key: pe.uuid,
          todos: false,
        };
      });
      treeData.push({
        title: produtoEdital.produto.nome,
        value: produtoEdital.produto.nome,
        key: produtoEdital.produto.nome,
        todos: true,
        children: marcasFabricantes,
      });
    }
  }
  return treeData;
};

export const validatePayload = (payload) => {
  let keys = Object.keys(payload);

  let erros = {
    editalOrigem: false,
    editaisDestino: false,
    tipoProduto: false,
    produtos: false,
    tipoProdutoEditalOrigem: false,
  };

  if (
    !keys.includes("edital_origem") ||
    payload["edital_origem"].length === 0
  ) {
    erros["editalOrigem"] = true;
  }
  if (
    !keys.includes("editais_destino_selecionados") ||
    payload["editais_destino_selecionados"].length === 0
  ) {
    erros["editaisDestino"] = true;
  }
  if (!keys.includes("tipo_produto") || payload["tipo_produto"].length === 0) {
    erros["tipoProduto"] = true;
  }
  if (
    !keys.includes("produtos_editais") ||
    payload["produtos_editais"].length === 0
  ) {
    erros["produtos"] = true;
  }
  if (
    !keys.includes("tipo_produto_edital_origem") ||
    payload["tipo_produto_edital_origem"].length === 0
  ) {
    erros["tipoProdutoEditalOrigem"] = true;
  }

  return erros;
};
