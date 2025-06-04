export const formataOpcoes = (data) => {
  return data.map((obj) => obj.nome);
};

export const formataPayload = (formValues) => {
  let params = `?`;
  const formKeys = Object.keys(formValues);
  if (formKeys.includes("nome_produto")) {
    params = params + `nome_produto=${formValues.nome_produto}`;
  }
  if (formKeys.includes("nome_marca")) {
    params = params + `&nome_marca=${formValues.nome_marca}`;
  }
  if (formKeys.includes("nome_fabricante")) {
    params = params + `&nome_fabricante=${formValues.nome_fabricante}`;
  }
  return params;
};
