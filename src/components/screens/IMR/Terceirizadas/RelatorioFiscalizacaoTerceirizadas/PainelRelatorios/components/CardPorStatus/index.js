import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { formatarPara4Digitos } from "src/components/screens/helper";
import { CLASSE_COR_CARD } from "./constants";
export const CardPorStatus = ({ ...props }) => {
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
  return _jsx("div", {
    onClick: () => onClickCard(),
    className: `card-medicao-por-status ${getClassNameCorCard()} ${getClassNameCursorPointer()} me-3 mb-3`,
    children: _jsxs("div", {
      className: "pt-2",
      children: [
        _jsx("div", { className: "titulo", children: cardStatus.label }),
        _jsx("hr", {}),
        _jsx("div", {
          className: "total",
          children: formatarPara4Digitos(cardStatus.total),
        }),
        _jsx("div", {
          className: "conferir-lista float-end",
          children: "Conferir lista",
        }),
      ],
    }),
  });
};
