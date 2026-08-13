import React from "react";
import Breadcrumb from "src/components/Shareable/Breadcrumb";
import PageNoSidebar from "src/components/Shareable/Page/PageNoSidebar";
import CadastroCategoria from "src/components/screens/Faq/CadastroCategoria/Cadastro";
import {
  AJUDA,
  CADASTRAR_CATEGORIA,
  CADASTRO_CATEGORIA,
} from "src/configs/constants";
import { HOME } from "src/constants/config";

const caminhoFaq = `/${AJUDA}`;
const caminhoListagemCategorias = `/${AJUDA}/${CADASTRO_CATEGORIA}`;
const caminhoCadastrarCategoria = `/${AJUDA}/${CADASTRO_CATEGORIA}/${CADASTRAR_CATEGORIA}`;

const atual = {
  href: caminhoCadastrarCategoria,
  titulo: "Cadastrar Categoria",
};

export default () => (
  <PageNoSidebar
    titulo="Cadastrar Categoria"
    botaoVoltar
    voltarPara={caminhoListagemCategorias}
    breadcrumb={
      <Breadcrumb
        home={HOME}
        anteriores={[
          {
            href: caminhoFaq,
            titulo: "Ajuda",
          },
          {
            href: caminhoListagemCategorias,
            titulo: "Cadastro de Categoria",
          },
        ]}
        atual={atual}
      />
    }
  >
    <CadastroCategoria />
  </PageNoSidebar>
);
