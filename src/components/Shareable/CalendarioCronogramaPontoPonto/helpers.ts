import {
  EtapaCalendario,
  ItemCalendario,
} from "src/interfaces/pre_recebimento.interface";

interface ObjetoCalendario {
  uuid: string;
  numero: string;
  produto: string;
  fornecedor: string;
  empenho: string;
  unidade_medida: string;
  local: string;
  programacoes: {
    data_inicio: string;
    data_fim: string;
    quantidade: number;
  }[];
}

export const formataComoEventos = (
  objetos: ObjetoCalendario[],
): ItemCalendario<EtapaCalendario>[] => {
  const eventos: ItemCalendario<EtapaCalendario>[] = [];

  const parseData = (data: string) => {
    const [dia, mes, ano] = data.split("/");
    return new Date(parseInt(ano), parseInt(mes) - 1, parseInt(dia), 0);
  };

  objetos.forEach((objeto: ObjetoCalendario) => {
    objeto.programacoes.forEach((programacao) => {
      const inicio = parseData(programacao.data_inicio);
      const fim = parseData(programacao.data_fim);

      const dataAtual = new Date(inicio);
      while (dataAtual <= fim) {
        const dia = String(dataAtual.getDate()).padStart(2, "0");
        const mes = String(dataAtual.getMonth() + 1).padStart(2, "0");
        const ano = dataAtual.getFullYear();
        const dataFormatada = `${dia}/${mes}/${ano}`;

        const objetoMapeado = {
          numero_cronograma: objeto.numero,
          nome_produto: objeto.produto,
          nome_fornecedor: objeto.fornecedor,
          numero_empenho: objeto.empenho,
          unidade_medida: objeto.unidade_medida,
          data_programada: dataFormatada,
          quantidade: programacao.quantidade,
          // campos sem equivalente — manter vazio/null para não quebrar a modal
          etapa: null,
          parte: null,
          uuid_cronograma: objeto.uuid,
          status: null,
        } as unknown as EtapaCalendario;

        eventos.push({
          title: objeto.produto,
          data: dataFormatada,
          start: new Date(dataAtual),
          end: new Date(dataAtual),
          allDay: true,
          objeto: objetoMapeado,
        });

        dataAtual.setDate(dataAtual.getDate() + 1);
      }
    });
  });

  return eventos;
};

export const ehMesmoDia = (d1: Date, d2: Date) => {
  return (
    d1.getFullYear() === d2.getFullYear() &&
    d1.getMonth() === d2.getMonth() &&
    d1.getDate() === d2.getDate()
  );
};
