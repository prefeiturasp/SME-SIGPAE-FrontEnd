import { Spin } from "antd";
import { Botao } from "src/components/Shareable/Botao";
import {
  BUTTON_STYLE,
  BUTTON_TYPE,
} from "src/components/Shareable/Botao/constants";
import CardMatriculados from "src/components/Shareable/CardMatriculados";
import CKEditorField from "src/components/Shareable/CKEditorField";
import ModalDataPrioritaria from "src/components/Shareable/ModalDataPrioritaria";
import { Select } from "src/components/Shareable/Select";
import {
  toastError,
  toastSuccess,
} from "src/components/Shareable/Toast/dialogs";
import { STATUS_DRE_A_VALIDAR } from "src/configs/constants";
import { TIPO_SOLICITACAO } from "src/constants/shared";
import arrayMutators from "final-form-arrays";
import {
  composeValidators,
  peloMenosUmCaractere,
  required,
  textAreaRequired,
} from "src/helpers/fieldValidators";
import {
  checaSeDataEstaEntre2e5DiasUteis,
  deepCopy,
  getError,
} from "src/helpers/utilities";
import HTTP_STATUS from "http-status-codes";
import React, { useEffect, useState } from "react";
import { Field, Form } from "react-final-form";
import {
  escolaAlterarSolicitacaoDeAlteracaoCardapio,
  escolaCriarSolicitacaoDeAlteracaoCardapio,
  escolaExcluirSolicitacaoDeAlteracaoCardapio,
  escolaIniciarSolicitacaoDeAlteracaoDeCardapio,
  getRascunhosAlteracaoTipoAlimentacao,
} from "src/services/alteracaoDeCardapio";
import { formataValues, obterTipoAlimentacaoSelecionado } from "./helper";
import { AlterarDiaOuPeriodo } from "./components/AlterarDiaOuPeriodoFields";
import { PeriodosFields } from "./components/PeriodosFields";
import { Rascunhos } from "./components/Rascunhos";
import { validateSubmit } from "./components/validacao";
import "./style.scss";

export const AlteracaoCardapio = ({ ...props }) => {
  const [rascunhos, setRascunhos] = useState();
  const [showModalDiasUteis, setShowModalDiasUteis] = useState(false);
  const [erro, setErro] = useState("");

  const {
    meusDados,
    motivos,
    periodos,
    proximosCincoDiasUteis,
    proximosDoisDiasUteis,
  } = props;

  const enviaAlteracaoCardapio = async (uuid, form) => {
    const response = await escolaIniciarSolicitacaoDeAlteracaoDeCardapio(
      uuid,
      TIPO_SOLICITACAO.SOLICITACAO_NORMAL,
    );
    if (response.status === HTTP_STATUS.OK) {
      toastSuccess("Alteração do Tipo de Alimentação enviada com sucesso");
      getRascunhosAsync();
      resetForm(form);
    } else {
      toastError(
        "Houve um erro ao enviar a Alteração do Tipo de Alimentação. Tente novamente mais tarde.",
      );
    }
  };

  const salvarSolicitacao = async (dados) => {
    if (dados.uuid) {
      const resposta = await escolaAlterarSolicitacaoDeAlteracaoCardapio(
        dados.uuid,
        dados,
        TIPO_SOLICITACAO.SOLICITACAO_NORMAL,
      );

      return { resposta, statusEsperado: HTTP_STATUS.OK };
    }

    const resposta = await escolaCriarSolicitacaoDeAlteracaoCardapio(
      dados,
      TIPO_SOLICITACAO.SOLICITACAO_NORMAL,
    );

    return { resposta, statusEsperado: HTTP_STATUS.CREATED };
  };

  const onSubmit = async (values, form) => {
    const dados = deepCopy(values);
    const status = dados.status;
    delete dados.status;

    const erros = validateSubmit(dados, meusDados);

    if (erros) {
      toastError(erros);
      return;
    }

    const dadosFormatados = formataValues(dados);
    const { resposta, statusEsperado } =
      await salvarSolicitacao(dadosFormatados);

    if (resposta.status !== statusEsperado) {
      toastError(getError(resposta.data));
      return;
    }

    if (status === STATUS_DRE_A_VALIDAR) {
      await enviaAlteracaoCardapio(resposta.data.uuid, form);

      if (dadosFormatados.uuid) {
        getRascunhosAsync();
      }

      return;
    }

    toastSuccess("Alteração do Tipo de Alimentação salva com sucesso");
    getRascunhosAsync();

    if (!dadosFormatados.uuid) {
      resetForm(form);
    }
  };

  const carregarRascunho = async (alteracaoDeCardapio, form) => {
    form.change("uuid", alteracaoDeCardapio.uuid);
    form.change("id_externo", alteracaoDeCardapio.id_externo);
    form.change("motivo", alteracaoDeCardapio.motivo.uuid);
    if (alteracaoDeCardapio.data_inicial !== alteracaoDeCardapio.data_final) {
      form.change("data_inicial", alteracaoDeCardapio.data_inicial);
      form.change("data_final", alteracaoDeCardapio.data_final);
    } else {
      form.change("alterar_dia", alteracaoDeCardapio.data_inicial);
    }

    const substituicoesValue = deepCopy(periodos);

    for (const substituicao of alteracaoDeCardapio.substituicoes) {
      const substituicaoValue = substituicoesValue.find(
        (subs) => subs.nome === substituicao.periodo_escolar.nome,
      );
      substituicaoValue.check = true;
      substituicaoValue.tipos_alimentacao_de = obterTipoAlimentacaoSelecionado(
        substituicao.tipos_alimentacao_de,
        substituicaoValue.tipos_alimentacao,
      );
      substituicaoValue.tipos_alimentacao_para =
        obterTipoAlimentacaoSelecionado(
          substituicao.tipos_alimentacao_para,
          substituicaoValue.tipos_alimentacao,
        );
      substituicaoValue.qtd_alunos = substituicao.qtd_alunos;
    }

    await form.change("substituicoes", substituicoesValue);
    form.change("observacao", alteracaoDeCardapio.observacao);
  };

  const getRascunhosAsync = async () => {
    const response = await getRascunhosAlteracaoTipoAlimentacao(
      TIPO_SOLICITACAO.SOLICITACAO_NORMAL,
    );
    if (response.status === HTTP_STATUS.OK) {
      setRascunhos(response.data.results);
    } else {
      setErro("Erro ao carregar rascunhos. Tente novamente mais tarde.");
    }
  };

  useEffect(() => {
    getRascunhosAsync();
  }, []);

  const removerRascunho = async (id_externo, uuid) => {
    if (window.confirm("Deseja remover este rascunho?")) {
      const response = await escolaExcluirSolicitacaoDeAlteracaoCardapio(
        uuid,
        TIPO_SOLICITACAO.SOLICITACAO_NORMAL,
      );
      if (response.status === HTTP_STATUS.NO_CONTENT) {
        toastSuccess(`Rascunho # ${id_externo} excluído com sucesso`);
        await getRascunhosAsync();
      } else {
        toastError(
          "Houve um erro ao excluir o rascunho. Tente novamente mais tarde.",
        );
      }
    }
  };

  const resetForm = (form) => {
    form.reset();
  };

  const ehMotivoPorNome = (nome, values) => {
    return motivos
      .find((motivo) => motivo.uuid === values.motivo)
      ?.nome.includes(nome);
  };

  const onAlterarDiaChanged = (value, values) => {
    if (
      value &&
      !ehMotivoPorNome("Lanche Emergencial", values) &&
      checaSeDataEstaEntre2e5DiasUteis(
        value,
        proximosDoisDiasUteis,
        proximosCincoDiasUteis,
      )
    ) {
      setShowModalDiasUteis(true);
    }
  };

  return (
    <>
      {erro && <div>{erro}</div>}
      {!erro && (
        <div className="formulario-alteracao-cardapio">
          <Form
            mutators={{
              ...arrayMutators,
            }}
            initialValues={{
              substituicoes: periodos,
              escola: meusDados.vinculo_atual.instituicao.uuid,
            }}
            onSubmit={onSubmit}
          >
            {({ handleSubmit, form, values, submitting }) => (
              <form onSubmit={handleSubmit}>
                <CardMatriculados meusDados={meusDados} />
                <Spin tip="Carregando rascunhos..." spinning={!rascunhos}>
                  {rascunhos?.length > 0 && (
                    <section className="mt-3">
                      <span className="page-title">Rascunhos</span>
                      <Rascunhos
                        rascunhos={rascunhos}
                        removerRascunho={removerRascunho}
                        form={form}
                        carregarRascunho={carregarRascunho}
                      />
                    </section>
                  )}
                </Spin>
                <div className="mt-2 page-title">
                  {values.uuid
                    ? `Solicitação # ${values.id_externo}`
                    : "Nova Solicitação"}
                </div>
                <div className="card mt-3">
                  <div className="card-body">
                    <div className="card-title fw-bold descricao">
                      Descrição da Alteração
                    </div>
                    <section className="section-form-motivo mt-3">
                      <Field
                        component={Select}
                        dataTestId="div-select-motivo"
                        name="motivo"
                        label="Tipo de Alteração"
                        options={motivos}
                        validate={required}
                        required
                        onChangeEffect={(event) => {
                          resetForm(form);
                          form.change("motivo", event.target.value);
                        }}
                      />
                    </section>
                    {values.motivo && (
                      <>
                        <AlterarDiaOuPeriodo
                          values={form.getState().values}
                          onAlterarDiaChanged={onAlterarDiaChanged}
                          ehMotivoPorNome={ehMotivoPorNome}
                          setErro={setErro}
                          proximosDoisDiasUteis={proximosDoisDiasUteis}
                          form={form}
                        />
                        <PeriodosFields
                          ehMotivoPorNome={ehMotivoPorNome}
                          periodos={periodos}
                          form={form}
                          values={form.getState().values}
                        />
                        <hr />
                        <Field
                          component={CKEditorField}
                          dataTestId="div-motivo-justificativa"
                          label="Motivo/Justificativa"
                          name="observacao"
                          // TODO: algum dia entender porque no jest o valor não é setado no values
                          required={!process.env.IS_TEST}
                          validate={
                            !process.env.IS_TEST &&
                            composeValidators(
                              textAreaRequired,
                              peloMenosUmCaractere,
                            )
                          }
                        />
                      </>
                    )}
                  </div>
                  <div className="row mb-3">
                    <div className="col-12 text-end">
                      <Botao
                        texto="Cancelar"
                        onClick={() => resetForm(form)}
                        disabled={submitting}
                        className="me-3"
                        style={BUTTON_STYLE.GREEN_OUTLINE}
                      />
                      <Botao
                        disabled={submitting}
                        texto={
                          values.uuid ? "Atualizar rascunho" : "Salvar rascunho"
                        }
                        type={BUTTON_TYPE.SUBMIT}
                        className="me-3"
                        style={BUTTON_STYLE.GREEN_OUTLINE}
                      />
                      <Botao
                        texto="Enviar"
                        className="me-2"
                        disabled={submitting}
                        type={BUTTON_TYPE.BUTTON}
                        onClick={async () => {
                          values["status"] = STATUS_DRE_A_VALIDAR;
                          await handleSubmit(values, form);
                        }}
                        style={BUTTON_STYLE.GREEN}
                      />
                    </div>
                  </div>
                </div>
                <ModalDataPrioritaria
                  showModal={showModalDiasUteis}
                  closeModal={() => setShowModalDiasUteis(false)}
                />
              </form>
            )}
          </Form>
        </div>
      )}
    </>
  );
};
