import React, { useEffect, useState } from "react";
import { Spin } from "antd";
import "./styles.scss";
import {
  detalharLayoutEmbalagem,
  corrigirLayoutEmbalagem,
} from "src/services/layoutEmbalagem.service";
import { TextArea } from "src/components/Shareable/TextArea/TextArea";
import { Field, Form } from "react-final-form";
import BotaoAnexo from "src/components/PreRecebimento/BotaoAnexo";
import InputFile from "src/components/Shareable/Input/InputFile";
import { DEZ_MB } from "../../../../../../constants/shared";
import Botao from "../../../../../Shareable/Botao";
import {
  BUTTON_STYLE,
  BUTTON_TYPE,
} from "../../../../../Shareable/Botao/constants";
import {
  LAYOUT_EMBALAGEM,
  PRE_RECEBIMENTO,
} from "../../../../../../configs/constants";
import { useNavigate } from "react-router-dom";
import ModalConfirmar from "./components/ModalConfirmar";
import {
  toastError,
  toastSuccess,
} from "../../../../../Shareable/Toast/dialogs";
import { downloadAndConvertToBase64 } from "../../../../../Shareable/Input/InputFile/helper";
import { atualizacaoLayoutEmbalagem } from "../../../../../../services/layoutEmbalagem.service";
import ModalAtualizar from "./components/ModalAtualizar";
import InserirArquivo from "../InserirArquivo";
import { FluxoDeStatusPreRecebimento } from "src/components/Shareable/FluxoDeStatusPreRecebimento";
import { getMensagemDeErro } from "../../../../../../helpers/statusErrors";
import TagLeveLeite from "src/components/Shareable/PreRecebimento/TagLeveLeite";

const TITULOS_SECOES_TIPOS_EMBALAGENS = {
  PRIMARIA: "Embalagem Primária",
  SECUNDARIA: "Embalagem Secundária",
  TERCIARIA: "Embalagem Terciária",
};

const FORMATOS_IMAGEM = "PDF, PNG, JPG ou JPEG";

export default ({ atualizar }) => {
  const navigate = useNavigate();
  const [carregando, setCarregando] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [objeto, setObjeto] = useState({});
  const [layoutEmbalagensPrimarias, setLayoutEmbalagensPrimarias] = useState(
    {},
  );
  const [layoutEmbalagensSecundarias, setLayoutEmbalagensSecundarias] =
    useState({});
  const [layoutEmbalagensTerciarias, setLayoutEmbalagensTerciarias] = useState(
    {},
  );
  const [arquivosLayoutsPrimarios, setArquivosLayoutsPrimarios] = useState();
  const [arquivosLayoutsSecundarios, setArquivosLayoutsSecundarios] =
    useState();
  const [arquivosLayoutsTerciarios, setArquivosLayoutsTerciarios] = useState();

  useEffect(() => {
    carregarDados();
  }, []);

  const carregarDados = async () => {
    setCarregando(true);

    const urlParams = new URLSearchParams(window.location.search);
    const uuid = urlParams.get("uuid");
    const response = await detalharLayoutEmbalagem(uuid);

    setObjeto(response.data);

    const tiposDeEmbalagens = response.data.tipos_de_embalagens;

    const layoutEmbalagensPrimarias = tiposDeEmbalagens
      .filter(
        (tipoDeEmbalagem) => tipoDeEmbalagem?.tipo_embalagem === "PRIMARIA",
      )
      .pop();

    const layoutEmbalagensSecundarias = tiposDeEmbalagens
      .filter(
        (tipoDeEmbalagem) => tipoDeEmbalagem?.tipo_embalagem === "SECUNDARIA",
      )
      .pop();

    const layoutEmbalagensTerciarias = tiposDeEmbalagens
      .filter(
        (tipoDeEmbalagem) => tipoDeEmbalagem?.tipo_embalagem === "TERCIARIA",
      )
      .pop();

    setLayoutEmbalagensSecundarias(layoutEmbalagensSecundarias);
    setLayoutEmbalagensPrimarias(layoutEmbalagensPrimarias);
    setLayoutEmbalagensTerciarias(layoutEmbalagensTerciarias);

    await obterArquivosTipoDeEmbalagem(
      layoutEmbalagensPrimarias,
      setArquivosLayoutsPrimarios,
    );

    layoutEmbalagensSecundarias &&
      (await obterArquivosTipoDeEmbalagem(
        layoutEmbalagensSecundarias,
        setArquivosLayoutsSecundarios,
      ));

    layoutEmbalagensTerciarias &&
      (await obterArquivosTipoDeEmbalagem(
        layoutEmbalagensTerciarias,
        setArquivosLayoutsTerciarios,
      ));

    if (atualizar && !layoutEmbalagensTerciarias) {
      setLayoutEmbalagensTerciarias({
        tipo_embalagem: "TERCIARIA",
      });
      setArquivosLayoutsTerciarios([]);
    }

    setCarregando(false);
  };

  const obterArquivosTipoDeEmbalagem = async (
    tipoDeEmbalagem,
    setArquivosTipoEmbalagem,
  ) => {
    const arquivosTipoImagem = await Promise.all(
      tipoDeEmbalagem.imagens.map(async (imagem) => {
        const base64 = await downloadAndConvertToBase64(imagem.arquivo);
        return {
          nome: imagem.nome,
          base64,
        };
      }),
    );
    setArquivosTipoEmbalagem(arquivosTipoImagem);
  };

  const renderizarSecaoTipoDeEmbalagem = (
    tipoDeEmbalagem,
    arquivosTipoDeLayoutEmbalagem,
    setArquivosLayoutsPrimarios,
  ) => {
    if (atualizar && arquivosTipoDeLayoutEmbalagem) {
      return renderizarSecaoAtualizacao(
        tipoDeEmbalagem,
        arquivosTipoDeLayoutEmbalagem,
        setArquivosLayoutsPrimarios,
      );
    } else {
      if (
        arquivosTipoDeLayoutEmbalagem &&
        tipoDeEmbalagem.status === "APROVADO"
      )
        return renderizarSecaoAprovada(tipoDeEmbalagem);

      if (
        arquivosTipoDeLayoutEmbalagem &&
        tipoDeEmbalagem.status === "REPROVADO"
      )
        return renderizarSecaoReprovada(
          tipoDeEmbalagem,
          arquivosTipoDeLayoutEmbalagem,
          setArquivosLayoutsPrimarios,
        );
    }
  };

  const renderizarSecaoAprovada = (tipoDeEmbalagem) => {
    const [dataEHoraAprovacao, usuarioAprovador] =
      tipoDeEmbalagem.complemento_do_status.split("|");

    return (
      <>
        <div className="subtitulo mb-3">
          {TITULOS_SECOES_TIPOS_EMBALAGENS[tipoDeEmbalagem.tipo_embalagem]}
        </div>

        <div className="row">
          <div className="col-5">
            {tipoDeEmbalagem.imagens.map((e) => (
              <div className="w-75" key={e.arquivo}>
                <BotaoAnexo urlAnexo={e.arquivo} />
              </div>
            ))}
          </div>

          <div className="col-7">
            <div className="subtitulo d-flex ms-5">
              <div className="w-5">
                <i className="fas fa-check me-2" />
              </div>
              <div className="w-95">
                <div>{dataEHoraAprovacao}</div>
                <div>{usuarioAprovador}</div>
              </div>
            </div>
          </div>
        </div>

        <hr />
      </>
    );
  };

  const renderizarSecaoAtualizacao = (
    tipoDeEmbalagem,
    arquivosTipoDeLayoutEmbalagem,
    setArquivosTipoDeLayoutEmbalagem,
  ) => {
    const setFiles = (arquivos) => {
      setFilesGeral(arquivos, setArquivosTipoDeLayoutEmbalagem);
    };

    const removeFile = (index) => {
      removeFileGeral(
        index,
        arquivosTipoDeLayoutEmbalagem,
        setArquivosTipoDeLayoutEmbalagem,
      );
    };

    return (
      <>
        <InserirArquivo
          setFiles={setFiles}
          removeFile={removeFile}
          arquivosIniciais={arquivosTipoDeLayoutEmbalagem}
          atualizar={true}
          tipoEmbalagem={tipoDeEmbalagem.tipo_embalagem}
          dataTestId={
            "inserir-arquivo-" + tipoDeEmbalagem.tipo_embalagem.toLowerCase()
          }
        />
        <hr />
      </>
    );
  };

  const renderizarSecaoReprovada = (
    tipoDeEmbalagem,
    arquivosTipoDeLayoutEmbalagem,
    setArquivosTipoDeLayoutEmbalagem,
  ) => {
    const dadosCorrecao = tipoDeEmbalagem.complemento_do_status;

    const setFiles = (arquivos) => {
      setFilesGeral(arquivos, setArquivosTipoDeLayoutEmbalagem);
    };

    const removeFile = (index) => {
      removeFileGeral(
        index,
        arquivosTipoDeLayoutEmbalagem,
        setArquivosTipoDeLayoutEmbalagem,
      );
    };

    return (
      <>
        <div className="row">
          <div className="col">
            <div className="subtitulo-laranja mb-3">
              {tipoDeEmbalagem.tipo_embalagem !== "TERCIARIA" && (
                <span className="asterisco">* </span>
              )}
              {TITULOS_SECOES_TIPOS_EMBALAGENS[tipoDeEmbalagem.tipo_embalagem]}
            </div>
          </div>
          <div className="col data-hora-correcao">
            Correção Solicitada em:
            <span className="ms-1">{objeto.log_mais_recente}</span>
          </div>
        </div>

        <div className="row">
          <div className="col-12">
            <TextArea
              label="Correções Necessárias"
              input={{ value: dadosCorrecao }}
              disabled
            />
          </div>
        </div>

        <div className="row">
          <Field
            component={InputFile}
            arquivosPreCarregados={arquivosTipoDeLayoutEmbalagem}
            className="inputfile"
            texto="Inserir Layout"
            name={"files"}
            accept={FORMATOS_IMAGEM}
            setFiles={setFiles}
            removeFile={removeFile}
            toastSuccess={"Imagem incluída com sucesso!"}
            alignLeft
            multiple={true}
            limiteTamanho={DEZ_MB}
            concatenarNovosArquivos
            dataTestId={
              "inserir-arquivo-" + tipoDeEmbalagem.tipo_embalagem.toLowerCase()
            }
          />
          <label className="col-12 label-imagem">
            <span className="red">
              {tipoDeEmbalagem.tipo_embalagem === "TERCIARIA"
                ? "IMPORTANTE:"
                : "Campo Obrigatório:"}
              &nbsp;
            </span>
            {"Envie um arquivo nos formatos: " +
              FORMATOS_IMAGEM +
              ", com até 10MB"}
          </label>
        </div>

        <hr />
      </>
    );
  };

  const setFilesGeral = (arquivos, setArquivos) => {
    const arquivosAtualizados = arquivos.map((arquivo) => {
      return {
        nome: arquivo.nome,
        base64: arquivo.base64 || arquivo.arquivo,
      };
    });

    setArquivos(arquivosAtualizados);
  };

  const removeFileGeral = (index, arquivos, setArquivos) => {
    const arquivosAtualizados = [...arquivos];
    arquivosAtualizados.splice(index, 1);

    setArquivos(arquivosAtualizados);
  };

  const voltarPagina = () =>
    navigate(`/${PRE_RECEBIMENTO}/${LAYOUT_EMBALAGEM}`);

  const onSubmit = () => {
    setShowModal(true);
  };

  const enviarCorrecaoLayoutEmbalagem = async (values) => {
    setCarregando(true);

    const urlParams = new URLSearchParams(window.location.search);
    const uuid = urlParams.get("uuid");
    const payload = formataPayload(values);
    const response = await corrigirLayoutEmbalagem(uuid, payload);
    try {
      if (response.status === 200) {
        toastSuccess("Correção Enviada com sucesso!");
        setShowModal(false);
        voltarPagina();
      }
    } catch (error) {
      toastError(getMensagemDeErro(error.response.status));
    } finally {
      setCarregando(false);
    }
  };

  const atualizarLayoutEmbalagem = async (values) => {
    setCarregando(true);

    const urlParams = new URLSearchParams(window.location.search);
    const uuid = urlParams.get("uuid");
    const payload = formataPayload(values);
    const response = await atualizacaoLayoutEmbalagem(uuid, payload);

    if (response.status === 200) {
      toastSuccess("Layout atualizado e enviado para análise com sucesso!");
      setShowModal(false);
      voltarPagina();
    } else {
      toastError("Ocorreu um erro ao salvar o Layout da Embalagem");
    }

    setCarregando(false);
  };

  const formataPayload = (values) => {
    const payload = {};
    payload.observacoes = values.observacoes;

    payload.tipos_de_embalagens = [];

    if (layoutEmbalagensPrimarias.status === "REPROVADO" || atualizar) {
      payload.tipos_de_embalagens.push({
        uuid: layoutEmbalagensPrimarias.uuid,
        tipo_embalagem: layoutEmbalagensPrimarias.tipo_embalagem,
        imagens_do_tipo_de_embalagem: formatarImagensPayload(
          arquivosLayoutsPrimarios,
        ),
      });
    }

    if (
      (layoutEmbalagensSecundarias &&
        layoutEmbalagensSecundarias.status === "REPROVADO") ||
      atualizar
    ) {
      payload.tipos_de_embalagens.push({
        uuid: layoutEmbalagensSecundarias.uuid,
        tipo_embalagem: layoutEmbalagensSecundarias.tipo_embalagem,
        imagens_do_tipo_de_embalagem: formatarImagensPayload(
          arquivosLayoutsSecundarios,
        ),
      });
    }

    if (
      layoutEmbalagensTerciarias &&
      (layoutEmbalagensTerciarias.status === "REPROVADO" || atualizar)
    ) {
      payload.tipos_de_embalagens.push({
        uuid: layoutEmbalagensTerciarias.uuid,
        tipo_embalagem: layoutEmbalagensTerciarias.tipo_embalagem,
        imagens_do_tipo_de_embalagem: formatarImagensPayload(
          arquivosLayoutsTerciarios,
        ),
      });
    }

    return payload;
  };

  const formatarImagensPayload = (imagens) => {
    return imagens.map((imagem) => ({
      arquivo: imagem.base64,
      nome: imagem.nome,
    }));
  };

  const desabilitarBotaoEnviar = () => {
    const LAYOUT_PRIMARIO_REPROVADO_E_SEM_ARQUIVO =
      layoutEmbalagensPrimarias &&
      layoutEmbalagensPrimarias.status === "REPROVADO" &&
      arquivosLayoutsPrimarios &&
      arquivosLayoutsPrimarios.length === 0;

    const LAYOUT_SECUNDARIO_REPROVADO_E_SEM_ARQUIVO =
      layoutEmbalagensSecundarias &&
      layoutEmbalagensSecundarias.status === "REPROVADO" &&
      arquivosLayoutsSecundarios &&
      arquivosLayoutsSecundarios.length === 0;

    return (
      LAYOUT_PRIMARIO_REPROVADO_E_SEM_ARQUIVO ||
      LAYOUT_SECUNDARIO_REPROVADO_E_SEM_ARQUIVO
    );
  };

  const desabilitarBotaoEnviarAtualizar = () => {
    const LAYOUT_PRIMARIO_REPROVADO_E_SEM_ARQUIVO =
      arquivosLayoutsPrimarios && arquivosLayoutsPrimarios.length === 0;

    const LAYOUT_SECUNDARIO_REPROVADO_E_SEM_ARQUIVO =
      arquivosLayoutsSecundarios && arquivosLayoutsSecundarios.length === 0;

    return (
      LAYOUT_PRIMARIO_REPROVADO_E_SEM_ARQUIVO ||
      LAYOUT_SECUNDARIO_REPROVADO_E_SEM_ARQUIVO
    );
  };

  return (
    <Spin tip="Carregando..." spinning={carregando}>
      <div className="card mt-3 card-corrigir-layout-embalagem">
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
            <div className="col-6">
              <label className="label-dados-produto">
                Nº do Pregão/Chamada Pública
              </label>
            </div>
          </div>
          <div className="row mt-2">
            <div className="col-6">
              <div className="d-flex align-items-center">
                <span className="valor-dados-produto">
                  {objeto.numero_ficha_tecnica} - {objeto.nome_produto}
                </span>
                {objeto.programa === "LEVE_LEITE" && (
                  <div className="ms-2">
                    <TagLeveLeite />
                  </div>
                )}
              </div>
            </div>
            <div className="col-6">
              <span className="valor-dados-produto">
                {objeto.pregao_chamada_publica}
              </span>
            </div>
          </div>

          <hr />

          <Form
            onSubmit={onSubmit}
            initialValues={{ observacoes: objeto.observacoes }}
            render={({ handleSubmit, values, errors }) => (
              <form onSubmit={handleSubmit}>
                {atualizar ? (
                  <ModalAtualizar
                    show={showModal}
                    handleClose={() => setShowModal(false)}
                    loading={carregando}
                    handleSim={() => atualizarLayoutEmbalagem(values)}
                  />
                ) : (
                  <ModalConfirmar
                    show={showModal}
                    handleClose={() => setShowModal(false)}
                    loading={carregando}
                    handleSim={() => enviarCorrecaoLayoutEmbalagem(values)}
                  />
                )}

                {renderizarSecaoTipoDeEmbalagem(
                  layoutEmbalagensPrimarias,
                  arquivosLayoutsPrimarios,
                  setArquivosLayoutsPrimarios,
                )}

                {renderizarSecaoTipoDeEmbalagem(
                  layoutEmbalagensSecundarias,
                  arquivosLayoutsSecundarios,
                  setArquivosLayoutsSecundarios,
                )}

                {(layoutEmbalagensTerciarias || atualizar) &&
                  renderizarSecaoTipoDeEmbalagem(
                    layoutEmbalagensTerciarias,
                    arquivosLayoutsTerciarios,
                    setArquivosLayoutsTerciarios,
                  )}

                <div className="row mb-3">
                  <div className="col-12">
                    <Field
                      component={TextArea}
                      label="Observações"
                      name="observacoes"
                      dataTestId="observacoes"
                    />
                  </div>
                </div>

                <div className="mt-4 mb-4">
                  <Botao
                    texto={atualizar ? "Atualizar Layout" : "Enviar Correção"}
                    type={BUTTON_TYPE.SUBMIT}
                    style={BUTTON_STYLE.GREEN}
                    className="float-end ms-3"
                    disabled={
                      Object.keys(errors).length > 0 ||
                      (atualizar
                        ? desabilitarBotaoEnviarAtualizar()
                        : desabilitarBotaoEnviar())
                    }
                  />
                  <Botao
                    texto="Cancelar"
                    type={BUTTON_TYPE.BUTTON}
                    style={BUTTON_STYLE.GREEN_OUTLINE}
                    className="float-end ms-3"
                    onClick={voltarPagina}
                  />
                </div>
              </form>
            )}
          />
        </div>
      </div>
    </Spin>
  );
};
