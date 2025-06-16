export const adicionarParametroAtivo = (lotes) => {
  return lotes.map((element) => {
    element["ativo"] = false;
    return element;
  });
};
