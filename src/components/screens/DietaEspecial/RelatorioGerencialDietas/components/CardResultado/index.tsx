import React from "react";

import { formatarPara4Digitos } from "src/components/screens/helper";

import "./style.scss";

type Props = {
  titulo: string;
  classeCor: string;
  total: number;
};
export default (props: Props) => {
  const { titulo, classeCor, total } = props;

  return (
    <div className={`card-medicao-por-status ${classeCor} me-3 mb-3`}>
      <div className="p-2">
        <h5 className="titulo">
          <b>{titulo}</b>
        </h5>
        <hr />
        <div className="total">{formatarPara4Digitos(total)}</div>
      </div>
    </div>
  );
};
