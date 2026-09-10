import React from "react";
import { formatarPara4Digitos } from "src/components/screens/helper";
import {
  acionaComEnterOuEspaco,
  usuarioEhEscolaTerceirizadaQualquerPerfil,
} from "src/helpers/utilities";

export const CardMedicaoPorStatus = ({ ...props }) => {
  const {
    children,
    classeCor,
    dados,
    form,
    onPageChanged,
    page,
    setResultados,
    statusSelecionado,
    setStatusSelecionado,
    total,
    resetForm,
    dataTestId,
    getDashboardMedicaoInicialAsync,
  } = props;

  const onClickCard = () => {
    if (total) {
      if (usuarioEhEscolaTerceirizadaQualquerPerfil()) {
        getDashboardMedicaoInicialAsync({
          status: dados.status === statusSelecionado ? null : dados.status,
        });
      } else {
        setResultados(statusSelecionado === dados.status ? null : dados);
        resetForm(form);
      }
      setStatusSelecionado(
        statusSelecionado === dados.status ? null : dados.status,
      );
      page !== 1 && onPageChanged(1);
    }
  };

  const ehClicavel = Boolean(total);

  return (
    <div
      data-testid={dataTestId}
      role={ehClicavel ? "button" : undefined}
      tabIndex={ehClicavel ? 0 : undefined}
      aria-pressed={ehClicavel ? statusSelecionado === dados.status : undefined}
      onClick={onClickCard}
      onKeyDown={(e) => acionaComEnterOuEspaco(e, onClickCard)}
      className={`card-medicao-por-status ${classeCor} me-3 mb-3`}
    >
      <div className="pt-2">
        <div className="titulo">{children}</div>
        <hr />
        <div className="total">{formatarPara4Digitos(total)}</div>
        <div className="conferir-lista float-end">Conferir lista</div>
      </div>
    </div>
  );
};
