import React from "react";
import { Radio } from "antd";
import { TextArea } from "src/components/Shareable/TextArea/TextArea";
import { Field } from "react-final-form";

export default ({ solicitacao, aprovacaoDilog, setAprovacaoDilog }) => {
  const onChangeCampos = (e) => {
    setAprovacaoDilog(e.target.value);
  };

  const analisadoPelaDilog = () => {
    return solicitacao.logs.some((l) =>
      ["Aprovado DILOG", "Reprovado DILOG"].includes(l.status_evento_explicacao)
    );
  };

  const reprovadoPelaDilog = () => {
    return solicitacao.logs.some(
      (l) => l.status_evento_explicacao === "Reprovado DILOG"
    );
  };

  return (
    <>
      <hr />
      {analisadoPelaDilog() ? (
        <>
          <p className="head-green">{solicitacao.status}</p>
        </>
      ) : (
        <>
          <p className="head-green">Análise DILOG</p>
          <Radio.Group
            size="large"
            onChange={onChangeCampos}
            value={aprovacaoDilog}
          >
            <Radio className="radio-entrega-sim" value={true}>
              Analise Aprovada
            </Radio>
            <Radio className="radio-entrega-nao" value={false}>
              Analise Reprovada
            </Radio>
          </Radio.Group>
        </>
      )}
      {(aprovacaoDilog === false || reprovadoPelaDilog()) && (
        <div className="mt-4">
          <>
            <label className="label fw-normal">
              <span>* </span>Justificativa
            </label>
            <Field
              component={TextArea}
              disabled={analisadoPelaDilog()}
              name="justificativa_dilog"
              placeholder="Escreva as alterações necessárias"
              className="input-busca-produto"
            />
          </>
        </div>
      )}
    </>
  );
};
