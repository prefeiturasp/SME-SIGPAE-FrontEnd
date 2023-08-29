import {
  DETALHAR_ALTERACAO_CRONOGRAMA,
  PRE_RECEBIMENTO,
} from "configs/constants";
import React from "react";
import { useHistory } from "react-router-dom";
import { tipoDeStatusClasse } from "./helper";
import "./style.scss";

export const FluxoDeStatusCronograma = ({ listaDeStatus, solicitacao }) => {
  const history = useHistory();

  const item = (status, key) => {
    const content = (
      <>
        {status.criado_em}
        <br />
        {status.usuario && <span>{status.usuario.nome}</span>}
      </>
    );

    const isClickable = !solicitacao && status.justificativa;

    return (
      <li
        key={key}
        className={`${tipoDeStatusClasse(status)}`}
        style={{
          width: `${100 / listaDeStatus.length}%`,
          cursor: isClickable ? "pointer" : "default",
        }}
        onClick={() => {
          isClickable &&
            history.push(
              `/${PRE_RECEBIMENTO}/${DETALHAR_ALTERACAO_CRONOGRAMA}?uuid=${status.justificativa}`
            );
        }}
      >
        {content}
      </li>
    );
  };

  return (
    <div className="w-100">
      <ul className={`progressbar-titles fluxos`}>
        {listaDeStatus.map((status, key) => (
          <li key={key}>{status.status_evento_explicacao}</li>
        ))}
      </ul>
      <ul className="progressbar-cronograma">
        {listaDeStatus.map((status, key) => (
          <>{item(status, key)}</>
        ))}
      </ul>
    </div>
  );
};
