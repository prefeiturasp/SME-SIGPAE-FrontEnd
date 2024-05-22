import React, { useEffect, useState } from "react";
import { Spin } from "antd";
import { useNavigate } from "react-router-dom";
import { Field, Form } from "react-final-form";

import {
  LAYOUT_EMBALAGEM,
  PRE_RECEBIMENTO,
  PAINEL_LAYOUT_EMBALAGEM,
} from "configs/constants";
import { usuarioComAcessoAoPainelEmbalagens } from "helpers/utilities";
import { textAreaRequired } from "helpers/fieldValidators";
import BotaoVoltar from "components/Shareable/Page/BotaoVoltar";
import { TextArea } from "components/Shareable/TextArea/TextArea";
import BotaoAnexo from "components/PreRecebimento/BotaoAnexo";
import Botao from "components/Shareable/Botao";
import {
  BUTTON_TYPE,
  BUTTON_STYLE,
} from "components/Shareable/Botao/constants";
import { FluxoDeStatusPreRecebimento } from "components/Shareable/FluxoDeStatusPreRecebimento";
import { toastError, toastSuccess } from "components/Shareable/Toast/dialogs";
import {
  analiseCodaeLayoutEmbalagem,
  detalharLayoutEmabalagem,
} from "services/layoutEmbalagem.service";

import ModalCancelarAnalise from "./components/ModalCancelarAnalise";
import ModalEnviarAnalise from "./components/ModalEnviarAnalise";
import ModalCancelarCorrecao from "./components/ModalCancelarCorrecao";
import "./styles.scss";

export default () => {
  const navigate = useNavigate();

  const [carregando, setCarregando] = useState(true);
  const [objeto, setObjeto] = useState({});
  const [embalagemPrimaria, setEmbalagemPrimaria] = useState([]);
  const [embalagemSecundaria, setEmbalagemSecundaria] = useState([]);
  const [embalagemTerciaria, setEmbalagemTerciaria] = useState([]);
  const [aprovacoes, setAprovacoes] = useState([]);
  const [modais, setModais] = useState([]);
  const [modalCancelar, setModalCancelar] = useState(false);
  const [modalEnviar, setModalEnviar] = useState(false);
  const [initialValues, setInitialValues] = useState({});

  const visaoCODAE = usuarioComAcessoAoPainelEmbalagens();

  const voltarPaginaGrid = () =>
    navigate(`/${PRE_RECEBIMENTO}/${LAYOUT_EMBALAGEM}`);

  const voltarPaginaPainel = () =>
    navigate(`/${PRE_RECEBIMENTO}/${PAINEL_LAYOUT_EMBALAGEM}`);

  const carregarDados = async () => {
    try {
      setCarregando(true);
      const urlParams = new URLSearchParams(window.location.search);
      const uuid = urlParams.get("uuid");
      const response = await detalharLayoutEmabalagem(uuid);

      const objeto = response.data;
      objeto.tipos_de_embalagens = ordenarTiposDeEmbalagens(
        objeto.tipos_de_embalagens
      );
      setObjeto(objeto);
      setEmbalagemPrimaria(obterImagensEmbalagem(response, "PRIMARIA"));
      setEmbalagemSecundaria(obterImagensEmbalagem(response, "SECUNDARIA"));
      setEmbalagemTerciaria(obterImagensEmbalagem(response, "TERCIARIA"));

      const aprovacoesAtualizadas = definirAprovacoes(objeto);
      setInitialValues(definirInitialValues(objeto, aprovacoesAtualizadas));
    } finally {
      setCarregando(false);
    }
  };

  const ordenarTiposDeEmbalagens = (tiposDeEmbalagem) =>
    tiposDeEmbalagem.sort((a, b) => {
      const embalagemA = a.tipo_embalagem.toUpperCase();
      const embalagemB = b.tipo_embalagem.toUpperCase();

      if (embalagemA < embalagemB) {
        return -1;
      }
      if (embalagemA > embalagemB) {
        return 1;
      }

      return 0;
    });

  const obterImagensEmbalagem = (response, tipo_embalagem) => {
    return response.data.tipos_de_embalagens
      .filter((e) => e.tipo_embalagem === tipo_embalagem)
      .map((e) => e.imagens)
      .flat();
  };

  const definirAprovacoes = (objeto) => {
    if (["Aprovado", "Solicitado Correção"].includes(objeto.status)) {
      const aprovacoesAtualizadas = objeto.tipos_de_embalagens.map(
        ({ status }) => (status === "APROVADO" ? true : false)
      );

      setAprovacoes(aprovacoesAtualizadas);
      return aprovacoesAtualizadas;
    }

    return [];
  };

  const definirInitialValues = (objeto, aprovacoes) => {
    return aprovacoes.length > 0
      ? {
          justificativa_0: objeto.tipos_de_embalagens[0]?.complemento_do_status,
          justificativa_1: objeto.tipos_de_embalagens[1]?.complemento_do_status,
          justificativa_2:
            objeto.tipos_de_embalagens[2]?.complemento_do_status || "",
        }
      : {
          justificativa_0: "",
          justificativa_1: "",
          justificativa_2: "",
        };
  };

  const changeModal = (index, value) => {
    let newModais = [...modais];
    newModais[index] = value;
    setModais(newModais);
  };

  const renderizarTipoEmbalagem = (idx, titulo, arquivos, values) =>
    objeto.tipos_de_embalagens[idx] && (
      <>
        <hr />

        <div
          className={`${
            objeto.tipos_de_embalagens[idx].status === "REPROVADO"
              ? "subtitulo-laranja"
              : "subtitulo"
          }  mb-3`}
        >
          {titulo}
        </div>
        <div className="row d-flex align-items-center">
          <div className="col-5">{botoesArquivosAnexos(arquivos)}</div>
          {visaoCODAE && textoAprovacao(idx, values)}
        </div>
      </>
    );

  const textoAprovacao = (index, values) => {
    if (!aprovacoes) return;

    if (aprovacoes[index] === true) {
      let texto = values[`justificativa_${index}`]?.split("|");

      return (
        texto && (
          <div className="col-7 d-flex align-items-center">
            <div className="subtitulo d-flex align-items-center ms-5">
              <div className="w-5">
                <i className="fas fa-check me-3 fa-2x" />
              </div>
              <div className="w-95">
                <div>{texto[0]}</div>
                <div>{texto[1]}</div>
              </div>
            </div>
          </div>
        )
      );
    } else if (aprovacoes[index] === false) {
      return (
        <div className="col-7">
          <Field
            component={TextArea}
            label="Correções Necessárias"
            name={`justificativa_${index}`}
            placeholder="Qual a sua observação para essa decisão?"
            required
            validate={textAreaRequired}
            disabled={objeto.status === "Solicitado Correção"}
          />

          {objeto.status !== "Solicitado Correção" && (
            <Botao
              texto="Cancelar"
              type={BUTTON_TYPE.BUTTON}
              style={BUTTON_STYLE.GREEN_OUTLINE}
              className="float-end ms-3"
              onClick={() => {
                changeModal(index, true);
              }}
            />
          )}

          <ModalCancelarCorrecao
            show={modais[index]}
            handleClose={() => {
              changeModal(index, false);
            }}
            cancelar={() => {
              aprovacoes[index] = undefined;
              values[`justificativa_${index}`] = "";
            }}
          />
        </div>
      );
    }
  };

  const botoesArquivosAnexos = (arquivos) =>
    arquivos.map((e) => (
      <div className="w-75" key={e.arquivo}>
        <BotaoAnexo urlAnexo={e.arquivo} />
      </div>
    ));

  const onSubmit = () => {
    setModalEnviar(true);
  };

  const getAprovacao = (index) => {
    if (aprovacoes[index] === true) {
      return "APROVADO";
    } else if (aprovacoes[index] === false) {
      return "REPROVADO";
    }
  };

  const formataPayload = (values) => {
    let payload = {};

    payload.tipos_de_embalagens = [];

    payload.tipos_de_embalagens.push({
      tipo_embalagem: "PRIMARIA",
      status: getAprovacao(0),
      complemento_do_status: values[`justificativa_${0}`],
    });
    payload.tipos_de_embalagens.push({
      tipo_embalagem: "SECUNDARIA",
      status: getAprovacao(1),
      complemento_do_status: values[`justificativa_${1}`],
    });
    if (embalagemTerciaria.length > 0) {
      payload.tipos_de_embalagens.push({
        tipo_embalagem: "TERCIARIA",
        status: getAprovacao(2),
        complemento_do_status: values[`justificativa_${2}`],
      });
    }

    return payload;
  };

  const enviarAnalise = async (values) => {
    setCarregando(true);
    let payload = formataPayload(values);
    try {
      let response = await analiseCodaeLayoutEmbalagem(objeto.uuid, payload);
      if (response.status === 201 || response.status === 200) {
        setCarregando(false);
        toastSuccess("Sua avaliação foi enviada com sucesso!");
        voltarPaginaPainel();
      } else {
        toastError("Ocorreu um erro ao analisar o Layout da Embalagem");
        setCarregando(false);
      }
    } catch (error) {
      toastError(error, "Ocorreu um erro ao analisar o Layout da Embalagem");
    }
  };

  useEffect(() => {
    carregarDados();
  }, []);

  return (
    <Spin tip="Carregando..." spinning={carregando}>
      <div className="card mt-3 card-detalhar-layout-embalagem">
        <div className="card-body">
          {objeto.logs && (
            <div className="row my-4">
              <FluxoDeStatusPreRecebimento listaDeStatus={objeto.logs} />
            </div>
          )}
          <div className="subtitulo mb-3">Dados do Produto</div>
          <div className="row mt-3">
            <div className="col-6">
              <label className="label-dados-produto">
                Número da Ficha Técnica e Nome do Produto
              </label>
            </div>
            <div className="col-3">
              <label className="label-dados-produto">
                Nº do Pregão/Chamada Pública
              </label>
            </div>
            {visaoCODAE && (
              <div className="col-3">
                <label className="label-dados-produto">Data do Cadastro</label>
              </div>
            )}
          </div>
          <div className="row mt-2">
            <div className="col-6">
              <span className="valor-dados-produto">
                {objeto.numero_ficha_tecnica} - {objeto.nome_produto}
              </span>
            </div>
            <div className="col-3">
              <span className="valor-dados-produto">
                {objeto.pregao_chamada_publica}
              </span>
            </div>
            {visaoCODAE && (
              <div className="col-3">
                <span className="valor-dados-produto">
                  {objeto.criado_em?.split(" ")[0]}
                </span>
              </div>
            )}
          </div>

          {visaoCODAE && (
            <>
              <hr />
              <p>Empresa:</p>
              <p className="fw-bold">{objeto.nome_empresa}</p>

              {objeto.observacoes && (
                <>
                  <hr />
                  <div className="row mb-3">
                    <div className="col-12">
                      <TextArea
                        label="Observações do Fornecedor"
                        input={{ value: objeto.observacoes }}
                        disabled
                      />
                    </div>
                  </div>
                </>
              )}
            </>
          )}

          {!carregando && (
            <Form
              onSubmit={onSubmit}
              initialValues={initialValues}
              render={({ handleSubmit, values }) => (
                <form onSubmit={handleSubmit}>
                  <ModalCancelarAnalise
                    show={modalCancelar}
                    handleClose={() => setModalCancelar(false)}
                    cancelar={voltarPaginaPainel}
                  />
                  <ModalEnviarAnalise
                    show={modalEnviar}
                    handleClose={() => setModalEnviar(false)}
                    enviar={() => enviarAnalise(values)}
                  />

                  {renderizarTipoEmbalagem(
                    0,
                    "Embalagem Primária",
                    embalagemPrimaria,
                    values
                  )}

                  {renderizarTipoEmbalagem(
                    1,
                    "Embalagem Secundária",
                    embalagemSecundaria,
                    values
                  )}

                  {renderizarTipoEmbalagem(
                    2,
                    "Embalagem Secundária",
                    embalagemSecundaria,
                    values
                  )}

                  {!visaoCODAE && objeto.observacoes && (
                    <>
                      <hr />
                      <div className="row mb-3">
                        <div className="col-12">
                          <TextArea
                            label="Observações"
                            input={{ value: objeto.observacoes }}
                            disabled
                          />
                        </div>
                      </div>
                    </>
                  )}

                  <hr />

                  <BotaoVoltar
                    onClick={visaoCODAE ? voltarPaginaPainel : voltarPaginaGrid}
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
