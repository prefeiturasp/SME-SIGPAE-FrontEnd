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
import arrayMutators from "final-form-arrays";
import HTTP_STATUS from "http-status-codes";
import {
  EscolaLabelInterface,
  TipoOcorrenciaInterface,
} from "src/interfaces/imr.interface";
import { ResponseFormularioSupervisaoTiposOcorrenciasInterface } from "src/interfaces/responses.interface";
import React, { useContext, useEffect, useState } from "react";
import { Form } from "react-final-form";
import { FieldArray } from "react-final-form-arrays";
import {
  Location,
  NavigateFunction,
  useLocation,
  useNavigate,
} from "react-router-dom";
import {
  createFormularioDiretor,
  getTiposOcorrenciaPorEditalDiretor,
} from "src/services/imr/relatorioFiscalizacaoTerceirizadas";
import { AdicionarResposta } from "../Terceirizadas/RelatorioFiscalizacaoTerceirizadas/NovoRelatorioVisitas/components/Formulario/components/BotaoAdicionar";
import RenderComponentByParametrizacao from "../Terceirizadas/RelatorioFiscalizacaoTerceirizadas/NovoRelatorioVisitas/components/Formulario/components/Ocorrencia/RenderComponentByParametrizacao";
import { SeletorDeDatas } from "../Terceirizadas/RelatorioFiscalizacaoTerceirizadas/NovoRelatorioVisitas/components/Formulario/components/Ocorrencia/Seletores/SeletorDeDatas";
import { ModalCancelaPreenchimento } from "./components/ModalCancelaPreenchimento";
import { ModalSalvar } from "./components/ModalSalvar";
import { SeletorCategoria } from "./components/SeletorCategoria";
import { SeletorTipoOcorrencia } from "./components/SeletorTipoOcorrencia";
import { formataPayload } from "./helpers";
import { RegistrarNovaOcorrenciaFormInterface } from "./interfaces";
import "./style.scss";

export const RegistrarNovaOcorrencia = () => {
  const [tiposOcorrencia, setTiposOcorrencia] =
    useState<Array<TipoOcorrenciaInterface>>();
  const [loadingTiposOcorrencia, setLoadingTiposOcorrencia] = useState(false);
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
  const [erroAPI, setErroAPI] = useState<string>("");

  const { meusDados } = useContext(MeusDadosContext);
  const location: Location<any> = useLocation();
  const navigate: NavigateFunction = useNavigate();

  const getTiposOcorrenciaPorEditalNutrisupervisaoAsync =
    async (): Promise<void> => {
      setLoadingTiposOcorrencia(true);
      const response: ResponseFormularioSupervisaoTiposOcorrenciasInterface =
        await getTiposOcorrenciaPorEditalDiretor({
          edital_uuid: location.state?.editalUuid,
        });
      if (response.status === HTTP_STATUS.OK) {
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
                    tipoOcorrencia.uuid === value.uuid
                )
            )
        );
      } else {
        setErroAPI(
          "Erro ao carregar tipos de ocorrência do edital da unidade educacional. Tente novamente mais tarde."
        );
      }
      setLoadingTiposOcorrencia(false);
    };

  useEffect(() => {
    if (meusDados) {
      getTiposOcorrenciaPorEditalNutrisupervisaoAsync();
      setEscolaSelecionada({
        label: "",
        value: "",
        lote_nome: "",
        terceirizada: "",
        edital: location.state?.editalUuid,
        uuid: meusDados.vinculo_atual.instituicao.uuid,
      });
    }
  }, [meusDados]);
  const onSubmit = async (
    values: RegistrarNovaOcorrenciaFormInterface
  ): Promise<void> => {
    if (!showModalSalvar) {
      setShowModalSalvar(true);
      return;
    }

    const response = await createFormularioDiretor(
      formataPayload(values, location.state?.solicitacaoMedicaoInicialUuid)
    );
    if (response.status === HTTP_STATUS.CREATED) {
      toastSuccess("Registro de Ocorrência realizado com sucesso!");
      navigate(-1);
    } else {
      toastError(
        "Erro ao criar Registro de Ocorrência. Tente novamente mais tarde."
      );
    }
  };

  const exibeBotaoAdicionar = (tipoOcorrencia: TipoOcorrenciaInterface) => {
    return (
      tipoOcorrencia.aceita_multiplas_respostas &&
      tipoOcorrencia.parametrizacoes.length > 0
    );
  };

  const excluiGrupoDeResposta = (form, indexFieldArray): void => {
    const grupos = [...form.getState().values["grupos"]];
    grupos.splice(indexFieldArray, 1);
    form.change("grupos", grupos);
  };

  return (
    <div className="card registrar-nova-ocorrencia mt-3">
      <div className="card-body">
        {!erroAPI && (
          <Spin spinning={loadingTiposOcorrencia}>
            {tiposOcorrencia && (
              <Form
                destroyOnUnregister
                keepDirtyOnReinitialize
                initialValues={{ grupos: [{}] }}
                mutators={{
                  ...arrayMutators,
                }}
                onSubmit={onSubmit}
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
                                        onClick={() =>
                                          excluiGrupoDeResposta(
                                            form,
                                            indexFieldArray
                                          )
                                        }
                                        type={BUTTON_TYPE.BUTTON}
                                        style={BUTTON_STYLE.GREEN_OUTLINE}
                                        icon={BUTTON_ICON.TRASH}
                                      />
                                    </div>
                                  </div>
                                )}
                                {tipoOcorrencia.parametrizacoes.length ? (
                                  tipoOcorrencia.parametrizacoes.map(
                                    (parametrizacao) => {
                                      return (
                                        <div
                                          key={indexFieldArray}
                                          className="row"
                                        >
                                          <RenderComponentByParametrizacao
                                            parametrizacao={parametrizacao}
                                            name_grupos={name}
                                            tipoOcorrencia={tipoOcorrencia}
                                            form={form}
                                            escolaSelecionada={
                                              escolaSelecionada
                                            }
                                            somenteLeitura={false}
                                          />
                                        </div>
                                      );
                                    }
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
                        <ModalCancelaPreenchimento
                          show={showModalCancelaPreenchimento}
                          handleClose={() =>
                            setShowModalCancelaPreenchimento(false)
                          }
                          form={form}
                          navigate={navigate}
                        />
                        <ModalSalvar
                          show={showModalSalvar}
                          handleClose={() => setShowModalSalvar(false)}
                          values={form.getState().values}
                          salvar={onSubmit}
                        />
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
