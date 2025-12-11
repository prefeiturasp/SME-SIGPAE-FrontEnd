import { EtapaCalendario } from "src/interfaces/pre_recebimento.interface";
import { ItemCalendario } from "./interfaces";

export const formataComoEventos = (
  etapas: EtapaCalendario[],
): ItemCalendario<EtapaCalendario>[] => {
  const eventos: ItemCalendario<EtapaCalendario>[] = [];
  etapas.forEach((etapa: EtapaCalendario) => {
    const evento: any = {
      title: etapa.nome_produto,
      data: etapa.data_programada,
      start: new Date(
        parseInt(etapa.data_programada.split("/")[2]),
        parseInt(etapa.data_programada.split("/")[1]) - 1,
        parseInt(etapa.data_programada.split("/")[0]),
        0,
      ),
      end: new Date(
        parseInt(etapa.data_programada.split("/")[2]),
        parseInt(etapa.data_programada.split("/")[1]) - 1,
        parseInt(etapa.data_programada.split("/")[0]),
        1,
      ),
      allDay: true,
      objeto: etapa,
    };

    if (
      etapa.programa_leve_leite !== null &&
      etapa.programa_leve_leite !== undefined
    ) {
      evento.programa_leve_leite = etapa.programa_leve_leite;
    }

    eventos.push(evento);
  });
  return eventos;
};
