import React, { useState } from "react";
import { Modal } from "react-bootstrap";
import Botao from "src/components/Shareable/Botao";
import {
  BUTTON_STYLE,
  BUTTON_TYPE,
} from "src/components/Shareable/Botao/constants";
import "./style.scss";
import { HistoricoCorrecaoSolicitada } from "./HistoricoCorrecaoSolicitada";
import { HistoricoCorrecaoEscola } from "./HistoricoCorrecaoEscola";
import { HistoricoAprovacao } from "./HistoricoAprovacao";
import { Tooltip } from "antd";

export const ModalHistoricoCorrecoesPeriodo = ({ ...props }) => {
  const { showModal, setShowModal, solicitacao, historicos } = props;
  const [detalhesHistoricoAtivo, setDetalhesHistoricoAtivo] = useState(<p />);
  const [activeIdx, setActiveIdx] = useState(undefined);

  const formatarTitulo = (acao) => {
    switch (acao) {
      case "MEDICAO_CORRECAO_SOLICITADA":
        return "Devolvidos para ajustes pela DRE";
      case "MEDICAO_CORRECAO_SOLICITADA_CODAE":
        return "Devolvidos para ajustes pela CODAE";
      case "MEDICAO_CORRIGIDA_PELA_UE":
        return "Corrigidos para DRE";
      case "MEDICAO_CORRIGIDA_PARA_CODAE":
        return "Corrigidos para CODAE";
      case "MEDICAO_APROVADA_PELA_DRE":
        return "Aprovado pela DRE";
      case "MEDICAO_APROVADA_PELA_CODAE":
        return "Aprovado pela CODAE";
      default:
        return acao;
    }
  };

  const instituicao = (acao) => {
    switch (acao) {
      case "MEDICAO_APROVADA_PELA_DRE":
        return "DRE";
      case "MEDICAO_APROVADA_PELA_CODAE":
        return "CODAE";
      default:
        return acao;
    }
  };

  const retornaIniciais = (email) => {
    const nome = email.split(" ");
    let iniciais = "";
    nome.forEach((n, index) => {
      if (index <= 1) {
        iniciais = iniciais.concat(n.charAt(0)).toUpperCase();
      }
    });
    return iniciais;
  };

  const selecionarHistorico = (index, acao) => {
    switch (acao) {
      case "MEDICAO_CORRECAO_SOLICITADA":
      case "MEDICAO_CORRECAO_SOLICITADA_CODAE":
        setDetalhesHistoricoAtivo(
          <HistoricoCorrecaoSolicitada
            historico={historicos[index]}
            retornaIniciais={retornaIniciais}
            solicitacao={solicitacao}
            formatarTitulo={(acao) => formatarTitulo(acao)}
          />
        );
        break;
      case "MEDICAO_CORRIGIDA_PELA_UE":
      case "MEDICAO_CORRIGIDA_PARA_CODAE":
        setDetalhesHistoricoAtivo(
          <HistoricoCorrecaoEscola
            historico={historicos[index]}
            retornaIniciais={retornaIniciais}
            solicitacao={solicitacao}
            formatarTitulo={(acao) => formatarTitulo(acao)}
          />
        );
        break;
      case "MEDICAO_APROVADA_PELA_DRE":
      case "MEDICAO_APROVADA_PELA_CODAE":
        setDetalhesHistoricoAtivo(
          <HistoricoAprovacao
            historico={historicos[index]}
            retornaIniciais={retornaIniciais}
            solicitacao={solicitacao}
            formatarTitulo={(acao) => formatarTitulo(acao)}
            instituicao={(acao) => instituicao(acao)}
          />
        );
        break;
      default:
        setDetalhesHistoricoAtivo(<p />);
        break;
    }
  };

  const closeModal = () => {
    setDetalhesHistoricoAtivo(<p />);
    setActiveIdx(undefined);
    setShowModal(false);
  };

  return (
    <Modal
      dialogClassName="modal-60w"
      show={showModal}
      onHide={() => closeModal()}
    >
      <Modal.Header closeButton>
        <Modal.Title>
          <div className="cor-titulo-modal">Histórico de Correções</div>
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div className="row">
          <div className="col-5">
            <h5 className="cor-titulo-modal mb-3">Usuário</h5>
            {historicos &&
              historicos.map((historico, idxHistorico) => {
                return (
                  <div
                    className={`col-12 mb-2 cards-usuario pt-2 pb-2 ${
                      activeIdx === idxHistorico ? "historico-ativo" : ""
                    }`}
                    key={idxHistorico}
                    onClick={() => {
                      setActiveIdx(idxHistorico);
                      selecionarHistorico(idxHistorico, historico.acao);
                    }}
                  >
                    <div className="row">
                      <div className="col-2">
                        <p className="align-middle text-center iniciais-usuario mb-0">
                          {retornaIniciais(historico.usuario.email)}
                        </p>
                      </div>
                      <div className="col-7 mb-1">
                        <Tooltip title={formatarTitulo(historico.acao)}>
                          <span className="mb-0">
                            <b>
                              {formatarTitulo(historico.acao).length > 23
                                ? `${formatarTitulo(historico.acao).substr(
                                    0,
                                    23
                                  )}...`
                                : formatarTitulo(historico.acao)}
                            </b>
                            <br />
                          </span>
                        </Tooltip>
                        <span className="mb-0">
                          {historico.usuario.nome.substr(0, 21)}
                        </span>
                      </div>
                      <div className="col-3 mb-1">
                        <span className="mb-0 float-end">
                          {historico.criado_em
                            .split(" ")[0]
                            .replaceAll("-", "/")}
                          <br />
                        </span>
                        <span className="mb-0 float-end">
                          {historico.criado_em.split(" ")[1]}
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
          </div>
          <div className="col-7">
            <h5 className="mb-3 cor-titulo-modal">Ações</h5>
            <div className="col-12 detalhes-historico">
              {detalhesHistoricoAtivo}
            </div>
          </div>
        </div>
      </Modal.Body>
      <Modal.Footer>
        <Botao
          className="float-end"
          texto="Fechar"
          type={BUTTON_TYPE.BUTTON}
          onClick={() => closeModal()}
          style={BUTTON_STYLE.GREEN}
        />
      </Modal.Footer>
    </Modal>
  );
};
