import React, { useState, useEffect, useContext } from "react";
import { Modal, Button } from "react-bootstrap";
import Botao from "src/components/Shareable/Botao";
import {
  BUTTON_TYPE,
  BUTTON_STYLE,
} from "src/components/Shareable/Botao/constants";
import { Spin } from "antd";
import { gerarParametrosConsulta } from "src/helpers/utilities";
import {
  gerarExcelEntregas,
  imprimirGuiasDaSolicitacao,
} from "src/services/logistica.service";
import { Switch, Checkbox } from "antd";

import "./styles.scss";
import { STATUS_GUIA } from "../../../../const";
import { toastError } from "src/components/Shareable/Toast/dialogs";
import { CentralDeDownloadContext } from "src/context/CentralDeDownloads";

export default ({ solicitacao, excel, pdf, showModal }) => {
  const [show, setShow] = useState(false);
  const [loading, setLoading] = useState(false);
  const [conferidas, setConferidas] = useState(false);
  const [insucesso, setInsucesso] = useState(false);
  const [pendentes, setPendentes] = useState(false);
  const [recebidas, setRecebidas] = useState(false);
  const [parciais, setParciais] = useState(false);
  const [naoRecebidas, setNaoRecebidas] = useState(false);
  const [repoParcial, setRepoParcial] = useState(false);
  const [repoTotal, setRepoTotal] = useState(false);

  const centralDownloadContext = useContext(CentralDeDownloadContext);

  const thenDownload = () => {
    showModal(true);
    setLoading(false);
    handleClose();
    centralDownloadContext.getQtdeDownloadsNaoLidas();
  };

  const catchDownload = (error) => {
    error.response.data.text().then((text) => toastError(text));
    setLoading(false);
  };

  const handleDownload = () => {
    setLoading(true);
    let uuid = solicitacao.uuid;
    let payload = montaPayload();
    if (excel) {
      const params = gerarParametrosConsulta({ uuid, ...payload });
      gerarExcelEntregas(params).then(thenDownload).catch(catchDownload);
    } else if (pdf) {
      const params = gerarParametrosConsulta(payload);
      imprimirGuiasDaSolicitacao(uuid, params)
        .then(thenDownload)
        .catch(catchDownload);
    }
  };

  const montaPayload = () => {
    let status_guia = [];
    let tem_insucesso = insucesso;
    let tem_conferencia = conferidas || pendentes;
    let nome_arquivo = "entregas_requisicao";

    if (pendentes) status_guia.push(STATUS_GUIA.PENDENTE);
    if (recebidas) status_guia.push(STATUS_GUIA.RECEBIDA);
    if (parciais) status_guia.push(STATUS_GUIA.PARCIAL);
    if (naoRecebidas) status_guia.push(STATUS_GUIA.NAO_RECEBIDO);
    if (repoParcial) status_guia.push(STATUS_GUIA.REPOSICAO_PARCIAL);
    if (repoTotal) status_guia.push(STATUS_GUIA.REPOSICAO_TOTAL);

    // Caso especifico para onde o usuário não marca nenhuma opção
    if (!tem_insucesso && !tem_conferencia) {
      tem_insucesso = true;
      tem_conferencia = true;
      status_guia = [
        STATUS_GUIA.PENDENTE,
        STATUS_GUIA.RECEBIDA,
        STATUS_GUIA.PARCIAL,
        STATUS_GUIA.NAO_RECEBIDO,
        STATUS_GUIA.REPOSICAO_TOTAL,
        STATUS_GUIA.REPOSICAO_PARCIAL,
      ];
    }

    return { status_guia, tem_conferencia, tem_insucesso, nome_arquivo };
  };

  const handleClose = () => {
    setShow(false);
    desligaTodosFiltros();
  };
  const handleShow = () => setShow(true);

  const desligaTodosFiltros = () => {
    desligaConferidas();
    setInsucesso(false);
    setPendentes(false);
  };

  const desligaConferidas = () => {
    setConferidas(false);
    setRecebidas(false);
    setParciais(false);
    setNaoRecebidas(false);
    setRepoParcial(false);
    setRepoTotal(false);
  };

  const validaCampos = () => {
    return (
      conferidas &&
      !recebidas &&
      !parciais &&
      !naoRecebidas &&
      !repoParcial &&
      !repoTotal
    );
  };

  const checkAllConferidas = (e) => {
    setRecebidas(e.target.checked);
    setParciais(e.target.checked);
    setNaoRecebidas(e.target.checked);
    setRepoParcial(e.target.checked);
    setRepoTotal(e.target.checked);
  };

  const totalGuiasConferidas =
    solicitacao.guias_parciais +
    solicitacao.guias_recebidas +
    solicitacao.guias_nao_recebidas +
    solicitacao.guias_reposicao_parcial +
    solicitacao.guias_reposicao_total;

  useEffect(() => {
    if (!conferidas) {
      desligaConferidas();
    }
  }, [conferidas]);

  const verificaConferidas =
    recebidas && parciais && naoRecebidas && repoParcial && repoTotal;

  return (
    <>
      {excel && (
        <Button className="acoes" variant="link" onClick={() => handleShow()}>
          <i className="fas fa-file-excel green" />
          <span className="link-exportar">Planilha</span>
        </Button>
      )}

      {pdf && (
        <Button className="acoes" variant="link" onClick={() => handleShow()}>
          <i className="fas fa-file-pdf red" />
          <span className="link-exportar">PDF</span>
        </Button>
      )}

      <Modal show={show} onHide={handleClose} dialogClassName="modal-entregas">
        <Spin tip="Carregando..." spinning={loading}>
          <Modal.Header closeButton>
            <Modal.Title>
              Exportar Relatório com seguintes status de Guia de Remessa
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <div className="switch-container">
              {totalGuiasConferidas > 0 && (
                <div className="switch-box">
                  <div className="switch-label">Guias Conferidas</div>
                  <Switch onChange={() => setConferidas(!conferidas)} />
                </div>
              )}
              {solicitacao.guias_insucesso > 0 && (
                <div className="switch-box">
                  <div className="switch-label">Guias Insucesso</div>
                  <Switch onChange={() => setInsucesso(!insucesso)} />
                </div>
              )}

              {solicitacao.guias_pendentes > 0 && (
                <div className="switch-box">
                  <div className="switch-label">Guias Pendentes</div>
                  <Switch onChange={() => setPendentes(!pendentes)} />
                </div>
              )}
            </div>

            {conferidas && (
              <div className="checkbox-container">
                <div className="checkbox-title">
                  Escolha os tipos de guias conferidas
                </div>
                <Checkbox
                  checked={verificaConferidas}
                  onChange={checkAllConferidas}
                >
                  Todas
                </Checkbox>
                {solicitacao.guias_recebidas > 0 && (
                  <Checkbox
                    checked={recebidas}
                    onChange={() => setRecebidas(!recebidas)}
                  >
                    Recebidas
                  </Checkbox>
                )}
                {solicitacao.guias_parciais > 0 && (
                  <Checkbox
                    checked={parciais}
                    onChange={() => setParciais(!parciais)}
                  >
                    Parciais
                  </Checkbox>
                )}
                {solicitacao.guias_nao_recebidas > 0 && (
                  <Checkbox
                    checked={naoRecebidas}
                    onChange={() => setNaoRecebidas(!naoRecebidas)}
                  >
                    Não Recebidas
                  </Checkbox>
                )}
                {solicitacao.guias_reposicao_parcial > 0 && (
                  <Checkbox
                    checked={repoParcial}
                    onChange={() => setRepoParcial(!repoParcial)}
                  >
                    Reposição Parcial
                  </Checkbox>
                )}
                {solicitacao.guias_reposicao_total > 0 && (
                  <Checkbox
                    checked={repoTotal}
                    onChange={() => setRepoTotal(!repoTotal)}
                  >
                    Reposição Total
                  </Checkbox>
                )}
              </div>
            )}
          </Modal.Body>
          <Modal.Footer>
            <Botao
              texto="Exportar"
              type={BUTTON_TYPE.BUTTON}
              style={BUTTON_STYLE.GREEN}
              className="ms-3"
              onClick={handleDownload}
              disabled={validaCampos()}
            />
          </Modal.Footer>
        </Spin>
      </Modal>
    </>
  );
};
