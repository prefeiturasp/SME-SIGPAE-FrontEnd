import Botao from "components/Shareable/Botao";
import {
  BUTTON_ICON,
  BUTTON_STYLE,
  BUTTON_TYPE,
} from "components/Shareable/Botao/constants";
import { toastError, toastSuccess } from "components/Shareable/Toast/dialogs";
import { CODAE, ESCOLA, TERCEIRIZADA } from "configs/constants";
import {
  statusEnum,
  TIPO_PERFIL,
  TIPO_SOLICITACAO_DIETA,
} from "constants/shared";
import HTTP_STATUS from "http-status-codes";
import React, { useEffect, useState } from "react";
import {
  CODAENegaSolicitacaoCancelamento,
  createSolicitacaoAberta,
  deleteSolicitacaoAberta,
  escolaCancelaSolicitacao,
  getDietaEspecial,
  getDietasEspeciaisVigentesDeUmAluno,
  getMotivosNegarSolicitacaoCancelamento,
  updateSolicitacaoAberta,
} from "services/dietaEspecial.service";
import {
  getProtocoloDietaEspecial,
  getRelatorioDietaEspecial,
} from "services/relatorios";
import EscolaCancelaDietaEspecial from "./componentes/EscolaCancelaDietaEspecial";

import { Spin } from "antd";
import ModalHistorico from "components/Shareable/ModalHistorico";
import ModalMarcarConferencia from "components/Shareable/ModalMarcarConferencia";
import {
  usuarioEhCogestorDRE,
  usuarioEhCoordenadorNutriCODAE,
  usuarioEhEmpresaTerceirizada,
  usuarioEhEscola,
  usuarioEhNutricionistaSupervisao,
} from "helpers/utilities";
import { Websocket } from "services/websocket";
import CorpoRelatorio from "./componentes/CorpoRelatorio";
import FormAutorizaDietaEspecial from "./componentes/FormAutorizaDietaEspecial";
import ModalAvisoDietaImportada from "./componentes/ModalAvisoDietaImportada";
import ModalNegaDietaEspecial from "./componentes/ModalNegaDietaEspecial";
import { cabecalhoDieta, ehSolicitacaoDeCancelamento } from "./helpers";
import "./style.scss";

const Relatorio = ({ visao }) => {
  const [dietaEspecial, setDietaEspecial] = useState(null);
  const [carregando, setCarregando] = useState(false);
  const [showNaoAprovaModal, setShowNaoAprovaModal] = useState(false);
  const [showModalMarcarConferencia, setShowModalMarcarConferencia] =
    useState(false);
  const [showModalAviso, setShowModalAviso] = useState(false);
  const [status, setStatus] = useState(undefined);
  const [mostrarHistorico, setMostrarHistorico] = useState(false);
  const [historico, setHistorico] = useState([]);
  const [card, setCard] = useState(null);
  const [uuidDieta, setUuidDieta] = useState(null);
  const [solicitacaoVigenteAtiva, setSolicitacaoVigenteAtiva] = useState(null);
  const [dietasAbertas, setDietasAbertas] = useState([]);
  const [dadosDietaAberta, setDadosDietaAberta] = useState(null);
  const [editar, setEditar] = useState(false);

  const dietaCancelada = status ? ehSolicitacaoDeCancelamento(status) : false;
  const tipoPerfil = localStorage.getItem("tipo_perfil");

  const fetchData = async (uuid) => {
    const payload = {
      uuid_solicitacao: uuid,
    };
    const response = await createSolicitacaoAberta(payload);
    if (response.status === HTTP_STATUS.CREATED) {
      setDadosDietaAberta(response.data);
    }
  };

  const initSocket = (uuid) => {
    return new Websocket(
      "solicitacoes-abertas/",
      ({ data }) => {
        getDietasEspeciaisAbertas(JSON.parse(data));
      },
      () => {
        if (dadosDietaAberta) {
          deleteSolicitacaoAberta(dadosDietaAberta.id);
        }
        initSocket(uuid);
      },
      () => {
        if (uuid) {
          fetchData(uuid);
          setUuidDieta(uuid);
        }
      }
    );
  };

  const habilitarEdicao = () => {
    setEditar(!editar);
  };

  const getDietasEspeciaisAbertas = (content) => {
    content && setDietasAbertas(content.message);
  };

  const loadSolicitacao = async (uuid, setDietaNull = false) => {
    setCarregando(true);
    if (setDietaNull) {
      setDietaEspecial(null);
    }
    const responseDietaEspecial = await getDietaEspecial(uuid);
    if (responseDietaEspecial.status === HTTP_STATUS.OK) {
      setDietaEspecial(responseDietaEspecial.data);
      setStatus(responseDietaEspecial.data.status_solicitacao);
      setHistorico(responseDietaEspecial.data.logs);
      await getSolicitacoesVigentes(
        responseDietaEspecial.data.aluno.codigo_eol
      );
      setCarregando(false);
    } else {
      toastError("Houve um erro ao carregar Solicitação");
    }
  };

  const getSolicitacoesVigentes = async (codigo_eol) => {
    const responseDietasVigentes = await getDietasEspeciaisVigentesDeUmAluno(
      codigo_eol
    );
    if (
      responseDietasVigentes &&
      responseDietasVigentes.status === HTTP_STATUS.OK
    ) {
      setSolicitacaoVigenteAtiva(responseDietasVigentes.data.results);
    } else {
      toastError("Houve um erro ao carregar Solicitação");
    }
  };

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const uuid = urlParams.get("uuid");
    const card = urlParams.get("card");
    if (card) {
      setCard(card);
    }
    loadSolicitacao(uuid);
    tipoPerfil === TIPO_PERFIL.DIETA_ESPECIAL &&
      card === "pendentes-aut" &&
      initSocket(uuid);
  }, []);

  useEffect(() => {
    const intervalCall = setInterval(() => {
      dadosDietaAberta && updateSolicitacaoAberta(dadosDietaAberta.id);
    }, 5000);
    return () => {
      clearInterval(intervalCall);
    };
  }, [dadosDietaAberta]);

  const gerarProtocolo = async (uuid, eh_importado) => {
    if (eh_importado === true && !dietaEspecial.protocolo_padrao) {
      setShowModalAviso(true);
    } else {
      setCarregando(true);
      await getProtocoloDietaEspecial(uuid, dietaEspecial);
      setCarregando(false);
    }
  };

  const gerarRelatorio = async (uuid) => {
    setCarregando(true);
    await getRelatorioDietaEspecial(uuid);
    setCarregando(false);
  };

  const BotaoAutorizaCancelamento = ({ uuid, onAutorizar, setCarregando }) => {
    return (
      <div className="form-group row float-end mt-4">
        <Botao
          texto="Autorizar"
          type={BUTTON_TYPE.BUTTON}
          style={BUTTON_STYLE.GREEN}
          className="ms-3"
          onClick={() => {
            setCarregando(true);
            escolaCancelaSolicitacao(uuid).then(() => {
              onAutorizar();
              toastSuccess(
                "Autorização do Cancelamento realizada com sucesso!"
              );
            });
          }}
        />
      </div>
    );
  };

  const BotaoImprimir = ({ uuid }) => {
    return (
      <Botao
        title="botao_imprimir"
        type={BUTTON_TYPE.BUTTON}
        style={BUTTON_STYLE.GREEN}
        icon={BUTTON_ICON.PRINT}
        className="float-end botaoImprimirDieta"
        onClick={() => gerarRelatorio(uuid)}
      />
    );
  };

  const BotaoMarcarConferencia = () => {
    return (
      <Botao
        texto="Marcar Conferência"
        type={BUTTON_TYPE.BUTTON}
        style={BUTTON_STYLE.GREEN}
        className="ms-3"
        onClick={() => {
          setShowModalMarcarConferencia(true);
        }}
      />
    );
  };

  const BotaoGerarProtocolo = ({ uuid, eh_importado }) => {
    return (
      <div className="form-group float-end mt-4">
        <Botao
          texto="Gerar Protocolo"
          type={BUTTON_TYPE.BUTTON}
          style={BUTTON_STYLE.GREEN_OUTLINE}
          icon={BUTTON_ICON.PRINT}
          className="ms-3"
          onClick={() => {
            gerarProtocolo(uuid, eh_importado);
          }}
        />
      </div>
    );
  };

  const BotaoEditarDieta = ({ nome }) => {
    return (
      <div className="form-group float-end mt-4">
        <Botao
          texto={nome}
          type={BUTTON_TYPE.BUTTON}
          style={BUTTON_STYLE.GREEN_OUTLINE}
          icon={BUTTON_ICON.PEN}
          className="ms-3"
          onClick={() => habilitarEdicao()}
        />
      </div>
    );
  };

  const getHistorico = () => {
    return historico;
  };

  const showModalHistorico = () => {
    setMostrarHistorico(true);
  };

  const handleOk = () => {
    setMostrarHistorico(false);
  };

  const handleCancel = () => {
    setMostrarHistorico(false);
  };

  const dietasFiltradas = () => {
    return dietasAbertas.filter((dieta) =>
      dieta.uuid_solicitacao.includes(uuidDieta)
    );
  };

  window.onbeforeunload = () => {
    dadosDietaAberta && deleteSolicitacaoAberta(dadosDietaAberta.id);
  };

  useEffect(() => {
    return () => {
      dadosDietaAberta && deleteSolicitacaoAberta(dadosDietaAberta.id);
    };
  }, [dadosDietaAberta]);

  const exibirUsuariosSimultaneos = () => {
    return (
      tipoPerfil === TIPO_PERFIL.DIETA_ESPECIAL && card === "pendentes-aut"
    );
  };

  const exibeBotaoImprimir = () => {
    let exibir = true;
    if (dietaEspecial && !editar) {
      if (
        usuarioEhEmpresaTerceirizada() ||
        usuarioEhCogestorDRE() ||
        usuarioEhNutricionistaSupervisao()
      ) {
        exibir = false;
      }
      if (
        usuarioEhEscola() &&
        dietaEspecial.ativo &&
        dietaEspecial.status_solicitacao === "CODAE_AUTORIZADO"
      ) {
        exibir = false;
      }
    }
    return exibir;
  };

  return (
    <Spin tip="Carregando..." spinning={carregando}>
      {dietaEspecial && status && (
        <span className="page-title">
          {cabecalhoDieta(dietaEspecial, card)}
        </span>
      )}
      <div className="card mt-3">
        <div className="card-body">
          <div className="row">
            {exibirUsuariosSimultaneos() && (
              <div className="col-9 mb-3">
                {dietasFiltradas().length > 0 && (
                  <>
                    <div className="col-5 usuarios-simultaneos-title">
                      Usuários visualizando simultaneamente:{" "}
                      {dietasFiltradas().length < 10
                        ? "0" + String(dietasFiltradas().length)
                        : dietasFiltradas().length}
                    </div>
                    <ul className="col-11 usuarios-simultaneos-dietas">
                      {dietasFiltradas().map((dieta, index) => (
                        <li key={index}>
                          {`${dieta.usuario.nome} - RF: ${dieta.usuario.registro_funcional} - ${dieta.usuario.email}`}
                        </li>
                      ))}
                    </ul>
                  </>
                )}
              </div>
            )}
            <div
              className={`${
                exibirUsuariosSimultaneos() ? "col-3" : "col-12"
              } col-3 mb-3`}
            >
              {dietaEspecial && exibeBotaoImprimir() && (
                <BotaoImprimir uuid={dietaEspecial.uuid} />
              )}
              {dietaEspecial && !editar && historico && (
                <Botao
                  type={BUTTON_TYPE.BUTTON}
                  texto="Histórico"
                  style={BUTTON_STYLE.GREEN_OUTLINE}
                  onClick={showModalHistorico}
                  className={`me-2 ${
                    exibirUsuariosSimultaneos() ? "float-end" : "float-start"
                  }`}
                />
              )}
            </div>
          </div>
          {historico.length > 0 && (
            <>
              <ModalHistorico
                visible={mostrarHistorico}
                onOk={handleOk}
                onCancel={handleCancel}
                logs={historico}
                getHistorico={getHistorico}
              />
            </>
          )}
          {dietaEspecial && (
            <>
              <CorpoRelatorio
                dietaEspecial={dietaEspecial}
                dietaCancelada={dietaCancelada}
                card={card}
                solicitacaoVigenteAtiva={solicitacaoVigenteAtiva}
                editar={editar}
              />
              {[
                statusEnum.CODAE_A_AUTORIZAR,
                statusEnum.ESCOLA_SOLICITOU_INATIVACAO,
              ].includes(status) &&
                visao === ESCOLA &&
                !dietaCancelada &&
                ![
                  TIPO_PERFIL.GESTAO_ALIMENTACAO_TERCEIRIZADA,
                  TIPO_PERFIL.NUTRICAO_MANIFESTACAO,
                  TIPO_PERFIL.MEDICAO,
                  TIPO_PERFIL.CODAE_GABINETE,
                ].includes(tipoPerfil) && (
                  <EscolaCancelaDietaEspecial
                    uuid={dietaEspecial.uuid}
                    onCancelar={() => loadSolicitacao(dietaEspecial.uuid)}
                  />
                )}
            </>
          )}
          {(status === statusEnum.CODAE_A_AUTORIZAR ||
            (status === statusEnum.CODAE_AUTORIZADO && editar)) &&
            visao === CODAE && (
              <FormAutorizaDietaEspecial
                dietaEspecial={dietaEspecial}
                onAutorizarOuNegar={(setDietaNull = false) =>
                  loadSolicitacao(dietaEspecial.uuid, setDietaNull)
                }
                visao={visao}
                setTemSolicitacaoCadastroProduto={() =>
                  setDietaEspecial({
                    ...dietaEspecial,
                    tem_solicitacao_cadastro_produto: true,
                  })
                }
                editar={editar}
                cancelar={() => habilitarEdicao()}
              />
            )}

          {dietaEspecial &&
            status === statusEnum.ESCOLA_SOLICITOU_INATIVACAO &&
            visao === CODAE && [
              <BotaoAutorizaCancelamento
                key={0}
                uuid={dietaEspecial.uuid}
                showNaoAprovaModal={showNaoAprovaModal}
                onAutorizar={() => {
                  loadSolicitacao(dietaEspecial.uuid);
                }}
                setCarregando={setCarregando}
              />,
              <div className="form-group row float-end mt-4 me-3" key={1}>
                <Botao
                  texto="Negar"
                  type={BUTTON_TYPE.BUTTON}
                  style={BUTTON_STYLE.RED}
                  className="ms-3"
                  onClick={() => setShowNaoAprovaModal(true)}
                />
              </div>,
            ]}
          {dietaEspecial &&
            visao === TERCEIRIZADA &&
            (status === statusEnum.CODAE_AUTORIZADO ||
              dietaCancelada ||
              status === statusEnum.CODAE_NEGOU_PEDIDO) && (
              <div className="form-group float-end mt-4">
                {dietaEspecial.conferido ? (
                  <label className="ms-3 conferido">
                    <i className="fas fa-check me-2" />
                    Solicitação Conferida
                  </label>
                ) : (
                  <BotaoMarcarConferencia uuid={dietaEspecial.uuid} />
                )}
              </div>
            )}
          {dietaEspecial &&
            status === statusEnum.CODAE_AUTORIZADO &&
            !["inativas", "inativas-temp"].includes(card) && (
              <>
                {!editar && (
                  <BotaoGerarProtocolo
                    uuid={dietaEspecial.uuid}
                    eh_importado={dietaEspecial.eh_importado}
                  />
                )}
                {dietaEspecial.tipo_solicitacao !==
                  TIPO_SOLICITACAO_DIETA.ALTERACAO_UE &&
                  !editar &&
                  usuarioEhCoordenadorNutriCODAE() && (
                    <BotaoEditarDieta nome="Editar" />
                  )}
              </>
            )}
        </div>
      </div>
      {dietaEspecial && (
        <ModalNegaDietaEspecial
          showModal={showNaoAprovaModal}
          closeModal={() => setShowNaoAprovaModal(false)}
          onNegar={() => {
            loadSolicitacao(dietaEspecial.uuid);
          }}
          uuid={dietaEspecial.uuid}
          getMotivos={() => getMotivosNegarSolicitacaoCancelamento()}
          submitModal={(uuid, values) =>
            CODAENegaSolicitacaoCancelamento(uuid, values)
          }
          fieldJustificativa={"justificativa"}
          tituloModal={"Deseja negar a solicitação de cancelamento?"}
        />
      )}
      {dietaEspecial && (
        <ModalMarcarConferencia
          showModal={showModalMarcarConferencia}
          closeModal={() => setShowModalMarcarConferencia(false)}
          onMarcarConferencia={() => {
            loadSolicitacao(dietaEspecial.uuid);
          }}
          uuid={dietaEspecial.uuid}
          endpoint="solicitacoes-dieta-especial"
        />
      )}
      <ModalAvisoDietaImportada
        closeModal={() => setShowModalAviso(false)}
        showModal={showModalAviso}
      />
    </Spin>
  );
};

export default Relatorio;
