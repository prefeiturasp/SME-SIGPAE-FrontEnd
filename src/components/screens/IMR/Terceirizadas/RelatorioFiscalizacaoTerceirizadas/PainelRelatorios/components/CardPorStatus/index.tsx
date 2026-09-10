import React from "react";

import { formatarPara4Digitos } from "src/components/screens/helper";
import {
  FiltrosRelatoriosVisitasInterface,
  RelatorioVisitaItemListagem,
} from "src/interfaces/imr.interface";
import { DashboardSupervisaoInterface } from "../../interfaces";
import { CLASSE_COR_CARD } from "./constants";
import { FormApi } from "final-form";
import { acionaComEnterOuEspaco } from "src/helpers/utilities";

type CardPorStatusType = {
  cardStatus: DashboardSupervisaoInterface;
  form: FormApi;
  statusSelecionado: string;
  setStatusSelecionado: (_statusSelecionado: string) => void;
  setFiltros: (_filtros: FiltrosRelatoriosVisitasInterface) => void;
  setPage: (_page: number) => void;
  setRelatoriosVisita: (
    _relatoriosVisita: RelatorioVisitaItemListagem[],
  ) => void;
  setConsultaRealizada: (_consultaRealizada: boolean) => void;
};

export const CardPorStatus = ({ ...props }: CardPorStatusType) => {
  const {
    cardStatus,
    form,
    setFiltros,
    statusSelecionado,
    setStatusSelecionado,
    setPage,
    setRelatoriosVisita,
    setConsultaRealizada,
  } = props;

  const onClickCard = () => {
    if (!cardStatus.total) return;
    form?.reset();
    setPage(1);
    setRelatoriosVisita([]);
    setConsultaRealizada(false);
    setStatusSelecionado(cardStatus.status);
    setFiltros({
      status:
        cardStatus.status !== "TODOS_OS_RELATORIOS" ? cardStatus.status : "",
    });
  };

  const getClassNameCorCard = () => {
    if (!cardStatus.total || statusSelecionado !== cardStatus.status)
      return "cinza";
    return CLASSE_COR_CARD[cardStatus.status];
  };

  const getClassNameCursorPointer = () => {
    return cardStatus.total ? "cursor-pointer" : "";
  };

  const ehClicavel = Boolean(cardStatus.total);

  return (
    <div
      role={ehClicavel ? "button" : undefined}
      tabIndex={ehClicavel ? 0 : undefined}
      aria-pressed={
        ehClicavel ? statusSelecionado === cardStatus.status : undefined
      }
      onClick={() => onClickCard()}
      onKeyDown={(e) => acionaComEnterOuEspaco(e, () => onClickCard())}
      className={`card-medicao-por-status ${getClassNameCorCard()} ${getClassNameCursorPointer()} me-3 mb-3`}
    >
      <div className="pt-2">
        <div className="titulo">{cardStatus.label}</div>
        <hr />
        <div className="total">{formatarPara4Digitos(cardStatus.total)}</div>
        <div className="conferir-lista float-end">Conferir lista</div>
      </div>
    </div>
  );
};
