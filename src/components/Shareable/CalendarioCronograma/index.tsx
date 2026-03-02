import React, { useEffect, useState } from "react";
import HTTP_STATUS from "http-status-codes";
import { CustomToolbar } from "src/components/Shareable/CalendarioCronograma/componentes/CustomToolbar";
import { Calendar, momentLocalizer, Views } from "react-big-calendar";
import moment from "moment";
import { formataComoEventos } from "src/components/Shareable/CalendarioCronograma/helpers";
import { Spin, Tooltip } from "antd";
import { ModalCronograma } from "src/components/Shareable/CalendarioCronograma/componentes/ModalCronograma";
import "src/components/Shareable/CalendarioCronograma/style.scss";
import {
  ItemCalendario,
  ItemCalendarioInterrupcao,
  ParametrosCalendario,
} from "./interfaces";
import { EtapaCalendario } from "src/interfaces/pre_recebimento.interface";
import { ResponseCalendarioCronograma } from "src/interfaces/responses.interface";
import { getInterrupcoesProgramadas } from "src/services/cronograma.service";
import ModalCadastrarInterrupcao from "./componentes/ModalCadastrarInterrupcao";
import ModalDetalheInterrupcao from "./componentes/ModalDetalheInterrupcao";
import { usuarioEhCronogramaOuCodae } from "../../../helpers/utilities";

interface Props {
  getObjetos: (
    _params?: ParametrosCalendario,
  ) => Promise<ResponseCalendarioCronograma>;
  nomeObjeto: string;
  nomeObjetoMinusculo: string;
}

type EventoCalendario =
  | ItemCalendario<EtapaCalendario>
  | ItemCalendarioInterrupcao;

const localizer = momentLocalizer(moment);

export const CalendarioCronograma: React.FC<Props> = ({
  getObjetos,
  nomeObjeto,
  nomeObjetoMinusculo,
}) => {
  const [itensCalendario, setItensCalendario] = useState<
    ItemCalendario<EtapaCalendario>[] | undefined
  >(undefined);
  const [interrupcoes, setInterrupcoes] = useState<ItemCalendarioInterrupcao[]>(
    [],
  );
  const [carregandoDiasCalendario, setCarregandoDiasCalendario] =
    useState<boolean>(false);
  const [eventoAtual, setEventoAtual] = useState<
    ItemCalendario<EtapaCalendario> | undefined
  >(undefined);
  const [exibirModalCronograma, setExibirModalCronograma] =
    useState<boolean>(false);
  const [mes, setMes] = useState<number>(moment().month() + 1);
  const [ano, setAno] = useState<number>(moment().year());

  const [exibirModalInterrupcao, setExibirModalInterrupcao] = useState(false);
  const [exibirModalDetalheInterrupcao, setExibirModalDetalheInterrupcao] =
    useState(false);
  const [dataSelecionada, setDataSelecionada] = useState<Date>(new Date());
  const [interrupcaoSelecionada, setInterrupcaoSelecionada] = useState<
    ItemCalendarioInterrupcao | undefined
  >(undefined);

  useEffect(() => {
    carregarObjetosAsync({ mes, ano });
  }, [mes, ano]);

  const carregarObjetosAsync = async (params: ParametrosCalendario) => {
    setCarregandoDiasCalendario(true);
    try {
      const [responseObjetos, responseInterrupcoes] = await Promise.all([
        getObjetos(params),
        getInterrupcoesProgramadas(params),
      ]);

      if (responseObjetos.status === HTTP_STATUS.OK) {
        setItensCalendario(formataComoEventos(responseObjetos.data.results));
      }

      const dataInterrupcoes =
        responseInterrupcoes?.data?.results || responseInterrupcoes?.data || [];
      if (Array.isArray(dataInterrupcoes)) {
        const interrupcoesFormatadas = dataInterrupcoes.map((item: any) => {
          // Parsing robusto para formato DD/MM/YYYY que é o padrão do projeto
          const [dia, mes, ano] = item.data.includes("/")
            ? item.data.split("/").map(Number)
            : item.data.split("-").reverse().map(Number); // fallback para YYYY-MM-DD se vier assim

          const dataInicio = new Date(ano, mes - 1, dia, 0, 0, 0);
          const dataFim = new Date(ano, mes - 1, dia, 1, 0, 0); // 1 hora de duração para garantir visibilidade

          return {
            uuid: item.uuid,
            title: `INTERRUPÇÃO DE ENTREGA`,
            start: dataInicio,
            end: dataFim,
            allDay: true,
            isInterrupcao: true as const,
            motivo_display: item.motivo_display,
            descricao_motivo: item.descricao_motivo,
            tipo_calendario: item.tipo_calendario,
            tipo_calendario_display: item.tipo_calendario_display,
          };
        });
        setInterrupcoes(interrupcoesFormatadas);
      }
    } finally {
      setCarregandoDiasCalendario(false);
    }
  };

  const handleSelecionarEvento = (evento: EventoCalendario) => {
    if ("isInterrupcao" in evento && evento.isInterrupcao) {
      setInterrupcaoSelecionada(evento as ItemCalendarioInterrupcao);
      setExibirModalDetalheInterrupcao(true);
      return;
    }
    setEventoAtual(evento as ItemCalendario<EtapaCalendario>);
    setExibirModalCronograma(true);
  };

  const handleSelecionarSlot = (slotInfo: { start: Date }) => {
    if (usuarioEhCronogramaOuCodae()) {
      setDataSelecionada(slotInfo.start);
      setExibirModalInterrupcao(true);
    }
  };

  const obterEstiloEvento = (evento: EventoCalendario) => {
    if ("isInterrupcao" in evento && evento.isInterrupcao) {
      const sufixo =
        evento.tipo_calendario === "PONTO_A_PONTO" ? "-ponto-a-ponto" : "";
      return {
        className: `interrupcao-entrega${sufixo}`,
      };
    }

    const item = evento as ItemCalendario<EtapaCalendario>;

    if (
      item.programa_leve_leite ||
      (item.objeto && (item.objeto as any).programa_leve_leite)
    ) {
      return {
        className: "programa-leve-leite",
      };
    }
    return {};
  };

  const EventWrapper = ({
    event,
    children,
  }: {
    event: EventoCalendario;
    children: React.ReactNode;
  }) => {
    if ("isInterrupcao" in event && event.isInterrupcao) {
      const textoPrincipal = event.descricao_motivo
        ? `${event.motivo_display}: ${event.descricao_motivo}`
        : event.motivo_display;

      const tooltipTitle = `${textoPrincipal} - ${event.tipo_calendario_display}`;

      return <Tooltip title={tooltipTitle}>{children}</Tooltip>;
    }
    return <>{children}</>;
  };

  const todosEventos: EventoCalendario[] = [
    ...(itensCalendario || []),
    ...interrupcoes,
  ];

  return (
    <div className="card calendario-sobremesa mt-3">
      <div className="card-body">
        <Spin tip="Carregando calendário..." spinning={!itensCalendario}>
          {itensCalendario && (
            <>
              <p>
                Para visualizar detalhes dos {nomeObjetoMinusculo}, clique sobre
                o item no dia programado.
              </p>
              <Spin
                tip={`Carregando dias de ${nomeObjeto}...`}
                spinning={carregandoDiasCalendario}
              >
                <Calendar
                  style={{ height: 1000 }}
                  formats={{
                    weekdayFormat: (date, culture, localizer) =>
                      localizer.format(date, "dddd", culture),
                  }}
                  selectable
                  resizable={false}
                  localizer={localizer}
                  events={todosEventos}
                  onSelectEvent={handleSelecionarEvento}
                  onSelectSlot={handleSelecionarSlot}
                  eventPropGetter={obterEstiloEvento}
                  components={{
                    toolbar: CustomToolbar,
                    eventWrapper: EventWrapper,
                  }}
                  messages={{
                    showMore: (target: string) => (
                      <span className="ms-2" role="presentation">
                        ...{target} mais
                      </span>
                    ),
                  }}
                  onNavigate={(date: Date) => {
                    setMes(date.getMonth() + 1);
                    setAno(date.getFullYear());
                  }}
                  defaultView={Views.MONTH}
                />
              </Spin>
              {exibirModalCronograma && eventoAtual && (
                <ModalCronograma
                  showModal={exibirModalCronograma}
                  closeModal={() => setExibirModalCronograma(false)}
                  event={eventoAtual}
                />
              )}
              {exibirModalInterrupcao && (
                <ModalCadastrarInterrupcao
                  showModal={exibirModalInterrupcao}
                  closeModal={() => setExibirModalInterrupcao(false)}
                  dataSelecionada={dataSelecionada}
                  onSave={() => carregarObjetosAsync({ mes, ano })}
                />
              )}
              {exibirModalDetalheInterrupcao && interrupcaoSelecionada && (
                <ModalDetalheInterrupcao
                  showModal={exibirModalDetalheInterrupcao}
                  closeModal={() => setExibirModalDetalheInterrupcao(false)}
                  evento={interrupcaoSelecionada}
                  onDelete={() => carregarObjetosAsync({ mes, ano })}
                />
              )}
            </>
          )}
        </Spin>
      </div>
    </div>
  );
};
