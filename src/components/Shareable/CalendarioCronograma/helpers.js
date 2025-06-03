export const formataComoEventos = (etapas) => {
  const eventos = [];
  etapas.forEach((etapa) => {
    eventos.push({
      title: etapa.nome_produto,
      data: etapa.data_programada,
      start: new Date(
        parseInt(etapa.data_programada.split("/")[2]),
        parseInt(etapa.data_programada.split("/")[1]) - 1,
        parseInt(etapa.data_programada.split("/")[0]),
        0
      ),
      end: new Date(
        parseInt(etapa.data_programada.split("/")[2]),
        parseInt(etapa.data_programada.split("/")[1]) - 1,
        parseInt(etapa.data_programada.split("/")[0]),
        1
      ),
      allDay: true,
      objeto: etapa,
    });
  });
  return eventos;
};
