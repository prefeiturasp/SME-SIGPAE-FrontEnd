import React from "react";
import { Input } from "antd";

function ResponsaveisInputs({
  responsaveis,
  setaResponsavel,
  emEdicao,
  verificarInput,
}) {
  return (
    <>
      {responsaveis.map((responsavel, index) => (
        <div className="row col-12 pr-0 mt-2" key={index}>
          <div className="col-8">
            <Input
              className="mt-2"
              name={`responsavel_nome_${index}`}
              value={responsavel.nome}
              onChange={(e) => setaResponsavel("nome", e.target.value, index)}
              disabled={!emEdicao}
            />
          </div>
          <div className="col-4 pr-0">
            <Input
              maxLength={7}
              className="mt-2"
              name={`responsavel_rf_${index}`}
              onKeyPress={(event) => verificarInput(event, index)}
              onChange={(event) =>
                setaResponsavel("rf", event.target.value, index)
              }
              value={responsavel.rf}
              disabled={!emEdicao}
            />
          </div>
        </div>
      ))}
    </>
  );
}

export default ResponsaveisInputs;
