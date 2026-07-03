import React, { useEffect, useRef, useState } from "react";
import { Spin } from "antd";
import { Field, Form } from "react-final-form";
import arrayMutators from "final-form-arrays";
import { useNavigate } from "react-router-dom";
import InputText from "src/components/Shareable/Input/InputText";
import AutoCompleteSelectField from "src/components/Shareable/AutoCompleteSelectField";
import { getListaFiltradaAutoCompleteSelect } from "src/helpers/autoCompleteSelect";
import Botao from "src/components/Shareable/Botao";
import {
  BUTTON_STYLE,
  BUTTON_TYPE,
} from "src/components/Shareable/Botao/constants";
import {
  toastError,
  toastSuccess,
} from "src/components/Shareable/Toast/dialogs";
import { composeValidators, required } from "src/helpers/fieldValidators";
import { formataMilharDecimal } from "src/helpers/utilities";
import { validarQuantidadeDescontada } from "../../helpers";
import { CronogramaMensalSimples } from "src/interfaces/cronograma_semanal.interface";
import {
  atualizaAjusteSaldo,
  cadastraAjusteSaldo,
  getAjusteSaldo,
  getCronogramasMensalComDocs,
  getDocumentosDoCronograma,
} from "src/services/ajusteSaldo.service";
import { AJUSTE_SALDO_LAUDO, RECEBIMENTO } from "src/configs/constants";
import HTTP_STATUS from "http-status-codes";

import "./styles.scss";
import { AjusteSaldoLaudoDetalhar } from "../../interfaces";

interface FormValues {
  cronograma?: string;
  produto?: string;
  fornecedor?: string;
  numero_laudo?: string;
  quantidade_laudo?: string;
  saldo_laudo?: string;
  quantidade_descontada?: string;
  saldo_atual?: string;
}

const CadastrarAjusteSaldo: React.FC<{
  editar?: boolean;
}> = ({ editar = false }) => {
  const navigate = useNavigate();
  const [carregando, setCarregando] = useState(false);
  const [cronogramas, setCronogramas] = useState<CronogramaMensalSimples[]>([]);
  const [cronogramaSelecionado, setCronogramaSelecionado] =
    useState<CronogramaMensalSimples | null>(null);
  const [documentos, setDocumentos] = useState<any[]>([]);
  const [documentoSelecionado, setDocumentoSelecionado] = useState<any | null>(
    null,
  );
  const [quantidadeDescontada, setQuantidadeDescontada] = useState<string>("");
  const [dadosAjuste, setDadosAjuste] = useState<any>(null);
  const formRef = useRef<any>(null);

  const preencheDadosCronograma = async () => {
    const form = formRef.current;
    if (!form || !cronogramaSelecionado) {
      setDocumentoSelecionado(null);
      return;
    }

    setDocumentos([]);
    setDocumentoSelecionado(null);

    setCarregando(true);
    try {
      form.change("produto", cronogramaSelecionado.produto_nome || "");
      form.change("fornecedor", cronogramaSelecionado.fornecedor_nome || "");

      const documentosResponse = await getDocumentosDoCronograma(
        cronogramaSelecionado.uuid,
      );
      setDocumentos(documentosResponse.data);
    } catch {
      toastError("Erro ao carregar dados do cronograma mensal");
    } finally {
      setCarregando(false);
    }
  };

  const preencheDadosDocumento = async () => {
    const form = formRef.current;
    if (!form || !documentoSelecionado) {
      form.change("numero_laudo", "");
      form.change("quantidade_laudo", "");
      form.change("saldo_laudo", "");
      return;
    }

    setCarregando(true);
    try {
      const qtd_str =
        formataMilharDecimal(documentoSelecionado.quantidade_laudo) +
        " " +
        documentoSelecionado.unidade_medida;
      const saldo_str =
        formataMilharDecimal(documentoSelecionado.saldo_atual) +
        " " +
        documentoSelecionado.unidade_medida;

      form.change("quantidade_laudo", qtd_str || "");
      form.change("saldo_laudo", saldo_str || "");
    } catch {
      toastError("Erro ao carregar dados do laudo.");
    } finally {
      setCarregando(false);
    }
  };

  const saldoDisponivelParaDesconto = () => {
    const saldoAtual =
      parseFloat(documentoSelecionado?.saldo_atual?.toFixed(2)) || 0;

    if (editar && dadosAjuste) {
      const quantidadeOriginal =
        parseFloat(dadosAjuste.quantidade_descontada) || 0;
      return parseFloat((saldoAtual + quantidadeOriginal).toFixed(2));
    }

    return saldoAtual;
  };

  const preencheDadosQuantidadeDescontada = async () => {
    const form = formRef.current;

    if (!form || !quantidadeDescontada) {
      form.change("saldo_atual", "");
      return;
    }

    setCarregando(true);
    try {
      const valorLimpo = quantidadeDescontada
        .toString()
        .replace(/\./g, "")
        .replace(",", ".");
      const valorDesconto = parseFloat(parseFloat(valorLimpo).toFixed(2)) || 0;

      const saldoAtual = saldoDisponivelParaDesconto();
      const saldoFinal = parseFloat((saldoAtual - valorDesconto).toFixed(2));
      const saldo_final_str =
        formataMilharDecimal(saldoFinal) +
        " " +
        documentoSelecionado.unidade_medida;

      if (saldoFinal < 0) {
        form.change(
          "saldo_atual",
          formataMilharDecimal(documentoSelecionado?.saldo_atual),
        );
        return;
      }

      form.change("saldo_atual", saldo_final_str);
    } catch {
      toastError("Erro ao calcular diferença");
    } finally {
      setCarregando(false);
    }
  };

  const selecionaCronogramaPorNumero = (value: string) => {
    const cron = cronogramas.find((cronograma) => cronograma.numero === value);
    setCronogramaSelecionado(cron || null);
  };

  const selecionaDocumentoPorNumero = (value: string) => {
    const doc = documentos.find(
      (documento) => documento.numero_laudo === value,
    );
    setDocumentoSelecionado(doc || null);
  };

  const preencheFormularioParaEdicao = async () => {
    const urlParams = new URLSearchParams(window.location.search);
    const uuid = urlParams.get("uuid");
    if (!uuid) return;

    const form = formRef.current;
    if (!form) return;

    let dados: AjusteSaldoLaudoDetalhar;
    try {
      const response = await getAjusteSaldo(uuid);
      if (response.status === HTTP_STATUS.OK) {
        dados = response.data;
        setDadosAjuste(dados);
      }
    } catch {
      toastError("Erro ao carregar dados do laudo.");
    }

    form.change("cronograma", dados.numero_cronograma);
    selecionaCronogramaPorNumero(dados.numero_cronograma);
  };

  useEffect(() => {
    if (editar && cronogramas.length > 0) preencheFormularioParaEdicao();
  }, [cronogramas]);

  const formularioValido = (values: FormValues, errors: any): boolean => {
    if (errors && Object.keys(errors).length > 0) {
      return false;
    }

    return true;
  };

  function parseFloatPersonalizado(str) {
    const cleaned = str.replace(/\./g, "").replace(",", ".");
    return parseFloat(cleaned);
  }

  const formataPayload = (values: FormValues) => {
    return {
      documento_recebimento: documentoSelecionado.uuid,
      quantidade_descontada: parseFloatPersonalizado(
        values.quantidade_descontada,
      ),
    };
  };

  const formataPayloadEdicao = (values: FormValues) => {
    return {
      uuid: dadosAjuste.uuid,
      quantidade_descontada: parseFloatPersonalizado(
        values.quantidade_descontada,
      ),
    };
  };

  const optionsCronograma = (values: Record<string, any>) => {
    return getListaFiltradaAutoCompleteSelect(
      cronogramas.map(({ numero }) => numero),
      values.cronograma,
      true,
    );
  };

  const optionsDocumento = (values: Record<string, any>) => {
    return getListaFiltradaAutoCompleteSelect(
      documentos.map(({ numero_laudo }) => numero_laudo),
      values.numero_laudo,
      true,
    );
  };

  const buscaCronogramas = async () => {
    setCarregando(true);
    try {
      const response = await getCronogramasMensalComDocs();
      setCronogramas(response.data);
    } catch {
      toastError("Erro ao carregar cronogramas");
    } finally {
      setCarregando(false);
    }
  };

  useEffect(() => {
    buscaCronogramas();
  }, []);

  useEffect(() => {
    const form = formRef.current;
    if (!editar || !form || documentos.length === 0) return;

    form.change("numero_laudo", dadosAjuste.numero_laudo);
    selecionaDocumentoPorNumero(dadosAjuste.numero_laudo);
  }, [documentos]);

  useEffect(() => {
    preencheDadosCronograma();
  }, [cronogramaSelecionado]);

  useEffect(() => {
    preencheDadosDocumento();

    // Caso seja uma edição
    const form = formRef.current;
    if (!editar || !dadosAjuste || !form) return;

    form.change(
      "quantidade_descontada",
      formataMilharDecimal(dadosAjuste.quantidade_descontada),
    );
    setQuantidadeDescontada(String(dadosAjuste.quantidade_descontada));
  }, [documentoSelecionado]);

  useEffect(() => {
    preencheDadosQuantidadeDescontada();
  }, [quantidadeDescontada]);

  const onSubmit = async (values: FormValues) => {
    if (!formularioValido(values, {})) {
      return;
    }

    setCarregando(true);

    if (editar) {
      const payload = formataPayloadEdicao(values);
      const response = await atualizaAjusteSaldo(payload);

      if (response && response.status === 200) {
        toastSuccess("Ajuste de saldo atualizado com sucesso!");
        navigate(`/${RECEBIMENTO}/${AJUSTE_SALDO_LAUDO}`);
      }
    } else {
      const payload = formataPayload(values);
      const response = await cadastraAjusteSaldo(payload);

      if (response && response.status === 201) {
        toastSuccess("Ajuste de saldo cadastrado com sucesso!");
        navigate(`/${RECEBIMENTO}/${AJUSTE_SALDO_LAUDO}`);
      }
    }

    setCarregando(false);
  };

  return (
    <>
      <Spin tip="Carregando..." spinning={carregando}>
        <div className="card mt-3 card-cadastro-ajuste-laudo">
          <div className="card-body cadastro-ajuste-laudo">
            <Form
              onSubmit={onSubmit}
              mutators={{ ...arrayMutators }}
              render={({ form, handleSubmit, values, errors }) => {
                formRef.current = form;

                return (
                  <form onSubmit={handleSubmit} data-testid="form-ajuste-laudo">
                    {/* Linha 1 */}
                    <div className="row">
                      <div className="col-4">
                        <Field
                          component={AutoCompleteSelectField}
                          dataTestId="cronograma"
                          options={optionsCronograma(values)}
                          label="Nº do Cronograma"
                          name={`cronograma`}
                          placeholder="Digite o Nº do Cronograma"
                          required
                          disabled={editar}
                          validate={required}
                          onSelect={(value) =>
                            selecionaCronogramaPorNumero(value)
                          }
                        />
                      </div>
                      <div className="col-4">
                        <Field
                          component={InputText}
                          label="Produto"
                          name="produto"
                          disabled
                        />
                      </div>
                      <div className="col-4">
                        <Field
                          component={InputText}
                          label="Fornecedor"
                          name="fornecedor"
                          disabled
                        />
                      </div>
                    </div>

                    {/* Linha 2: */}
                    <div className="row">
                      <div className="col-4">
                        <Field
                          component={AutoCompleteSelectField}
                          dataTestId="numero-laudo"
                          options={optionsDocumento(values)}
                          label="Nº do Laudo"
                          name={`numero_laudo`}
                          placeholder="Selecione o Nº do Laudo"
                          required
                          disabled={editar}
                          validate={required}
                          onSelect={(value: string) => {
                            const doc = documentos.find(
                              (doc) => doc.numero_laudo === value,
                            );
                            setDocumentoSelecionado(doc || null);
                          }}
                          validate={required}
                          onSelect={(value: string) => {
                            const doc = documentos.find(
                              (doc) => doc.numero_laudo === value,
                            );
                            setDocumentoSelecionado(doc || null);
                          }}
                        />
                      </div>
                      <div className="col-4">
                        <Field
                          component={InputText}
                          label="Quantidade do Laudo"
                          name="quantidade_laudo"
                          agrupadorMilharComDecimal
                          disabled
                        />
                      </div>
                      <div className="col-4">
                        <Field
                          component={InputText}
                          label="Saldo do Laudo"
                          name="saldo_laudo"
                          agrupadorMilharComDecimal
                          disabled
                        />
                      </div>
                    </div>

                    {/* Linha 3: */}
                    <div className="row">
                      <div className="col-4">
                        <Field
                          component={InputText}
                          label="Quantidade a ser descontada"
                          name={`quantidade_descontada`}
                          placeholder="Digite a Quantidade"
                          required
                          validate={composeValidators(required, (value) =>
                            validarQuantidadeDescontada(
                              value,
                              saldoDisponivelParaDesconto,
                            ),
                          )}
                          agrupadorMilharComDecimal
                          inputOnChange={(e) => {
                            setQuantidadeDescontada(e.target.value);
                          }}
                        />
                      </div>
                      <div className="col-4">
                        <Field
                          component={InputText}
                          label="Saldo Atual"
                          name="saldo_atual"
                          required
                          disabled={true}
                          agrupadorMilharComDecimal
                        />
                      </div>
                    </div>

                    <div className="mt-4 mb-4">
                      <Botao
                        texto={editar ? "Salvar" : "Cadastrar"}
                        type={BUTTON_TYPE.SUBMIT}
                        style={BUTTON_STYLE.GREEN}
                        className="float-end ms-3"
                        disabled={!formularioValido(values, errors)}
                      />
                      <Botao
                        texto="Cancelar"
                        type={BUTTON_TYPE.BUTTON}
                        style={BUTTON_STYLE.GREEN_OUTLINE}
                        className="float-end ms-3"
                        onClick={() => navigate(-1)}
                      />
                    </div>
                  </form>
                );
              }}
            />
          </div>
        </div>
      </Spin>
    </>
  );
};

export default CadastrarAjusteSaldo;
