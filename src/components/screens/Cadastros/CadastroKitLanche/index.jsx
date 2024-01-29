import React, { useEffect, useState } from "react";
import HTTP_STATUS from "http-status-codes";
import { useNavigate } from "react-router-dom";
import { toastError, toastSuccess } from "components/Shareable/Toast/dialogs";
import { getNumerosEditais } from "services/edital.service";
import {
  getKitLanches,
  createKitLanche,
  checaNomeKitLanche,
  updateKitLanche,
} from "services/codae.service";
import { Field, Form } from "react-final-form";
import { OnBlur } from "react-final-form-listeners";
import { Select } from "components/Shareable/Select";
import InputText from "components/Shareable/Input/InputText";
import CKEditorField from "components/Shareable/CKEditorField";
import {
  required,
  selectValidate,
  textAreaRequired,
} from "helpers/fieldValidators";
import Botao from "components/Shareable/Botao";
import {
  BUTTON_TYPE,
  BUTTON_STYLE,
} from "components/Shareable/Botao/constants";
import { Spin } from "antd";
import "./style.scss";

export default ({ uuid }) => {
  const navigate = useNavigate();
  const [carregando, setCarregando] = useState(true);
  const [editais, setEditais] = useState([]);
  const [opcaoStatus] = useState([
    { uuid: "", nome: "Selecione uma opção" },
    { uuid: "ATIVO", nome: "Ativo" },
    { uuid: "INATIVO", nome: "Inativo" },
  ]);
  const [desabilitarBotao, setDesabilitarBotao] = useState(false);
  const [modeloKitLanche, setModeloKitLanche] = useState({
    edital: null,
    nome: null,
    descricao: null,
    status: "ATIVO",
  });

  const onSubmit = async (formValues) => {
    setCarregando(true);
    const payload = {
      edital: formValues.edital,
      nome: formValues.nome,
      descricao: formValues.descricao,
      status: formValues.status,
    };
    const response = uuid
      ? await updateKitLanche(payload, uuid)
      : await createKitLanche(payload);
    if ([HTTP_STATUS.CREATED, HTTP_STATUS.OK].includes(response.status)) {
      toastSuccess("Cadastro salvo com sucesso");
      navigate("/codae/cadastros/consulta-kits");
    } else {
      toastError("Houve um erro ao tentar criar o Kit Lanche");
    }
    setCarregando(false);
  };

  const fetchData = async () => {
    await getNumerosEditais().then((res) => {
      if (res.status === HTTP_STATUS.OK) {
        const result = res.data.results.map((edital) => {
          return { uuid: edital.uuid, nome: edital.numero };
        });
        setEditais(result);
      } else {
        toastError(`Houve um erro ao carregar dados`);
      }
    });
    if (uuid) {
      await getKitLanches(uuid).then((res) => {
        if (res.status === HTTP_STATUS.OK) setModeloKitLanche(res.data);
      });
    }
    setCarregando(false);
  };

  const checaNomeExiste = async (values) => {
    if (
      ![null, undefined, ""].includes(values.nome) &&
      ![null, undefined, ""].includes(values.edital)
    ) {
      const payload = {
        nome: values.nome,
        edital: values.edital,
        uuid: modeloKitLanche.uuid,
      };
      try {
        const response = await checaNomeKitLanche(payload);
        if (response.status === HTTP_STATUS.OK) {
          toastError(
            "Esse nome de kit lanche já existe para edital selecionado"
          );
          setDesabilitarBotao(true);
        }
      } catch (error) {
        setDesabilitarBotao(false);
      }
    }
  };

  useEffect(() => {
    if (carregando) {
      fetchData();
    }
  }, [editais]);

  return (
    <Spin tip="Carregando..." spinning={carregando}>
      <div className="card mt-3 card-consulta-kits">
        <div className="card-body consulta-kits">
          <Form
            onSubmit={onSubmit}
            initialValues={() => modeloKitLanche}
            render={({ handleSubmit, submitting, values, form }) => (
              <form onSubmit={handleSubmit}>
                <div className="row mb-3">
                  <div className="col-4">
                    <label className="col-form-label mb-1">
                      <span className="asterisco">* </span>
                      Número do Edital
                    </label>
                    <Field
                      name="edital"
                      component={Select}
                      options={[
                        { uuid: "", nome: "Selecione uma opção" },
                      ].concat(editais)}
                      required
                      validate={selectValidate}
                      disabled={modeloKitLanche.uuid ? true : false}
                    />
                    <OnBlur name="edital">
                      {() => checaNomeExiste(values)}
                    </OnBlur>
                  </div>
                  <div className="col-12">
                    <label className="col-form-label mb-1">
                      <span className="asterisco">* </span>
                      Nome do KIT
                    </label>
                    <Field
                      name="nome"
                      component={InputText}
                      required
                      disabled={modeloKitLanche.uuid ? true : false}
                      validate={required}
                    />
                    <OnBlur name="nome">{() => checaNomeExiste(values)}</OnBlur>
                  </div>
                  <div className="col-12">
                    <label className="col-form-label mb-1">
                      <span className="asterisco">* </span>
                      Alimentos que compõe o KIT
                    </label>
                    <Field
                      component={CKEditorField}
                      name="descricao"
                      required
                      validate={textAreaRequired}
                    />
                  </div>
                  <div className="col-4">
                    <label className="col-form-label mb-1">
                      <span className="asterisco">* </span>
                      Status
                    </label>
                    <Field
                      name="status"
                      component={Select}
                      options={opcaoStatus}
                      required
                      validate={selectValidate}
                    />
                  </div>
                </div>
                <div className="row">
                  <div className="col-12">
                    <hr />
                  </div>
                  <div className="offset-6 col-6">
                    <Botao
                      texto="Salvar"
                      type={BUTTON_TYPE.SUBMIT}
                      style={BUTTON_STYLE.GREEN}
                      className="ms-3 float-end"
                      disabled={submitting || desabilitarBotao}
                    />
                    <Botao
                      texto="Cancelar"
                      type={BUTTON_TYPE.BUTTON}
                      style={BUTTON_STYLE.GREEN_OUTLINE}
                      className="ms-3 float-end"
                      onClick={() => form.reset(modeloKitLanche)}
                    />
                  </div>
                </div>
              </form>
            )}
          />
        </div>
      </div>
    </Spin>
  );
};
