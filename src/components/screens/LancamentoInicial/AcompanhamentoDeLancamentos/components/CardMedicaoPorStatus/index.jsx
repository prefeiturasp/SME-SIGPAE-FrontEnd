import React from "react";
import { formatarPara4Digitos } from "components/screens/helper";
import { usuarioEhEscolaTerceirizadaQualquerPerfil } from "helpers/utilities";

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
  } = props;

  return (
    <div
      onClick={() => {
        if (total) {
          if (usuarioEhEscolaTerceirizadaQualquerPerfil()) {
            setResultados(dados);
          } else {
            setResultados(statusSelecionado === dados.status ? null : dados);
            resetForm(form);
          }
          setStatusSelecionado(
            statusSelecionado === dados.status ? null : dados.status
          );
          page !== 1 && onPageChanged(1);
        }
      }}
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
