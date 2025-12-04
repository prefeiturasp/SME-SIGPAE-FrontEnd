import HTTP_STATUS from "http-status-codes";
import moment from "moment";
import { useEffect, useState } from "react";
import { Field, Form } from "react-final-form";
import Botao from "src/components/Shareable/Botao";
import {
  BUTTON_STYLE,
  BUTTON_TYPE,
} from "src/components/Shareable/Botao/constants";
import CKEditorField from "src/components/Shareable/CKEditorField";
import { InputComData } from "src/components/Shareable/DatePicker";
import InputText from "src/components/Shareable/Input/InputText";
import SSelect from "src/components/Shareable/Select";
import { toastError } from "src/components/Shareable/Toast/dialogs";
import { getStatusSolicitacoesVigentes } from "src/helpers/dietaEspecial";
import {
  length,
  required,
  textAreaRequired,
} from "src/helpers/fieldValidators";
import {
  composeValidators,
  dateDelta,
  gerarParametrosConsulta,
  getError,
} from "src/helpers/utilities";
import {
  getMotivosAlteracaoUE,
  getSolicitacoesDietaEspecial,
} from "src/services/dietaEspecial.service";
import { getEscolasSimplissima } from "src/services/escola.service";
import { obtemDadosAlunoPeloEOL } from "src/services/perfil.service";

import SolicitacaoVigente from "src/components/screens/DietaEspecial/Escola/componentes/SolicitacaoVigente";
import { formatarSolicitacoesVigentes } from "src/components/screens/DietaEspecial/Escola/helper";

import "./styles.scss";

import { toastSuccess } from "src/components/Shareable/Toast/dialogs";
import { createSolicitacaoAlteracaoUE } from "src/services/dietaEspecial.service";

export default ({
  solicitacoesVigentes,
  setSolicitacoesVigentes,
  meusDadosEscola,
}) => {
  const [carregandoAluno, setCarregandoAluno] = useState(null);
  const [carregandoEscola, setCarregandoEscola] = useState(null);
  const [dadosIniciais, setDadosIniciais] = useState(null);
  const [motivosAlteracaoUE, setMotivosAlteracaoUE] = useState(null);

  useEffect(() => {
    getMotivosAlteracaoUE().then((response) => {
      setMotivosAlteracaoUE(response.data.results);
    });
  }, []);

  const onSubmit = (values, form) => {
    const payload = { ...values };
    if (values.data_inicio)
      payload.data_inicio = moment(values.data_inicio).format("DD/MM/YYYY");
    else delete payload.data_inicio;
    if (values.data_termino)
      payload.data_termino = moment(values.data_termino).format("DD/MM/YYYY");
    else delete payload.data_termino;
    payload.dieta_alterada = solicitacoesVigentes[0].uuid;
    payload.escola_destino = values.codigo_eol_escola;

    return createSolicitacaoAlteracaoUE(payload)
      .then((response) => {
        if (response.status === HTTP_STATUS.CREATED) {
          toastSuccess("Solicitação de alteração criada com sucesso");
          setDadosIniciais(null);
          setSolicitacoesVigentes(null);
          setTimeout(() => form.restart());
        }
      })
      .catch((error) => {
        if (error.response.status === HTTP_STATUS.BAD_REQUEST) {
          toastError(getError(error.response.data));
        }
      });
  };

  const getEscolaPorEol = async (codigoEol, values) => {
    if (isNaN(parseInt(codigoEol)) || codigoEol.length !== 6) {
      setDadosIniciais({ ...values, nome_escola: undefined });
      return;
    }

    setCarregandoEscola(true);

    const params = { codigo_eol: codigoEol };
    const response = await getEscolasSimplissima(params);

    if (!response) {
      toastError("Escola não encontrada no EOL.");
      setDadosIniciais({ ...values, nome_escola: undefined });
      return;
    }

    if (response.data.results.length) {
      const tipoGestao = response.data.results[0].tipo_gestao;
      const tipoGestaoEhPermitida = [
        "TERC TOTAL",
        "DIRETA",
        "PARCEIRA",
      ].includes(tipoGestao);
      if (tipoGestaoEhPermitida) {
        setDadosIniciais({
          ...values,
          nome_escola: response.data.results[0].nome,
        });
      } else {
        toastError(
          "Escola não possui gestão Terceirizada Total, Direta ou Parceira.",
        );
      }
    } else {
      toastError("Escola não encontrada no EOL.");
      setDadosIniciais({ ...values, nome_escola: undefined });
    }

    setCarregandoEscola(false);
  };

  const getAlunoPorEol = async (codigoEol, values) => {
    if (isNaN(parseInt(codigoEol)) || codigoEol.length !== 7) {
      setDadosIniciais({ ...values, nome_aluno: undefined });
      setSolicitacoesVigentes(null);
      return;
    }
    setCarregandoAluno(true);

    const eolResponse = await obtemDadosAlunoPeloEOL(codigoEol);

    if (!eolResponse || eolResponse.status === 400) {
      toastError("Aluno não encontrado no EOL.");
      setSolicitacoesVigentes(null);
    } else {
      const params = gerarParametrosConsulta({
        codigo_eol_aluno: codigoEol,
        ativo: true,
        status: getStatusSolicitacoesVigentes(),
        escola: meusDadosEscola.uuid,
        tipo_solicitacao: "COMUM",
      });

      const response = await getSolicitacoesDietaEspecial(params);

      if (response.status === HTTP_STATUS.OK) {
        if (response.data.count) {
          setSolicitacoesVigentes(
            formatarSolicitacoesVigentes([response.data.results[0]]),
          );
          setDadosIniciais({
            ...values,
            nome_aluno: response.data.results[0].aluno.nome,
            data_nascimento: response.data.results[0].aluno.data_nascimento,
          });
        } else {
          toastError("Aluno informado não tem dieta ativa.");
          setDadosIniciais({ ...values, nome_aluno: undefined });
          setSolicitacoesVigentes(null);
        }
      } else {
        if (response.status === HTTP_STATUS.BAD_REQUEST) {
          setSolicitacoesVigentes(null);
          setDadosIniciais({ ...values, nome_aluno: undefined });
          toastError(
            `Houve um erro ao realizar a solicitação: ${getError(
              response.data,
            )}`,
          );
        } else {
          setDadosIniciais({ ...values, nome_aluno: undefined });
          setSolicitacoesVigentes(null);
          toastError(`Houve um erro ao realizar a solicitação!`);
        }
      }
    }
    setCarregandoAluno(false);
  };

  const ehMotivoOutro = (values) => {
    return (
      values?.motivo_alteracao &&
      motivosAlteracaoUE
        .find((m) => m.uuid === values.motivo_alteracao)
        ?.nome.includes("Outro")
    );
  };

  return (
    <Form
      onSubmit={onSubmit}
      subscription={{ submitting: true, values: true }}
      initialValues={dadosIniciais}
      render={({ handleSubmit, form, pristine, submitting, values }) => {
        return (
          <form
            onSubmit={handleSubmit}
            className="form-cadastro-dieta-alteracao-ue"
          >
            <span className="card-title fw-bold cinza-escuro">
              Descrição da Solicitação
            </span>
            <div className="row">
              <div className="col-3">
                <Field
                  dataTestId="codigo-eol-aluno"
                  label="Cód. EOL do Aluno"
                  component={InputText}
                  name="codigo_eol_aluno"
                  placeholder="Insira o Código"
                  className="form-control"
                  type="number"
                  required
                  disabled={carregandoAluno}
                  validate={composeValidators(required, length(7))}
                  inputOnChange={(e) => {
                    const value = e.target.value;
                    const values_ = form.getState().values;
                    getAlunoPorEol(value, values_);
                  }}
                />
              </div>
              <div className="col-6">
                <Field
                  component={InputText}
                  label="Nome do Aluno"
                  name="nome_aluno"
                  className="input-busca-aluno"
                  disabled={true}
                  validate={required}
                />
              </div>
              <div className="col-3">
                <Field
                  component={InputComData}
                  name="data_nascimento"
                  label="Data de Nascimento"
                  className="form-control"
                  minDate={dateDelta(-360 * 99)}
                  maxDate={dateDelta(-1)}
                  showMonthDropdown
                  showYearDropdown
                  disabled={true}
                  validate={required}
                />
              </div>
            </div>

            {solicitacoesVigentes && (
              <SolicitacaoVigente
                titulo="Dieta Ativa"
                solicitacoesVigentes={solicitacoesVigentes}
              />
            )}
            <div className="row">
              <div className="col-md-5">
                <Field
                  dataTestId="motivo-alteracao"
                  label="Motivo da alteração"
                  component={SSelect}
                  className="form-control"
                  name="motivo_alteracao"
                  options={
                    motivosAlteracaoUE
                      ? [{ nome: "Selecione...", uuid: "" }].concat(
                          motivosAlteracaoUE,
                        )
                      : []
                  }
                  validate={required}
                  required={true}
                />
              </div>
              <div className="col">
                <div className="row">
                  <div className="col label-periodo">
                    * Alteração válida pelo período:
                  </div>
                </div>
                <div className="row">
                  <div className="col">
                    <Field
                      dataTestId="data-inicio"
                      component={InputComData}
                      name="data_inicio"
                      className="form-control"
                      placeholder="De"
                      minDate={moment().add(1, "days")._d}
                      maxDate={
                        values && values.data_termino
                          ? moment(values.data_termino, "DD/MM/YYYY")._d
                          : null
                      }
                      writable
                      validate={required}
                      visitedError={true}
                    />
                  </div>
                  <div className="col">
                    <Field
                      dataTestId="data-termino"
                      component={InputComData}
                      name="data_termino"
                      className="form-control"
                      placeholder="Até"
                      minDate={
                        values && values.data_inicio
                          ? moment(values.data_inicio, "DD/MM/YYYY")._d
                          : moment().add(1, "days")._d
                      }
                      maxDate={null}
                      writable
                      validate={required}
                    />
                  </div>
                </div>
              </div>
            </div>
            <div className="row mt-2">
              <div className="col">
                <span className="card-title fw-bold cinza-escuro ">
                  Escola onde será realizado o programa
                </span>
              </div>
            </div>

            <div className="row">
              <div className="col-3">
                <Field
                  dataTestId="codigo-eol-escola"
                  label="Cód. EOL da Escola"
                  component={InputText}
                  name="codigo_eol_escola"
                  placeholder="Insira o Código"
                  className="form-control"
                  type="number"
                  required
                  disabled={carregandoEscola}
                  validate={composeValidators(required, length(6))}
                  inputOnChange={(e) => {
                    const value = e.target.value;
                    const values_ = form.getState().values;
                    getEscolaPorEol(value, values_);
                  }}
                />
              </div>
              <div className="col-9">
                <Field
                  component={InputText}
                  label="Nome da Escola"
                  name="nome_escola"
                  className="input-busca-aluno"
                  disabled={true}
                  validate={required}
                />
              </div>
            </div>
            <div className="row pb-3 mb-3">
              <div className="col-12">
                <Field
                  component={CKEditorField}
                  label="Observações"
                  name="observacoes_alteracao"
                  className="form-control"
                  required={!process.env.IS_TEST && ehMotivoOutro(values)}
                  validate={
                    !process.env.IS_TEST &&
                    ehMotivoOutro(values) &&
                    composeValidators(textAreaRequired)
                  }
                />
              </div>
            </div>

            <div className="mt-5">
              <Botao
                dataTestId="botao-enviar"
                texto="Enviar"
                className="float-end ms-3"
                type={BUTTON_TYPE.SUBMIT}
                disabled={submitting}
                style={BUTTON_STYLE.GREEN}
              />
              <Botao
                dataTestId="botao-limpar"
                texto="Limpar Campos"
                className="float-end ms-3"
                onClick={() => {
                  setDadosIniciais(null);
                  setSolicitacoesVigentes(null);
                  form.restart();
                }}
                disabled={pristine || submitting}
                style={BUTTON_STYLE.GREEN_OUTLINE}
              />
            </div>
          </form>
        );
      }}
    />
  );
};
