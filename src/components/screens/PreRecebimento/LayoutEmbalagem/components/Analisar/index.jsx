import React, { useEffect, useState, useContext } from "react";
import { Spin } from "antd";
import "./styles.scss";
import { PRE_RECEBIMENTO } from "configs/constants";
import { useNavigate } from "react-router-dom";
import { detalharLayoutEmabalagem } from "services/layoutEmbalagem.service";
import { TextArea } from "components/Shareable/TextArea/TextArea";
import BotaoAnexo from "components/PreRecebimento/BotaoAnexo";
import Botao from "components/Shareable/Botao";
import {
  BUTTON_TYPE,
  BUTTON_STYLE,
} from "components/Shareable/Botao/constants";
import { Field, Form } from "react-final-form";
import MeusDadosContext from "context/MeusDadosContext";
import moment from "moment";
import { textAreaRequired } from "helpers/fieldValidators";
import ModalCancelarCorrecao from "./components/ModalCancelarCorrecao";
import { PAINEL_LAYOUT_EMBALAGEM } from "../../../../../../configs/constants";
import ModalCancelarAnalise from "./components/ModalCancelarAnalise";
import ModalEnviarAnalise from "./components/ModalEnviarAnalise";
import { analiseCodaeLayoutEmbalagem } from "../../../../../../services/layoutEmbalagem.service";
import {
  toastError,
  toastSuccess,
} from "../../../../../Shareable/Toast/dialogs";
import { FluxoDeStatusPreRecebimento } from "components/Shareable/FluxoDeStatusPreRecebimento";
import { PERFIL } from "constants/shared";
import useSomenteLeitura from "hooks/useSomenteLeitura";

export default () => {
  const navigate = useNavigate();

  const { meusDados } = useContext(MeusDadosContext);
  const somenteLeitura = useSomenteLeitura([
    PERFIL.ADMINISTRADOR_CODAE_GABINETE,
    PERFIL.DILOG_DIRETORIA,
  ]);

  const [carregando, setCarregando] = useState(true);
  const [layoutDeEmbalagem, setLayoutDeEmbalagem] = useState({});
  const [initialValues, setInitialValues] = useState({});
  const [aprovacoes, setAprovacoes] = useState([]);
  const [modalEnviar, setModalEnviar] = useState(false);
  const [modalCancelarAnalise, setModalCancelarAnalise] = useState(false);
  const [modaisCancelarCorrecao, setModaisCancelarCorrecao] = useState([
    false,
    false,
    false,
  ]);
  const [embalagemTerciariaSolicitada, setEmbalagemTerciariaSolicitada] =
    useState(false);

  useEffect(() => {
    (async () => {
      await carregarDados();
      setCarregando(false);
    })();
  }, []);

  const carregarDados = async () => {
    const urlParams = new URLSearchParams(window.location.search);
    const uuid = urlParams.get("uuid");
    const response = await detalharLayoutEmabalagem(uuid);

    const layoutDeEmbalagem = definirLayoutDeEmbalagem(response);
    setLayoutDeEmbalagem(layoutDeEmbalagem);

    const aprovacoes = definirAprovacoes(layoutDeEmbalagem);
    setAprovacoes(aprovacoes);

    const initialValues = definirInitialValues(layoutDeEmbalagem, aprovacoes);
    setInitialValues(initialValues);
  };

  const definirLayoutDeEmbalagem = (response) => {
    const layoutDeEmbalagem = response.data;

    layoutDeEmbalagem.tipos_de_embalagens = ordenaTiposDeEmbalagem(
      layoutDeEmbalagem.tipos_de_embalagens
    );

    return layoutDeEmbalagem;
  };

  const ordenaTiposDeEmbalagem = (tiposDeEmbalagem) => {
    return tiposDeEmbalagem.sort((a, b) => {
      const embalagemA = a.tipo_embalagem.toUpperCase();
      const embalagemB = b.tipo_embalagem.toUpperCase();
      if (embalagemA < embalagemB) return -1;
      if (embalagemA > embalagemB) return 1;
      return 0;
    });
  };

  const definirAprovacoes = (layoutDeEmbalagem) => {
    const aprovacoes = layoutDeEmbalagem.tipos_de_embalagens.map(
      (tipoEmbalagem) =>
        tipoEmbalagem.status === "APROVADO" ? true : undefined
    );

    return aprovacoes;
  };

  const definirInitialValues = (objeto, aprovacoes) => {
    const initialValues =
      aprovacoes.length > 0
        ? {
            justificativa_0:
              objeto.tipos_de_embalagens[0].complemento_do_status,
            justificativa_1:
              objeto.tipos_de_embalagens[1].complemento_do_status,
            justificativa_2:
              objeto.tipos_de_embalagens.length === 3
                ? objeto.tipos_de_embalagens[2].complemento_do_status
                : "",
          }
        : {
            justificativa_0: "",
            justificativa_1: "",
            justificativa_2: "",
          };

    return initialValues;
  };

  const atualizaModalCancelarCorrecao = (index, value) => {
    let newModais = [...modaisCancelarCorrecao];
    newModais[index] = value;
    setModaisCancelarCorrecao(newModais);
  };

  const atualizarAprovacoes = (index, value) => {
    let newAprovacoes = [...aprovacoes];
    newAprovacoes[index] = value;
    setAprovacoes(newAprovacoes);
  };

  const retornaBotoesAprovacao = (index, form) => {
    const textoAprovacao = `Embalagem Aprovada em ${moment().format(
      "DD/MM/YYYY - HH:mm"
    )}\n|Por: ${meusDados?.nome}`;

    return (
      <div className="mt-4">
        <Botao
          texto="Aprovar"
          type={BUTTON_TYPE.BUTTON}
          style={BUTTON_STYLE.GREEN}
          icon="fas fa-check"
          onClick={() => {
            atualizarAprovacoes(index, true);
            form.change(`justificativa_${index}`, textoAprovacao);
          }}
          disabled={aprovacoes[index] !== undefined}
        />

        <Botao
          texto="Reprovar"
          type={BUTTON_TYPE.BUTTON}
          style={BUTTON_STYLE.GREEN_OUTLINE}
          icon="fas fa-times"
          className="ms-4"
          onClick={() => {
            atualizarAprovacoes(index, false);
            form.change(`justificativa_${index}`, "");
          }}
          disabled={aprovacoes[index] === false}
        />
      </div>
    );
  };

  const retornaTextoAprovacaoOuCampoCorrecao = (index, values, form) => {
    if (aprovacoes[index] === true)
      return renderizarTextoAprovacao(values, index);

    if (aprovacoes[index] === false)
      return renderizarCampoCorrecao(index, form);

    if (aprovacoes[index] === undefined && !layoutDeEmbalagem.primeira_analise)
      return renderizarCampoCorrecaoBloqueado(index);
  };

  const renderizarTextoAprovacao = (values, index) => {
    const [dataHoraAprovacao, usuarioAprovacao] =
      values[`justificativa_${index}`].split("|");

    return (
      <div className="col-7 d-flex align-items-center">
        <div className="subtitulo d-flex align-items-center ms-5">
          <div className="w-5">
            <i className="fas fa-check me-3 fa-2x" />
          </div>
          <div className="w-95">
            <div>{dataHoraAprovacao}</div>
            <div>{usuarioAprovacao}</div>
          </div>
        </div>
      </div>
    );
  };

  const renderizarCampoCorrecao = (index, form) => (
    <div className="col-7">
      <Field
        component={TextArea}
        label="Correções Necessárias"
        name={`justificativa_${index}`}
        placeholder="Qual a sua observação para essa decisão?"
        required
        validate={textAreaRequired}
      />

      {layoutDeEmbalagem.status !== "Solicitado Correção" && (
        <Botao
          texto="Cancelar"
          type={BUTTON_TYPE.BUTTON}
          style={BUTTON_STYLE.GREEN_OUTLINE}
          className="float-end ms-3"
          onClick={() => {
            atualizaModalCancelarCorrecao(index, true);
          }}
        />
      )}

      <ModalCancelarCorrecao
        show={modaisCancelarCorrecao[index]}
        handleClose={() => {
          atualizaModalCancelarCorrecao(index, false);
        }}
        cancelar={() => {
          atualizarAprovacoes(
            index,
            definirAprovacoes(layoutDeEmbalagem)[index]
          );

          form.change(
            `justificativa_${index}`,
            layoutDeEmbalagem.tipos_de_embalagens[index]
              ?.complemento_do_status || ""
          );

          !layoutDeEmbalagem.tipos_de_embalagens[index] &&
            setEmbalagemTerciariaSolicitada(false);
        }}
      />
    </div>
  );

  const renderizarCampoCorrecaoBloqueado = (index) => (
    <div className="col-7">
      <Field
        component={TextArea}
        label="Correções Necessárias"
        name={`justificativa_${index}`}
        placeholder="Qual a sua observação para essa decisão?"
        required
        validate={textAreaRequired}
        disabled
      />
    </div>
  );

  const onSubmit = () => {
    setModalEnviar(true);
  };

  const enviarAnalise = async (values) => {
    setCarregando(true);

    let payload = formataPayload(values);
    try {
      let response = await analiseCodaeLayoutEmbalagem(
        layoutDeEmbalagem.uuid,
        payload
      );
      if (response.status === 201 || response.status === 200) {
        toastSuccess("Sua avaliação foi enviada com sucesso!");
        voltarPaginaPainel();
      } else {
        toastError("Ocorreu um erro ao analisar o Layout da Embalagem");
      }
    } catch (error) {
      toastError(error, "Ocorreu um erro ao analisar o Layout da Embalagem");
    } finally {
      setCarregando(false);
    }
  };

  const formataPayload = (values) => {
    let payload = {};

    payload.tipos_de_embalagens = [];

    layoutDeEmbalagem.tipos_de_embalagens[0].status === "EM_ANALISE" &&
      payload.tipos_de_embalagens.push({
        uuid: layoutDeEmbalagem.tipos_de_embalagens[0].uuid,
        tipo_embalagem: "PRIMARIA",
        status: getAprovacao(0),
        complemento_do_status: values[`justificativa_${0}`],
      });

    layoutDeEmbalagem.tipos_de_embalagens[1].status === "EM_ANALISE" &&
      payload.tipos_de_embalagens.push({
        uuid: layoutDeEmbalagem.tipos_de_embalagens[1].uuid,
        tipo_embalagem: "SECUNDARIA",
        status: getAprovacao(1),
        complemento_do_status: values[`justificativa_${1}`],
      });

    layoutDeEmbalagem.tipos_de_embalagens[2] &&
      layoutDeEmbalagem.tipos_de_embalagens[2].status === "EM_ANALISE" &&
      payload.tipos_de_embalagens.push({
        uuid: layoutDeEmbalagem.tipos_de_embalagens[2].uuid,
        tipo_embalagem: "TERCIARIA",
        status: getAprovacao(2),
        complemento_do_status: values[`justificativa_${2}`],
      });

    return payload;
  };

  const getAprovacao = (index) =>
    aprovacoes[index] ? "APROVADO" : "REPROVADO";

  const voltarPaginaPainel = () =>
    navigate(`/${PRE_RECEBIMENTO}/${PAINEL_LAYOUT_EMBALAGEM}`);

  const validaAprovacoes =
    aprovacoes[0] !== undefined &&
    aprovacoes[1] !== undefined &&
    (!layoutDeEmbalagem.tipos_de_embalagens[2] || aprovacoes[2] !== undefined);

  return (
    <Spin tip="Carregando..." spinning={carregando}>
      <div className="card mt-3 card-detalhar-layout-embalagem">
        <div className="card-body">
          {layoutDeEmbalagem.logs && (
            <div className="row my-4">
              <FluxoDeStatusPreRecebimento
                listaDeStatus={layoutDeEmbalagem.logs}
              />
            </div>
          )}
          <div className="subtitulo mb-3">Dados do Produto</div>
          <div className="row mt-3">
            <div className="col-4">
              <label className="label-dados-produto">Nº do Cronograma</label>
            </div>
            <div className="col-4">
              <label className="label-dados-produto">
                Nº do Pregão/Chamada Pública
              </label>
            </div>
            <div className="col-4">
              <label className="label-dados-produto">Data do Cadastro</label>
            </div>
          </div>
          {Object.keys(layoutDeEmbalagem).length > 0 && (
            <div className="row mt-2">
              <div className="col-4">
                <span className="valor-dados-produto">
                  {layoutDeEmbalagem.numero_cronograma}
                </span>
              </div>
              <div className="col-4">
                <span className="valor-dados-produto">
                  {layoutDeEmbalagem.pregao_chamada_publica}
                </span>
              </div>
              <div className="col-4">
                <span className="valor-dados-produto">
                  {layoutDeEmbalagem.criado_em.split(" ")[0]}
                </span>
              </div>
            </div>
          )}

          <hr />
          <p>Empresa:</p>
          <p className="fw-bold">{layoutDeEmbalagem.nome_empresa}</p>
          <p>Produto:</p>
          <p className="fw-bold">{layoutDeEmbalagem.nome_produto}</p>

          {layoutDeEmbalagem.observacoes && (
            <>
              <hr />
              <div className="row mb-3">
                <div className="col-12">
                  <TextArea
                    label="Observações do Fornecedor"
                    input={{ value: layoutDeEmbalagem.observacoes }}
                    disabled
                  />
                </div>
              </div>
            </>
          )}

          <hr />

          {Object.keys(initialValues).length > 0 && (
            <Form
              onSubmit={onSubmit}
              initialValues={initialValues}
              render={({ handleSubmit, values, errors, form }) => (
                <form onSubmit={handleSubmit}>
                  <ModalCancelarAnalise
                    show={modalCancelarAnalise}
                    handleClose={() => setModalCancelarAnalise(false)}
                    cancelar={voltarPaginaPainel}
                  />
                  <ModalEnviarAnalise
                    show={modalEnviar}
                    handleClose={() => setModalEnviar(false)}
                    enviar={() => enviarAnalise(values)}
                  />

                  <div
                    className={`${
                      layoutDeEmbalagem.tipos_de_embalagens[0].status !==
                        "APROVADO" && !layoutDeEmbalagem.primeira_analise
                        ? "subtitulo-laranja"
                        : "subtitulo"
                    }  mb-3`}
                  >
                    Embalagem Primária
                  </div>
                  <div className="row">
                    <div className="col-5">
                      {layoutDeEmbalagem.tipos_de_embalagens[0].imagens.map(
                        (e) => (
                          <div className="w-75" key={e.arquivo}>
                            <BotaoAnexo urlAnexo={e.arquivo} />
                          </div>
                        )
                      )}
                      {!somenteLeitura && retornaBotoesAprovacao(0, form)}
                    </div>
                    {retornaTextoAprovacaoOuCampoCorrecao(0, values, form)}
                  </div>

                  <hr />

                  <div
                    className={`${
                      layoutDeEmbalagem.tipos_de_embalagens[1].status !==
                        "APROVADO" && !layoutDeEmbalagem.primeira_analise
                        ? "subtitulo-laranja"
                        : "subtitulo"
                    }  mb-3`}
                  >
                    Embalagem Secundária
                  </div>
                  <div className="row">
                    <div className="col-5">
                      {layoutDeEmbalagem.tipos_de_embalagens[1].imagens.map(
                        (e) => (
                          <div className="w-75" key={e.arquivo}>
                            <BotaoAnexo urlAnexo={e.arquivo} />
                          </div>
                        )
                      )}
                      {!somenteLeitura && retornaBotoesAprovacao(1, form)}
                    </div>
                    {retornaTextoAprovacaoOuCampoCorrecao(1, values, form)}
                  </div>

                  <hr />

                  <div
                    className={`${
                      layoutDeEmbalagem.tipos_de_embalagens[2]?.status !==
                        "APROVADO" && !layoutDeEmbalagem.primeira_analise
                        ? "subtitulo-laranja"
                        : "subtitulo"
                    }  mb-3`}
                  >
                    Embalagem Terciária
                  </div>

                  {layoutDeEmbalagem.tipos_de_embalagens[2] ? (
                    <div className="row">
                      <div className="col-5">
                        {layoutDeEmbalagem.tipos_de_embalagens[2].imagens.map(
                          (e) => (
                            <div className="w-75" key={e.arquivo}>
                              <BotaoAnexo urlAnexo={e.arquivo} />
                            </div>
                          )
                        )}
                        {!somenteLeitura && retornaBotoesAprovacao(2, form)}
                      </div>
                      {retornaTextoAprovacaoOuCampoCorrecao(2, values, form)}
                    </div>
                  ) : (
                    <>
                      <div className="row">
                        <div className="col aviso-embalagem-terciaria px-3 py-3">
                          <strong>Lembrete!</strong>
                          <br />
                          Foi identificado que não consta Embalagem Terciária.
                          Caso necessário, solicite a correção clicando no botão
                          abaixo:
                        </div>
                      </div>
                      <div className="row mt-4">
                        <div className="col px-0">
                          <Botao
                            texto="Solicitar Embalagem"
                            type={BUTTON_TYPE.BUTTON}
                            style={BUTTON_STYLE.GREEN}
                            onClick={() => {
                              form.change(`justificativa_${2}`, "");
                              setEmbalagemTerciariaSolicitada(true);
                            }}
                            disabled={embalagemTerciariaSolicitada}
                          />
                        </div>
                        {embalagemTerciariaSolicitada &&
                          renderizarCampoCorrecao(2, form)}
                      </div>
                    </>
                  )}

                  <hr />

                  {!somenteLeitura && (
                    <Botao
                      texto="Enviar para o Fornecedor"
                      type={BUTTON_TYPE.SUBMIT}
                      style={BUTTON_STYLE.GREEN}
                      className="float-end ms-3"
                      disabled={
                        !validaAprovacoes || Object.keys(errors).length > 0
                      }
                      tooltipExterno={
                        (!validaAprovacoes || Object.keys(errors).length > 0) &&
                        "É necessário avaliar todas as embalagens antes de prosseguir."
                      }
                    />
                  )}

                  <Botao
                    texto="Cancelar"
                    type={BUTTON_TYPE.BUTTON}
                    style={BUTTON_STYLE.GREEN_OUTLINE}
                    className="float-end ms-3"
                    onClick={() => setModalCancelarAnalise(true)}
                  />
                </form>
              )}
            />
          )}
        </div>
      </div>
    </Spin>
  );
};
