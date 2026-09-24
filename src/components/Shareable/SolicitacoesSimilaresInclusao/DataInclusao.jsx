import React from "react";

export const DataInclusao = ({ inclusao, status, logs }) => {
  const escolaCancelouTudo = status === "ESCOLA_CANCELOU";
  const cancelado = inclusao?.cancelado || escolaCancelouTudo;

  const justificativa =
    inclusao?.cancelado_justificativa ||
    (escolaCancelouTudo ? logs?.[logs.length - 1]?.justificativa : "") ||
    "";

  return (
    <span className={`data-inclusao ${cancelado ? "cancelado" : ""}`}>
      <b className="me-4">{inclusao?.data}</b>
      {cancelado && (
        <div className="dark-red">
          <strong>justificativa:</strong> {justificativa}
        </div>
      )}
    </span>
  );
};

export default DataInclusao;
