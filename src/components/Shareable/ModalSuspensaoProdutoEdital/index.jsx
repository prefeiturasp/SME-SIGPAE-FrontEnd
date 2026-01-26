import React, { useState, useEffect } from "react";
import HTTP_STATUS from "http-status-codes";
import { Modal } from "react-bootstrap";
import { Field, Form } from "react-final-form";
import CKEditorField from "src/components/Shareable/CKEditorField";
import InputText from "src/components/Shareable/Input/InputText";
import ManagedInputFileField from "src/components/Shareable/Input/InputFile/ManagedField";
import MultiSelect from "src/components/Shareable/FinalForm/MultiSelect";
import Botao from "src/components/Shareable/Botao";
import {
  BUTTON_TYPE,
  BUTTON_STYLE,
  BUTTON_ICON,
} from "src/components/Shareable/Botao/constants";
import { peloMenosUmCaractere, required } from "src/helpers/fieldValidators";
import { EDITAIS_INVALIDOS } from "src/helpers/gestaoDeProdutos";
import { vinculosAtivosProdutoEditais } from "src/services/produto.service";
import { meusDados } from "src/services/perfil.service";
import { usuarioEhEscolaTerceirizadaQualquerPerfil } from "src/helpers/utilities";
import "./style.scss";

const ModalSuspensaoProdutoEdital = ({
  closeModalSuspender,
  showModal,
  produto,
  onSubmitSupender,
  state,
}) => {
  const [dados, setDados] = useState(undefined);
  const [vinculos, setVinculos] = useState([]);

  const vinculosProdutoEditais = async () => {
    const vinculosEditais = await vinculosAtivosProdutoEditais(
      produto?.homologacao?.uuid || produto?.ultima_homologacao.uuid,
    );
    if (vinculosEditais.status === HTTP_STATUS.OK) {
      setVinculos(vinculosEditais.data);
    }
  };

  useEffect(() => {
    const fetchDados = async () => {
      const resposta = await meusDados();
      setDados(resposta);
      !usuarioEhEscolaTerceirizadaQualquerPerfil() && vinculosProdutoEditais();
    };
    fetchDados();
  }, []);

  const getDadosIniciais = () => {
    return dados
      ? {
          funcionario_registro_funcional: dados.registro_funcional,
          funcionario_nome: dados.nome,
          funcionario_cargo: dados.cargo || "",
          nome_produto: produto?.nome,
          marca_produto: produto?.marca.nome,
          produto_tipo: produto?.eh_para_alunos_com_dieta
            ? "D. Especial"
            : "Comum",
        }
      : {};
  };

  const opcoesEditais = () => {
    let vinculos_produto_edital = vinculos.vinculos_produto_edital;

    if (vinculos_produto_edital) {
      vinculos_produto_edital = vinculos_produto_edital.filter(
        (vinculo) =>
          !vinculo.suspenso &&
          !EDITAIS_INVALIDOS.includes(vinculo.edital.numero.toUpperCase()),
      );

      return vinculos_produto_edital.map((vinculo) => ({
        value: vinculo.edital.uuid,
        label: vinculo.edital.numero,
      }));
    }
    return [];
  };

  const verificaEditaisSelecionados = (values) => {
    const editaisSelecionados =
      values.editais_para_suspensao && values.editais_para_suspensao.length;
    return editaisSelecionados === opcoesEditais().length;
  };

  return (
    <Modal
      dialogClassName="modal-ativacao-produto modal-90w"
      show={showModal}
      onHide={closeModalSuspender}
    >
      <Modal.Header className="border-0" closeButton>
        <Modal.Title> {`Suspensão de Produto`} </Modal.Title>
      </Modal.Header>
      <Form
        onSubmit={onSubmitSupender}
        initialValues={getDadosIniciais()}
        render={({ handleSubmit, form, values }) => (
          <form onSubmit={handleSubmit}>
            <Modal.Body>
              <div className="form-row">
                <div className="col-5">
                  <Field
                    component={InputText}
                    label="Nome"
                    name="funcionario_nome"
                    disabled
                  />
                </div>
                <div className="col-2">
                  <Field
                    component={InputText}
                    label="RF"
                    name="funcionario_registro_funcional"
                    disabled
                  />
                </div>
                <div className="col-5">
                  <Field
                    component={InputText}
                    label="Cargo"
                    name="funcionario_cargo"
                    disabled
                  />
                </div>
              </div>
              <div className="form-row">
                <div className="col-6">
                  <Field
                    component={InputText}
                    label="Nome do produto"
                    name="nome_produto"
                    disabled
                  />
                </div>
                <div className="col-6">
                  <Field
                    component={InputText}
                    label="Marca"
                    name="marca_produto"
                    disabled
                  />
                </div>
              </div>
              <div className="form-row">
                <div className="multiselect-editais col-6">
                  <Field
                    label="Suspender produtos nos editais"
                    component={MultiSelect}
                    disableSearch
                    name="editais_para_suspensao"
                    multiple
                    nomeDoItemNoPlural="itens"
                    options={opcoesEditais()}
                    required
                  />
                </div>
                <div className="col-6">
                  <Field
                    component={InputText}
                    label="Tipo"
                    name="produto_tipo"
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
              <div className="row">
                <div className="col-12">
                  <Botao
                    texto="Fechar"
                    type={BUTTON_TYPE.BUTTON}
                    onClick={closeModalSuspender}
                    style={BUTTON_STYLE.GREEN_OUTLINE}
                    className="ms-3"
                  />
                  <Botao
                    texto="Suspender"
                    style={BUTTON_STYLE.GREEN}
                    className="ms-3"
                    type={BUTTON_TYPE.BUTTON}
                    onClick={() => {
                      const todosEditaisSelecionados =
                        verificaEditaisSelecionados(values);
                      state.tipo_resposta = todosEditaisSelecionados
                        ? "aceitar"
                        : "aceitar_parcialmente";
                      form.submit();
                    }}
                    disabled={
                      peloMenosUmCaractere(values.justificativa) !==
                        undefined ||
                      !values.editais_para_suspensao ||
                      (values.editais_para_suspensao &&
                        values.editais_para_suspensao.length === 0)
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

export default ModalSuspensaoProdutoEdital;
