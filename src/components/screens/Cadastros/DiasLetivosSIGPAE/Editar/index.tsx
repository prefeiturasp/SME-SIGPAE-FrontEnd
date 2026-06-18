import { Spin } from "antd";
import arrayMutators from "final-form-arrays";
import HTTP_STATUS from "http-status-codes";
import { useEffect, useRef, useState } from "react";
import { Field, Form } from "react-final-form";
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
import { toastError } from "src/components/Shareable/Toast/dialogs";
import Weekly from "src/components/Shareable/Weekly/Weekly";
import { required, requiredMultiselect } from "src/helpers/fieldValidators";
import { getDataObj } from "src/helpers/utilities";
import { getTiposUnidadeEscolar } from "src/services/cadastroTipoAlimentacao.service";
import { getUnidadesEducacionaisComCodEol } from "src/services/dietaEspecial.service";
import { buscaPeriodosEscolares } from "src/services/escola.service";
import { getLotesSimples } from "src/services/lote.service";
import {
  FiltroUnidadesEducacionaisInterface,
  OpcaoMultiselectInterface,
  TipoUnidadeEscolarInterface,
} from "./interfaces";

export const EditarDiasLetivosSIGPAE = () => {
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

  const debounceUnidadesRef = useRef<ReturnType<typeof setTimeout> | null>(
    null,
  );

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
          response.data.map((unidade) => ({
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
        response.data.results.map((periodo) => ({
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

  const onSubmit = () => {};

  useEffect(() => {
    Promise.all([
      getLotesSimplesAsync(),
      getTiposUnidadesUEAsync(),
      getPeriodosAsync(),
    ]);
  }, []);

  return (
    <div className="editar-dias-letivos">
      {erroAPI && <div>{erroAPI}</div>}
      {!erroAPI && (
        <div className="card mt-3">
          <div className="card-body">
            <Form
              initialValues={{
                recorrencias: [{ data_inicial: undefined }],
              }}
              onSubmit={onSubmit}
              mutators={{ ...arrayMutators }}
            >
              {({ handleSubmit, form, values }) => (
                <form onSubmit={handleSubmit}>
                  <div className="row">
                    <div className="col-4">
                      <label className="col-form-label">
                        <span className="red">*</span> DRE/Lote
                      </label>
                      <Field
                        component={MultiselectRaw}
                        name="lotes"
                        selected={values.lotes || []}
                        options={lotes}
                        onSelectedChanged={(values_) => {
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
                    <div className="col-4">
                      <label className="label fw-normal pb-2 pt-2">
                        <span className="red">*</span> Tipo de Unidade
                      </label>
                      <Field
                        component={MultiselectRaw}
                        placeholder="Selecione o(s) tipo(s) de unidade"
                        name="tipos_unidades"
                        dataTestId="select-tipos-unidades"
                        options={tiposUnidades.map((tipo_unidade) => ({
                          label: tipo_unidade.iniciais,
                          value: tipo_unidade.uuid,
                        }))}
                        selected={values.tipos_unidades || []}
                        onSelectedChanged={(values_) => {
                          setUnidadesEducacionais([]);
                          form.change("unidades_educacionais", undefined);
                          form.change(
                            `tipos_unidades`,
                            values_.map((value_) => value_.value),
                          );
                          if (debounceUnidadesRef.current) {
                            clearTimeout(debounceUnidadesRef.current);
                          }
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
                          if (debounceUnidadesRef.current) {
                            clearTimeout(debounceUnidadesRef.current);
                            debounceUnidadesRef.current = null;
                          }
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
                    <div className="col-4">
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
                          options={unidadesEducacionais}
                          selected={values.unidades_educacionais || []}
                          onSelectedChanged={(values_) => {
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
                  <hr />
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
                                Período Letivo
                              </label>
                              <div className="row g-0">
                                <div className="col-6 pe-3">
                                  <Field
                                    component={InputComData}
                                    placeholder="De"
                                    name={`${name}.data_inicial`}
                                    required
                                    maxDate={
                                      values.recorrencias?.[index]?.data_final
                                        ? getDataObj(
                                            values.recorrencias[index]
                                              .data_final,
                                          )
                                        : undefined
                                    }
                                  />
                                </div>
                                <div className="col-6">
                                  <Field
                                    component={InputComData}
                                    placeholder="Até"
                                    name={`${name}.data_final`}
                                    required
                                    minDate={
                                      values.recorrencias?.[index]?.data_inicial
                                        ? getDataObj(
                                            values.recorrencias[index]
                                              .data_inicial,
                                          )
                                        : undefined
                                    }
                                  />
                                </div>
                              </div>
                            </div>
                            <div className="col-4">
                              <label className="label fw-normal pb-2 pt-2">
                                Períodos Escolares
                              </label>
                              <Field
                                component={MultiselectRaw}
                                name={`${name}.periodos_escolares`}
                                options={periodosEscolares}
                                selected={
                                  values.recorrencias?.[index]
                                    ?.periodos_escolares || []
                                }
                                onSelectedChanged={(values_) => {
                                  form.change(
                                    `${name}.periodos_escolares`,
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
                                required
                                validate={required}
                                arrayDiasSemana={
                                  values.recorrencias?.[index]?.dias_semana ||
                                  []
                                }
                                handleWeekly={async (value) => {
                                  const dias =
                                    values.recorrencias?.[index]?.dias_semana ||
                                    [];
                                  const atualizado = dias.includes(value)
                                    ? dias.filter((d) => d !== value)
                                    : [...dias, value];
                                  form.change(
                                    `${name}.dias_semana`,
                                    atualizado,
                                  );
                                }}
                              />
                            </div>
                            {index > 0 && (
                              <div className="col-1 d-flex align-items-end pb-1">
                                <Botao
                                  onClick={() => fields.remove(index)}
                                  icon={BUTTON_ICON.TRASH}
                                  type={BUTTON_TYPE.BUTTON}
                                  style={BUTTON_STYLE.GREEN_OUTLINE}
                                />
                              </div>
                            )}
                          </div>
                        ))}
                        <div className="row mt-3">
                          <div className="col-12 text-center">
                            <Botao
                              texto="Adicionar Recorrência"
                              onClick={() => fields.push({})}
                              type={BUTTON_TYPE.BUTTON}
                              style={BUTTON_STYLE.GREEN_OUTLINE}
                            />
                          </div>
                        </div>
                      </>
                    )}
                  </FieldArray>
                </form>
              )}
            </Form>
          </div>
        </div>
      )}
    </div>
  );
};
