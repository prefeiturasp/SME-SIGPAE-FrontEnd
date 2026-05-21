import { Spin, Tooltip } from "antd";
import HTTP_STATUS from "http-status-codes";
import moment from "moment";
import React, { useEffect, useState } from "react";
import { Calendar, momentLocalizer, Views } from "react-big-calendar";
import { ModalCronograma } from "src/components/Shareable/ModalCronograma";
import "src/components/Shareable/CalendarioCronogramaPontoPonto/style.scss";
import {
  EtapaCalendario,
  ItemCalendario,
} from "src/interfaces/pre_recebimento.interface";
import { ResponseCalendarioCronograma } from "src/interfaces/responses.interface";
import { getInterrupcoesProgramadas } from "src/services/cronograma.service";
import {
  ehMesmoDia,
  formataComoEventos,
} from "src/components/Shareable/CalendarioCronogramaPontoPonto/helpers";
import { ItemCalendarioInterrupcao, ParametrosCalendario } from "./interfaces";
import AgendaSemanalView from "./AgendaSemanalView";
import "./AgendaSemanalView.scss";
import Botao from "src/components/Shareable/Botao";
import {
  BUTTON_ICON,
  BUTTON_STYLE,
  BUTTON_TYPE,
} from "src/components/Shareable/Botao/constants";

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

export const CalendarioCronogramaPontoPonto: React.FC<Props> = ({
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
  const [view, setView] = useState<string>("month");
  const [dataAgenda, setDataAgenda] = useState<Date>(new Date());

  useEffect(() => {
    carregarObjetosAsync({ mes, ano });
  }, [mes, ano]);

  useEffect(() => {
    if (view === "agenda") {
      const primeiroDia = moment([ano, mes - 1, 1]);
      while (primeiroDia.isoWeekday() > 5) {
        primeiroDia.add(1, "day");
      }
      setDataAgenda(primeiroDia.toDate());
    }
  }, [mes, ano]);

  const carregarObjetosAsync = async (params: ParametrosCalendario) => {
    setCarregandoDiasCalendario(true);
    try {
      const [responseObjetos, responseInterrupcoes] = await Promise.all([
        getObjetos({ ...params, status: "FORNECEDOR_CIENTE" }),
        getInterrupcoesProgramadas({
          ...params,
          motivo: ["FERIADO", "EMENDA"],
          tipo_calendario: ["PONTO_A_PONTO"],
        }),
      ]);

      if (responseObjetos.status === HTTP_STATUS.OK) {
        setItensCalendario(formataComoEventos(responseObjetos.data));
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

          let title = "INTERRUPÇÃO";

          if (item.motivo === "FERIADO" || item.motivo === "EMENDA") {
            title = item.motivo;
          }

          return {
            uuid: item.uuid,
            title,
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
      return;
    }
    setEventoAtual(evento as ItemCalendario<EtapaCalendario>);
    setExibirModalCronograma(true);
  };

  const handleTabMes = () => setView("month");

  const handleTabAgenda = () => {
    const segunda = moment().startOf("isoWeek").toDate();
    setDataAgenda(segunda);
    setView("agenda");
  };

  const handlePrevMonth = () => {
    const novaData = moment([ano, mes - 1, 1]).subtract(1, "month");
    setMes(novaData.month() + 1);
    setAno(novaData.year());
  };

  const handleNextMonth = () => {
    const novaData = moment([ano, mes - 1, 1]).add(1, "month");
    setMes(novaData.month() + 1);
    setAno(novaData.year());
  };

  const handleDrillDown = (date: Date) => {
    setDataAgenda(date);
    setView("agenda");
  };

  const obterEstiloEvento = (evento: EventoCalendario) => {
    if ("isInterrupcao" in evento && evento.isInterrupcao) {
      const sufixo =
        evento.tipo_calendario === "PONTO_A_PONTO" ? "-ponto-a-ponto" : "";
      return {
        className: `interrupcao-entrega${sufixo}`,
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
    let tooltipTitle = "";
    if ("isInterrupcao" in event && event.isInterrupcao) {
      const textoPrincipal = event.descricao_motivo
        ? `${event.motivo_display}: ${event.descricao_motivo}`
        : event.motivo_display;

      tooltipTitle = `${textoPrincipal}`;
    } else {
      tooltipTitle = event.title;
    }

    return <Tooltip title={tooltipTitle}>{children}</Tooltip>;
  };

  const itensFiltrados = (itensCalendario || []).filter((item) => {
    return !interrupcoes.some((interrupcao) =>
      ehMesmoDia(item.start, interrupcao.start),
    );
  });

  const todosEventos: EventoCalendario[] = [...interrupcoes, ...itensFiltrados];

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
                {/* Cabecalho externo com abas e navegacao */}
                <div className="row toolbar-container mb-3">
                  <div
                    className="col-6"
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "1rem",
                    }}
                  >
                    <div
                      className={`mes-tab ${view === "month" ? "active" : ""}`}
                      role="button"
                      tabIndex={0}
                      onClick={handleTabMes}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" || e.key === " ") {
                          e.preventDefault();
                          handleTabMes();
                        }
                      }}
                    >
                      Mês
                    </div>
                    <div
                      className={`agenda-tab ${view === "agenda" ? "active" : ""}`}
                      role="button"
                      tabIndex={0}
                      onClick={handleTabAgenda}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" || e.key === " ") {
                          e.preventDefault();
                          handleTabAgenda();
                        }
                      }}
                    >
                      Agenda
                    </div>
                  </div>
                  <div className="col-6 text-end">
                    <div className="back-next-buttons">
                      <Botao
                        type={BUTTON_TYPE.BUTTON}
                        style={BUTTON_STYLE.GREEN_OUTLINE}
                        icon={BUTTON_ICON.ARROW_LEFT}
                        onClick={handlePrevMonth}
                      />
                      <span className="label-month">
                        {moment([ano, mes - 1, 1]).format("MMMM YYYY")}
                      </span>
                      <Botao
                        type={BUTTON_TYPE.BUTTON}
                        style={BUTTON_STYLE.GREEN_OUTLINE}
                        icon={BUTTON_ICON.ARROW_RIGHT}
                        onClick={handleNextMonth}
                      />
                    </div>
                  </div>
                </div>

                {/* View condicional */}
                {view === "month" ? (
                  <Calendar
                    key="calendar-month"
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
                    onSelectSlot={(slotInfo) => handleDrillDown(slotInfo.start)}
                    eventPropGetter={obterEstiloEvento}
                    components={{
                      toolbar: () => null,
                      eventWrapper: EventWrapper,
                    }}
                    onDrillDown={handleDrillDown}
                    onShowMore={(events, date) => handleDrillDown(date)}
                    messages={{
                      showMore: (target: any) => (
                        <span
                          className="ms-2 showmore-message"
                          role="presentation"
                        >
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
                ) : (
                  <Calendar
                    key="calendar-agenda"
                    style={{ height: 1000 }}
                    localizer={localizer}
                    events={todosEventos}
                    onSelectEvent={handleSelecionarEvento}
                    components={{ toolbar: () => null }}
                    views={{ agenda: AgendaSemanalView }}
                    defaultView={"agenda" as any}
                    date={dataAgenda}
                    length={7}
                    onNavigate={(date: Date) => setDataAgenda(date)}
                    messages={{
                      noEventsInRange:
                        "Nenhuma entrega programada neste período.",
                    }}
                  />
                )}
              </Spin>
              {exibirModalCronograma && eventoAtual && (
                <ModalCronograma
                  showModal={exibirModalCronograma}
                  closeModal={() => setExibirModalCronograma(false)}
                  event={eventoAtual}
                  ehCronogramaPontoAPonto={true}
                />
              )}
            </>
          )}
        </Spin>
      </div>
    </div>
  );
};
