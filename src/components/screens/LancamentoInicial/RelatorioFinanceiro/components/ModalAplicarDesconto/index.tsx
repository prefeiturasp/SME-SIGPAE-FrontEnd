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
import { FaixaEtaria } from "src/services/medicaoInicial/parametrizacao_financeira.interface";
import { cadastroDescontoFinanceiro } from "src/services/medicaoInicial/relatorioFinanceiro.service";
import { normalizar } from "src/components/screens/LancamentoInicial/ParametrizacaoFinanceira/AdicionarParametrizacaoFinanceira/helpers";
import {
  numberToStringDecimalMonetario,
  stringDecimalToNumber,
} from "src/helpers/parsers";
import { capitalize } from "src/helpers/utilities";
import ModalCancelar from "../ModalCancelar";

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
  { uuid: "", nome: "Selecione o tipo" },
  { uuid: "ALIMENTACOES", nome: "ALIMENTAÇÕES" },
  { uuid: "DIETAS_TIPO_A", nome: "DIETA ESPECIAL TIPO A" },
  { uuid: "DIETAS_TIPO_B", nome: "DIETA ESPECIAL TIPO B" },
];

type Props = {
  showModal: boolean;
  setShowModal: (_e: boolean) => void;
  relatorioFinanceiro: string;
  onSave?: (_e: DescontoFinanceiro[]) => void;
  unidadesEducacionais?: { label: string; value: string }[];
  descontos?: DescontoFinanceiro[];
  faixasEtarias: FaixaEtaria[];
  relatorioConsolidado: RelatorioFinanceiroConsolidado;
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
}: Props) => {
  const [clausulas, setClausulas] = useState<any[]>([]);
  const [cancelar, setCancelar] = useState<boolean>(false);

  const initialValues = useMemo(() => {
    return {
      cadastros_desconto:
        descontos?.length > 0
          ? descontos.map((desconto) => ({
              ...desconto,
              faixa_etaria: `${desconto.periodo_escolar}|${
                typeof desconto.faixa_etaria === "string"
                  ? desconto.faixa_etaria
                  : desconto.faixa_etaria?.uuid
              }`,
              clausula_desconto:
                typeof desconto.clausula_desconto === "string"
                  ? desconto.clausula_desconto
                  : desconto.clausula_desconto?.uuid,
              unidades_educacionais: desconto.unidades_educacionais.map(
                ({ uuid }) => uuid,
              ),
            }))
          : [DEFAULT_EMPENHO],
    };
  }, [descontos]);

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

  const formatarPayload = (
    descontos: DescontoFinanceiro[],
  ): DescontoFinanceiro[] => {
    return descontos.map((desconto) => {
      if (typeof desconto.faixa_etaria === "string") {
        const [periodo, faixaUuid] = desconto.faixa_etaria?.split("|") || [
          "",
          "",
        ];
        return {
          ...desconto,
          periodo_escolar: periodo,
          faixa_etaria: faixaUuid,
        };
      } else return { ...desconto, faixa_etaria: desconto.faixa_etaria?.uuid };
    });
  };

  const onSubmit = async (values: {
    cadastros_desconto: DescontoFinanceiro[];
  }) => {
    const payload = formatarPayload(values?.cadastros_desconto ?? []);
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
    const response = await getClausulasParaDescontos();
    if (response.status === HTTP_STATUS.OK) setClausulas(response.data.results);
    else toastError("Erro ao carregar cláusulas para descontos.");
  };

  useEffect(() => {
    getClausulasParaDescontosAsync();
  }, []);

  const getValorUnitario = (
    tipoLancamento: string,
    faixaSelecionada: string,
  ) => {
    if (!tipoLancamento || !faixaSelecionada) return 0;

    const [periodo, faixaUuid] = faixaSelecionada.split("|");

    const faixa = faixasEtarias.find((f) => f.uuid === faixaUuid);
    if (!faixa) return 0;

    const nomeFaixa = normalizar(faixa.__str__);

    const tabela = relatorioConsolidado.tabelas?.find((tabela) => {
      const nomeTabela = tabela.nome
        ?.normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .toUpperCase();

      return (
        nomeTabela?.includes(
          tipoLancamento.replaceAll("_", " ").toUpperCase(),
        ) && tabela.periodo_escolar === periodo
      );
    });

    if (!tabela) return 0;

    const campo = tabela.valores?.find(
      (item) =>
        normalizar(item.nome_campo).replaceAll("_", " ") === nomeFaixa &&
        item.tipo_valor === "UNITARIO",
    );
    return stringDecimalToNumber(campo?.valor) ?? 0;
  };

  return (
    <Modal show={showModal} onHide={() => setShowModal(false)} size="lg">
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
              const valorUnitario = getValorUnitario(
                desconto.tipo_lancamento,
                desconto.faixa_etaria,
              );

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
                                component={Select}
                                options={TIPO_LANCAMENTO_OPTIONS}
                                label="Tipo de Lançamento"
                                name={`${name}.tipo_lancamento`}
                                id="tipo_lancamento"
                                placeholder="Selecione o tipo"
                                required
                                validate={required}
                              />
                            </div>
                            <div className="col-4">
                              <Field
                                component={Select}
                                options={faixasEtariasOptions}
                                label="Faixa Etária para Desconto"
                                name={`${name}.faixa_etaria`}
                                id="faixa_etaria"
                                required
                                validate={required}
                              />
                            </div>
                            <div className="col-4">
                              <Field
                                component={Select}
                                options={[
                                  { uuid: "", nome: "Selecione a cláusula" },
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
                                component={InputText}
                                label="Valor Unitário"
                                name={`${name}.valor_unitario`}
                                disabled
                                prefix="R$"
                              />
                            </div>
                            <div className="col-4">
                              <Field
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
                  onClick={() =>
                    descontos?.length > 0
                      ? setShowModal(false)
                      : setCancelar(true)
                  }
                />
                <Botao
                  dataTestId="botao-salvar"
                  texto="Salvar Empenhos"
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
