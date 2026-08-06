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
      (diaSobremesaDoce) => diaSobremesaDoce.data === data,
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
            diaSobremesaDoce.tipo_unidade.iniciais === tipoUnidade,
        );
      let editais_numeros = "";
      let editais_numeros_virgula = "";
      let editais_uuids = [];
      diasSobremesaDoceMesmoDiaETipoUnidade.forEach(
        (diaSobremesaDoceMesmoDiaETipoUnidade) => {
          editais_numeros += `\x0A${diaSobremesaDoceMesmoDiaETipoUnidade.edital_numero}`;
          editais_numeros_virgula += `, ${diaSobremesaDoceMesmoDiaETipoUnidade.edital_numero}`;
          editais_uuids.push(diaSobremesaDoceMesmoDiaETipoUnidade.edital);
        },
      );
      const primeiro = diasSobremesaDoceMesmoDiaETipoUnidade[0];
      const tituloBase = primeiro.tipo_unidade.iniciais;
      const ehSobremesaAF = primeiro.tipo?.nome === "Sobremesa AF";
      eventos.push({
        title: ehSobremesaAF ? `Sob. AF - ${tituloBase}` : tituloBase,
        tipo_unidade: primeiro.tipo_unidade,
        tipo: primeiro.tipo,
        data: primeiro.data,
        start: new Date(
          parseInt(primeiro.data.split("/")[2]),
          parseInt(primeiro.data.split("/")[1]) - 1,
          parseInt(primeiro.data.split("/")[0]),
          0,
        ),
        end: new Date(
          parseInt(primeiro.data.split("/")[2]),
          parseInt(primeiro.data.split("/")[1]) - 1,
          parseInt(primeiro.data.split("/")[0]),
          1,
        ),
        allDay: true,
        criado_por: primeiro.criado_por,
        criado_em: primeiro.criado_em,
        uuid: primeiro.uuid,
        editais_numeros: editais_numeros,
        editais_numeros_virgula: editais_numeros_virgula,
        editais_uuids: editais_uuids,
      });
    });
  });
  return eventos;
};
