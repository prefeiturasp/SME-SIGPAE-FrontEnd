import React from "react";
import "./styles.scss";

interface CollapseProps {
  periodos?: any[];
}

export const CollapseContentCEI: React.FC<CollapseProps> = ({ periodos }) => {
  return (
    <div className="detalhes-collapse-cei">
      <div className="linha linha-1">
        <p>Faixas Etárias com Dietas Autorizadas</p>
      </div>
      {periodos.map((p) => (
        <div key={p.periodo} className="linha item-periodo">
          <div className="linha item item-periodo">
            <p>Período {p.periodo}</p>
          </div>
          {p.faixa_etaria?.map((faixa) => (
            <div key={faixa.faixa} className="linha linha-2">
              <div className="item">{faixa.faixa}</div>
              <div className="item">{faixa.autorizadas}</div>
            </div>
          ))}
        </div>
      ))}
    </div>
  );
};
