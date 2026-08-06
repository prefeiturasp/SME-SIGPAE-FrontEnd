import React, { useState } from "react";
import Breadcrumb from "src/components/Shareable/Breadcrumb";
import Botao from "src/components/Shareable/Botao";
import {
  BUTTON_STYLE,
  BUTTON_TYPE,
} from "src/components/Shareable/Botao/constants";
import InputText from "src/components/Shareable/Input/InputText";
import PageNoSidebar from "src/components/Shareable/Page/PageNoSidebar";
import {
  toastError,
  toastSuccess,
} from "src/components/Shareable/Toast/dialogs";
import { HOME } from "src/constants/config";
import { createFaqCategory } from "src/services/faq.service";
import "./categoryRegistration.scss";
import ModalGenerico from "src/components/Shareable/ModalGenerico";
import HTTP_STATUS from "http-status-codes";

const FAQ_PATH = "/ajuda";
const CATEGORY_REGISTRATION_PATH = "/ajuda/cadastro-categoria";

const CategoryRegistrationPage = () => {
  const [categoryName, setCategoryName] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const normalizedCategoryName = categoryName.trim();

  const submitDisabled = !normalizedCategoryName || submitting;

  const [showDuplicateCategoryModal, setShowDuplicateCategoryModal] =
    useState(false);
  const [duplicateCategoryMessage, setDuplicateCategoryMessage] = useState("");

  const closeDuplicateCategoryModal = () => {
    setShowDuplicateCategoryModal(false);
  };

  const handleCancel = () => {
    setCategoryName("");
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (submitDisabled) {
      return;
    }

    setSubmitting(true);

    try {
      const response = await createFaqCategory({
        nome: normalizedCategoryName,
      });

      if (response.status === 201) {
        toastSuccess("Categoria Cadastrada com Sucesso!");
        setCategoryName("");
      }
    } catch (error) {
      const errorMessage = error.response?.data?.nome?.[0];

      const isDuplicateCategory =
        error.response?.status === HTTP_STATUS.BAD_REQUEST &&
        errorMessage?.includes("já existe uma categoria");

      if (isDuplicateCategory) {
        setDuplicateCategoryMessage(errorMessage);
        setShowDuplicateCategoryModal(true);
        return;
      }

      toastError(errorMessage || "Não foi possível cadastrar a categoria.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <PageNoSidebar
      titulo="Cadastrar Categoria"
      botaoVoltar
      voltarPara={FAQ_PATH}
      breadcrumb={
        <Breadcrumb
          home={HOME}
          anteriores={[
            {
              href: FAQ_PATH,
              titulo: "Ajuda",
            },
          ]}
          atual={{
            href: CATEGORY_REGISTRATION_PATH,
            titulo: "Cadastro de Categoria",
          }}
        />
      }
    >
      <div className="category-registration-page">
        <form className="category-registration-form" onSubmit={handleSubmit}>
          <div className="category-registration-field">
            <InputText
              id="category-name"
              label="Nome da Categoria"
              maxlength={100}
              placeholder="Digite o nome da categoria"
              required
              input={{
                name: "nome",
                value: categoryName,
                onChange: (event) => {
                  setCategoryName(event.target.value);
                },
              }}
            />
          </div>

          <div className="category-registration-actions">
            <Botao
              texto="Cancelar"
              type={BUTTON_TYPE.BUTTON}
              style={BUTTON_STYLE.GREEN_OUTLINE}
              className="category-registration-button"
              onClick={handleCancel}
            />

            <Botao
              texto={submitting ? "Cadastrando..." : "Cadastrar Categoria"}
              type={BUTTON_TYPE.SUBMIT}
              style={BUTTON_STYLE.GREEN}
              className="category-registration-button"
              disabled={submitDisabled}
            />
          </div>
        </form>

        <ModalGenerico
          show={showDuplicateCategoryModal}
          titulo="Cadastrar Categoria"
          texto={<strong>{duplicateCategoryMessage}</strong>}
          textoBotaoSim="OK"
          handleClose={closeDuplicateCategoryModal}
          handleSim={closeDuplicateCategoryModal}
          unicoBotao
        />
      </div>
    </PageNoSidebar>
  );
};

export default CategoryRegistrationPage;
