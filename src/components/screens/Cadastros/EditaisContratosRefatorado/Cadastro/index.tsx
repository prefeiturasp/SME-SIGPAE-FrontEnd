import { Spin } from "antd";
import { Botao } from "components/Shareable/Botao";
import {
  BUTTON_STYLE,
  BUTTON_TYPE,
} from "components/Shareable/Botao/constants";
import { InputText } from "components/Shareable/Input/InputText";
import { TextArea } from "components/Shareable/TextArea/TextArea";
import { toastError, toastSuccess } from "components/Shareable/Toast/dialogs";
import arrayMutators from "final-form-arrays";
import { required } from "helpers/fieldValidators";
import HTTP_STATUS from "http-status-codes";
import { DiretoriaRegionalInterface } from "interfaces/escola.interface";
import { LoteRascunhosInterface } from "interfaces/rascunhos.interface";
import {
  ResponseDiretoriasRegionaisSimplissimaInterface,
  ResponseLotesSimplesInterface,
  ResponseTerceirizadaListaNomesInterface,
} from "interfaces/responses.interface";
import { TerceirizadaInterface } from "interfaces/terceirizada.interface";
import React, { useEffect, useState } from "react";
import { Field, Form } from "react-final-form";
import { NavigateFunction, useNavigate } from "react-router-dom";
import { getDiretoriaregionalSimplissima } from "services/diretoriaRegional.service";
import { criarEditalEContrato } from "services/edital.service";
import { getLotesSimples } from "services/lote.service";
import { getNomesTerceirizadas } from "services/produto.service.js";
import { FormCadastroEditaisContratosInterface } from "../interfaces";
import "./style.scss";
import { FieldArrayContratos } from "./components";
import { ModalCadastroEdital } from "./ModalCadastroEdital";
import {
  CADASTROS,
  CONFIGURACOES,
  EDITAIS_CADASTRADOS,
} from "configs/constants";

export const EditaisContratosRefatorado = () => {
  const [lotes, setLotes] = useState<Array<LoteRascunhosInterface>>(undefined);
  const [DREs, setDREs] =
    useState<Array<DiretoriaRegionalInterface>>(undefined);
  const [empresas, setEmpresas] =
    useState<Array<TerceirizadaInterface>>(undefined);

  const [erro, setErro] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(true);
  const [showModal, setShowModal] = useState<boolean>(false);

  const navigate: NavigateFunction = useNavigate();

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
    ]).then(() => {
      setLoading(false);
    });
  };

  const onSubmit = async (
    values: FormCadastroEditaisContratosInterface
  ): Promise<void> => {
    if (!showModal) {
      setShowModal(true);
      return;
    }
    const response = await criarEditalEContrato(values);
    if (response.status === HTTP_STATUS.CREATED) {
      toastSuccess("Edital salvo com sucesso");
      navigate("/configuracoes/cadastros/editais-cadastrados");
    } else {
      toastError("Houve um erro ao salvar o edital");
    }
  };

  const REQUISICOES_FINALIZADAS = !loading && lotes && DREs && empresas;

  const DEFAULT_CONTRATOS = {
    vigencias: [
      {
        numero_contrato: undefined,
        data_inicial: undefined,
        data_final: undefined,
      },
    ],
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
                </div>
                <Form
                  keepDirtyOnReinitialize
                  mutators={{
                    ...arrayMutators,
                  }}
                  initialValues={{
                    contratos: [DEFAULT_CONTRATOS],
                  }}
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
                        <div className="col-4">
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
                        <div className="col-4">
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
                            onClick={() => {
                              form.change("tipo_contratacao", undefined);
                              form.change("numero", undefined);
                              form.change("processo", undefined);
                              form.change("objeto", undefined);
                              form.change("contratos", [DEFAULT_CONTRATOS]);
                            }}
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