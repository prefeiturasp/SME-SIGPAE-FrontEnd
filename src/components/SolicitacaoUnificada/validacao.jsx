export const validateSubmit = (values) => {
  let peloMenosUmaEscola = false;
  let error = false;
  values.escolas.forEach(function (escola) {
    if (escola.checked) {
      peloMenosUmaEscola = true;
      if (values.pedido_multiplo) {
        // eslint-disable-next-line
        if (escola.numero_alunos === "0" || escola.numero_alunos == false) {
          error = "Número de alunos de uma escola não pode ser 0 ou nulo";
        } else if (parseInt(escola.numero_alunos) > escola.total_alunos) {
          return `Escola ${escola.nome} possui apenas ${escola.total_alunos}`;
        }
      } else {
        if (
          parseInt(escola.total_alunos) <
          values[`school_${escola.codigo_eol}`].nro_alunos
        ) {
          error = `Escola ${escola.nome} possui apenas ${escola.total_alunos} alunos`;
        }
      }
    }
  });
  if (!peloMenosUmaEscola)
    error = "Pelo menos uma escola precisa ser selecionada";
  return error;
};
