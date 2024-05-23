import React from "react";
import Botao from "components/Shareable/Botao";
import {
  BUTTON_STYLE,
  BUTTON_TYPE,
} from "components/Shareable/Botao/constants";

type BlocoOcorrenciasType = {
  comOcorrencias: string;
  setComOcorrencias: (_comOcorrencias: string) => void;
  errosAoSalvar: Array<{ erro: string; periodo_escolar: string }>;
  setErrosAoSalvar: (
    _errosAoSalvar: Array<{ erro: string; periodo_escolar: string }>
  ) => void;
};

export const BlocoOcorrencias = ({ ...props }: BlocoOcorrenciasType) => {
  const { comOcorrencias, setComOcorrencias, errosAoSalvar, setErrosAoSalvar } =
    props;

  return (
    <div className="bloco-ocorrencias mb-3">
      <div className="pb-3">
        <b className="section-title">Ocorrências</b>
      </div>
      <div
        className={`box row ${
          errosAoSalvar &&
          errosAoSalvar.find((erro) => erro.periodo_escolar === "OCORRENCIAS")
            ? "border-danger"
            : ""
        }`}
      >
        <div className="col-8 my-auto">
          <span className="me-3">Avaliação do Serviço: </span>
          <input
            name="com_ocorrencias"
            onClick={() => {
              setComOcorrencias("nao");
              setErrosAoSalvar(
                errosAoSalvar.filter(
                  (obj) => obj.periodo_escolar !== "OCORRENCIAS"
                )
              );
            }}
            type="radio"
            value="nao"
            id="nao"
            required
          />
          <label className="ms-1" htmlFor="nao">
            Serviço prestado sem ocorrências
          </label>
          <input
            name="com_ocorrencias"
            className="ms-3"
            onClick={() => {
              setComOcorrencias("sim");
              setErrosAoSalvar(
                errosAoSalvar.filter(
                  (obj) => obj.periodo_escolar !== "OCORRENCIAS"
                )
              );
            }}
            type="radio"
            value="sim"
            id="sim"
            required
          />
          <label className="ms-1" htmlFor="sim">
            Com ocorrências
          </label>
        </div>
        <div className="col-4">
          <div className="row">
            <div className="col-4">
              {errosAoSalvar &&
                errosAoSalvar
                  .filter((obj) => obj.periodo_escolar === "OCORRENCIAS")
                  .map((obj, idxErros) => {
                    return (
                      <span className="mt-auto mensagem-erro" key={idxErros}>
                        {obj.erro}
                      </span>
                    );
                  })}
            </div>
            <div className="col-8 text-end">
              <Botao
                texto="Registrar Ocorrências"
                disabled={comOcorrencias !== "sim"}
                type={BUTTON_TYPE.BUTTON}
                style={BUTTON_STYLE.RED_OUTLINE}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};