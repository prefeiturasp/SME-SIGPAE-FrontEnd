import Botao from "src/components/Shareable/Botao";
import {
  BUTTON_STYLE,
  BUTTON_TYPE,
} from "src/components/Shareable/Botao/constants";
import React from "react";
import {
  NavigateFunction,
  createSearchParams,
  useNavigate,
} from "react-router-dom";

import {
  LANCAMENTO_INICIAL,
  LANCAMENTO_MEDICAO_INICIAL,
  REGISTRAR_OCORRENCIAS,
} from "src/configs/constants";
import { EscolaSimplesInterface } from "src/interfaces/escola.interface";

type BlocoOcorrenciasType = {
  comOcorrencias: string;
  setComOcorrencias: (_comOcorrencias: string) => void;
  errosAoSalvar: Array<{ erro: string; periodo_escolar: string }>;
  setErrosAoSalvar: (
    _errosAoSalvar: Array<{ erro: string; periodo_escolar: string }>
  ) => void;
  ano: string;
  mes: string;
  escolaSimples: EscolaSimplesInterface;
  solicitacaoMedicaoInicialUuid: string;
};

export const BlocoOcorrencias = ({ ...props }: BlocoOcorrenciasType) => {
  const {
    comOcorrencias,
    setComOcorrencias,
    errosAoSalvar,
    setErrosAoSalvar,
    ano,
    mes,
    escolaSimples,
    solicitacaoMedicaoInicialUuid,
  } = props;

  const navigate: NavigateFunction = useNavigate();

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
              setComOcorrencias("false");
              setErrosAoSalvar(
                errosAoSalvar.filter(
                  (obj) => obj.periodo_escolar !== "OCORRENCIAS"
                )
              );
            }}
            type="radio"
            value="false"
            id="false"
            required
          />
          <label className="ms-1" htmlFor="false">
            Serviço prestado sem ocorrências
          </label>
          <input
            name="com_ocorrencias"
            className="ms-3"
            onClick={() => {
              setComOcorrencias("true");
              setErrosAoSalvar(
                errosAoSalvar.filter(
                  (obj) => obj.periodo_escolar !== "OCORRENCIAS"
                )
              );
            }}
            type="radio"
            value="true"
            id="true"
            required
          />
          <label className="ms-1" htmlFor="true">
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
                onClick={() =>
                  navigate({
                    pathname: `/${LANCAMENTO_INICIAL}/${LANCAMENTO_MEDICAO_INICIAL}/${REGISTRAR_OCORRENCIAS}`,
                    search: createSearchParams({
                      ano,
                      mes,
                      editalUuid: escolaSimples.lote.contratos_do_lote.find(
                        (contrato) => !contrato.encerrado
                      ).edital,
                      solicitacaoMedicaoInicialUuid,
                    }).toString(),
                  })
                }
                disabled={comOcorrencias !== "true"}
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
