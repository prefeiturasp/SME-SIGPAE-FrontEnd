export const formataComoEventos = (objetos) => {
  const eventos = [];
  (objetos || []).forEach((objeto) => {
    const [dia, mes, ano] = objeto.data.split("/").map(Number);

    const tiposIniciais = objeto.tipos_unidade_escolar
      .map((t) => t.iniciais)
      .join(", ");

    const lotesIniciais = objeto.lotes.map((l) => l.iniciais).join(", ");

    const periodosNomes = objeto.periodos_escolares
      .map((p) => p.nome)
      .join(", ");

    const editaisNumerosFormatado = (objeto.editais_numeros || []).join("\n");
    const editaisNumerosVirgula = (objeto.editais_numeros || []).join(", ");

    eventos.push({
      title: `Dia Letivo: ${tiposIniciais}`,
      uuid: objeto.uuid,
      data: objeto.data,
      start: new Date(ano, mes - 1, dia, 0),
      end: new Date(ano, mes - 1, dia, 1),
      allDay: true,
      lotes: lotesIniciais,
      tipos_unidade_escolar: tiposIniciais,
      periodos_escolares: periodosNomes,
      unidades_escolares: objeto.unidades_escolares,
      editais_numeros: editaisNumerosFormatado,
      editais_numeros_virgula: editaisNumerosVirgula,
    });
  });
  return eventos;
};
