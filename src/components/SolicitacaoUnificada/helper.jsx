export const extrairKitsLanche = (kits) => {
  let listaKits = [];
  kits.forEach((element) => {
    listaKits.push(element.uuid);
  });
  return listaKits;
};

export const formatarSubmissao = (formValues, dadosUsuario) => {
  const escolas_quantidades = [];
  formValues.unidades_escolares.forEach((ue) => {
    const eq_formatada = {
      escola: ue.uuid,
      kits: ue.kits_selecionados,
      quantidade_alunos: ue.nmr_alunos,
      tempo_passeio: ue.quantidade_kits - 1,
    };
    escolas_quantidades.push(eq_formatada);
  });
  let payload = {
    diretoria_regional: dadosUsuario.vinculo_atual.instituicao.uuid,
    lista_kit_lanche_igual: false,
    escolas_quantidades,
    local: formValues.local,
    evento: formValues.evento,
    solicitacao_kit_lanche: {
      data: formValues.data,
      descricao: formValues.descricao || "<p></p>",
      kits: [],
    },
  };
  return payload;
};
