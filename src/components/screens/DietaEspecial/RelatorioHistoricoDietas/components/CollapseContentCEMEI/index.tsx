import React from "react";
import "./styles.scss";

interface CollapseProps {
  periodos?: any;
}

export const CollapseContentCEMEI: React.FC<CollapseProps> = ({ periodos }) => {
  return (
    <div className="detalhes-collapse-cemei">
      <div className="linha linha-1">
        <p>Faixas Etárias com Dietas Autorizadas</p>
      </div>
      {periodos.por_idade?.map((p) => (
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
      <div className="linha linha-1">
        <p>Dietas Autorizadas nas Turmas do Infantil</p>
      </div>
      {periodos.turma_infantil?.map((item) => (
        <div key={`infantil-${item.periodo}`} className="linha linha-2">
          <div className="item item-periodo">{item.periodo}</div>
          <div className="item">{item.autorizadas}</div>
        </div>
      ))}
    </div>
  );
};
