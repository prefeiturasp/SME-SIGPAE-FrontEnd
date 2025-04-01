import React from "react";
import "./styles.scss";

interface CollapseProps {
  periodos?: any;
}

export const CollapseContentEMEBS: React.FC<CollapseProps> = ({ periodos }) => {
  return (
    <div className="detalhes-collapse-emebs">
      <div className="linha linha-1">
        <p>Alunos do Infantil (4 a 6 anos)</p>
      </div>
      {periodos.infantil?.map((item) => (
        <div key={`infantil-${item.periodo}`} className="linha linha-2">
          <div className="item item-periodo">{item.periodo}</div>
          <div className="item">{item.autorizadas}</div>
        </div>
      ))}
      <div className="linha linha-1">
        <p>Alunos do Fundamental (acima de 6 anos)</p>
      </div>
      {periodos.fundamental?.map((item) => (
        <div key={`fundamental-${item.periodo}`} className="linha linha-2">
          <div className="item item-periodo">{item.periodo}</div>
          <div className="item">{item.autorizadas}</div>
        </div>
      ))}
    </div>
  );
};
