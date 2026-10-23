import { Spin } from "antd";
import Botao from "src/components/Shareable/Botao";
import {
  BUTTON_ICON,
  BUTTON_STYLE,
  BUTTON_TYPE,
} from "src/components/Shareable/Botao/constants";
import {
  toastError,
  toastSuccess,
} from "src/components/Shareable/Toast/dialogs";
import { MeusDadosContext } from "src/context/MeusDadosContext";
import { getError } from "src/helpers/utilities";
import arrayMutators from "final-form-arrays";
import HTTP_STATUS from "http-status-codes";
import {
  EscolaLabelInterface,
  OcorrenciaDiretorEdicaoInterface,
  TipoOcorrenciaInterface,
} from "src/interfaces/imr.interface";
import React, { useContext, useEffect, useMemo, useState } from "react";
import { Form } from "react-final-form";
import { FieldArray } from "react-final-form-arrays";
import {
  Location,
  NavigateFunction,
  useLocation,
  useNavigate,
} from "react-router-dom";
import {
  atualizarOcorrenciaDiretor,
  buscarOcorrenciaDiretor,
  createFormularioDiretor,
  excluirOcorrenciaDiretor,
  getTiposOcorrenciaPorEditalDiretor,
} from "src/services/imr/relatorioFiscalizacaoTerceirizadas";
import { AdicionarResposta } from "../Terceirizadas/RelatorioFiscalizacaoTerceirizadas/NovoRelatorioVisitas/components/Formulario/components/BotaoAdicionar";
import RenderComponentByParametrizacao from "../Terceirizadas/RelatorioFiscalizacaoTerceirizadas/NovoRelatorioVisitas/components/Formulario/components/Ocorrencia/RenderComponentByParametrizacao";
import { SeletorDeDatas } from "../Terceirizadas/RelatorioFiscalizacaoTerceirizadas/NovoRelatorioVisitas/components/Formulario/components/Ocorrencia/Seletores/SeletorDeDatas";
import { ModalCancelaPreenchimento } from "./components/ModalCancelaPreenchimento";
import { ModalCancelarEdicao } from "./components/ModalCancelarEdicao";
import { ModalExcluirEdicao } from "./components/ModalExcluirEdicao";
import { ModalSalvar } from "./components/ModalSalvar";
import { ModalSalvarEdicao } from "./components/ModalSalvarEdicao";
import { SeletorCategoria } from "./components/SeletorCategoria";
import { SeletorTipoOcorrencia } from "./components/SeletorTipoOcorrencia";
import {
  formataPayload,
  formataPayloadEdicao,
  getIntervaloMes,
  getUrlListaOcorrencias,
} from "./helpers";
import { RegistrarNovaOcorrenciaFormInterface } from "./interfaces";
import "./style.scss";

const renderizaParametrizacoes = (
  parametrizacoes,
  name,
  indexFieldArray,
  tipoOcorrencia,
  form,
  escolaSelecionada,
) =>
  parametrizacoes.map((parametrizacao) => (
    <div key={indexFieldArray} className="row">
      <RenderComponentByParametrizacao
        parametrizacao={parametrizacao}
        name_grupos={name}
        tipoOcorrencia={tipoOcorrencia}
        form={form}
        escolaSelecionada={escolaSelecionada}
        somenteLeitura={false}
      />
    </div>
  ));

interface RegistrarNovaOcorrenciaProps {
  modoEdicao?: boolean;
  ocorrenciaUuid?: string;
  tipoOcorrenciaUuid?: string;
  grupo?: number;
  editalUuid?: string;
  solicitacaoMedicaoInicialUuid?: string;
  mes?: string;
  ano?: string;
}

const MENSAGEM_ERRO_OCORRENCIA_EDICAO: Record<number, string> = {
  [HTTP_STATUS.FORBIDDEN]:
    "Você não tem permissão para editar a ocorrência desta unidade educacional.",
  [HTTP_STATUS.NOT_FOUND]:
    "A ocorrência solicitada não foi encontrada ou foi removida.",
  [HTTP_STATUS.BAD_REQUEST]:
    "Os dados para consultar a ocorrência são inválidos ou estão incompletos.",
};

export const RegistrarNovaOcorrencia = ({
  ...props
}: RegistrarNovaOcorrenciaProps) => {
  const [tiposOcorrencia, setTiposOcorrencia] =
    useState<Array<TipoOcorrenciaInterface>>();
  const [loadingTiposOcorrencia, setLoadingTiposOcorrencia] = useState(false);
  const [loadingOcorrencia, setLoadingOcorrencia] = useState(false);
  const [ocorrencia, setOcorrencia] =
    useState<OcorrenciaDiretorEdicaoInterface>();
  const [categorias, setCategorias] =
    useState<Array<{ nome: string; uuid: string }>>();
  const [tiposOcorrenciaDaCategoria, setTiposOcorrenciaDaCategoria] = useState<
    Array<TipoOcorrenciaInterface>
  >([]);
  const [tipoOcorrencia, setTipoOcorrencia] =
    useState<TipoOcorrenciaInterface>();
  const [escolaSelecionada, setEscolaSelecionada] =
    useState<EscolaLabelInterface>();

  const [showModalCancelaPreenchimento, setShowModalCancelaPreenchimento] =
    useState(false);
  const [showModalSalvar, setShowModalSalvar] = useState(false);
  const [showModalCancelarEdicao, setShowModalCancelarEdicao] = useState(false);
  const [showModalExcluirEdicao, setShowModalExcluirEdicao] = useState(false);
  const [showModalSalvarEdicao, setShowModalSalvarEdicao] = useState(false);
  const [erroAPI, setErroAPI] = useState<string>("");

  const { meusDados } = useContext(MeusDadosContext);
  const location: Location<any> = useLocation();
  const navigate: NavigateFunction = useNavigate();

  const modoEdicao = Boolean(
    props.modoEdicao &&
      props.ocorrenciaUuid &&
      props.tipoOcorrenciaUuid &&
      props.grupo,
  );
  const ocorrenciaUuid = props.ocorrenciaUuid || "";
  const tipoOcorrenciaUuid = props.tipoOcorrenciaUuid || "";
  const grupoSelecionado = props.grupo || 1;
  const editalUuid = props.editalUuid || location.state?.editalUuid;
  const solicitacaoMedicaoInicialUuid =
    props.solicitacaoMedicaoInicialUuid ||
    location.state?.solicitacaoMedicaoInicialUuid;
  const mes = props.mes || location.state?.mes;
  const ano = props.ano || location.state?.ano;

  const { minDate, maxDate } = getIntervaloMes(mes, ano);

  const aplicarOcorrencia = (
    tipos: Array<TipoOcorrenciaInterface>,
    respostaOcorrencia: Awaited<ReturnType<typeof buscarOcorrenciaDiretor>>,
  ) => {
    if (respostaOcorrencia?.status !== HTTP_STATUS.OK) {
      const mensagem =
        MENSAGEM_ERRO_OCORRENCIA_EDICAO[respostaOcorrencia?.status] ||
        "Não foi possível carregar a ocorrência. Tente novamente mais tarde.";
      toastError(mensagem);
      setErroAPI(mensagem);
      return;
    }

    const tipoSelecionado = tipos.find(
      (tipo) => tipo.uuid === respostaOcorrencia.data.tipo_ocorrencia,
    );
    if (!tipoSelecionado) {
      setErroAPI("Não foi possível identificar o tipo da ocorrência.");
      return;
    }

    setTipoOcorrencia(tipoSelecionado);
    setTiposOcorrenciaDaCategoria(
      tipos
        .filter(
          (tipo) => tipo.categoria.uuid === tipoSelecionado.categoria.uuid,
        )
        .map((tipo) => ({ nome: tipo.titulo, ...tipo })),
    );
    setOcorrencia(respostaOcorrencia.data);
  };

  const getTiposOcorrenciaPorEditalNutrisupervisaoAsync =
    async (): Promise<void> => {
      setLoadingTiposOcorrencia(true);
      setLoadingOcorrencia(modoEdicao);

      const [response, respostaOcorrencia] = await Promise.all([
        getTiposOcorrenciaPorEditalDiretor({
          edital_uuid: editalUuid,
        }),
        modoEdicao
          ? buscarOcorrenciaDiretor({
              uuid: ocorrenciaUuid,
              tipo_ocorrencia: tipoOcorrenciaUuid,
              grupo: grupoSelecionado,
            })
          : Promise.resolve(undefined),
      ]);

      if (response?.status === HTTP_STATUS.OK) {
        setTiposOcorrencia(response.data);
        setCategorias(
          response.data
            .map((tipoOcorrencia) => {
              return {
                nome: tipoOcorrencia.categoria.nome,
                uuid: tipoOcorrencia.categoria.uuid,
              };
            })
            .filter(
              (value, index, self) =>
                index ===
                self.findIndex(
                  (tipoOcorrencia) =>
                    tipoOcorrencia.nome === value.nome &&
                    tipoOcorrencia.uuid === value.uuid,
                ),
            ),
        );

        if (modoEdicao) {
          aplicarOcorrencia(response.data, respostaOcorrencia);
        }
      } else {
        setErroAPI(
          "Erro ao carregar tipos de ocorrência do edital da unidade educacional. Tente novamente mais tarde.",
        );
      }
      setLoadingTiposOcorrencia(false);
      setLoadingOcorrencia(false);
    };

  useEffect(() => {
    if (meusDados) {
      getTiposOcorrenciaPorEditalNutrisupervisaoAsync();
      setEscolaSelecionada({
        label: "",
        value: "",
        lote_nome: "",
        terceirizada: "",
        edital: editalUuid,
        uuid: meusDados.vinculo_atual.instituicao.uuid,
      });
    }
  }, [meusDados]);

  const valoresIniciais = useMemo(() => {
    if (!modoEdicao || !ocorrencia || !tiposOcorrencia) {
      return { grupos: [{}] };
    }

    const tipoSelecionado = tiposOcorrencia.find(
      (tipo) => tipo.uuid === ocorrencia.tipo_ocorrencia,
    );
    const grupo: Record<string, unknown> = {};

    tipoSelecionado?.parametrizacoes.forEach((parametrizacao) => {
      const resposta = ocorrencia.respostas.find(
        (item) => item.parametrizacao === parametrizacao.uuid,
      );

      grupo[
        `tipoocorrencia_${tipoSelecionado.uuid}_parametrizacao_${parametrizacao.uuid}_uuid_undefined`
      ] = resposta?.resposta;
    });

    return {
      categoria: ocorrencia.categoria.uuid,
      tipo_ocorrencia: ocorrencia.tipo_ocorrencia,
      datas: [ocorrencia.data],
      grupos: [grupo],
    };
  }, [modoEdicao, ocorrencia, tiposOcorrencia]);

  const onSubmit = async (
    values: RegistrarNovaOcorrenciaFormInterface,
  ): Promise<void> => {
    if (!showModalSalvar) {
      setShowModalSalvar(true);
      return;
    }

    const response = await createFormularioDiretor(
      formataPayload(values, solicitacaoMedicaoInicialUuid),
    );
    if (response.status === HTTP_STATUS.CREATED) {
      toastSuccess("Registro de Ocorrência realizado com sucesso!");
      navigate(-1);
    } else {
      toastError(getError(response.data));
    }
  };

  const urlListaOcorrencias = getUrlListaOcorrencias({
    ano,
    mes,
    editalUuid,
    solicitacaoMedicaoInicialUuid,
  });

  const onSubmitEdicao = async (
    values: RegistrarNovaOcorrenciaFormInterface,
  ): Promise<void> => {
    if (!showModalSalvarEdicao) {
      setShowModalSalvarEdicao(true);
      return;
    }

    const response = await atualizarOcorrenciaDiretor({
      uuid: ocorrenciaUuid,
      ...formataPayloadEdicao(values, tipoOcorrenciaUuid, grupoSelecionado),
    });

    if (response?.status === HTTP_STATUS.OK) {
      toastSuccess("Edição da Ocorrência realizada com sucesso!");
      navigate(urlListaOcorrencias);
    } else {
      toastError(getError(response?.data));
    }
  };

  const cancelarEdicao = (form: { reset: () => void }) => {
    form.reset();
    setShowModalCancelarEdicao(false);
    navigate(urlListaOcorrencias);
  };

  const excluirOcorrencia = async (): Promise<void> => {
    const response = await excluirOcorrenciaDiretor({
      uuid: ocorrenciaUuid,
      tipo_ocorrencia: tipoOcorrenciaUuid,
      grupo: grupoSelecionado,
    });

    if (response?.status === HTTP_STATUS.NO_CONTENT) {
      toastSuccess("Registro de Ocorrência excluído com sucesso!");
      navigate(urlListaOcorrencias);
    } else {
      toastError(getError(response?.data));
    }
  };

  const exibeBotaoAdicionar = (tipoOcorrencia: TipoOcorrenciaInterface) => {
    return (
      !modoEdicao &&
      tipoOcorrencia.aceita_multiplas_respostas &&
      tipoOcorrencia.parametrizacoes.length > 0
    );
  };

  const excluiGrupoDeResposta = (form, indexFieldArray): void => {
    const grupos = [...form.getState().values["grupos"]];
    grupos.splice(indexFieldArray, 1);
    form.change("grupos", grupos);
  };

  const criarHandlerExcluirGrupoDeResposta = (form, indexFieldArray) => () => {
    excluiGrupoDeResposta(form, indexFieldArray);
  };

  return (
    <div className="card registrar-nova-ocorrencia mt-3">
      <div className="card-body">
        {!erroAPI && (
          <Spin spinning={loadingTiposOcorrencia || loadingOcorrencia}>
            {tiposOcorrencia && (!modoEdicao || ocorrencia) && (
              <Form
                destroyOnUnregister
                keepDirtyOnReinitialize
                initialValues={valoresIniciais}
                mutators={{
                  ...arrayMutators,
                }}
                onSubmit={modoEdicao ? onSubmitEdicao : onSubmit}
              >
                {({
                  handleSubmit,
                  form,
                  form: {
                    mutators: { push },
                  },
                  submitting,
                }) => (
                  <form onSubmit={handleSubmit}>
                    <div className="row">
                      <div className="col-6">
                        <SeletorCategoria
                          categorias={categorias}
                          setTiposOcorrenciaDaCategoria={
                            setTiposOcorrenciaDaCategoria
                          }
                          tiposOcorrencia={tiposOcorrencia}
                          disabled={modoEdicao}
                        />
                      </div>
                      <div className="col-6">
                        <SeletorTipoOcorrencia
                          setTipoOcorrencia={setTipoOcorrencia}
                          tiposOcorrenciaDaCategoria={
                            tiposOcorrenciaDaCategoria
                          }
                          tiposOcorrencia={tiposOcorrencia}
                          values={form.getState().values}
                          form={form}
                          disabled={modoEdicao}
                        />
                      </div>
                    </div>
                    {tipoOcorrencia && (
                      <section className="tipo-ocorrencia">
                        <div className="row">
                          <div className="col-12">
                            <div className="title-label mt-3 mb-1">
                              Descrição do Tipo de Ocorrência e Penalidades:
                            </div>
                            <div className="box-descricao">
                              <div>
                                <b>{tipoOcorrencia.titulo}:</b>{" "}
                                {tipoOcorrencia.descricao}
                              </div>
                              <div>
                                <b>
                                  Penalidade:{" "}
                                  {tipoOcorrencia.penalidade.numero_clausula}{" "}
                                  Obrigação:{" "}
                                  {tipoOcorrencia.penalidade.obrigacoes.toString()}
                                </b>
                              </div>
                            </div>
                            {tipoOcorrencia.parametrizacoes.length > 0 && (
                              <h2 className="mt-3 mb-3">
                                Detalhe a ocorrência nos itens abaixo:
                              </h2>
                            )}
                          </div>
                        </div>
                        {tipoOcorrencia.parametrizacoes.length > 0 && (
                          <div className="row">
                            <SeletorDeDatas
                              titulo="Data da Ocorrência"
                              name="datas"
                              name_grupos="datas_ocorrencias[0]"
                              form={form}
                              ehDataOcorrencia
                              somenteLeitura={false}
                              minDate={minDate}
                              maxDate={maxDate || undefined}
                            />
                          </div>
                        )}
                        <FieldArray name="grupos">
                          {({ fields }) =>
                            fields.map((name, indexFieldArray) => (
                              <>
                                {indexFieldArray > 0 && (
                                  <div className="row">
                                    <div className="col-11">
                                      <hr />
                                    </div>
                                    <div className="col-1 text-end">
                                      <Botao
                                        className="no-border"
                                        titulo="Excluir"
                                        onClick={criarHandlerExcluirGrupoDeResposta(
                                          form,
                                          indexFieldArray,
                                        )}
                                        type={BUTTON_TYPE.BUTTON}
                                        style={BUTTON_STYLE.GREEN_OUTLINE}
                                        icon={BUTTON_ICON.TRASH}
                                      />
                                    </div>
                                  </div>
                                )}
                                {tipoOcorrencia.parametrizacoes.length ? (
                                  renderizaParametrizacoes(
                                    tipoOcorrencia.parametrizacoes,
                                    name,
                                    indexFieldArray,
                                    tipoOcorrencia,
                                    form,
                                    escolaSelecionada,
                                  )
                                ) : (
                                  <div
                                    key={indexFieldArray}
                                    className="row mt-3"
                                  >
                                    <div className="col-12">
                                      Não há parametrização para esse item.
                                    </div>
                                  </div>
                                )}
                              </>
                            ))
                          }
                        </FieldArray>

                        {exibeBotaoAdicionar(tipoOcorrencia) && (
                          <div className="text-center mt-3">
                            <AdicionarResposta
                              push={push}
                              nameFieldArray="grupos"
                            />
                          </div>
                        )}
                        {modoEdicao && (
                          <div className="row float-end mt-4">
                            <div className="col-12">
                              <Botao
                                texto="Cancelar"
                                type={BUTTON_TYPE.BUTTON}
                                onClick={() => setShowModalCancelarEdicao(true)}
                                style={BUTTON_STYLE.GREEN_OUTLINE}
                              />
                              <Botao
                                texto="Excluir Registro"
                                className="ms-3"
                                type={BUTTON_TYPE.BUTTON}
                                onClick={() => setShowModalExcluirEdicao(true)}
                                style={BUTTON_STYLE.RED_OUTLINE}
                              />
                              <Botao
                                texto="Salvar"
                                className="ms-3"
                                disabled={submitting}
                                type={BUTTON_TYPE.SUBMIT}
                                style={BUTTON_STYLE.GREEN}
                              />
                            </div>
                          </div>
                        )}
                        {!modoEdicao && (
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
                                texto="Salvar"
                                className="ms-3"
                                disabled={submitting}
                                type={BUTTON_TYPE.SUBMIT}
                                style={BUTTON_STYLE.GREEN_OUTLINE}
                              />
                            </div>
                          </div>
                        )}
                        <ModalCancelaPreenchimento
                          show={!modoEdicao && showModalCancelaPreenchimento}
                          handleClose={() =>
                            setShowModalCancelaPreenchimento(false)
                          }
                          form={form}
                          navigate={navigate}
                        />
                        <ModalSalvar
                          show={!modoEdicao && showModalSalvar}
                          handleClose={() => setShowModalSalvar(false)}
                          values={form.getState().values}
                          salvar={onSubmit}
                        />
                        {modoEdicao && (
                          <>
                            <ModalCancelarEdicao
                              show={showModalCancelarEdicao}
                              handleClose={() =>
                                setShowModalCancelarEdicao(false)
                              }
                              confirmar={() => cancelarEdicao(form)}
                            />
                            <ModalExcluirEdicao
                              show={showModalExcluirEdicao}
                              handleClose={() =>
                                setShowModalExcluirEdicao(false)
                              }
                              excluir={excluirOcorrencia}
                            />
                            <ModalSalvarEdicao
                              show={showModalSalvarEdicao}
                              handleClose={() =>
                                setShowModalSalvarEdicao(false)
                              }
                              values={form.getState().values}
                              salvar={onSubmitEdicao}
                            />
                          </>
                        )}
                      </section>
                    )}
                  </form>
                )}
              </Form>
            )}
          </Spin>
        )}
      </div>
    </div>
  );
};
