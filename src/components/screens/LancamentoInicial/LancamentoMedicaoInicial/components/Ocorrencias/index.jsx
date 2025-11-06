import { Fragment, useState } from "react";
import Botao from "src/components/Shareable/Botao";
import {
  BUTTON_ICON,
  BUTTON_STYLE,
  BUTTON_TYPE,
} from "src/components/Shareable/Botao/constants";
import ModalHistorico from "src/components/Shareable/ModalHistorico";
import { OCORRENCIA_STATUS_DE_PROGRESSO } from "src/components/screens/LancamentoInicial/ConferenciaDosLancamentos/constants";
import { medicaoInicialExportarOcorrenciasPDF } from "src/services/relatorios";
import { ModalAtualizarOcorrencia } from "../ModalAtualizarOcorrencia";

export default ({
  solicitacaoMedicaoInicial,
  onClickInfoBasicas,
  setObjSolicitacaoMIFinalizada,
  setFinalizandoMedicao,
}) => {
  const [showModal, setShowModal] = useState(false);
  const [showModalHistorico, setShowModalHistorico] = useState(false);

  const visualizarModalHistorico = () => {
    setShowModalHistorico(true);
  };

  return (
    <>
      <div className="row mb-3">
        <div className="col-12">
          <b className="section-title">Ocorrências</b>
        </div>
      </div>
      {solicitacaoMedicaoInicial && (
        <div className="row mb-3">
          <div className="col-12">
            <div className="content-section-ocorrencias">
              <div className="row">
                <div className="col-4">
                  <p className="mb-0">
                    Avaliação do Serviço:{" "}
                    <b
                      className={`${
                        solicitacaoMedicaoInicial.com_ocorrencias
                          ? "value-avaliacao-servico-red"
                          : "value-avaliacao-servico-green"
                      }`}
                    >
                      {solicitacaoMedicaoInicial.com_ocorrencias
                        ? "COM OCORRÊNCIAS"
                        : "SEM OCORRÊNCIAS"}
                    </b>
                  </p>
                </div>
                {solicitacaoMedicaoInicial.ocorrencia ? (
                  <div className="col-8 text-end">
                    <span
                      className={`status-ocorrencia text-center ${solicitacaoMedicaoInicial.ocorrencia.status !== "OCORRENCIA_EXCLUIDA_PELA_ESCOLA" && "me-3"}`}
                    >
                      <b
                        className={
                          [
                            "MEDICAO_CORRECAO_SOLICITADA",
                            "MEDICAO_CORRECAO_SOLICITADA_CODAE",
                          ].includes(
                            solicitacaoMedicaoInicial.ocorrencia.status,
                          )
                            ? "red"
                            : ""
                        }
                      >
                        {OCORRENCIA_STATUS_DE_PROGRESSO[
                          solicitacaoMedicaoInicial.ocorrencia.status
                        ] &&
                          OCORRENCIA_STATUS_DE_PROGRESSO[
                            solicitacaoMedicaoInicial.ocorrencia.status
                          ].nome}
                      </b>
                    </span>
                    {solicitacaoMedicaoInicial.ocorrencia?.status !==
                      "OCORRENCIA_EXCLUIDA_PELA_ESCOLA" && (
                      <span
                        className="download-ocorrencias me-0"
                        onClick={() =>
                          medicaoInicialExportarOcorrenciasPDF(
                            solicitacaoMedicaoInicial.ocorrencia.ultimo_arquivo,
                          )
                        }
                      >
                        <i className={`${BUTTON_ICON.DOWNLOAD} me-2`} />
                        Formulário de Ocorrências
                      </span>
                    )}
                  </div>
                ) : (
                  <div className="col-6" />
                )}
                {solicitacaoMedicaoInicial.ocorrencia && (
                  <Fragment>
                    {solicitacaoMedicaoInicial.ocorrencia.status ===
                      "MEDICAO_CORRECAO_SOLICITADA" && (
                      <div className="col-12 mt-4">
                        <p>Correções Solicitadas:</p>
                        <div className="justificativa-ocorrencia-medicao">
                          <p
                            dangerouslySetInnerHTML={{
                              __html:
                                solicitacaoMedicaoInicial.ocorrencia.logs.find(
                                  (log) =>
                                    log.status_evento_explicacao ===
                                    "Correção solicitada",
                                ).justificativa,
                            }}
                          />
                        </div>
                      </div>
                    )}

                    <div className="col-12 mt-4">
                      <div className="float-end">
                        <Botao
                          texto="Histórico"
                          type={BUTTON_TYPE.BUTTON}
                          style={BUTTON_STYLE.GREEN_OUTLINE}
                          className="ms-3"
                          onClick={visualizarModalHistorico}
                        />
                        {[
                          "MEDICAO_CORRECAO_SOLICITADA",
                          "MEDICAO_CORRECAO_SOLICITADA_CODAE",
                          "MEDICAO_CORRIGIDA_PARA_CODAE",
                        ].includes(
                          solicitacaoMedicaoInicial.ocorrencia.status,
                        ) && (
                          <Botao
                            className="float-end ms-3"
                            texto="Atualizar Formulário de Ocorrências"
                            style={BUTTON_STYLE.GREEN}
                            onClick={() => setShowModal(true)}
                          />
                        )}
                      </div>
                    </div>
                  </Fragment>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
      {solicitacaoMedicaoInicial.ocorrencia && (
        <ModalHistorico
          visible={showModalHistorico}
          onOk={() => setShowModalHistorico(false)}
          onCancel={() => setShowModalHistorico(false)}
          logs={solicitacaoMedicaoInicial.ocorrencia.logs}
          solicitacaoMedicaoInicial={solicitacaoMedicaoInicial.ocorrencia}
          titulo="Histórico do Formulário de Ocorrências"
          getHistorico={() => solicitacaoMedicaoInicial.ocorrencia.logs}
          getOcorrencia={() => solicitacaoMedicaoInicial.ocorrencia}
        />
      )}
      <ModalAtualizarOcorrencia
        showModal={showModal}
        closeModal={() => setShowModal(false)}
        solicitacaoMedicaoInicial={solicitacaoMedicaoInicial}
        onClickInfoBasicas={onClickInfoBasicas}
        setObjSolicitacaoMIFinalizada={(value) =>
          setObjSolicitacaoMIFinalizada(value)
        }
        setFinalizandoMedicao={setFinalizandoMedicao}
      />
    </>
  );
};
