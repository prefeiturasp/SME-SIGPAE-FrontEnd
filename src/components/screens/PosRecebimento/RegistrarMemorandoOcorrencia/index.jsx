import React, { useMemo, useState } from "react";
import { Spin, Tooltip } from "antd";
import arrayMutators from "final-form-arrays";
import { Field, Form } from "react-final-form";
import { FieldArray } from "react-final-form-arrays";
import { useNavigate } from "react-router-dom";

import Botao from "src/components/Shareable/Botao";
import {
  BUTTON_STYLE,
  BUTTON_TYPE,
} from "src/components/Shareable/Botao/constants";
import { InputComData } from "src/components/Shareable/DatePicker";
import InputText from "src/components/Shareable/Input/InputText";
import ModalGenerico from "src/components/Shareable/ModalGenerico";
import Select from "src/components/Shareable/Select";
import { toastSuccess } from "src/components/Shareable/Toast/dialogs";
import { MEMORANDO_OCORRENCIAS, POS_RECEBIMENTO } from "src/configs/constants";
import { required } from "src/helpers/fieldValidators";
import { exibeError } from "src/helpers/utilities";
import { cadastraMemorandoOcorrencia } from "src/services/posRecebimento.service";

import {
  criarLote,
  loteEstaCompleto,
  montarPayload,
  OPCOES_CATEGORIA,
  OPCOES_TIPO_OCORRENCIA,
  quantidadeValida,
} from "./helpers";

import "./styles.scss";

const TOOLTIP_ADICIONAR_LOTE =
  "Preencha os dados do lote atual para adicionar um novo lote.";

const RegistrarMemorandoOcorrencia = () => {
  const navigate = useNavigate();
  const valoresIniciais = useMemo(() => ({ lotes: [criarLote()] }), []);
  const [carregando, setCarregando] = useState(false);
  const [loteParaExcluir, setLoteParaExcluir] = useState(null);

  const voltarParaListagem = () =>
    navigate(`/${POS_RECEBIMENTO}/${MEMORANDO_OCORRENCIAS}`);

  const enviar = async (values) => {
    try {
      setCarregando(true);
      const response = await cadastraMemorandoOcorrencia(montarPayload(values));

      if (response.status === 201) {
        toastSuccess("Ocorrência registrada com sucesso!");
        voltarParaListagem();
      } else {
        exibeError(response, "Ocorreu um erro ao registrar a ocorrência");
      }
    } catch {
      // O serviço já exibe o toast de erro.
    } finally {
      setCarregando(false);
    }
  };

  const confirmarExclusao = (form) => {
    form.mutators.remove("lotes", loteParaExcluir);
    setLoteParaExcluir(null);
  };

  return (
    <Spin tip="Carregando..." spinning={carregando}>
      <div className="card mt-3 card-registrar-memorando-ocorrencia">
        <div className="card-body">
          <Form
            onSubmit={enviar}
            initialValues={valoresIniciais}
            mutators={{ ...arrayMutators }}
            render={({ handleSubmit, values, errors, form }) => (
              <form onSubmit={handleSubmit}>
                <ModalGenerico
                  show={loteParaExcluir !== null}
                  titulo="Excluir Lote"
                  texto="Deseja realmente excluir o Lote?"
                  handleClose={() => setLoteParaExcluir(null)}
                  handleSim={() => confirmarExclusao(form)}
                />

                <div className="row">
                  <div className="col-4">
                    <Field
                      component={Select}
                      name="categoria"
                      label="Categoria"
                      options={OPCOES_CATEGORIA}
                      required
                      validate={required}
                      dataTestId="categoria"
                    />
                  </div>
                  <div className="col-4">
                    <Field
                      component={InputText}
                      name="produto"
                      label="Produto"
                      placeholder="Digite aqui o Nome do Produto"
                      required
                      validate={required}
                      dataTestId="produto"
                    />
                  </div>
                  <div className="col-4">
                    <Field
                      component={Select}
                      name="tipo_ocorrencia"
                      label="Tipo de Ocorrência"
                      options={OPCOES_TIPO_OCORRENCIA}
                      required
                      validate={required}
                      dataTestId="tipo-ocorrencia"
                    />
                  </div>
                </div>

                <FieldArray name="lotes">
                  {({ fields }) => {
                    const loteAtualCompleto = loteEstaCompleto(
                      values.lotes?.[values.lotes.length - 1],
                    );

                    const botaoAdicionarLote = (
                      <Botao
                        texto="+ Adicionar Lote"
                        type={BUTTON_TYPE.BUTTON}
                        style={BUTTON_STYLE.GREEN_OUTLINE}
                        dataTestId="adicionar-lote"
                        disabled={!loteAtualCompleto}
                        onClick={() => fields.push(criarLote())}
                      />
                    );

                    return (
                      <>
                        {fields.map((name, index) => (
                          <div key={name} className="lote-memorando">
                            {index > 0 && (
                              <div className="d-flex justify-content-end">
                                <Botao
                                  texto=""
                                  type={BUTTON_TYPE.BUTTON}
                                  style={BUTTON_STYLE.GREEN_OUTLINE}
                                  icon="fas fa-trash"
                                  tooltipExterno="Remover Lote"
                                  dataTestId={`remover-lote-${index}`}
                                  onClick={() => setLoteParaExcluir(index)}
                                />
                              </div>
                            )}

                            <div className="row mt-3">
                              <div className="col-4">
                                <Field
                                  component={InputText}
                                  name={`${name}.lote`}
                                  label="Lote"
                                  placeholder="Digite aqui o Lote do Produto"
                                  required
                                  validate={required}
                                  dataTestId={`lote-${index}`}
                                />
                              </div>
                              <div className="col-4">
                                <Field
                                  component={InputText}
                                  name={`${name}.marca`}
                                  label="Marca"
                                  placeholder="Digite aqui a Marca do Produto"
                                  required
                                  validate={required}
                                  dataTestId={`marca-${index}`}
                                />
                              </div>
                              <div className="col-4">
                                <Field
                                  component={InputComData}
                                  name={`${name}.data_fabricacao`}
                                  label="Data de Fabricação"
                                  placeholder="Selecione a data"
                                  required
                                  validate={required}
                                  minDate={null}
                                  maxDate={null}
                                  dataTestId={`data-fabricacao-${index}`}
                                />
                              </div>
                            </div>

                            <div className="row mt-3">
                              <div className="col-4">
                                <Field
                                  component={InputComData}
                                  name={`${name}.data_validade`}
                                  label="Data de Validade"
                                  placeholder="Selecione a data"
                                  required
                                  validate={required}
                                  minDate={null}
                                  maxDate={null}
                                  dataTestId={`data-validade-${index}`}
                                />
                              </div>
                              <div className="col-4">
                                <Field
                                  component={InputText}
                                  name={`${name}.quantidade_problema_devolucao`}
                                  label="Quantidade com Problema / Devolução"
                                  placeholder="0"
                                  required
                                  validate={quantidadeValida}
                                  agrupadorMilharComDecimal
                                  dataTestId={`quantidade-${index}`}
                                />
                              </div>
                            </div>
                          </div>
                        ))}

                        <div className="text-center mt-3">
                          {loteAtualCompleto ? (
                            botaoAdicionarLote
                          ) : (
                            <Tooltip title={TOOLTIP_ADICIONAR_LOTE}>
                              <span className="d-inline-block">
                                {botaoAdicionarLote}
                              </span>
                            </Tooltip>
                          )}
                        </div>
                      </>
                    );
                  }}
                </FieldArray>

                <hr />

                <div className="mt-4 mb-4">
                  <Botao
                    texto="Registrar Ocorrência"
                    type={BUTTON_TYPE.SUBMIT}
                    style={BUTTON_STYLE.GREEN}
                    className="float-end ms-3"
                    dataTestId="salvar-ocorrencia"
                    disabled={Object.keys(errors).length > 0}
                  />
                  <Botao
                    texto="Cancelar"
                    type={BUTTON_TYPE.BUTTON}
                    style={BUTTON_STYLE.GREEN_OUTLINE}
                    className="float-end ms-3"
                    dataTestId="cancelar"
                    onClick={voltarParaListagem}
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

export default RegistrarMemorandoOcorrencia;
