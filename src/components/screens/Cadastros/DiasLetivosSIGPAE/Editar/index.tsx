import { Spin } from "antd";
import arrayMutators from "final-form-arrays";
import HTTP_STATUS from "http-status-codes";
import { useEffect, useMemo, useRef, useState } from "react";
import { Field, Form } from "react-final-form";
import { useNavigate, useSearchParams } from "react-router-dom";
import { FieldArray } from "react-final-form-arrays";
import { lotesToOptions } from "src/components/screens/Relatorios/SolicitacoesAlimentacao/helpers";
import Botao from "src/components/Shareable/Botao";
import {
  BUTTON_ICON,
  BUTTON_STYLE,
  BUTTON_TYPE,
} from "src/components/Shareable/Botao/constants";
import { InputComData } from "src/components/Shareable/DatePicker";
import { MultiselectRaw } from "src/components/Shareable/MultiselectRaw";
import {
  toastError,
  toastSuccess,
} from "src/components/Shareable/Toast/dialogs";
import Weekly from "src/components/Shareable/Weekly/Weekly";
import { required, requiredMultiselect } from "src/helpers/fieldValidators";
import { getDataObj, getError } from "src/helpers/utilities";
import { getTiposUnidadeEscolar } from "src/services/cadastroTipoAlimentacao.service";
import { getUnidadesEducacionaisComCodEol } from "src/services/dietaEspecial.service";
import { buscaPeriodosEscolares } from "src/services/escola.service";
import {
  cadastrarDiasLetivos,
  getDiaLetivo,
  editarDiaLetivo,
  excluirDiaLetivo,
} from "src/services/diasLetivos";
import { getLotesSimples } from "src/services/lote.service";
import {
  DiasLetivosFormInterface,
  FiltroUnidadesEducacionaisInterface,
  OpcaoMultiselectInterface,
  PeriodoEscolarInterface,
  TipoUnidadeEscolarInterface,
  UnidadeEducacionalInterface,
} from "./interfaces";
import { ModalExcluirDiaLetivo } from "../components/ModalExcluirDiaLetivo";

export const EditarDiasLetivosSIGPAE = () => {
  const [searchParams] = useSearchParams();
  const uuid = searchParams.get("uuid");
  const isEdicao = !!uuid;

  const [lotes, setLotes] = useState<OpcaoMultiselectInterface[]>([]);
  const [tiposUnidades, setTiposUnidades] = useState<
    TipoUnidadeEscolarInterface[]
  >([]);
  const [unidadesEducacionais, setUnidadesEducacionais] = useState<
    OpcaoMultiselectInterface[]
  >([]);
  const [periodosEscolares, setPeriodosEscolares] = useState<
    OpcaoMultiselectInterface[]
  >([]);
  const [dadosEdicao, setDadosEdicao] =
    useState<DiasLetivosFormInterface | null>(null);
  const [showModalExcluir, setShowModalExcluir] = useState(false);

  const navigate = useNavigate();
  const initialValues = useMemo(() => {
    if (isEdicao && dadosEdicao) {
      return dadosEdicao;
    }
    return {
      recorrencias: [{ data_inicial: undefined }],
    } as unknown as Partial<DiasLetivosFormInterface>;
  }, [isEdicao, dadosEdicao]);
  const debounceUnidadesRef = useRef<ReturnType<typeof setTimeout> | null>(
    null,
  );
  const [carregandoInicial, setCarregandoInicial] = useState(true);
  const [carregandoUnidades, setCarregandoUnidades] = useState(false);
  const [erroAPI, setErroAPI] = useState("");

  const getLotesSimplesAsync = async () => {
    const response = await getLotesSimples();
    if (response.status === HTTP_STATUS.OK) {
      setLotes(lotesToOptions(response.data.results));
    } else {
      setErroAPI("Erro ao carregar lotes. Tente novamente mais tarde.");
    }
  };

  const getTiposUnidadesUEAsync = async () => {
    const response = await getTiposUnidadeEscolar({
      pertence_relatorio_solicitacoes_alimentacao: true,
    });
    if (response.status === HTTP_STATUS.OK) {
      setTiposUnidades(response.data.results);
    } else {
      setErroAPI(
        "Erro ao carregar tipos de unidade educacional. Tente novamente mais tarde.",
      );
    }
  };

  const getUnidadesEducacionaisAsync = async (
    values: FiltroUnidadesEducacionaisInterface,
  ) => {
    setCarregandoUnidades(true);
    setUnidadesEducacionais([]);
    try {
      let data = values;
      const response = await getUnidadesEducacionaisComCodEol(data);
      if (response.status === HTTP_STATUS.OK) {
        if (response.data.mensagem) {
          setUnidadesEducacionais([
            {
              label: response.data.mensagem,
              value: "__no_result__",
              disabled: true,
            },
          ]);
          return;
        }
        setUnidadesEducacionais(
          response.data.map((unidade: UnidadeEducacionalInterface) => ({
            label: `${unidade.codigo_eol_escola}`,
            value: unidade.uuid,
          })),
        );
      } else {
        toastError("Erro ao buscar unidades educacionais");
      }
    } finally {
      setCarregandoUnidades(false);
    }
  };

  const getPeriodosAsync = async () => {
    const response = await buscaPeriodosEscolares();
    if (response.status === HTTP_STATUS.OK) {
      setPeriodosEscolares(
        response.data.results.map((periodo: PeriodoEscolarInterface) => ({
          label: periodo.nome,
          value: periodo.uuid,
        })),
      );
    } else {
      setErroAPI(
        "Erro ao carregar períodos escolares. Tente novamente mais tarde.",
      );
    }
  };

  const getDiaLetivoAsync = async () => {
    const response = await getDiaLetivo(uuid as string);
    if (response?.status === HTTP_STATUS.OK) {
      const { data } = response;
      setDadosEdicao({
        lotes: data.lotes,
        tipos_unidades: data.tipos_unidades,
        unidades_educacionais: data.unidades_educacionais,
        recorrencias: [
          {
            periodos_escolares: data.periodos_escolares,
            data_inicial: data.data,
            data_final: data.data,
          },
        ],
      } as unknown as DiasLetivosFormInterface);

      if (data.lotes?.length && data.tipos_unidades?.length) {
        getUnidadesEducacionaisAsync({
          lotes: data.lotes,
          tipos_unidades: data.tipos_unidades,
        });
      }
    } else {
      setErroAPI("Erro ao carregar o dia letivo. Tente novamente mais tarde.");
    }
  };

  const onSubmit = async (values: DiasLetivosFormInterface) => {
    let response;

    if (isEdicao) {
      const payload = {
        lotes: values.lotes,
        tipos_unidades: values.tipos_unidades,
        unidades_educacionais: values.unidades_educacionais || [],
        periodos_escolares: values.recorrencias?.[0]?.periodos_escolares || [],
      };
      response = await editarDiaLetivo(uuid as string, payload);
    } else {
      response = await cadastrarDiasLetivos(values);
    }

    if (
      response?.status === HTTP_STATUS.CREATED ||
      response?.status === HTTP_STATUS.OK
    ) {
      toastSuccess(
        isEdicao
          ? "Dia letivo atualizado com sucesso"
          : "Dias letivos cadastrados com sucesso",
      );
    } else {
      toastError(getError(response?.data));
    }
  };

  const handleExcluirDiaLetivo = async () => {
    const response = await excluirDiaLetivo(uuid as string);

    if (response?.status === HTTP_STATUS.NO_CONTENT) {
      toastSuccess("Dia letivo excluído com sucesso");
      setShowModalExcluir(false);
      navigate(-1);
    } else {
      toastError(getError(response?.data));
    }
  };

  useEffect(() => {
    Promise.all([
      getLotesSimplesAsync(),
      getTiposUnidadesUEAsync(),
      getPeriodosAsync(),
      ...(isEdicao ? [getDiaLetivoAsync()] : []),
    ]).finally(() => setCarregandoInicial(false));
  }, []);

  const tiposUnidadesOptions = useMemo(
    () =>
      tiposUnidades.map((tipo_unidade) => ({
        label: tipo_unidade.iniciais,
        value: tipo_unidade.uuid,
      })),
    [tiposUnidades],
  );

  return (
    <div className="editar-dias-letivos d-flex flex-column flex-grow-1">
      {erroAPI && <div>{erroAPI}</div>}
      {!erroAPI && (
        <Spin spinning={carregandoInicial} tip="Carregando...">
          <div
            className="card mt-3 flex-grow-1 d-flex flex-column"
            style={{ minHeight: "calc(100vh - 200px)" }}
          >
            <Form<DiasLetivosFormInterface>
              key={carregandoInicial ? "loading" : "ready"}
              initialValues={initialValues}
              onSubmit={onSubmit}
              mutators={{ ...arrayMutators }}
            >
              {({ handleSubmit, form, values, submitting }) => (
                <form
                  onSubmit={handleSubmit}
                  className="d-flex flex-column flex-grow-1"
                >
                  <div className="card-body d-flex flex-column flex-grow-1">
                    <div className="flex-grow-1">
                      <div className="row">
                        <div className="col-3">
                          <label className="col-form-label">
                            <span className="red">*</span> DRE/Lote
                          </label>
                          <Field
                            component={MultiselectRaw}
                            name="lotes"
                            dataTestId="select-lotes"
                            selected={values.lotes || []}
                            options={lotes}
                            onSelectedChanged={(
                              values_: OpcaoMultiselectInterface[],
                            ) => {
                              form.change(
                                `lotes`,
                                values_.map((value_) => value_.value),
                              );
                              form.change(`tipos_unidades`, undefined);
                            }}
                            hasSelectAll
                            placeholder="Selecione os Lote(s)"
                            required
                            validate={requiredMultiselect}
                          />
                        </div>
                        <div className="col-3">
                          <label className="label fw-normal pb-2 pt-2">
                            <span className="red">*</span> Tipo de Unidade
                          </label>
                          <Field
                            component={MultiselectRaw}
                            placeholder="Selecione o(s) tipo(s) de unidade"
                            name="tipos_unidades"
                            dataTestId="select-tipos-unidades"
                            options={tiposUnidadesOptions}
                            selected={values.tipos_unidades || []}
                            onSelectedChanged={(
                              values_: OpcaoMultiselectInterface[],
                            ) => {
                              form.change("unidades_educacionais", undefined);
                              form.change(
                                `tipos_unidades`,
                                values_.map((value_) => value_.value),
                              );
                              clearTimeout(debounceUnidadesRef.current);
                              const lotes = values.lotes;
                              const tiposUnidades = values_.map((v) => v.value);
                              debounceUnidadesRef.current = setTimeout(() => {
                                getUnidadesEducacionaisAsync({
                                  lotes,
                                  tipos_unidades: tiposUnidades,
                                });
                              }, 3000);
                            }}
                            onBlur={() => {
                              clearTimeout(debounceUnidadesRef.current);
                              debounceUnidadesRef.current = null;
                              if (values.tipos_unidades?.length > 0) {
                                getUnidadesEducacionaisAsync({
                                  lotes: values.lotes,
                                  tipos_unidades: values.tipos_unidades,
                                });
                              }
                            }}
                            required
                            validate={requiredMultiselect}
                          />
                        </div>
                        <div className="col-6">
                          <label className="label fw-normal pb-2 pt-2">
                            Unidades Educacionais
                          </label>
                          <Spin
                            tip="Carregando unidades educacionais..."
                            spinning={carregandoUnidades}
                          >
                            <Field
                              component={MultiselectRaw}
                              name="unidades_educacionais"
                              dataTestId="select-unidades-educacionais"
                              options={unidadesEducacionais}
                              selected={values.unidades_educacionais || []}
                              onSelectedChanged={(
                                values_: OpcaoMultiselectInterface[],
                              ) => {
                                form.change(
                                  "unidades_educacionais",
                                  values_.map((value_) => value_.value),
                                );
                              }}
                              disabled={!values.lotes && !values.tipos_unidades}
                            />
                          </Spin>
                        </div>
                      </div>
                      <div className="row mt-3">
                        <div className="col-12 d-flex align-items-end">
                          <strong className="me-2">Recorrência</strong>
                          <hr className="flex-grow-1 mb-1" />
                        </div>
                      </div>
                      <FieldArray name="recorrencias">
                        {({ fields }) => (
                          <>
                            {fields.map((name, index) => (
                              <div key={name} className="row mt-2">
                                <div className="col-5">
                                  <label className="col-form-label">
                                    <span className="red">* </span>Período
                                    Letivo
                                  </label>
                                  <div className="row g-0">
                                    <div className="col-6 pe-3">
                                      <Field
                                        component={InputComData}
                                        placeholder="De"
                                        name={`${name}.data_inicial`}
                                        dataTestId={`input-data-inicial-${index}`}
                                        required={!isEdicao}
                                        disabled={isEdicao}
                                        maxDate={
                                          values.recorrencias?.[index]
                                            ?.data_final
                                            ? getDataObj(
                                                values.recorrencias[index]
                                                  .data_final,
                                              )
                                            : undefined
                                        }
                                        validate={
                                          !isEdicao ? required : undefined
                                        }
                                      />
                                    </div>
                                    <div className="col-6">
                                      <Field
                                        component={InputComData}
                                        placeholder="Até"
                                        name={`${name}.data_final`}
                                        dataTestId={`input-data-final-${index}`}
                                        required={!isEdicao}
                                        disabled={isEdicao}
                                        minDate={
                                          values.recorrencias?.[index]
                                            ?.data_inicial
                                            ? getDataObj(
                                                values.recorrencias[index]
                                                  .data_inicial,
                                              )
                                            : undefined
                                        }
                                        validate={
                                          !isEdicao ? required : undefined
                                        }
                                      />
                                    </div>
                                  </div>
                                </div>
                                <div className="col-4">
                                  <label className="label fw-normal pb-2 pt-2">
                                    <span className="red">* </span>Períodos
                                    Escolares
                                  </label>
                                  <Field
                                    component={MultiselectRaw}
                                    name={`${name}.periodos_escolares`}
                                    dataTestId={`select-periodos-escolares-${index}`}
                                    options={periodosEscolares}
                                    selected={
                                      values.recorrencias?.[index]
                                        ?.periodos_escolares || []
                                    }
                                    onSelectedChanged={(
                                      values_: OpcaoMultiselectInterface[],
                                    ) => {
                                      form.change(
                                        `${name}.periodos_escolares` as keyof DiasLetivosFormInterface,
                                        values_.map((v) => v.value),
                                      );
                                    }}
                                    placeholder="Selecione os períodos"
                                    required
                                    validate={requiredMultiselect}
                                  />
                                </div>
                                <div className="col-2 my-auto">
                                  <Field
                                    component={Weekly}
                                    name={`${name}.dias_semana`}
                                    label="Repetir"
                                    required={!isEdicao}
                                    disabled={isEdicao}
                                    classNameArgs={`${isEdicao && "weekly-disabled"}`}
                                    validate={
                                      !isEdicao
                                        ? requiredMultiselect
                                        : undefined
                                    }
                                    dataTestId={`weekly-dias-semana-${index}`}
                                    arrayDiasSemana={
                                      values.recorrencias?.[index]
                                        ?.dias_semana || []
                                    }
                                    handleWeekly={async (value: string) => {
                                      const dias =
                                        values.recorrencias?.[index]
                                          ?.dias_semana || [];
                                      const atualizado = dias.includes(value)
                                        ? dias.filter((d) => d !== value)
                                        : [...dias, value];
                                      form.change(
                                        `${name}.dias_semana` as keyof DiasLetivosFormInterface,
                                        atualizado,
                                      );
                                    }}
                                  />
                                </div>
                                {index > 0 && (
                                  <div className="col-1 d-flex align-items-end pb-1">
                                    <Botao
                                      dataTestId={`btn-remover-recorrencia-${index}`}
                                      onClick={() => fields.remove(index)}
                                      icon={BUTTON_ICON.TRASH}
                                      type={BUTTON_TYPE.BUTTON}
                                      style={BUTTON_STYLE.GREEN_OUTLINE}
                                    />
                                  </div>
                                )}
                              </div>
                            ))}
                            {!isEdicao && (
                              <div className="row mt-3">
                                <div className="col-12 text-center">
                                  <Botao
                                    texto="Adicionar Recorrência"
                                    dataTestId="btn-adicionar-recorrencia"
                                    onClick={() => fields.push({})}
                                    type={BUTTON_TYPE.BUTTON}
                                    style={BUTTON_STYLE.GREEN_OUTLINE}
                                  />
                                </div>
                              </div>
                            )}
                          </>
                        )}
                      </FieldArray>
                    </div>
                    <div className="row mt-4">
                      <div className="col-12 text-end">
                        {!isEdicao && (
                          <Botao
                            texto="Limpar"
                            dataTestId="btn-limpar"
                            type={BUTTON_TYPE.BUTTON}
                            style={BUTTON_STYLE.GREEN_OUTLINE}
                            className="me-3"
                            disabled={submitting}
                            onClick={() => {
                              form.reset();
                              setUnidadesEducacionais([]);
                            }}
                          />
                        )}
                        <Botao
                          texto="Cancelar"
                          dataTestId="btn-cancelar"
                          type={BUTTON_TYPE.BUTTON}
                          style={BUTTON_STYLE.GREEN_OUTLINE}
                          className="me-3"
                          disabled={submitting}
                          onClick={() => navigate(-1)}
                        />
                        {isEdicao && (
                          <Botao
                            texto="Excluir Cadastro"
                            dataTestId="btn-excluir"
                            type={BUTTON_TYPE.BUTTON}
                            style={BUTTON_STYLE.RED_OUTLINE}
                            icon="fas fa-trash"
                            className="me-3"
                            disabled={submitting}
                            onClick={() => setShowModalExcluir(true)}
                          />
                        )}
                        <Botao
                          texto={
                            submitting
                              ? ""
                              : isEdicao
                                ? "Salvar Alterações"
                                : "Salvar"
                          }
                          dataTestId="btn-salvar"
                          icon={submitting ? BUTTON_ICON.LOADING : undefined}
                          type={BUTTON_TYPE.BUTTON}
                          style={BUTTON_STYLE.GREEN}
                          onClick={() => !submitting && handleSubmit()}
                        />
                      </div>
                    </div>
                  </div>
                </form>
              )}
            </Form>
          </div>
        </Spin>
      )}

      {isEdicao && (
        <ModalExcluirDiaLetivo
          event={dadosEdicao}
          showModal={showModalExcluir}
          closeModal={() => setShowModalExcluir(false)}
          onConfirm={handleExcluirDiaLetivo}
        />
      )}
    </div>
  );
};
