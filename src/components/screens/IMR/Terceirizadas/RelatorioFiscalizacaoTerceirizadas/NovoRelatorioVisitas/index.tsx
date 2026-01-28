import { Spin } from "antd";
import Botao from "src/components/Shareable/Botao";
import {
  BUTTON_STYLE,
  BUTTON_TYPE,
} from "src/components/Shareable/Botao/constants";
import {
  toastError,
  toastSuccess,
} from "src/components/Shareable/Toast/dialogs";
import ModalSolicitacaoDownload from "src/components/Shareable/ModalSolicitacaoDownload";
import {
  PAINEL_RELATORIOS_FISCALIZACAO,
  SUPERVISAO,
  TERCEIRIZADAS,
} from "src/configs/constants";
import { FormApi } from "final-form";
import arrayMutators from "final-form-arrays";
import HTTP_STATUS from "http-status-codes";
import {
  ArquivoInterface,
  EscolaLabelInterface,
  NovoRelatorioVisitasFormInterface,
  TipoOcorrenciaInterface,
} from "src/interfaces/imr.interface";
import { ResponseFormularioSupervisaoTiposOcorrenciasInterface } from "src/interfaces/responses.interface";
import React, { useEffect, useState } from "react";
import { Form } from "react-final-form";
import { NavigateFunction, useNavigate } from "react-router-dom";
import {
  createFormularioSupervisao,
  createRascunhoFormularioSupervisao,
  updateRascunhoFormularioSupervisao,
  updateFormularioSupervisao,
  getTiposOcorrenciaPorEditalNutrisupervisao,
  getFormularioSupervisao,
  getRespostasFormularioSupervisao,
  getRespostasNaoSeAplicaFormularioSupervisao,
  exportarPDFRelatorioNotificacao,
} from "src/services/imr/relatorioFiscalizacaoTerceirizadas";
import { Anexos } from "./components/Anexos";
import { Cabecalho } from "./components/Cabecalho";
import { Formulario } from "./components/Formulario";
import { ModalCancelaPreenchimento } from "./components/ModalCancelaPreenchimento";
import { ModalSalvar } from "./components/ModalSalvar";
import { ModalSalvarRascunho } from "./components/ModalSalvarRascunho";
import {
  formataPayload,
  formataPayloadUpdate,
  validarFormulariosTiposOcorrencia,
  validarFormulariosParaCategoriasDeNotificacao,
} from "./helpers";
import "./styles.scss";
import { Notificacoes } from "./components/Notificacoes";
import { ModalBaixarNotificaoces } from "./components/ModalBaixarNotificacoes";

interface NovoRelatorioVisitasProps {
  somenteLeitura?: boolean;
  isEditing?: boolean;
}

export const NovoRelatorioVisitas = ({
  somenteLeitura = false,
  isEditing = false,
}: NovoRelatorioVisitasProps) => {
  const [showModalCancelaPreenchimento, setShowModalCancelaPreenchimento] =
    useState(false);
  const [showModalSalvarRascunho, setShowModalSalvarRascunho] = useState(false);
  const [showModalSalvar, setShowModalSalvar] = useState(false);
  const [showModalBaixarNotificacoes, setShowModalBaixarNotificacoes] =
    useState(false);

  const [escolaSelecionada, setEscolaSelecionada] =
    useState<EscolaLabelInterface>();
  const [tiposOcorrencia, setTiposOcorrencia] =
    useState<Array<TipoOcorrenciaInterface>>();
  const [loadingTiposOcorrencia, setLoadingTiposOcorrencia] = useState(false);
  const [erroAPI, setErroAPI] = useState<string>("");
  const [anexos, setAnexos] = useState<ArquivoInterface[]>([]);
  const [notificacoesAssinadas, setNotificacoesAssinadas] = useState<
    ArquivoInterface[]
  >([]);
  const [anexosIniciais, setAnexosIniciais] = useState<any[]>([]);
  const [notificacoesIniciais, setNotificacoesIniciais] = useState<any[]>([]);
  const [initialValues, setInitialValues] = useState();
  const [respostasOcorrencias, setRespostasOcorrencias] = useState([]);
  const [respostasOcorrenciaNaoSeAplica, setRespostasOcorrenciaNaoSeAplica] =
    useState([]);
  const [exibirModalCentralDownloads, setExibirModalCentralDownloads] =
    useState(false);

  const navigate: NavigateFunction = useNavigate();

  useEffect(() => {
    if (isEditing || somenteLeitura) getDadosFormularioSupervisao();
  }, []);

  const getDadosFormularioSupervisao = async () => {
    const urlParams = new URLSearchParams(window.location.search);
    const uuid = urlParams.get("uuid");
    if (uuid) {
      const formularioResponse = await getFormularioSupervisao(uuid);
      setAnexosIniciais(formularioResponse.data.anexos);
      setNotificacoesIniciais(formularioResponse.data.notificacoes_assinadas);
      setInitialValues({
        ...formularioResponse.data,
        acompanhou_visita: formularioResponse.data.acompanhou_visita
          ? "sim"
          : "nao",
        anexos: null,
        notificacoes_assinadas: null,
      });

      const [respostasResponse, respostasNaoSeAplica] = await Promise.all([
        getRespostasFormularioSupervisao(uuid),
        getRespostasNaoSeAplicaFormularioSupervisao(uuid),
      ]);

      setRespostasOcorrencias(respostasResponse.data);
      setRespostasOcorrenciaNaoSeAplica(respostasNaoSeAplica.data);
    }
  };

  function navigateToPainelRelatorios() {
    navigate(
      `/${SUPERVISAO}/${TERCEIRIZADAS}/${PAINEL_RELATORIOS_FISCALIZACAO}`,
    );
  }

  const salvarRascunho = async (
    values: NovoRelatorioVisitasFormInterface,
    gerarRelatorioNotificacoes = false,
  ): Promise<void> => {
    if (!values.escola || !values.data) {
      toastError(
        "Os campos unidade educacional e data da visita são obrigatórios para salvar um rascunho.",
      );
      return;
    }
    if (!showModalSalvarRascunho && !gerarRelatorioNotificacoes) {
      setShowModalSalvarRascunho(true);
      return;
    }
    if (values.uuid) {
      const response = await updateRascunhoFormularioSupervisao(
        formataPayloadUpdate(
          values,
          escolaSelecionada,
          anexos,
          notificacoesAssinadas,
          respostasOcorrenciaNaoSeAplica,
        ),
      );
      if (response.status === HTTP_STATUS.OK) {
        toastSuccess(
          "Rascunho do Relatório de Fiscalização salvo com sucesso!",
        );
        if (gerarRelatorioNotificacoes) {
          solicitarGeracaoRelatorioNotificacoes(values.uuid);
        } else {
          navigateToPainelRelatorios();
        }
      } else {
        toastError(
          "Erro ao atualizar rascunho do Relatório de Fiscalização. Tente novamente mais tarde.",
        );
      }
    } else {
      const response = await createRascunhoFormularioSupervisao(
        formataPayload(
          values,
          escolaSelecionada,
          anexos,
          notificacoesAssinadas,
        ),
      );
      if (response.status === HTTP_STATUS.CREATED) {
        toastSuccess(
          "Rascunho do Relatório de Fiscalização salvo com sucesso!",
        );
        if (gerarRelatorioNotificacoes) {
          solicitarGeracaoRelatorioNotificacoes(response.data.uuid);
        } else {
          navigateToPainelRelatorios();
        }
      } else {
        toastError(
          "Erro ao criar rascunho do Relatório de Fiscalização. Tente novamente mais tarde.",
        );
      }
    }
  };

  const solicitarGeracaoRelatorioNotificacoes = async (
    formulario_uuid: string,
  ): Promise<void> => {
    const response = await exportarPDFRelatorioNotificacao(formulario_uuid);
    if (response.status === HTTP_STATUS.OK) {
      setShowModalBaixarNotificacoes(false);
      setExibirModalCentralDownloads(true);
    } else {
      setShowModalBaixarNotificacoes(false);
      toastError("Erro ao solicitar geração de relatório de notificações.");
    }
  };

  const salvar = async (
    values: NovoRelatorioVisitasFormInterface,
  ): Promise<void> => {
    if (!showModalSalvar) {
      setShowModalSalvar(true);
      return;
    }

    if (values.uuid) {
      const response = await updateFormularioSupervisao(
        formataPayloadUpdate(
          values,
          escolaSelecionada,
          anexos,
          notificacoesAssinadas,
          respostasOcorrenciaNaoSeAplica,
        ),
      );
      if (response.status === HTTP_STATUS.OK) {
        toastSuccess("Relatório de Fiscalização enviado com sucesso!");
        navigate(
          `/${SUPERVISAO}/${TERCEIRIZADAS}/${PAINEL_RELATORIOS_FISCALIZACAO}`,
        );
      } else {
        toastError(
          "Erro ao enviar Relatório de Fiscalização. Tente novamente mais tarde.",
        );
      }
    } else {
      const response = await createFormularioSupervisao(
        formataPayload(
          values,
          escolaSelecionada,
          anexos,
          notificacoesAssinadas,
        ),
      );
      if (response.status === HTTP_STATUS.CREATED) {
        toastSuccess("Relatório de Fiscalização enviado com sucesso!");
        navigate(
          `/${SUPERVISAO}/${TERCEIRIZADAS}/${PAINEL_RELATORIOS_FISCALIZACAO}`,
        );
      } else {
        toastError(
          "Erro ao enviar Relatório de Fiscalização. Tente novamente mais tarde.",
        );
      }
    }
  };

  const getTiposOcorrenciaPorEditalNutrisupervisaoAsync = async (
    form: FormApi<any, Partial<any>>,
    _escola: EscolaLabelInterface,
  ): Promise<void> => {
    setLoadingTiposOcorrencia(true);
    const response: ResponseFormularioSupervisaoTiposOcorrenciasInterface =
      await getTiposOcorrenciaPorEditalNutrisupervisao({
        edital_uuid: _escola.edital,
        escola_uuid: _escola.uuid,
      });
    if (response.status === HTTP_STATUS.OK) {
      setTiposOcorrencia(response.data);
      response.data.forEach((tipoOcorrencia) => {
        form.change(`grupos_${tipoOcorrencia.uuid}`, [{}]);
      });
      setErroAPI("");
    } else {
      setErroAPI(
        "Erro ao carregar tipos de ocorrência do edital da unidade educacional. Tente novamente mais tarde.",
      );
    }
    setLoadingTiposOcorrencia(false);
  };

  useEffect(() => {
    if (!escolaSelecionada) {
      setTiposOcorrencia(undefined);
    }
  }, [escolaSelecionada]);

  const onSubmit = async (
    _values: NovoRelatorioVisitasFormInterface,
  ): Promise<void> => {
    // TODO: implementar
  };

  const formularioValido = (form: FormApi<any, Partial<any>>) => {
    const _validarFormulariosTiposOcorrencia =
      validarFormulariosTiposOcorrencia(
        form.getState().values,
        tiposOcorrencia,
      );
    return (
      !form.getState().hasValidationErrors &&
      _validarFormulariosTiposOcorrencia.formulariosValidos &&
      notificacoesAssinadas.length > 0
    );
  };

  const showNotificacoesComponent = (
    form: FormApi<any, Partial<any>>,
    tiposOcorrencia,
  ) => {
    const _validarFormulariosTiposOcorrencia =
      validarFormulariosParaCategoriasDeNotificacao(
        form.getState().values,
        tiposOcorrencia,
      );
    return (
      _validarFormulariosTiposOcorrencia.listaValidacaoPorTipoOcorrencia
        .length !== 0
    );
  };

  const habilitarBotaoBaixarNotificacao = (
    form: FormApi<any, Partial<any>>,
    tiposOcorrencia,
  ) => {
    const _validarFormulariosTiposOcorrencia =
      validarFormulariosParaCategoriasDeNotificacao(
        form.getState().values,
        tiposOcorrencia,
      );
    return (
      !form.getState().hasValidationErrors &&
      _validarFormulariosTiposOcorrencia.formulariosValidos
    );
  };

  const handleClickVoltar = () => {
    navigate(
      `/${SUPERVISAO}/${TERCEIRIZADAS}/${PAINEL_RELATORIOS_FISCALIZACAO}`,
    );
  };

  return (
    <div className="card novo-relatorio-visitas mt-3">
      <div className="card-body">
        <Form
          initialValues={initialValues}
          keepDirtyOnReinitialize
          mutators={{
            ...arrayMutators,
          }}
          onSubmit={onSubmit}
        >
          {({
            handleSubmit,
            values,
            form,
            form: {
              mutators: { push },
            },
            submitting,
          }) => (
            <form onSubmit={handleSubmit}>
              <Cabecalho
                values={form.getState().values}
                form={form}
                setEscolaSelecionada={setEscolaSelecionada}
                escolaSelecionada={escolaSelecionada}
                getTiposOcorrenciaPorEditalNutrisupervisaoAsync={
                  getTiposOcorrenciaPorEditalNutrisupervisaoAsync
                }
                setTiposOcorrencia={setTiposOcorrencia}
                somenteLeitura={somenteLeitura}
                isEditing={isEditing}
              />
              <div className="row">
                <div className="col-12">
                  <hr />
                </div>
              </div>
              {!erroAPI && (
                <Spin
                  spinning={loadingTiposOcorrencia}
                  style={{ display: "block", margin: "auto", width: "100%" }}
                >
                  {tiposOcorrencia && escolaSelecionada && (
                    <Formulario
                      respostasOcorrencias={respostasOcorrencias}
                      respostasOcorrenciaNaoSeAplica={
                        respostasOcorrenciaNaoSeAplica
                      }
                      form={form}
                      tiposOcorrencia={tiposOcorrencia}
                      values={form.getState().values}
                      escolaSelecionada={escolaSelecionada}
                      push={push}
                      somenteLeitura={somenteLeitura}
                    />
                  )}
                </Spin>
              )}
              {tiposOcorrencia &&
                showNotificacoesComponent(form, tiposOcorrencia) && (
                  <Notificacoes
                    onClickBaixarNotificacoes={setShowModalBaixarNotificacoes}
                    somenteLeitura={somenteLeitura}
                    setNotificacoesAssinadas={setNotificacoesAssinadas}
                    notificacoesAssinadas={notificacoesAssinadas}
                    notificacoesIniciais={notificacoesIniciais}
                    disabledBaixarNotificacoes={
                      !habilitarBotaoBaixarNotificacao(form, tiposOcorrencia)
                    }
                  />
                )}
              {tiposOcorrencia &&
                validarFormulariosTiposOcorrencia(
                  form.getState().values,
                  tiposOcorrencia,
                ).listaValidacaoPorTipoOcorrencia.length !== 0 && (
                  <Anexos
                    setAnexos={setAnexos}
                    anexos={anexos}
                    anexosIniciais={anexosIniciais}
                    somenteLeitura={somenteLeitura}
                  />
                )}
              {!somenteLeitura && (
                <div className="row float-end mt-4">
                  <div className="col-12">
                    <Botao
                      texto="Cancelar"
                      onClick={() => {
                        setShowModalCancelaPreenchimento(true);
                      }}
                      style={BUTTON_STYLE.GREEN_OUTLINE}
                    />
                    <Botao
                      texto="Salvar rascunho"
                      className="ms-3"
                      disabled={submitting}
                      onClick={() => salvarRascunho(values)}
                      type={BUTTON_TYPE.BUTTON}
                      style={BUTTON_STYLE.GREEN_OUTLINE}
                    />
                    {tiposOcorrencia && (
                      <Botao
                        texto="Enviar Formulário"
                        className="ms-3"
                        disabled={submitting || !formularioValido(form)}
                        onClick={() => salvar(values)}
                        type={BUTTON_TYPE.BUTTON}
                        style={BUTTON_STYLE.GREEN}
                      />
                    )}
                  </div>
                </div>
              )}
              {somenteLeitura && (
                <div className="row float-end mt-4">
                  <div className="col-12">
                    <Botao
                      texto="Voltar"
                      onClick={() => {
                        handleClickVoltar();
                      }}
                      style={BUTTON_STYLE.GREEN_OUTLINE}
                    />
                  </div>
                </div>
              )}
              <ModalCancelaPreenchimento
                show={showModalCancelaPreenchimento}
                handleClose={() => setShowModalCancelaPreenchimento(false)}
                form={form}
                navigate={navigate}
              />
              <ModalSalvarRascunho
                show={showModalSalvarRascunho}
                handleClose={() => setShowModalSalvarRascunho(false)}
                values={form.getState().values}
                salvarRascunho={salvarRascunho}
                escolaSelecionada={escolaSelecionada}
              />
              <ModalSalvar
                show={showModalSalvar}
                handleClose={() => setShowModalSalvar(false)}
                values={form.getState().values}
                salvar={salvar}
                escolaSelecionada={escolaSelecionada}
              />
              <ModalBaixarNotificaoces
                show={showModalBaixarNotificacoes}
                handleClose={() => setShowModalBaixarNotificacoes(false)}
                salvarRascunhoEBaixarNotificacoes={() =>
                  salvarRascunho(form.getState().values, true)
                }
              />
              {exibirModalCentralDownloads && (
                <ModalSolicitacaoDownload
                  show={exibirModalCentralDownloads}
                  setShow={setExibirModalCentralDownloads}
                  callbackClose={navigateToPainelRelatorios}
                />
              )}
            </form>
          )}
        </Form>
      </div>
    </div>
  );
};
