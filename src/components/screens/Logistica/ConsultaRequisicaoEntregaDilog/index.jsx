import React, { useEffect, useState, useRef, useContext } from "react";
import HTTP_STATUS from "http-status-codes";
import { Spin } from "antd";
import {
  getRequisicoesListagem,
  gerarExcelSolicitacoes,
  arquivaGuias,
  desarquivaGuias,
} from "../../../../services/logistica.service";
import ListagemSolicitacoes from "./components/ListagemSolicitacoes";
import "./styles.scss";
import Filtros from "./components/Filtros";
import { gerarParametrosConsulta } from "src/helpers/utilities";
import Botao from "src/components/Shareable/Botao";
import {
  BUTTON_TYPE,
  BUTTON_STYLE,
  BUTTON_ICON,
} from "src/components/Shareable/Botao/constants";
import { enviaSolicitacoesDaGrade } from "../../../../services/disponibilizacaoDeSolicitacoes.service";
import {
  toastError,
  toastInfo,
  toastSuccess,
} from "src/components/Shareable/Toast/dialogs";
import { Modal } from "react-bootstrap";
import { CentralDeDownloadContext } from "src/context/CentralDeDownloads/index";
import ModalSolicitacaoDownload from "src/components/Shareable/ModalSolicitacaoDownload/index.jsx";
import { Paginacao } from "src/components/Shareable/Paginacao/index.jsx";
import useSomenteLeitura from "src/hooks/useSomenteLeitura";
import { PERFIL } from "../../../../constants/shared";

export default () => {
  const [carregando, setCarregando] = useState(false);
  const [carregandoModal, setCarregandoModal] = useState(false);
  const [solicitacoes, setSolicitacoes] = useState();
  const [ativos, setAtivos] = useState([]);
  const [filtros, setFiltros] = useState();
  const [total, setTotal] = useState();
  const [page, setPage] = useState();
  const [carregandoExcel, setCarregandoExcel] = useState(false);
  const [selecionados, setSelecionados] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [showDownload, setShowDownload] = useState(false);
  const [initialValues, setInitialValues] = useState({});

  const centralDownloadContext = useContext(CentralDeDownloadContext);

  const inicioResultado = useRef();
  const somenteLeitura = useSomenteLeitura([
    PERFIL.ADMINISTRADOR_CODAE_GABINETE,
    PERFIL.DILOG_DIRETORIA,
  ]);

  const buscarSolicitacoes = async (page) => {
    setCarregando(true);
    const params = gerarParametrosConsulta({ page: page, ...filtros });
    try {
      const response = await getRequisicoesListagem(params);
      if (response.data.count) {
        setSolicitacoes(response.data.results);
        setTotal(response.data.count);
        inicioResultado.current.scrollIntoView();
      } else {
        setSolicitacoes(null);
        setTotal(response.data.count);
      }
    } catch (erro) {
      if (erro.response) {
        if (typeof erro.response.data === "object") {
          let chave = Object.keys(erro.response.data);
          let msn_erro_return = erro.response.data[chave[0]];
          let msg_erro = Array.isArray(msn_erro_return)
            ? msn_erro_return[0]
            : msn_erro_return;
          toastError(msg_erro);
        } else {
          toastError("Erro do Servidor Interno");
        }
        setSolicitacoes(null);
        setTotal(null);
      }
    }
    setAtivos([]);
    setCarregando(false);
  };

  const enviarSolicitacoesMarcadas = async () => {
    setCarregandoModal(true);
    let payload = selecionados.map((x) => x.uuid);
    const response = await enviaSolicitacoesDaGrade(payload);
    if (response.status === HTTP_STATUS.OK && response.data.length === 0) {
      atualizaTabela();
      setShowModal(false);
      response.status = 428;
    } else if (response.status === HTTP_STATUS.OK && response.data.length > 0) {
      atualizaTabela();
      setShowModal(false);
    }
    setCarregandoModal(false);
    exibeToastPeloStatus(response.status, response.data);
  };

  const exibeToastPeloStatus = (status, data) => {
    if (status === HTTP_STATUS.OK) {
      toastSuccess("Requisições de entrega enviadas com sucesso");
    } else if (status === HTTP_STATUS.BAD_REQUEST) {
      if (data.detail.includes("transição de estado")) {
        toastError("Erro de transição de estado");
      } else {
        toastError(data.detail);
      }
    } else if (status === HTTP_STATUS.PRECONDITION_REQUIRED) {
      toastInfo("Nenhuma requisição de entrega a enviar");
    } else {
      if (data.detail && data.detail.length > 0) {
        toastError(data.detail);
      } else {
        toastError("Erro do Servidor Interno");
      }
    }
  };

  const atualizaTabela = () => {
    buscarSolicitacoes(page ? page : 1);
  };

  const confereSolicitacoesSelecionadas = () => {
    return (
      selecionados.find(
        (selecionado) => selecionado.status !== "Aguardando envio"
      ) !== undefined || selecionados.length === 0
    );
  };

  const arquivaDesarquivaGuias = async (
    selecionadas,
    numero_requisicao,
    situacao,
    setModal,
    setCarregando
  ) => {
    setCarregando(true);
    let guias = selecionadas.map((x) => x.numero_guia);
    const payload = { guias, numero_requisicao };
    let textoToast =
      situacao === "ATIVA"
        ? "Guia(s) de Remessa arquivada(s) com sucesso"
        : "Guia(s) de Remessa desarquivada(s) com sucesso";
    let response =
      situacao === "ATIVA"
        ? await arquivaGuias(payload)
        : await desarquivaGuias(payload);
    if (response.status === HTTP_STATUS.OK) {
      atualizaTabela();
      toastSuccess(textoToast);
      setModal(false);
    } else {
      toastError("Erro ao arquivar a guia");
    }
    setCarregando(false);
  };

  const solicitaExcelGuias = () => {
    setCarregandoExcel(true);
    const params = gerarParametrosConsulta({ ...filtros });
    gerarExcelSolicitacoes(params).then(() => {
      setCarregandoExcel(false);
      setShowDownload(true);
      centralDownloadContext.getQtdeDownloadsNaoLidas();
    });
  };

  useEffect(() => {
    const queryString = window.location.search;

    if (queryString) {
      const urlParams = new URLSearchParams(window.location.search);
      const codigo = urlParams.get("numero_requisicao");
      const filtro = {
        numero_requisicao: codigo,
      };
      setFiltros({ ...filtro });
      setInitialValues({ ...filtro });
    }
  }, []);

  useEffect(() => {
    if (filtros) {
      buscarSolicitacoes(1);
      setPage(1);
    }
  }, [filtros]);

  const nextPage = (page) => {
    buscarSolicitacoes(page);
    setPage(page);
  };

  return (
    <Spin tip="Carregando..." spinning={carregando}>
      <ModalSolicitacaoDownload show={showDownload} setShow={setShowDownload} />
      <div className="card mt-3 card-consulta-requisicao-entrega">
        <div className="card-body gestao-requisicao-entrega">
          <Filtros
            setFiltros={setFiltros}
            setSolicitacoes={setSolicitacoes}
            initialValues={initialValues}
            setInitialValues={setInitialValues}
            inicioResultado={inicioResultado}
          />
          {solicitacoes && (
            <>
              <br /> <hr /> <br />
              <ListagemSolicitacoes
                solicitacoes={solicitacoes}
                selecionados={selecionados}
                setSelecionados={setSelecionados}
                ativos={ativos}
                setAtivos={setAtivos}
                arquivaDesarquivaGuias={arquivaDesarquivaGuias}
                setShowDownload={setShowDownload}
                somenteLeitura={somenteLeitura}
              />
              <div className="row">
                <div className="col">
                  <Paginacao
                    className="mt-3 mb-3"
                    current={page || 1}
                    total={total}
                    showSizeChanger={false}
                    onChange={nextPage}
                    pageSize={10}
                  />
                </div>
                <div className="d-flex align-items-end">
                  <Botao
                    texto="Enviar"
                    type={BUTTON_TYPE.BUTTON}
                    style={BUTTON_STYLE.GREEN_OUTLINE}
                    className="ms-2 me-2"
                    onClick={() => {
                      setShowModal(true);
                    }}
                    disabled={
                      somenteLeitura || confereSolicitacoesSelecionadas()
                    }
                  />
                  <Spin size="small" spinning={carregandoExcel}>
                    <Botao
                      texto="Planilha Relatório Consolidado"
                      type={BUTTON_TYPE.BUTTON}
                      style={BUTTON_STYLE.GREEN_OUTLINE}
                      icon={BUTTON_ICON.FILE_EXCEL}
                      className="ms-2 me-2"
                      onClick={solicitaExcelGuias}
                    />
                  </Spin>
                </div>
              </div>
            </>
          )}

          {total === 0 && (
            <div className="text-center mt-5">
              Não existe informação para os critérios de busca utilizados.
            </div>
          )}
        </div>
      </div>

      <Modal
        show={showModal}
        onHide={() => {
          setShowModal(false);
        }}
      >
        <Spin tip="Enviando..." spinning={carregandoModal}>
          <Modal.Header closeButton>
            <Modal.Title>Atenção</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            {selecionados.length === 1
              ? `Deseja enviar a Requisição de Entrega n° ${selecionados[0].numero_solicitacao} ? `
              : `Deseja enviar as seguintes Requisições de Entrega n° ${selecionados
                  .map((x) => x.numero_solicitacao)
                  .join("; ")} ? `}
          </Modal.Body>
          <Modal.Footer>
            <Botao
              texto="SIM"
              type={BUTTON_TYPE.BUTTON}
              onClick={() => {
                enviarSolicitacoesMarcadas();
              }}
              style={BUTTON_STYLE.GREEN}
              className="ms-3"
              disabled={carregandoModal}
            />
            <Botao
              texto="NÃO"
              type={BUTTON_TYPE.BUTTON}
              onClick={() => {
                setShowModal(false);
              }}
              style={BUTTON_STYLE.GREEN_OUTLINE}
              className="ms-3"
            />
          </Modal.Footer>
        </Spin>
      </Modal>
    </Spin>
  );
};
