export const formataOpcoes = (lista) => {
  return lista.map((opcao) => ({
    label: opcao.nome || opcao.iniciais,
    value: opcao.uuid,
  }));
};

export const formataOpcoesDropdown = (lista) => {
  return lista.map(() => ({ active: false }));
};

export const formataNome = (nome) => {
  return nome.slice(0, 40) + (nome.length > 40 ? "..." : "");
};
