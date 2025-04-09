import React from "react";
import "./styles.scss";

interface CollapseProps {
  periodos?: any[];
}

export const CollapseContentEMEI: React.FC<CollapseProps> = ({ periodos }) => {
  return (
    <div className="detalhes-historico-relatorio">
      {periodos.map((p) => (
        <div key={p.periodo} className="linha linha-1">
          <div className="item item-periodo">{p.periodo}</div>
          <div className="item">{p.autorizadas}</div>
        </div>
      ))}
    </div>
  );
};
