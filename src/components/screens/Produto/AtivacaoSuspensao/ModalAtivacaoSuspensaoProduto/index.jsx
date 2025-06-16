import React, { useState, useEffect } from "react";
import HTTP_STATUS from "http-status-codes";
import * as R from "ramda";
import { Modal } from "react-bootstrap";
import { Field, Form } from "react-final-form";
import CKEditorField from "src/components/Shareable/CKEditorField";
import InputText from "src/components/Shareable/Input/InputText";
import ManagedInputFileField from "src/components/Shareable/Input/InputFile/ManagedField";
import {
  toastError,
  toastSuccess,
} from "src/components/Shareable/Toast/dialogs";
import MultiSelect from "src/components/Shareable/FinalForm/MultiSelect";
import Botao from "src/components/Shareable/Botao";
import {
  BUTTON_TYPE,
  BUTTON_STYLE,
  BUTTON_ICON,
} from "src/components/Shareable/Botao/constants";
import { peloMenosUmCaractere, required } from "src/helpers/fieldValidators";
import { EDITAIS_INVALIDOS } from "src/helpers/gestaoDeProdutos";
import { ativarProduto, suspenderProduto } from "src/services/produto.service";
import { meusDados } from "src/services/perfil.service";
import "./style.scss";
import { getNumerosEditais } from "src/services/edital.service";

const capitalizar = R.replace(/^./, R.toUpper);

const ModalAtivacaoSuspensaoProduto = ({
  acao,
  idHomologacao,
  atualizarDados,
  closeModal,
  showModal,
  produto,
  ehSuspensaoFluxoAlteracaoDados,
}) => {
  const [meusDadosUsuario, setMeusDadosUsuario] = useState(undefined);
  const [editais, setEditais] = useState(undefined);

  useEffect(() => {
    const fetchData = async () => {
      const resposta = await meusDados();
      setMeusDadosUsuario(resposta);
      getEditaisAsync();
    };
    fetchData();
  }, []);

  const getDadosIniciais = () => {
    return meusDadosUsuario
      ? {
          funcionario_registro_funcional: meusDadosUsuario.registro_funcional,
          funcionario_nome: meusDadosUsuario.nome,
          funcionario_cargo: meusDadosUsuario.cargo || "",
        }
      : {};
  };

  const onSubmit = async (values) => {
    const endpoint = acao === "ativação" ? ativarProduto : suspenderProduto;
    const response = await endpoint(idHomologacao, values);
    if (response.status === HTTP_STATUS.OK) {
      if (
        values.editais_para_suspensao_ativacao &&
        values.editais_para_suspensao_ativacao.length === editais.length
      ) {
        const searchParams = new URLSearchParams(window.location.search);
        if (acao === "ativação") {
          searchParams.delete("card_suspensos");
        } else {
          searchParams.set("card_suspensos", true);
        }
        const newRelativePathQuery =
          window.location.pathname + "?" + searchParams.toString();
        history.pushState(null, "", newRelativePathQuery);
        toastSuccess(`${capitalizar(acao)} de produto enviada com sucesso.`);
        window.location.reload();
      }
      if (ehSuspensaoFluxoAlteracaoDados) {
        const searchParams = new URLSearchParams(window.location.search);
        searchParams.set("uuid", response.data.uuid);
        const newRelativePathQuery =
          window.location.pathname + "?" + searchParams.toString();
        history.pushState(null, "", newRelativePathQuery);
      }
      toastSuccess(`${capitalizar(acao)} de produto enviada com sucesso.`);
      atualizarDados();
    } else {
      toastError(`Houve um erro ao registrar a ${acao} de produto`);
    }
    closeModal();
  };

  const getEditaisAsync = async () => {
    const response = await getNumerosEditais();
    if (response.status === HTTP_STATUS.OK) {
      setEditais(response.data.results);
    }
  };

  const opcoesEditais = () => {
    let options = [];
    if (acao) {
      if (acao === "suspensão") {
        let vinculos_produto_edital = produto.vinculos_produto_edital;
        if (vinculos_produto_edital) {
          vinculos_produto_edital = vinculos_produto_edital.filter(
            (vinculo) => !vinculo.suspenso
          );
        }
        options = vinculos_produto_edital
          .filter(
            ({ edital }) =>
              !EDITAIS_INVALIDOS.includes(edital.numero.toUpperCase())
          )
          .map((vinculo) => ({
            value: vinculo.edital.uuid,
            label: vinculo.edital.numero,
          }));
      }
      if (acao === "ativação" && editais?.length > 0) {
        options = editais
          .filter(
            (edital) => !EDITAIS_INVALIDOS.includes(edital.numero.toUpperCase())
          )
          .map((edital) => ({
            label: edital.numero,
            value: edital.uuid,
          }));
      }
    }
    return options;
  };

  return (
    <Modal
      dialogClassName="modal-ativacao-produto modal-90w"
      show={showModal}
      onHide={closeModal}
    >
      <Modal.Header className="border-0" closeButton>
        <Modal.Title> {`${capitalizar(acao || "")} de Produto`} </Modal.Title>
      </Modal.Header>
      <Form
        onSubmit={onSubmit}
        initialValues={getDadosIniciais()}
        render={({ handleSubmit, submitting, values }) => (
          <form onSubmit={handleSubmit}>
            <Modal.Body>
              <div className="form-row">
                <div className="col-4">
                  <Field
                    component={InputText}
                    label="RF/CRN/CRF"
                    name="funcionario_registro_funcional"
                    disabled
                  />
                </div>
                <div className="col-8">
                  <Field
                    component={InputText}
                    label="Cargo"
                    name="funcionario_cargo"
                    disabled
                  />
                </div>
              </div>
              <div className="form-row">
                <div className="multiselect-editais col-6">
                  <Field
                    label={`${
                      acao === "suspensão" ? "Suspender" : "Ativar"
                    } produto nos editais`}
                    component={MultiSelect}
                    disableSearch
                    name="editais_para_suspensao_ativacao"
                    multiple
                    nomeDoItemNoPlural="itens"
                    options={opcoesEditais()}
                    required
                  />
                </div>
                <div className="col-6 input-nome">
                  <Field
                    component={InputText}
                    label="Nome"
                    name="funcionario_nome"
                    disabled
                  />
                </div>
              </div>
              <div className="form-row row-ativacao mt-3">
                <div className="col-12">
                  <Field
                    component={CKEditorField}
                    label="Justificativa"
                    name="justificativa"
                    required
                    validate={(value) => {
                      for (let validator of [peloMenosUmCaractere, required]) {
                        const erro = validator(value);
                        if (erro) return erro;
                      }
                    }}
                  />
                </div>
              </div>
              <section className="form-row attachments">
                <div className="col-9">
                  <div className="card-title fw-bold cinza-escuro">Anexar</div>
                  <div className="text">
                    Anexar fotos, documentos ou relatórios relacionados à
                    reclamação do produto.
                  </div>
                </div>
                <div className="col-3 btn">
                  <Field
                    component={ManagedInputFileField}
                    className="inputfile"
                    texto="Anexar"
                    name="anexos"
                    accept=".png, .doc, .pdf, .docx, .jpeg, .jpg"
                    icone={BUTTON_ICON.ATTACH}
                    toastSuccessMessage="Anexo incluso com sucesso"
                    concatenarNovosArquivos
                  />
                </div>
              </section>
            </Modal.Body>
            <Modal.Footer className="border-0">
              <div className="row mt-4">
                <div className="col-12">
                  <Botao
                    texto="Voltar"
                    type={BUTTON_TYPE.BUTTON}
                    onClick={closeModal}
                    style={BUTTON_STYLE.GREEN_OUTLINE}
                    className="ms-3"
                  />
                  <Botao
                    texto="Enviar"
                    type={BUTTON_TYPE.SUBMIT}
                    style={BUTTON_STYLE.GREEN}
                    className="ms-3"
                    disabled={
                      submitting ||
                      peloMenosUmCaractere(values.justificativa) !==
                        undefined ||
                      !values.editais_para_suspensao_ativacao ||
                      (values.editais_para_suspensao_ativacao &&
                        values.editais_para_suspensao_ativacao.length === 0)
                    }
                  />
                </div>
              </div>
            </Modal.Footer>
          </form>
        )}
      />
    </Modal>
  );
};

export default ModalAtivacaoSuspensaoProduto;
