import React, { useEffect, useRef, useState } from "react";
import { Spin } from "antd";
import { AxiosResponse } from "axios";
import { Field, Form } from "react-final-form";
import arrayMutators from "final-form-arrays";
import { FieldArray } from "react-final-form-arrays";
import InputText from "src/components/Shareable/Input/InputText";
import { TextArea } from "src/components/Shareable/TextArea/TextArea";
import AutoCompleteField from "src/components/Shareable/AutoCompleteField";
import { InputComData } from "src/components/Shareable/DatePicker";
import Select from "src/components/Shareable/Select";
import Botao from "src/components/Shareable/Botao";
import {
  BUTTON_STYLE,
  BUTTON_TYPE,
} from "src/components/Shareable/Botao/constants";
import {
  toastError,
  toastSuccess,
} from "src/components/Shareable/Toast/dialogs";
import { required } from "src/helpers/fieldValidators";
import { exibeError, formataMilharDecimal } from "src/helpers/utilities";
import {
  getCronogramasMensalAssinados,
  getCronogramaMensalDetalhado,
  criarCronogramaSemanalRascunho,
  atualizarCronogramaSemanalRascunho,
} from "src/services/cronogramaSemanal.service";
import {
  CronogramaMensalSimples,
  CronogramaMensalDetalhado,
  EtapaMes,
} from "src/interfaces/cronograma_semanal.interface";
import { obterLimitesMes } from "./helpers";
import "./styles.scss";

interface FormValues {
  cronograma_mensal?: string;
  produto?: string;
  fornecedor?: string;
  numero_contrato?: string;
  numero_processo_sei?: string;
  numero_chamada_publica_ou_ata?: string;
  tipo_documento?: string;
  numero_empenho?: string;
  qtd_total_empenho?: string;
  custo_unitario_produto?: string;
  observacoes?: string;
  programacoes?: {
    mes_programado: string;
    data_inicio: string;
    data_fim: string;
    quantidade: string;
  }[];
}

interface CadastrarCronogramaSemanalProps {
  uuid?: string;
  edicao?: boolean;
}

const CadastrarCronogramaSemanal: React.FC<CadastrarCronogramaSemanalProps> = ({
  uuid,
  edicao = false,
}) => {
  const [carregando, setCarregando] = useState(false);
  const [cronogramasMensal, setCronogramasMensal] = useState<
    CronogramaMensalSimples[]
  >([]);
  const [cronogramaMensalSelecionado, setCronogramaMensalSelecionado] =
    useState<CronogramaMensalDetalhado | null>(null);
  const [etapasMeses, setEtapasMeses] = useState<EtapaMes[]>([]);
  const formRef = useRef<any>(null);

  useEffect(() => {
    carregarCronogramasMensal();
  }, []);

  const carregarCronogramasMensal = async () => {
    try {
      setCarregando(true);
      const response = await getCronogramasMensalAssinados();
      if (response && response.data) {
        setCronogramasMensal(response.data);
      }
    } catch {
      toastError("Erro ao carregar cronogramas mensal");
    }
  };

  const [valoresCronogramaMensal, setValoresCronogramaMensal] =
    useState<FormValues>({
      cronograma_mensal: "",
      programacoes: [],
    });

  const selecionarCronogramaMensal = (
    uuidCronograma: string,
    numeroCronograma: string,
  ) => {
    const form = formRef.current;
    if (!form) {
      return;
    }

    // IMPORTANTE: Atualizar o campo cronograma_mensal manualmente
    // pois o AutoCompleteField não está atualizando o form corretamente em testes
    form.change("cronograma_mensal", numeroCronograma);

    setCarregando(true);
    getCronogramaMensalDetalhado(uuidCronograma)
      .then((response: AxiosResponse<CronogramaMensalDetalhado>) => {
        if (response && response.data) {
          const data = response.data;

          // Usar form.change() para atualizar cada campo individualmente
          // Isso evita reinicializar o form e perder o valor de cronograma_mensal
          form.change("produto", data.ficha_tecnica?.produto?.nome || "");
          form.change("fornecedor", data.empresa?.nome_fantasia || "");
          form.change("numero_contrato", data.contrato?.numero || "");
          form.change("numero_processo_sei", data.contrato?.processo || "");
          form.change(
            "numero_chamada_publica_ou_ata",
            data.contrato?.numero_pregao
              ? data.contrato?.ata || ""
              : data.contrato?.numero_chamada_publica || "",
          );
          form.change(
            "tipo_documento",
            data.contrato?.numero_pregao
              ? "Nº da Ata"
              : "Nº da Chamada Pública",
          );
          form.change("numero_empenho", data.numero_empenho || "");
          form.change(
            "qtd_total_empenho",
            formataMilharDecimal(data.qtd_total_empenho) || "",
          );
          form.change(
            "custo_unitario_produto",
            `R$ ${formataMilharDecimal(data.custo_unitario_produto)}`,
          );

          const novosValores = {
            ...form.getState().values,
            produto: data.ficha_tecnica?.produto?.nome || "",
            fornecedor: data.empresa?.nome_fantasia || "",
            numero_contrato: data.contrato?.numero || "",
            numero_processo_sei: data.contrato?.processo || "",
            numero_chamada_publica_ou_ata: data.contrato?.numero_pregao
              ? data.contrato?.ata || ""
              : data.contrato?.numero_chamada_publica || "",
            tipo_documento: data.contrato?.numero_pregao
              ? "Nº da Ata"
              : "Nº da Chamada Pública",
            numero_empenho: data.numero_empenho || "",
            qtd_total_empenho:
              formataMilharDecimal(data.qtd_total_empenho) || "",
            custo_unitario_produto: `R$ ${formataMilharDecimal(data.custo_unitario_produto)}`,
          };

          setValoresCronogramaMensal(novosValores);

          if (data.etapas && data.etapas.length > 0) {
            const meses: { [key: string]: number } = {};
            data.etapas.forEach((etapa: any) => {
              if (etapa.data_programada) {
                // data_programada já vem no formato MM/YYYY
                const mesAno = etapa.data_programada;
                if (!meses[mesAno]) {
                  meses[mesAno] = 0;
                }
                meses[mesAno] += etapa.quantidade || 0;
              }
            });

            const etapasMesesList: EtapaMes[] = Object.entries(meses).map(
              ([mes_ano, quantidade_total]) => ({
                mes_ano,
                quantidade_total,
              }),
            );
            setEtapasMeses(etapasMesesList);
          }

          setCronogramaMensalSelecionado(data);
        }
      })
      .catch(() => {
        toastError("Erro ao carregar dados do cronograma mensal");
      })
      .finally(() => {
        setCarregando(false);
      });
  };

  const calcularQuantidadeEstimada = (
    programacoes: FormValues["programacoes"],
  ): number => {
    if (
      !cronogramaMensalSelecionado ||
      !cronogramaMensalSelecionado.etapas ||
      !programacoes
    ) {
      return 0;
    }

    return programacoes.reduce((total, prog) => {
      if (!prog.mes_programado) return total;

      const etapasDoMes = cronogramaMensalSelecionado.etapas.filter(
        (etapa: any) => {
          if (!etapa.data_programada) return false;
          // data_programada já está no formato MM/YYYY
          return etapa.data_programada === prog.mes_programado;
        },
      );

      const qtdMes = etapasDoMes.reduce(
        (sum: number, etapa: any) => sum + (etapa.quantidade || 0),
        0,
      );
      return total + qtdMes;
    }, 0);
  };

  const calcularDiferenca = (
    programacoes: FormValues["programacoes"],
  ): number => {
    const quantidadeEstimada = calcularQuantidadeEstimada(programacoes);
    const quantidadeEntregue = (programacoes || []).reduce((total, prog) => {
      const qtd =
        parseFloat(
          prog.quantidade?.replace(/\./g, "").replace(",", ".") || "0",
        ) || 0;
      return total + qtd;
    }, 0);
    return quantidadeEstimada - quantidadeEntregue;
  };

  const onSubmit = async (values: FormValues) => {
    if (!values.cronograma_mensal) {
      toastError("Selecione um Cronograma Mensal");
      return;
    }

    try {
      setCarregando(true);

      const option = optionsCronogramasMensal.find(
        (o) => o.value === values.cronograma_mensal,
      );
      const uuidCronograma = option?.uuid;

      const payload = {
        cronograma_mensal: uuidCronograma,
        observacoes: values.observacoes || "",
        programacoes: (values.programacoes || [])
          .filter(
            (p) =>
              p.mes_programado && p.data_inicio && p.data_fim && p.quantidade,
          )
          .map((p) => ({
            mes_programado: p.mes_programado,
            data_inicio: p.data_inicio,
            data_fim: p.data_fim,
            quantidade: parseFloat(
              p.quantidade.replace(/\./g, "").replace(",", "."),
            ),
          })),
      };

      let response;
      if (edicao && uuid) {
        response = await atualizarCronogramaSemanalRascunho(uuid, payload, {
          skipAuthRefresh: true,
        });
      } else {
        response = await criarCronogramaSemanalRascunho(payload, {
          skipAuthRefresh: true,
        });
      }

      if (response && (response.status === 200 || response.status === 201)) {
        toastSuccess("Rascunho salvo com sucesso!");
      }
    } catch (error) {
      exibeError(error, "Erro ao salvar cronograma semanal");
    } finally {
      setCarregando(false);
    }
  };

  const optionsCronogramasMensal = cronogramasMensal.map((c) => ({
    value: c.numero,
    label: c.numero,
    uuid: c.uuid,
  }));

  const optionsMeses = etapasMeses.map((e) => ({
    nome: e.mes_ano,
    uuid: e.mes_ano,
  }));

  const textoFaltante = (programacoes: FormValues["programacoes"]) => {
    const diferenca = calcularDiferenca(programacoes);

    const textoPadrao = (
      <div>
        Faltam
        <span className="fw-bold">
          &nbsp;
          {formataMilharDecimal(Math.abs(diferenca)?.toString())}
          &nbsp;
        </span>
        para programar
      </div>
    );

    const textoQuantidadeMaior = <div>Quantidade maior que a prevista</div>;

    return (
      <div className="row">
        <div
          className={`col-12 texto-alimento-faltante ${
            diferenca === 0 ? "mensagem-verde" : "mensagem-vermelho"
          }`}
        >
          {diferenca < 0 ? textoQuantidadeMaior : textoPadrao}
        </div>
      </div>
    );
  };

  return (
    <Spin tip="Carregando..." spinning={carregando}>
      <div className="card mt-3 card-cadastro-cronograma-semanal">
        <div className="card-body cadastro-cronograma-semanal">
          <Form
            onSubmit={onSubmit}
            initialValues={valoresCronogramaMensal}
            mutators={{ ...arrayMutators }}
            render={({ form, handleSubmit, values }) => {
              formRef.current = form;

              return (
                <form
                  onSubmit={handleSubmit}
                  data-testid="form-cronograma-semanal"
                >
                  {/* Linha 1: Cronograma Mensal (1/3) + Produto (2/3) */}
                  <div className="row">
                    <div className="col-4">
                      <Field
                        component={AutoCompleteField}
                        options={optionsCronogramasMensal}
                        label="Cronograma Mensal Cadastrado"
                        name="cronograma_mensal"
                        required
                        validate={required}
                        placeholder="Selecione um Cronograma Mensal"
                        dataTestId="select-cronograma-mensal"
                        inputOnChange={(value: string) => {
                          if (value) {
                            const option = optionsCronogramasMensal.find(
                              (o) => o.value === value,
                            );
                            if (option && option.uuid) {
                              // Chamar selecionarCronogramaMensal que vai atualizar o form com form.change
                              selecionarCronogramaMensal(
                                option.uuid,
                                option.value,
                              );
                            }
                          }
                        }}
                      />
                    </div>
                    <div className="col-8">
                      <Field
                        component={InputText}
                        label="Produto"
                        name="produto"
                        disabled
                      />
                    </div>
                  </div>

                  {/* Linha 2: Fornecedor (inteira) */}
                  <div className="row">
                    <div className="col-12">
                      <Field
                        component={InputText}
                        label="Fornecedor"
                        name="fornecedor"
                        disabled
                      />
                    </div>
                  </div>

                  {/* Linha 3: Nº Contrato + Nº Processo SEI + Nº Empenho */}
                  <div className="row">
                    <div className="col-4">
                      <Field
                        component={InputText}
                        label="Nº do Contrato"
                        name="numero_contrato"
                        disabled
                      />
                    </div>
                    <div className="col-4">
                      <Field
                        component={InputText}
                        label="Nº do Processo SEI - Contratos"
                        name="numero_processo_sei"
                        disabled
                      />
                    </div>
                    <div className="col-4">
                      <Field
                        component={InputText}
                        label="Nº do Empenho"
                        name="numero_empenho"
                        disabled
                      />
                    </div>
                  </div>

                  {/* Linha 4: Chamada/Ata + Qtd Total + Custo Unitário */}
                  <div className="row">
                    <div className="col-4">
                      <Field
                        component={InputText}
                        label={
                          values.tipo_documento || "Nº da Chamada Pública/Ata"
                        }
                        name="numero_chamada_publica_ou_ata"
                        disabled
                      />
                    </div>
                    <div className="col-4">
                      <Field
                        component={InputText}
                        label="Quantidade Total do Empenho"
                        name="qtd_total_empenho"
                        disabled
                      />
                    </div>
                    <div className="col-4">
                      <Field
                        component={InputText}
                        label="Custo Unitário do Produto"
                        name="custo_unitario_produto"
                        disabled
                      />
                    </div>
                  </div>

                  {values.cronograma_mensal && (
                    <>
                      <div className="subtitulo mt-4">
                        Programação de Entrega
                      </div>
                      <hr className="linha-verde" />

                      <FieldArray name="programacoes">
                        {({ fields }) => (
                          <>
                            {fields.map((name, index) => (
                              <React.Fragment key={name}>
                                {index !== 0 && (
                                  <>
                                    <hr />
                                    <div className="row">
                                      <div className="w-100">
                                        <Botao
                                          texto=""
                                          type={BUTTON_TYPE.BUTTON}
                                          style={BUTTON_STYLE.GREEN_OUTLINE}
                                          icon="fas fa-trash"
                                          className="float-end ms-3"
                                          onClick={() => fields.remove(index)}
                                          tooltipExterno="Remover Programação"
                                        />
                                      </div>
                                    </div>
                                  </>
                                )}

                                <div className="row">
                                  <div className="col-3">
                                    <Field
                                      component={Select}
                                      name={`${name}.mes_programado`}
                                      options={[
                                        { nome: "Selecione o Mês", uuid: "" },
                                        ...optionsMeses,
                                      ]}
                                      label="Mês Programado"
                                      required
                                      validate={required}
                                      onChange={() => {
                                        form.change(
                                          `${name}.data_inicio` as keyof FormValues,
                                          "",
                                        );
                                        form.change(
                                          `${name}.data_fim` as keyof FormValues,
                                          "",
                                        );
                                      }}
                                    />
                                  </div>

                                  <div className="col-3">
                                    <Field
                                      component={InputComData}
                                      label="Período Programado para Entrega"
                                      name={`${name}.data_inicio`}
                                      placeholder=""
                                      writable={false}
                                      showMonthYearPicker={false}
                                      dateFormat="DD/MM/YYYY"
                                      dateFormatPicker="dd/MM/yyyy"
                                      minDate={
                                        obterLimitesMes(
                                          values.programacoes?.[index]
                                            ?.mes_programado || "",
                                        ).minDate
                                      }
                                      maxDate={
                                        obterLimitesMes(
                                          values.programacoes?.[index]
                                            ?.mes_programado || "",
                                        ).maxDate
                                      }
                                    />
                                  </div>

                                  <div className="col-3">
                                    <Field
                                      component={InputComData}
                                      label="Até"
                                      name={`${name}.data_fim`}
                                      placeholder=""
                                      writable={false}
                                      showMonthYearPicker={false}
                                      dateFormat="DD/MM/YYYY"
                                      dateFormatPicker="dd/MM/yyyy"
                                      minDate={
                                        obterLimitesMes(
                                          values.programacoes?.[index]
                                            ?.mes_programado || "",
                                        ).minDate
                                      }
                                      maxDate={
                                        obterLimitesMes(
                                          values.programacoes?.[index]
                                            ?.mes_programado || "",
                                        ).maxDate
                                      }
                                    />
                                  </div>

                                  <div className="col-3">
                                    <Field
                                      component={InputText}
                                      label="Quantidade da Entrega"
                                      name={`${name}.quantidade`}
                                      placeholder="Informe a quantidade"
                                      agrupadorMilharComDecimal
                                    />
                                  </div>
                                </div>

                                {textoFaltante(values.programacoes)}
                              </React.Fragment>
                            ))}

                            <div className="text-center mb-2 mt-2">
                              <Botao
                                texto="+ Adicionar Programação"
                                type={BUTTON_TYPE.BUTTON}
                                style={BUTTON_STYLE.GREEN_OUTLINE}
                                onClick={() =>
                                  fields.push({
                                    mes_programado: "",
                                    data_inicio: "",
                                    data_fim: "",
                                    quantidade: "",
                                  })
                                }
                              />
                            </div>
                          </>
                        )}
                      </FieldArray>

                      <div className="row mt-4">
                        <div className="col-12">
                          <Field
                            component={TextArea}
                            label="Observações"
                            name="observacoes"
                            placeholder="Digite suas observações..."
                          />
                        </div>
                      </div>

                      <hr />

                      <div className="mt-4 mb-4">
                        <Botao
                          texto="Salvar Rascunho"
                          type={BUTTON_TYPE.SUBMIT}
                          style={BUTTON_STYLE.GREEN_OUTLINE}
                          className="float-end"
                          disabled={!values.cronograma_mensal}
                          dataTestId="botao-salvar-rascunho"
                        />
                      </div>
                    </>
                  )}
                </form>
              );
            }}
          />
        </div>
      </div>
    </Spin>
  );
};

export default CadastrarCronogramaSemanal;
