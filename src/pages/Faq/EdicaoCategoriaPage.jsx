import React from "react";
import Breadcrumb from "src/components/Shareable/Breadcrumb";
import PageNoSidebar from "src/components/Shareable/Page/PageNoSidebar";
import EdicaoCategoria from "src/components/screens/Faq/CadastroCategoria/Edicao";
import { AJUDA, CADASTRO_CATEGORIA } from "src/configs/constants";
import { HOME } from "src/constants/config";

const caminhoFaq = `/${AJUDA}`;
const caminhoListagemCategorias = `/${AJUDA}/${CADASTRO_CATEGORIA}`;

export default () => (
  <PageNoSidebar
    titulo="Editar Categoria"
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
        atual={{
          href: "#",
          titulo: "Editar Categoria",
        }}
      />
    }
  >
    <EdicaoCategoria />
  </PageNoSidebar>
);
