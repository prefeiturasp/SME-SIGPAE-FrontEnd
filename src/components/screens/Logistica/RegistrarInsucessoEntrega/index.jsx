import React, { useEffect, useState } from "react";
import { Spin } from "antd";
import { getGuiaParaInsucesso } from "../../../../services/logistica.service";
import { Form, Field } from "react-final-form";
import Select from "src/components/Shareable/Select";
import FinalFormToRedux from "src/components/Shareable/FinalFormToRedux";
import { InputText } from "src/components/Shareable/Input/InputText";
import { InputHorario } from "src/components/Shareable/Input/InputHorario";
import { TextArea } from "src/components/Shareable/TextArea/TextArea";
import InputFile from "src/components/Shareable/Input/InputFile";
import { useNavigate } from "react-router-dom";
import { INSUCESSO_ENTREGA, LOGISTICA } from "src/configs/constants";
import {
  required,
  maxLength,
  apenasLetras,
  alphaNumeric,
  peloMenosUmNumeroEUmaLetra,
} from "../../../../helpers/fieldValidators";
import { composeValidators } from "../../../../helpers/utilities";
import { toastError } from "src/components/Shareable/Toast/dialogs";
import Botao from "src/components/Shareable/Botao";
import {
  BUTTON_TYPE,
  BUTTON_STYLE,
} from "src/components/Shareable/Botao/constants";
import ModalInsucesso from "./components/ModalInsucesso";
import moment from "moment";
import "./styles.scss";

import { gerarParametrosConsulta } from "src/helpers/utilities";

const FORM_NAME = "registrarInsucessoEntrega";
const FORMATOS_IMAGEM = "PNG, JPG ou JPEG";

export default () => {
  const [uuid, setUuid] = useState();
  const [carregando, setCarregando] = useState(false);
  const [HoraRecebimento, setHoraRecebimento] = useState("00:00");
  const [HoraRecebimentoAlterada, setHoraRecebimentoAlterada] = useState(false);
  const [initialValues, setInitialValues] = useState({});
  const [arquivo, setArquivo] = useState([]);
  const navigate = useNavigate();

  const carregarGuia = async (uuid) => {
    let response;
    try {
      setCarregando(true);
      const params = gerarParametrosConsulta({ uuid: uuid });
      response = await getGuiaParaInsucesso(params);

      setInitialValues({
        numero_guia: response.data.numero_guia,
        data_entrega: response.data.data_entrega,
        nome_unidade: response.data.nome_unidade,
        numero_requisicao: response.data.numero_requisicao,
        hora_tentativa: "00:00",
      });
      setCarregando(false);
    } catch (e) {
      toastError(e.response.data.detail);
      setCarregando(false);
    }
  };

  const escolherHora = (hora) => {
    if (hora) {
      const horario = moment(hora).format("HH:mm");
      setHoraRecebimento(horario);
      setHoraRecebimentoAlterada(true);
    } else {
      setHoraRecebimento("00:00");
      setHoraRecebimentoAlterada(false);
    }
  };

  const removeFile = () => {
    setArquivo([]);
  };

  const setFiles = (files) => {
    let arquivos = arquivo;
    arquivos = files;
    setArquivo(arquivos);
  };

  const onSubmit = async (values) => {
    values.hora_tentativa = HoraRecebimento;
    values.guia = uuid;
    if (arquivo[0]) values.arquivo = arquivo[0].arquivo;
  };

  const validaHoraRecebimento = (value) => {
    value = HoraRecebimentoAlterada ? HoraRecebimento : undefined;
    return value !== undefined ? "" : "Campo obrigatório";
  };

  const goToInsucesso = () => {
    navigate(`/${LOGISTICA}/${INSUCESSO_ENTREGA}`);
  };

  useEffect(() => {
    const queryString = window.location.search;

    if (queryString) {
      const urlParams = new URLSearchParams(window.location.search);
      const param = urlParams.get("uuid");
      setUuid(param);
      carregarGuia(param);
    }
  }, []);

  return (
    <Spin tip="Carregando..." spinning={carregando}>
      <div className="card mt-3 card-insucesso-entrega">
        <div className="card-body insucesso-entrega">
          <Form
            onSubmit={onSubmit}
            initialValues={initialValues}
            validate={() => {}}
            render={({ handleSubmit, submitting, errors, values }) => (
              <form onSubmit={handleSubmit}>
                <FinalFormToRedux form={FORM_NAME} />
                <div className="row">
                  <div className="col-12">
                    <Field
                      component={InputText}
                      label="Nome da UE"
                      name="nome_unidade"
                      className="input-busca-produto"
                      disabled
                    />
                  </div>
                </div>
                <div className="row">
                  <div className="col-4">
                    <Field
                      component={InputText}
                      label="Nº da Requisição de Entrega"
                      name="numero_requisicao"
                      className="input-busca-produto"
                      disabled
                    />
                  </div>
                  <div className="col-4">
                    <Field
                      component={InputText}
                      label="Nº da Guia de Remessa"
                      name="numero_guia"
                      className="input-busca-produto"
                      disabled
                    />
                  </div>
                  <div className="col-4">
                    <Field
                      component={InputText}
                      label="Data de Entrega"
                      name="data_entrega"
                      className="input-busca-produto"
                      disabled
                    />
                  </div>
                </div>

                <hr />
                <div className="row">
                  <div className="col">
                    <Field
                      component={Select}
                      label="Motivo"
                      name="motivo"
                      placeholder="Motivo"
                      options={[
                        { uuid: "", nome: "Selecione" },
                        {
                          uuid: "UNIDADE_FECHADA",
                          nome: "Unidade Educacional Fechada",
                        },
                        {
                          uuid: "UNIDADE_SEM_ENERGIA",
                          nome: "Unidade Educacional Sem Energia Elétrica",
                        },
                        {
                          uuid: "UNIDADE_SEM_ACESSO",
                          nome: "Interdição de Via de Acesso ao Local de Entrega",
                        },
                        { uuid: "OUTROS", nome: "Outros" },
                      ]}
                      className="input-busca-produto"
                      validate={required}
                      required
                    />
                  </div>
                </div>
                {values.motivo === "OUTROS" && (
                  <div className="row">
                    <div className="col-12">
                      <Field
                        component={InputText}
                        label="Descreva o título do motivo"
                        name="outro_motivo"
                        className="input-busca-produto"
                        validate={composeValidators(required, maxLength(100))}
                        required
                      />
                    </div>
                  </div>
                )}

                <div className="row">
                  <div className="col-12">
                    <Field
                      component={TextArea}
                      label="Justificativa"
                      name="justificativa"
                      required
                      contador={500}
                      validate={composeValidators(required, maxLength(500))}
                    />
                  </div>
                </div>
                <div className="row">
                  <div className="col-4">
                    <Field
                      component={InputText}
                      label="Nome do Motorista"
                      name="nome_motorista"
                      className="input-busca-produto"
                      contador={100}
                      validate={composeValidators(
                        required,
                        maxLength(100),
                        apenasLetras
                      )}
                      required
                    />
                  </div>
                  <div className="col-4">
                    <Field
                      component={InputText}
                      label="Placa do Veículo"
                      name="placa_veiculo"
                      className="input-busca-produto"
                      contador={7}
                      validate={composeValidators(
                        required,
                        maxLength(7),
                        alphaNumeric,
                        peloMenosUmNumeroEUmaLetra
                      )}
                      required
                    />
                  </div>
                  <div className="col-4">
                    <Field
                      component={InputHorario}
                      label="Selecionar Hora da Entrega"
                      name="hora_tentativa"
                      placeholder="Selecione a Hora"
                      horaAtual={HoraRecebimento}
                      onChangeFunction={(data) => {
                        escolherHora(data);
                      }}
                      className="input-busca-produto"
                      validate={validaHoraRecebimento}
                      required
                      functionComponent
                    />
                  </div>
                </div>

                <hr />
                <div className="mt-4 mb-4">
                  <div className="row pb-3">
                    <article className="col-9 produto">
                      <label className="mb-3">
                        <span>
                          Se possível, insira uma <strong>foto</strong> que
                          demonstre o motivo do insucesso de entrega.
                        </span>
                      </label>
                      <Field
                        component={InputFile}
                        className="inputfile"
                        texto="Inserir Imagem"
                        name="files"
                        accept={FORMATOS_IMAGEM}
                        setFiles={setFiles}
                        removeFile={removeFile}
                        toastSuccess={"Imagem incluída com sucesso!"}
                        alignLeft
                        disabled={arquivo.length > 0}
                      />
                      <label className="mb-3">
                        {"IMPORTANTE: Envie um arquivo nos formatos: " +
                          FORMATOS_IMAGEM +
                          ", com até 10MB"}
                      </label>
                    </article>
                  </div>

                  <ModalInsucesso
                    values={values}
                    disabled={Object.keys(errors).length > 0 || submitting}
                  />

                  <Botao
                    texto="Voltar"
                    type={BUTTON_TYPE.BUTTON}
                    style={BUTTON_STYLE.GREEN_OUTLINE}
                    className="float-end ms-3"
                    onClick={goToInsucesso}
                    disabled={submitting}
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
