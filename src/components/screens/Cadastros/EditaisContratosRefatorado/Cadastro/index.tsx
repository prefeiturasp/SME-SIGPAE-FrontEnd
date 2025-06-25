import { Spin, Switch } from "antd";
import { Botao } from "src/components/Shareable/Botao";
import {
  BUTTON_STYLE,
  BUTTON_TYPE,
} from "src/components/Shareable/Botao/constants";
import { InputText } from "src/components/Shareable/Input/InputText";
import { TextArea } from "src/components/Shareable/TextArea/TextArea";
import {
  toastError,
  toastSuccess,
} from "src/components/Shareable/Toast/dialogs";
import {
  CADASTROS,
  CONFIGURACOES,
  EDITAIS_CADASTRADOS,
} from "src/configs/constants";
import { FormApi } from "final-form";
import arrayMutators from "final-form-arrays";
import { required } from "src/helpers/fieldValidators";
import HTTP_STATUS from "http-status-codes";
import { DiretoriaRegionalInterface } from "src/interfaces/escola.interface";
import { LoteRascunhosInterface } from "src/interfaces/rascunhos.interface";
import {
  ResponseDiretoriasRegionaisSimplissimaInterface,
  ResponseGetEditalCotratoInterface,
  ResponseLotesSimplesInterface,
  ResponseTerceirizadaListaNomesInterface,
} from "src/interfaces/responses.interface";
import { TerceirizadaInterface } from "src/interfaces/terceirizada.interface";
import React, { useEffect, useState } from "react";
import { Field, Form } from "react-final-form";
import { NavigateFunction, useLocation, useNavigate } from "react-router-dom";
import { getDiretoriaregionalSimplissima } from "src/services/diretoriaRegional.service";
import {
  criarEditalEContrato,
  getEditalContrato,
  updateEditalContrato,
} from "src/services/edital.service";
import { getLotesSimples } from "src/services/lote.service";
import { getNomesTerceirizadas } from "src/services/produto.service";
import {
  EditalContratoListadoInterface,
  FormCadastroEditaisContratosInterface,
} from "../interfaces";
import { FieldArrayContratos } from "./components/FieldArrayContratos";
import { ModalCadastroEdital } from "./components/ModalCadastroEdital";
import { formataEditalContratoParaForm } from "./helper";
import "./style.scss";

export const EditaisContratosRefatorado = () => {
  const [objEditalContrato, setObjEditalContrato] =
    useState<EditalContratoListadoInterface>(undefined);
  const [lotes, setLotes] = useState<Array<LoteRascunhosInterface>>(undefined);
  const [DREs, setDREs] =
    useState<Array<DiretoriaRegionalInterface>>(undefined);
  const [empresas, setEmpresas] =
    useState<Array<TerceirizadaInterface>>(undefined);

  const [erro, setErro] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(true);
  const [showModal, setShowModal] = useState<boolean>(false);
  const [switchAtivoImr, setSwitchAtivoImrl] = useState<boolean>(false);

  const location = useLocation();
  const navigate: NavigateFunction = useNavigate();

  const getEditalContratoAsync = async (uuid: string): Promise<void> => {
    const response = await getEditalContrato<ResponseGetEditalCotratoInterface>(
      uuid
    );
    if (response.status === HTTP_STATUS.OK) {
      const editalFormatadoParaForm = formataEditalContratoParaForm(
        response.data,
        setSwitchAtivoImrl
      );
      setObjEditalContrato(editalFormatadoParaForm);
    } else {
      setErro("Erro ao carregar edital ");
    }
  };

  const getLotesSimplesAsync = async (): Promise<void> => {
    const response: ResponseLotesSimplesInterface = await getLotesSimples();
    if (response.status === HTTP_STATUS.OK) {
      setLotes(response.data.results);
    } else {
      setErro("Erro ao carregar lotes. Tente novamente mais tarde.");
    }
  };

  const getDiretoriareginalSimplissimaAsync = async (): Promise<void> => {
    const response: ResponseDiretoriasRegionaisSimplissimaInterface =
      await getDiretoriaregionalSimplissima();
    if (response.status === HTTP_STATUS.OK) {
      setDREs(response.data.results);
    } else {
      setErro(
        "Erro ao carregar diretorias regionais. Tente novamente mais tarde."
      );
    }
  };

  const getNomesTerceirizadasAsync = async (): Promise<void> => {
    const response: ResponseTerceirizadaListaNomesInterface =
      await getNomesTerceirizadas({
        tipo_empresa: "Terceirizada",
      });
    if (response.status === HTTP_STATUS.OK) {
      setEmpresas(response.data.results);
    } else {
      setErro("Erro ao carregar empresas. Tente novamente mais tarde.");
    }
  };

  useEffect(() => {
    requisicoesPreRender();
  }, []);

  const requisicoesPreRender = async (): Promise<void> => {
    await Promise.all([
      getLotesSimplesAsync(),
      getDiretoriareginalSimplissimaAsync(),
      getNomesTerceirizadasAsync(),
      location?.state?.uuid && getEditalContratoAsync(location.state.uuid),
    ]).then(() => {
      setLoading(false);
    });
  };

  const onSubmit = async (
    values: FormCadastroEditaisContratosInterface
  ): Promise<void> => {
    if (!showModal && !location?.state?.uuid) {
      setShowModal(true);
      return;
    }
    const values_ = { ...values, eh_imr: switchAtivoImr };
    if (!values.uuid) {
      const response = await criarEditalEContrato(values_);
      if (response.status === HTTP_STATUS.CREATED) {
        toastSuccess("Edital salvo com sucesso");
        navigate("/configuracoes/cadastros/editais-cadastrados");
      } else {
        toastError("Houve um erro ao salvar o edital");
      }
    } else {
      const response = await updateEditalContrato(values_, values_.uuid);
      if (response.status === HTTP_STATUS.OK) {
        toastSuccess("Edição salva com sucesso!");
        navigate("/configuracoes/cadastros/editais-cadastrados");
      } else {
        toastError("Houve um erro ao atualizar o edital");
      }
    }
  };

  const cancelarForm = (form: FormApi<any, Partial<any>>): void => {
    if (location?.state?.uuid) {
      navigate(-1);
    } else {
      form.change("tipo_contratacao", undefined);
      form.change("numero", undefined);
      form.change("processo", undefined);
      form.change("objeto", undefined);
      form.change("contratos", [DEFAULT_CONTRATOS]);
    }
  };

  const REQUISICOES_FINALIZADAS =
    !loading &&
    lotes &&
    DREs &&
    empresas &&
    (location?.state?.uuid ? objEditalContrato : true);

  const DEFAULT_CONTRATOS = {
    vigencias: [
      {
        numero_contrato: undefined,
        data_inicial: undefined,
        data_final: undefined,
      },
    ],
  };

  const onChangeSwitchImr = (checked: boolean) => {
    setSwitchAtivoImrl(checked);
  };

  return (
    <Spin tip="Carregando..." spinning={!REQUISICOES_FINALIZADAS}>
      <div className="form-editais-contratos">
        <div className="card mt-3">
          <div className="card-body">
            {erro && <div className="mt-3">{erro}</div>}
            {!erro && REQUISICOES_FINALIZADAS && (
              <>
                <div className="row mt-3 mb-3">
                  <div className="col-6">
                    <div className="title">
                      Novo Cadastro de Editais e Contratos
                    </div>
                  </div>
                  {!location?.state?.uuid && (
                    <div className="col-6 text-end">
                      <Botao
                        texto="Editais e Contratos Cadastrados"
                        onClick={() =>
                          navigate(
                            `/${CONFIGURACOES}/${CADASTROS}/${EDITAIS_CADASTRADOS}`
                          )
                        }
                        type={BUTTON_TYPE.BUTTON}
                        style={BUTTON_STYLE.GREEN_OUTLINE}
                      />
                    </div>
                  )}
                </div>
                <Form
                  keepDirtyOnReinitialize
                  mutators={{
                    ...arrayMutators,
                  }}
                  initialValues={
                    objEditalContrato || {
                      contratos: [DEFAULT_CONTRATOS],
                    }
                  }
                  onSubmit={onSubmit}
                >
                  {({
                    handleSubmit,
                    form,
                    submitting,
                    form: {
                      mutators: { push },
                    },
                    values,
                  }) => (
                    <form onSubmit={handleSubmit}>
                      <div className="row">
                        <div className="col-3">
                          <Field
                            component={InputText}
                            label="Tipo de contratação"
                            name="tipo_contratacao"
                            placeholder="Digite o tipo de contratação"
                            required
                            validate={required}
                            max={50}
                          />
                        </div>
                        <div className="col-3">
                          <Field
                            component={InputText}
                            className="form-control"
                            label="N° do Edital"
                            name="numero"
                            placeholder="Digite o número do edital"
                            required
                            validate={required}
                            max={50}
                          />
                        </div>
                        <div className="col-2 switch-imr">
                          <label className="col-form-label">
                            Edital com IMR?
                          </label>
                          <br />
                          <div>
                            <label
                              className={`col-form-label ${
                                !switchAtivoImr && "green"
                              }`}
                            >
                              Não
                            </label>
                            <br />
                            <Switch
                              size="small"
                              onChange={onChangeSwitchImr}
                              checked={switchAtivoImr}
                            />
                            <label
                              className={`col-form-label ${
                                switchAtivoImr && "green"
                              }`}
                            >
                              Sim
                            </label>
                            <br />
                          </div>
                        </div>
                        <div className="col-4">
                          <Field
                            component={InputText}
                            label="Nº do processo administrativo"
                            name="processo"
                            placeholder="Digite o número do processo"
                            required
                            validate={required}
                            max={50}
                          />
                        </div>
                      </div>
                      <div className="row">
                        <div className="col-12">
                          <Field
                            component={TextArea}
                            label="Objeto resumido"
                            name="objeto"
                            required
                            validate={required}
                            height="120"
                          />
                        </div>
                      </div>
                      <FieldArrayContratos
                        form={form}
                        values={values}
                        push={push}
                        lotes={lotes}
                        DREs={DREs}
                        empresas={empresas}
                        getEditalContratoAsync={getEditalContratoAsync}
                      />
                      <div className="row mt-3">
                        <div className="col-12 text-center">
                          <Botao
                            texto="+ Adicionar outro contrato relacionado"
                            onClick={() => push("contratos", DEFAULT_CONTRATOS)}
                            style={BUTTON_STYLE.GREEN_OUTLINE}
                            type={BUTTON_TYPE.BUTTON}
                          />
                        </div>
                      </div>
                      <div className="row">
                        <div className="col-12 text-end">
                          <Botao
                            onClick={() => cancelarForm(form)}
                            texto="Cancelar"
                            className="me-3"
                            disabled={submitting}
                            type={BUTTON_TYPE.BUTTON}
                            style={BUTTON_STYLE.GREEN_OUTLINE}
                          />
                          <Botao
                            texto="Salvar"
                            disabled={submitting}
                            type={BUTTON_TYPE.SUBMIT}
                            style={BUTTON_STYLE.GREEN}
                          />
                        </div>
                      </div>
                      <ModalCadastroEdital
                        showModal={showModal}
                        closeModal={() => setShowModal(false)}
                        values={values}
                        submitting={submitting}
                        onSubmit={onSubmit}
                        lotes={lotes}
                        DREs={DREs}
                        empresas={empresas}
                      />
                    </form>
                  )}
                </Form>
              </>
            )}
          </div>
        </div>
      </div>
    </Spin>
  );
};
