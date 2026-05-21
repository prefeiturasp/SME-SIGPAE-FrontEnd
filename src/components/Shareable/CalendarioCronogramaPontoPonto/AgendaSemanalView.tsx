import React from "react";
import moment from "moment";
import "moment/locale/pt-br";
import { ehMesmoDia } from "./helpers";
import {
  ItemCalendario,
  EtapaCalendario,
} from "src/interfaces/pre_recebimento.interface";
import { ItemCalendarioInterrupcao } from "./interfaces";

type EventoCalendario =
  | ItemCalendario<EtapaCalendario>
  | ItemCalendarioInterrupcao;

interface AgendaSemanalViewProps {
  date: Date;
  events: EventoCalendario[];
  localizer: any;
  length?: number;
  onSelectEvent?: (_event: any, _e: React.SyntheticEvent) => void;
}

// Retorna ate `quantidade` dias uteis (seg-sex) a partir de `dataInicio`, ignorando sab/dom
const obterDiasUteis = (dataInicio: Date, quantidade: number = 7): Date[] => {
  const resultado: Date[] = [];
  const atual = new Date(dataInicio);
  atual.setHours(0, 0, 0, 0);

  while (resultado.length < quantidade) {
    const dia = atual.getDay();
    if (dia !== 0 && dia !== 6) {
      resultado.push(new Date(atual));
    }
    atual.setDate(atual.getDate() + 1);
  }
  return resultado;
};

// Renderiza cabecalho em duas linhas: nome do dia + dia/mes (ex: "Quinta-Feira" e "07 de Mai")
const renderizarCabecalhoDia = (data: Date): React.ReactNode => {
  const nomeDia = moment(data).locale("pt-br").format("dddd");
  const diaMes = moment(data).locale("pt-br").format("DD [de] MMM");
  return (
    <>
      <span className="agenda-day-name">
        {nomeDia.replace(/^\w/, (c) => c.toUpperCase())}
      </span>
      <span className="agenda-day-date">{diaMes}</span>
    </>
  );
};

// Filtra eventos de produto (nao interrupcao) para um dia especifico
const obterProdutosDoDia = (
  events: EventoCalendario[],
  date: Date,
): ItemCalendario<EtapaCalendario>[] => {
  return events.filter(
    (evento) => !("isInterrupcao" in evento) && ehMesmoDia(evento.start, date),
  ) as ItemCalendario<EtapaCalendario>[];
};

// Filtra interrupcoes para um dia especifico
const obterInterrupcoesDoDia = (
  events: EventoCalendario[],
  date: Date,
): ItemCalendarioInterrupcao[] => {
  return events.filter(
    (evento) => "isInterrupcao" in evento && ehMesmoDia(evento.start, date),
  ) as ItemCalendarioInterrupcao[];
};

const AgendaSemanalView: React.FC<AgendaSemanalViewProps> & {
  range: (_start: Date, _props: any) => { start: Date; end: Date };
  navigate: (_date: Date, _action: string, _props: any) => Date;
  title: (_start: Date, _props: any) => string;
} = ({ date, events, length = 7, onSelectEvent }) => {
  const diasUteis = obterDiasUteis(date, length);

  return (
    <div className="agenda-semanal-view">
      {diasUteis.map((dia) => {
        const interrupcoes = obterInterrupcoesDoDia(events, dia);
        const produtos = obterProdutosDoDia(events, dia);

        return (
          <div className="agenda-row" key={dia.toISOString()}>
            <div className="agenda-day-header">
              {renderizarCabecalhoDia(dia)}
            </div>
            <div className="agenda-day-content">
              {interrupcoes.length === 0 && produtos.length === 0 ? (
                <div className="agenda-empty">---</div>
              ) : (
                <>
                  {interrupcoes.map((interrupcao) => (
                    <div
                      className="agenda-interrupcao-tag"
                      key={interrupcao.uuid}
                    >
                      {interrupcao.motivo_display}
                      {interrupcao.descricao_motivo &&
                        `: ${interrupcao.descricao_motivo}`}
                    </div>
                  ))}
                  {produtos.map((evento) => (
                    <div
                      className="agenda-product-tag"
                      key={evento.objeto.uuid}
                      role="button"
                      tabIndex={0}
                      onClick={(e) => onSelectEvent?.(evento, e)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" || e.key === " ") {
                          e.preventDefault();
                          onSelectEvent?.(evento, e as any);
                        }
                      }}
                    >
                      {evento.title.toUpperCase()}
                    </div>
                  ))}
                </>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};

// Metodos estaticos exigidos pela interface de view do react-big-calendar

AgendaSemanalView.range = (
  start: Date,
  { length = 7, localizer }: any,
): { start: Date; end: Date } => {
  // Buffer maior que length para cobrir fins de semana pulados
  const end = localizer.add(start, length * 2, "day");
  return { start, end };
};

AgendaSemanalView.navigate = (
  date: Date,
  action: string,
  { localizer }: any,
): Date => {
  switch (action) {
    case "PREV":
      return localizer.add(date, -30, "day");
    case "NEXT":
      return localizer.add(date, 30, "day");
    case "TODAY":
      return new Date();
    default:
      return date;
  }
};

AgendaSemanalView.title = (start: Date, { localizer }: any): string => {
  return localizer.format(start, "MMMM YYYY");
};

export default AgendaSemanalView;
