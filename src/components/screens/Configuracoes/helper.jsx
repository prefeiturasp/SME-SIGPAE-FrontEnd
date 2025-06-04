export const getOptions = (templates) => {
  const retorno = [{ nome: "Selecione", uuid: "Selecione" }];
  const temps = templates.map((template) => {
    return { nome: template.assunto, uuid: template.uuid };
  });
  return retorno.concat(temps);
};
