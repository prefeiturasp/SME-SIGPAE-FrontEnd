import { Spin } from "antd";
import AutoCompleteField from "src/components/Shareable/AutoCompleteField";
import { Botao } from "src/components/Shareable/Botao";
import {
  BUTTON_ICON,
  BUTTON_STYLE,
} from "src/components/Shareable/Botao/constants";
import { InputComData } from "src/components/Shareable/DatePicker";
import { InputText } from "src/components/Shareable/Input/InputText";
import ModalSolicitacaoDownload from "src/components/Shareable/ModalSolicitacaoDownload";
import Select from "src/components/Shareable/Select";
import { toastError } from "src/components/Shareable/Toast/dialogs";
import { FormApi } from "final-form";
import {
  maxValueMaiorFrequenciaNoPeriodoIMR,
  required,
} from "src/helpers/fieldValidators";
import {
  composeValidators,
  converterDDMMYYYYparaYYYYMMDD,
} from "src/helpers/utilities";
import HTTP_STATUS from "http-status-codes";
import {
  DiretoriaRegionalInterface,
  EscolaSimplissimaInterface,
} from "interfaces/escola.interface";
import {
  EscolaLabelInterface,
  NovoRelatorioVisitasFormInterface,
  PeriodoDeVisitaInterface,
  TipoOcorrenciaInterface,
} from "interfaces/imr.interface";
import {
  ResponseDiretoriasRegionaisSimplissimaInterface,
  ResponseGetEscolasTercTotalInterface,
  ResponseGetQuantidadeAlunosMatriculadosPorDataInterface,
  ResponsePeriodosDeVisitaInterface,
} from "interfaces/responses.interface";
import moment from "moment";
import React, { ChangeEvent, useEffect, useState } from "react";
import { Field } from "react-final-form";
import { getDiretoriaregionalSimplissima } from "src/services/diretoriaRegional.service";
import {
  getEscolasTercTotal,
  getQuantidadeAlunosMatriculadosPorData,
} from "src/services/escola.service";
import {
  exportarPDFRelatorioFiscalizacao,
  getPeriodosVisita,
} from "src/services/imr/relatorioFiscalizacaoTerceirizadas";

type CabecahoType = {
  form: FormApi<any, Partial<any>>;
  values: NovoRelatorioVisitasFormInterface;
  setEscolaSelecionada: (_escola: EscolaLabelInterface) => void;
  escolaSelecionada: EscolaLabelInterface;
  getTiposOcorrenciaPorEditalNutrisupervisaoAsync: (
    _form: FormApi<any, Partial<any>>,
    _escola: EscolaLabelInterface
  ) => Promise<void>;
  setTiposOcorrencia: (
    _tiposOcorrencia: Array<TipoOcorrenciaInterface>
  ) => void;
  somenteLeitura?: boolean;
  isEditing?: boolean;
};

export const Cabecalho = ({ ...props }: CabecahoType) => {
  const [diretoriasRegionais, setDiretoriasRegionais] =
    useState<{ nome: string; uuid: string }[]>();
  const [escolas, setEscolas] = useState<EscolaLabelInterface[]>([]);
  const [periodosVisita, setPeriodosVisita] =
    useState<PeriodoDeVisitaInterface[]>();

  const [loadingEscolas, setLoadingEscolas] = useState(false);
  const [loadingTotalMatriculadosPorData, setLoadingTotalMatriculadosPorData] =
    useState(false);
  const [exibirModalCentralDownloads, setExibirModalCentralDownloads] =
    useState(false);
  const [imprimindoPDF, setImprimindoPDF] = useState(false);

  const [erroAPI, setErroAPI] = useState<string>("");

  const {
    form,
    values,
    setEscolaSelecionada,
    getTiposOcorrenciaPorEditalNutrisupervisaoAsync,
    setTiposOcorrencia,
    somenteLeitura,
    isEditing,
  } = props;

  const initialValues = form.getState().initialValues;

  const getDiretoriasRegionaisAsync = async (): Promise<void> => {
    const response: ResponseDiretoriasRegionaisSimplissimaInterface =
      await getDiretoriaregionalSimplissima();
    if (response.status === HTTP_STATUS.OK) {
      setDiretoriasRegionais(
        response.data.results.map((dre: DiretoriaRegionalInterface) => {
          return {
            nome: dre.nome,
            uuid: dre.uuid,
          };
        })
      );
    } else {
      setErroAPI("Erro ao carregar DREs. Tente novamente mais tarde.");
    }
  };

  const getEscolasTercTotalAsync = async (dreUuid: string): Promise<void> => {
    setLoadingEscolas(true);
    const response: ResponseGetEscolasTercTotalInterface =
      await getEscolasTercTotal({
        dre: dreUuid,
      });
    if (response.status === HTTP_STATUS.OK) {
      setEscolas(
        response.data.map((escola: EscolaSimplissimaInterface) => {
          return {
            label: `${escola.codigo_eol} - ${escola.nome}`,
            value: `${escola.codigo_eol} - ${escola.nome}`,
            uuid: escola.uuid,
            lote_nome: escola.lote_obj?.nome,
            edital: escola.lote_obj?.contratos_do_lote.find(
              (lote) => !lote.encerrado
            )?.edital,
            terceirizada: escola.terceirizada,
          };
        })
      );
    } else {
      setErroAPI("Erro ao carregar escolas. Tente novamente mais tarde.");
    }
    setLoadingEscolas(false);
  };

  const setEscolaInitialValues = async (initialValues) => {
    const _escola = initialValues.escola;
    if (_escola) {
      form.change("escola", `${_escola.codigo_eol} - ${_escola.nome}`);
      form.change("lote", _escola?.lote);
      form.change("terceirizada", _escola?.terceirizada);

      setEscolaSelecionada(_escola);
      await getTiposOcorrenciaPorEditalNutrisupervisaoAsync(form, _escola);
      await getTotalAlunosMatriculadosPorData(values.data, _escola.uuid);
    }
  };

  const getTotalAlunosMatriculadosPorData = async (
    data: string,
    escolaUUID: string
  ): Promise<void> => {
    setLoadingTotalMatriculadosPorData(true);
    const response: ResponseGetQuantidadeAlunosMatriculadosPorDataInterface =
      await getQuantidadeAlunosMatriculadosPorData({
        escola_uuid: escolaUUID,
        data: converterDDMMYYYYparaYYYYMMDD(data),
      });
    if (response.status === HTTP_STATUS.OK) {
      form.change("total_matriculados_por_data", response.data);
    } else {
      setErroAPI(
        "Erro ao carregar quantidade alunos matriculados por data. Tente novamente mais tarde."
      );
    }
    setLoadingTotalMatriculadosPorData(false);
  };

  const exportarPDF = async () => {
    setImprimindoPDF(true);
    const response = await exportarPDFRelatorioFiscalizacao({
      uuid: values.uuid,
    });
    if (response.status === HTTP_STATUS.OK) {
      setExibirModalCentralDownloads(true);
    } else {
      toastError("Erro ao baixar PDF. Tente novamente mais tarde");
    }
    setImprimindoPDF(false);
  };

  const getPeriodosVisitaAsync = async (): Promise<void> => {
    const response: ResponsePeriodosDeVisitaInterface =
      await getPeriodosVisita();
    if (response.status === HTTP_STATUS.OK) {
      setPeriodosVisita(response.data.results);
    } else {
      setErroAPI(
        "Erro ao carregar Períodos de Visita. Tente novamente mais tarde."
      );
    }
  };

  const requisicoesPreRender = async (): Promise<void> => {
    await Promise.all([
      getDiretoriasRegionaisAsync(),
      getPeriodosVisitaAsync(),
    ]);
  };

  useEffect(() => {
    requisicoesPreRender();
  }, []);

  useEffect(() => {
    if (initialValues && initialValues.escola) {
      setEscolaInitialValues(initialValues);
    }
  }, [initialValues]);

  const LOADING = !diretoriasRegionais || !periodosVisita;

  return (
    <>
      {erroAPI && <div>{erroAPI}</div>}
      {!erroAPI && (
        <Spin tip="Carregando..." spinning={LOADING}>
          {!LOADING && (
            <div className="cabecalho">
              <div className="row">
                <div className="col-11">
                  <h2 className="mt-2 mb-4">Dados da Unidade Educacional</h2>
                </div>
                {values.status && values.status !== "EM_PREENCHIMENTO" && (
                  <div className="col-1 text-end">
                    <Botao
                      style={
                        imprimindoPDF
                          ? BUTTON_STYLE.GREEN_OUTLINE
                          : BUTTON_STYLE.GREEN
                      }
                      icon={
                        imprimindoPDF
                          ? BUTTON_ICON.LOADING
                          : BUTTON_ICON.FILE_PDF
                      }
                      disabled={imprimindoPDF}
                      onClick={() => exportarPDF()}
                    />
                  </div>
                )}
              </div>
              <div className="row">
                <div className="col-5">
                  <Field
                    component={Select}
                    options={[
                      { nome: "Selecione uma DRE", uuid: "" },
                      ...diretoriasRegionais,
                    ]}
                    name="diretoria_regional"
                    label="Diretoria Regional de Educação"
                    validate={required}
                    required
                    disabled={isEditing || somenteLeitura}
                    onChangeEffect={(e: ChangeEvent<HTMLInputElement>) => {
                      const value = e.target.value;
                      setTiposOcorrencia(undefined);
                      form.change("escola", undefined);
                      form.change("lote", undefined);
                      form.change("terceirizada", undefined);
                      form.change("total_matriculados_por_data", undefined);
                      form.change("maior_frequencia_no_periodo", undefined);
                      getEscolasTercTotalAsync(value);
                    }}
                  />
                </div>
                <div className="col-7">
                  <Spin tip="Carregando..." spinning={loadingEscolas}>
                    <Field
                      component={AutoCompleteField}
                      options={escolas}
                      filterOption={(
                        inputValue: string,
                        option: { label: string }
                      ) =>
                        option!.label
                          .toUpperCase()
                          .indexOf(inputValue.toUpperCase()) !== -1
                      }
                      name="escola"
                      label="Unidade Educacional"
                      placeholder={"Selecione uma Unidade"}
                      required
                      disabled={
                        !values.diretoria_regional ||
                        loadingEscolas ||
                        isEditing ||
                        somenteLeitura
                      }
                      inputOnChange={async (value: string) => {
                        setTiposOcorrencia(undefined);
                        const _escola = escolas.find(
                          (e: EscolaLabelInterface) => e.value === value
                        );
                        if (_escola) {
                          form.change("total_matriculados_por_data", undefined);
                          form.change("maior_frequencia_no_periodo", undefined);

                          form.change("lote", _escola?.lote_nome);
                          form.change("terceirizada", _escola?.terceirizada);

                          await setEscolaSelecionada(_escola);
                          await getTiposOcorrenciaPorEditalNutrisupervisaoAsync(
                            form,
                            _escola
                          );
                          if (values.data && _escola) {
                            await getTotalAlunosMatriculadosPorData(
                              values.data,
                              _escola.uuid
                            );
                          }
                        } else {
                          setEscolaSelecionada(undefined);
                        }
                      }}
                    />
                  </Spin>
                </div>
              </div>
              <div className="row">
                <div className="col-4">
                  <Field
                    component={InputText}
                    label="Lote"
                    name="lote"
                    placeholder="Lote da Unidade"
                    required
                    validate={required}
                    disabled
                  />
                </div>
                <div className="col-8">
                  <Field
                    component={InputText}
                    label="Empresa Terceirizada"
                    name="terceirizada"
                    required
                    validate={required}
                    placeholder="Nome da Empresa Prestadora de Serviço"
                    disabled
                  />
                </div>
              </div>
              <div className="row">
                <div className="col-12">
                  <hr />
                  <h2 className="mt-2 mb-4">Dados da Visita</h2>
                </div>
              </div>
              <div className="row">
                <div className="col-4">
                  <Field
                    component={InputComData}
                    name="data"
                    label="Data da Visita"
                    placeholder="Selecione uma data"
                    minDate={null}
                    maxDate={moment().toDate()}
                    required
                    validate={required}
                    disabled={somenteLeitura}
                    inputOnChange={(value) => {
                      form.change("total_matriculados_por_data", undefined);
                      form.change("maior_frequencia_no_periodo", undefined);
                      if (props.escolaSelecionada) {
                        getTotalAlunosMatriculadosPorData(
                          value,
                          props.escolaSelecionada.uuid
                        );
                      }
                    }}
                  />
                </div>
                <div className="col-4">
                  <Field
                    component={Select}
                    options={[
                      { nome: "Selecione um Período", uuid: "" },
                      ...periodosVisita,
                    ]}
                    naoDesabilitarPrimeiraOpcao
                    name="periodo_visita"
                    label="Período de Visita"
                    validate={required}
                    required
                    disabled={somenteLeitura}
                  />
                </div>
              </div>
              <div className="row">
                <div className="col-4">
                  <Spin
                    tip="Carregando..."
                    spinning={loadingTotalMatriculadosPorData}
                  >
                    <Field
                      component={InputText}
                      type="number"
                      label="Nº de Matriculados da Unidade"
                      name="total_matriculados_por_data"
                      required
                      disabled
                    />
                  </Spin>
                </div>
                <div className="col-4">
                  <Field
                    component={InputText}
                    type="number"
                    label="Maior Nº de Frequentes no Período"
                    name="maior_frequencia_no_periodo"
                    tooltipText="Referência do mês anterior"
                    required
                    validate={composeValidators(
                      required,
                      maxValueMaiorFrequenciaNoPeriodoIMR(
                        values.total_matriculados_por_data
                      )
                    )}
                    min={0}
                    placeholder="Informe a quantidade"
                    disabled={
                      values.total_matriculados_por_data === null ||
                      values.total_matriculados_por_data === undefined ||
                      loadingTotalMatriculadosPorData ||
                      somenteLeitura
                    }
                  />
                </div>
              </div>
              <section className="nutri-acompanhou-visita">
                <div className="row mt-3 mb-3">
                  <div className="col-12">
                    Nutricionista RT da Empresa acompanhou a Visita?
                  </div>
                </div>
                <div className="row">
                  <div className="col-2">
                    <Field
                      name="acompanhou_visita"
                      component="input"
                      type="radio"
                      value="sim"
                      id="sim"
                      required
                      validate={required}
                      disabled={somenteLeitura}
                    />
                    <label htmlFor="sim">Sim</label>
                  </div>
                  <div className="col-2">
                    <Field
                      name="acompanhou_visita"
                      component="input"
                      type="radio"
                      value="nao"
                      id="nao"
                      required
                      validate={required}
                      disabled={somenteLeitura}
                    />
                    <label htmlFor="nao">Não estava presente</label>
                  </div>
                </div>
              </section>
              {values.acompanhou_visita === "sim" && (
                <div className="row mt-3 mb-3">
                  <div className="col-8">
                    <Field
                      component={InputText}
                      label="Nome da Nutricionista RT da Empresa"
                      name="nome_nutricionista_empresa"
                      placeholder="Digite o Nome da Nutricionista da Empresa"
                      required
                      validate={required}
                      disabled={somenteLeitura}
                    />
                  </div>
                </div>
              )}
            </div>
          )}
          <ModalSolicitacaoDownload
            show={exibirModalCentralDownloads}
            setShow={setExibirModalCentralDownloads}
          />
        </Spin>
      )}
    </>
  );
};
