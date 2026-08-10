import { Modal } from "react-bootstrap";
import { Botao } from "src/components/Shareable/Botao";
import {
  BUTTON_ICON,
  BUTTON_STYLE,
  BUTTON_TYPE,
} from "src/components/Shareable/Botao/constants";
import { Form, Field } from "react-final-form";
import {
  toastError,
  toastSuccess,
} from "src/components/Shareable/Toast/dialogs";
import { MultiselectRaw } from "src/components/Shareable/MultiselectRaw";
import {
  DescontoFinanceiro,
  RelatorioFinanceiroConsolidado,
} from "src/interfaces/relatorio_financeiro.interface";
import arrayMutators from "final-form-arrays";
import HTTP_STATUS from "http-status-codes";
import { FieldArray } from "react-final-form-arrays";
import { useEffect, useMemo, useState } from "react";
import Select from "src/components/Shareable/Select";
import { required } from "src/helpers/fieldValidators";
import { InputText } from "src/components/Shareable/Input/InputText";
import { getClausulasParaDescontos } from "src/services/medicaoInicial/clausulasParaDescontos.service";
import {
  FaixaEtaria,
  TipoAlimentacao,
} from "src/services/medicaoInicial/parametrizacao_financeira.interface";
import { cadastroDescontoFinanceiro } from "src/services/medicaoInicial/relatorioFinanceiro.service";
import { normalizar } from "src/components/screens/LancamentoInicial/ParametrizacaoFinanceira/AdicionarParametrizacaoFinanceira/helpers";
import {
  numberToStringDecimalMonetario,
  stringDecimalToNumber,
} from "src/helpers/parsers";
import { capitalize } from "src/helpers/utilities";
import ModalCancelar from "../ModalCancelar";
import { ClausulaInterface } from "src/interfaces/clausulas_para_descontos.interface";
import {
  formatarPayload,
  getValoresDescontos,
  getValorUnitario,
} from "./helpers";

const DEFAULT_EMPENHO: DescontoFinanceiro = {
  unidades_educacionais: [],
  tipo_lancamento: "",
  faixa_etaria: "",
  clausula_desconto: "",
  quantidade: 0,
  valor_unitario: 0,
  total_desconto: 0,
  periodo_escolar: "",
};

const TIPO_LANCAMENTO_OPTIONS = [
  { uuid: "ALIMENTACOES", nome: "ALIMENTAÇÕES" },
  { uuid: "DIETAS_TIPO_A", nome: "DIETA ESPECIAL TIPO A" },
  { uuid: "DIETAS_TIPO_B", nome: "DIETA ESPECIAL TIPO B" },
];

const TIPOS_UNIDADE = {
  CEMEI: [
    { prefixo: "CEI", nome: "CEI" },
    { prefixo: "EMEI", nome: "EMEI" },
  ],
  EMEBS: [
    { prefixo: "INFANTIL", nome: "INFANTIL" },
    { prefixo: "FUNDAMENTAL", nome: "FUNDAMENTAL" },
  ],
};

type Props = {
  showModal: boolean;
  setShowModal: (_e: boolean) => void;
  relatorioFinanceiro: string;
  onSave?: (_e: DescontoFinanceiro[]) => void;
  unidadesEducacionais?: { label: string; value: string }[];
  descontos?: DescontoFinanceiro[];
  faixasEtarias: FaixaEtaria[];
  relatorioConsolidado: RelatorioFinanceiroConsolidado;
  tiposAlimentacao: Array<TipoAlimentacao>;
};

const ModalAplicarDesconto = ({
  showModal,
  setShowModal,
  relatorioFinanceiro,
  onSave,
  unidadesEducacionais,
  descontos,
  faixasEtarias,
  relatorioConsolidado,
  tiposAlimentacao,
}: Props) => {
  const [clausulas, setClausulas] = useState<ClausulaInterface[]>([]);
  const [cancelar, setCancelar] = useState<boolean>(false);

  const grupoNome =
    relatorioConsolidado?.grupo_unidade_escolar?.nome?.toUpperCase() ?? "";

  const ehCei = grupoNome?.includes("GRUPO 1");
  const ehCemei = grupoNome?.includes("GRUPO 2");
  const ehEmef = grupoNome?.includes("GRUPO 4");
  const ehEmebs = grupoNome?.includes("GRUPO 5");

  const alimentacoesDietaA = tiposAlimentacao.filter((item) =>
    ["REFEICAO", "LANCHE", "LANCHE 4H"].includes(
      normalizar(item.nome).toUpperCase(),
    ),
  );

  const alimentacoesDietaB = tiposAlimentacao.filter((item) =>
    ["LANCHE", "LANCHE 4H"].includes(normalizar(item.nome).toUpperCase()),
  );

  const initialValues = useMemo(() => {
    return {
      cadastros_desconto:
        descontos?.length > 0
          ? descontos.map((e) => getValoresDescontos(e, { ehEmef }))
          : [DEFAULT_EMPENHO],
    };
  }, [descontos, ehEmef]);

  const faixasEtariasOptions = useMemo(() => {
    return [
      { uuid: "", nome: "Selecione as faixas" },
      ...["INTEGRAL", "PARCIAL"].flatMap((tipo) =>
        faixasEtarias.map((faixa) => ({
          uuid: `${tipo}|${faixa.uuid}`,
          nome: `${capitalize(tipo)} - ${faixa.__str__}`,
        })),
      ),
    ];
  }, [faixasEtarias]);

  const adicionarOpcaoRefeicaoEJA = (opcoes: TipoAlimentacao[]) => {
    if (!ehEmef) return opcoes;

    return opcoes.flatMap((item) => {
      const ehRefeicao = normalizar(item.nome).toUpperCase() === "REFEICAO";

      if (!ehRefeicao) {
        return [item];
      }

      return [
        item,
        {
          ...item,
          uuid: `NOITE|${item.uuid}`,
          nome: "Refeição - EJA",
        },
      ];
    });
  };

  const getOpcoesAlimentacao = (tipoLancamento: string) => {
    const tipo = tipoLancamento?.includes("|")
      ? tipoLancamento.split("|")[1]
      : tipoLancamento;

    switch (tipo) {
      case "ALIMENTACOES":
        return [
          ...adicionarOpcaoRefeicaoEJA(tiposAlimentacao),
          { uuid: "kit_lanche", nome: "Kit Lanche" },
        ];

      case "DIETAS_TIPO_A":
        return adicionarOpcaoRefeicaoEJA(alimentacoesDietaA);

      case "DIETAS_TIPO_B":
        return alimentacoesDietaB;

      default:
        return [];
    }
  };

  const getTiposLancamentoOptions = () => {
    if (ehCemei) {
      return [
        { uuid: "", nome: "Selecione o tipo" },
        ...TIPOS_UNIDADE.CEMEI.flatMap(({ prefixo, nome }) =>
          TIPO_LANCAMENTO_OPTIONS.map((option) => ({
            ...option,
            uuid: `${prefixo}|${option.uuid}`,
            nome: `${option.nome} - ${nome}`,
          })),
        ),
      ];
    }

    if (ehEmebs) {
      return [
        { uuid: "", nome: "Selecione o tipo" },
        ...TIPOS_UNIDADE.EMEBS.flatMap(({ prefixo, nome }) =>
          TIPO_LANCAMENTO_OPTIONS.map((option) => ({
            ...option,
            uuid: `${prefixo}|${option.uuid}`,
            nome: `${option.nome} - ${nome}`,
          })),
        ),
      ];
    }

    return [{ uuid: "", nome: "Selecione o tipo" }, ...TIPO_LANCAMENTO_OPTIONS];
  };

  const onSubmit = async (values: {
    cadastros_desconto: DescontoFinanceiro[];
  }) => {
    const payload = formatarPayload(values?.cadastros_desconto ?? [], {
      ehCemei,
      ehEmebs,
      ehEmef,
    });

    const response = await cadastroDescontoFinanceiro(
      payload,
      relatorioFinanceiro,
    );

    if (response.status === HTTP_STATUS.OK) {
      toastSuccess("Descontos aplicados com sucesso.");
      if (typeof onSave === "function") onSave(response.data);
      setShowModal(false);
    } else {
      toastError("Falha ao aplicar descontos.");
    }
  };

  const getClausulasParaDescontosAsync = async () => {
    const response = await getClausulasParaDescontos(undefined, {
      edital: relatorioConsolidado?.edital?.uuid,
    });

    if (response.status === HTTP_STATUS.OK) {
      setClausulas(response.data.results);
    } else {
      toastError("Erro ao carregar cláusulas para descontos.");
    }
  };

  useEffect(() => {
    if (relatorioConsolidado) getClausulasParaDescontosAsync();
  }, [relatorioConsolidado]);

  return (
    <Modal show={showModal} onHide={() => setCancelar(true)} size="lg">
      <Modal.Header closeButton>
        <Modal.Title>Aplicar Descontos</Modal.Title>
      </Modal.Header>

      <Form
        onSubmit={onSubmit}
        initialValues={initialValues}
        mutators={{ ...arrayMutators }}
        render={({ handleSubmit, submitting, values, form }) => {
          useEffect(() => {
            values.cadastros_desconto?.forEach((desconto, index) => {
              const valorUnitario = getValorUnitario({
                desconto,
                grupo: {
                  ehCei,
                  ehCemei,
                  ehEmebs,
                  ehEmef,
                },
                faixasEtarias,
                tiposAlimentacao,
                tabelas: relatorioConsolidado.tabelas,
              });

              const clausula = clausulas.find(
                (c) => c.uuid === desconto.clausula_desconto,
              );

              const percentualDesconto =
                Number(clausula?.porcentagem_desconto || 0) / 100;

              const valorAtual = Number(
                values.cadastros_desconto[index]?.valor_unitario || 0,
              );

              if (valorUnitario !== valorAtual) {
                form.change(
                  `cadastros_desconto.${index}.valor_unitario`,
                  numberToStringDecimalMonetario(valorUnitario),
                );
              }

              const valorBase =
                Number(desconto.quantidade || 0) * Number(valorUnitario || 0);

              const totalCalculado = valorBase * percentualDesconto;

              const totalAtual = stringDecimalToNumber(
                values.cadastros_desconto[index]?.total_desconto?.toString() ||
                  "0",
              );

              if (totalCalculado !== totalAtual) {
                form.change(
                  `cadastros_desconto.${index}.total_desconto`,
                  numberToStringDecimalMonetario(totalCalculado),
                );
              }
            });
          }, [values.cadastros_desconto, form, clausulas]);

          const totalDescontosItens =
            values.cadastros_desconto?.reduce((acc, desconto) => {
              return (
                acc +
                stringDecimalToNumber(
                  desconto?.total_desconto?.toString() || "0",
                )
              );
            }, 0) || 0;

          return (
            <form onSubmit={handleSubmit}>
              <Modal.Body>
                <b className="mb-3 d-block">
                  Informe abaixo os descontos que devem ser aplicados nos
                  lançamentos do Grupo 1:
                </b>

                <FieldArray name="cadastros_desconto">
                  {({ fields }) => (
                    <>
                      {fields.map((name, index) => (
                        <div key={name}>
                          {fields.length > 1 && (
                            <div className="position-relative mb-3 mt-4">
                              <hr className="m-0" />

                              <div
                                style={{
                                  position: "absolute",
                                  right: 0,
                                  top: "-14px",
                                  background: "#fff",
                                  paddingLeft: "8px",
                                }}
                              >
                                <Botao
                                  dataTestId={`botao_remover_${index}`}
                                  icon={BUTTON_ICON.TRASH}
                                  style={BUTTON_STYLE.GREEN_OUTLINE}
                                  type={BUTTON_TYPE.BUTTON}
                                  onClick={() => fields.remove(index)}
                                />
                              </div>
                            </div>
                          )}

                          <div className="row mt-2">
                            <div className="col-12">
                              <Field
                                dataTestId={`unidades_educacionais_${index}`}
                                label="Unidades Educacionais para pagamento neste empenho"
                                component={MultiselectRaw}
                                name={`${name}.unidades_educacionais`}
                                placeholder="Selecione as Unidades"
                                options={unidadesEducacionais}
                                selected={
                                  values.cadastros_desconto?.[index]
                                    ?.unidades_educacionais || []
                                }
                                onSelectedChanged={(values_: any) => {
                                  form.change(
                                    `${name}.unidades_educacionais`,
                                    values_.map((v: any) => v.value),
                                  );
                                }}
                                required
                              />
                            </div>
                          </div>

                          <div className="row mt-2">
                            <div className="col-4">
                              <Field
                                dataTestId={`tipo_lancamento_${index}`}
                                component={Select}
                                options={getTiposLancamentoOptions()}
                                label="Tipo de Lançamento"
                                name={`${name}.tipo_lancamento`}
                                id="tipo_lancamento"
                                placeholder="Selecione o tipo"
                                required
                                validate={required}
                                onChangeEffect={(e) => {
                                  if (e.target?.value?.includes("EMEI")) {
                                    form.change(`${name}.faixa_etaria`, null);
                                    form.change(
                                      `${name}.periodo_escolar`,
                                      null,
                                    );
                                  } else if (e.target?.value?.includes("CEI")) {
                                    form.change(
                                      `${name}.tipo_alimentacao`,
                                      null,
                                    );
                                  }
                                }}
                              />
                            </div>

                            <div className="col-4">
                              {ehCei ||
                              (ehCemei &&
                                values.cadastros_desconto[
                                  index
                                ]?.tipo_lancamento?.includes("CEI")) ? (
                                <Field
                                  component={Select}
                                  options={faixasEtariasOptions}
                                  label="Faixa Etária para Desconto"
                                  name={`${name}.faixa_etaria`}
                                  id="faixa_etaria"
                                  required
                                  validate={required}
                                />
                              ) : (
                                <Field
                                  dataTestId={`tipo_alimentacao_${index}`}
                                  component={Select}
                                  options={[
                                    {
                                      uuid: "",
                                      nome: "Selecione as alimentações",
                                    },
                                    ...getOpcoesAlimentacao(
                                      values.cadastros_desconto[index]
                                        ?.tipo_lancamento,
                                    ),
                                  ]}
                                  label="Alimentações"
                                  name={`${name}.tipo_alimentacao`}
                                  id="tipo_alimentacao"
                                  required
                                  validate={required}
                                />
                              )}
                            </div>

                            <div className="col-4">
                              <Field
                                dataTestId={`clausula_desconto_${index}`}
                                component={Select}
                                options={[
                                  {
                                    uuid: "",
                                    nome: "Selecione a cláusula",
                                  },
                                  ...clausulas.map((clausula) => ({
                                    uuid: clausula.uuid,
                                    nome: `${clausula.numero_clausula}. ${clausula.item_clausula} - (${clausula.porcentagem_desconto}%)`,
                                  })),
                                ]}
                                label="Cláusula de Desconto"
                                name={`${name}.clausula_desconto`}
                                id="clausula_desconto"
                                required
                                validate={required}
                              />
                            </div>
                          </div>

                          <div className="row mt-2">
                            <div className="col-4">
                              <Field
                                dataTestId={`quantidade_${index}`}
                                component={InputText}
                                label="Quantidade"
                                name={`${name}.quantidade`}
                                placeholder="Informe a quantidade"
                                validate={required}
                                required
                                apenasNumeros
                              />
                            </div>

                            <div className="col-4">
                              <Field
                                dataTestId={`valor_unitario_${index}`}
                                component={InputText}
                                label="Valor Unitário"
                                name={`${name}.valor_unitario`}
                                disabled
                                prefix="R$"
                              />
                            </div>

                            <div className="col-4">
                              <Field
                                dataTestId={`total_desconto_${index}`}
                                component={InputText}
                                label="Total do Desconto"
                                name={`${name}.total_desconto`}
                                disabled
                                prefix="R$"
                              />
                            </div>
                          </div>
                        </div>
                      ))}

                      {fields.length > 1 && (
                        <div className="row mt-4">
                          <div className="col-12">
                            <Field
                              component={InputText}
                              label="Total de Descontos dos Itens"
                              name="total_descontos_itens"
                              disabled
                              prefix="R$"
                              valorInicial={numberToStringDecimalMonetario(
                                totalDescontosItens,
                              )}
                            />
                          </div>
                        </div>
                      )}

                      <div className="row mt-4 justify-content-center">
                        <div className="col-auto">
                          <Botao
                            dataTestId="botao-adicionar"
                            texto="Adicionar mais descontos"
                            icon={BUTTON_ICON.PLUS}
                            type={BUTTON_TYPE.BUTTON}
                            style={BUTTON_STYLE.GREEN_OUTLINE}
                            onClick={() => fields.push(DEFAULT_EMPENHO)}
                          />
                        </div>
                      </div>
                    </>
                  )}
                </FieldArray>
              </Modal.Body>

              <Modal.Footer>
                <Botao
                  dataTestId="botao-cancelar"
                  texto="Cancelar"
                  type={BUTTON_TYPE.BUTTON}
                  style={BUTTON_STYLE.GREEN_OUTLINE}
                  className="ms-3"
                  onClick={() => setCancelar(true)}
                />

                <Botao
                  dataTestId="botao-salvar"
                  texto="Salvar Descontos"
                  type={BUTTON_TYPE.SUBMIT}
                  style={BUTTON_STYLE.GREEN}
                  className="ms-3"
                  disabled={submitting}
                />
              </Modal.Footer>
            </form>
          );
        }}
      />

      <ModalCancelar
        showModal={cancelar}
        setShowModal={setCancelar}
        onCancelar={() => {
          setShowModal(false);
          setCancelar(false);
        }}
      />
    </Modal>
  );
};

export default ModalAplicarDesconto;
