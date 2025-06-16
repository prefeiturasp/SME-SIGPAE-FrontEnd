export const formataComoEventos = (diasSobremesaDoce) => {
  const datas = [];
  const eventos = [];
  diasSobremesaDoce.forEach((diaSobremesaDoce) => {
    if (!datas.includes(diaSobremesaDoce.data)) {
      datas.push(diaSobremesaDoce.data);
    }
  });
  datas.forEach((data) => {
    const tiposUnidadesMesmoDia = [];
    const diasSobremesaDoceMesmoDia = diasSobremesaDoce.filter(
      (diaSobremesaDoce) => diaSobremesaDoce.data === data
    );
    diasSobremesaDoceMesmoDia.forEach((diaSobremesaDoce) => {
      if (
        !tiposUnidadesMesmoDia.includes(diaSobremesaDoce.tipo_unidade.iniciais)
      ) {
        tiposUnidadesMesmoDia.push(diaSobremesaDoce.tipo_unidade.iniciais);
      }
    });

    tiposUnidadesMesmoDia.forEach((tipoUnidade) => {
      const diasSobremesaDoceMesmoDiaETipoUnidade =
        diasSobremesaDoceMesmoDia.filter(
          (diaSobremesaDoce) =>
            diaSobremesaDoce.tipo_unidade.iniciais === tipoUnidade
        );
      let editais_numeros = "";
      let editais_numeros_virgula = "";
      let editais_uuids = [];
      diasSobremesaDoceMesmoDiaETipoUnidade.forEach(
        (diaSobremesaDoceMesmoDiaETipoUnidade) => {
          editais_numeros += `\x0A${diaSobremesaDoceMesmoDiaETipoUnidade.edital_numero}`;
          editais_numeros_virgula += `, ${diaSobremesaDoceMesmoDiaETipoUnidade.edital_numero}`;
          editais_uuids.push(diaSobremesaDoceMesmoDiaETipoUnidade.edital);
        }
      );
      eventos.push({
        title: diasSobremesaDoceMesmoDiaETipoUnidade[0].tipo_unidade.iniciais,
        tipo_unidade: diasSobremesaDoceMesmoDiaETipoUnidade[0].tipo_unidade,
        data: diasSobremesaDoceMesmoDiaETipoUnidade[0].data,
        start: new Date(
          parseInt(diasSobremesaDoceMesmoDiaETipoUnidade[0].data.split("/")[2]),
          parseInt(
            diasSobremesaDoceMesmoDiaETipoUnidade[0].data.split("/")[1]
          ) - 1,
          parseInt(diasSobremesaDoceMesmoDiaETipoUnidade[0].data.split("/")[0]),
          0
        ),
        end: new Date(
          parseInt(diasSobremesaDoceMesmoDiaETipoUnidade[0].data.split("/")[2]),
          parseInt(
            diasSobremesaDoceMesmoDiaETipoUnidade[0].data.split("/")[1]
          ) - 1,
          parseInt(diasSobremesaDoceMesmoDiaETipoUnidade[0].data.split("/")[0]),
          1
        ),
        allDay: true,
        criado_por: diasSobremesaDoceMesmoDiaETipoUnidade[0].criado_por,
        criado_em: diasSobremesaDoceMesmoDiaETipoUnidade[0].criado_em,
        uuid: diasSobremesaDoceMesmoDiaETipoUnidade[0].uuid,
        editais_numeros: editais_numeros,
        editais_numeros_virgula: editais_numeros_virgula,
        editais_uuids: editais_uuids,
      });
    });
  });
  return eventos;
};
