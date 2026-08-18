import React from "react";
import Breadcrumb from "src/components/Shareable/Breadcrumb";
import PageNoSidebar from "src/components/Shareable/Page/PageNoSidebar";
import ListagemCategorias from "src/components/screens/Faq/Categorias/Listagem";
import { AJUDA, CADASTRO_CATEGORIA } from "src/configs/constants";
import { HOME } from "src/constants/config";
import BotaoCadastrarCategoria from "src/components/screens/Faq/Categorias/components/BotaoCadastrarCategoria";

const caminhoFaq = `/${AJUDA}`;
const caminhoListagemCategorias = `/${AJUDA}/${CADASTRO_CATEGORIA}`;

const atual = {
  href: caminhoListagemCategorias,
  titulo: "Cadastro de Categoria",
};

export default () => (
  <PageNoSidebar
    titulo="Cadastrar Categoria"
    botaoVoltar
    voltarPara={caminhoFaq}
    breadcrumb={
      <Breadcrumb
        home={HOME}
        anteriores={[
          {
            href: caminhoFaq,
            titulo: "Ajuda",
          },
        ]}
        atual={atual}
      />
    }
  >
    <BotaoCadastrarCategoria />
    <ListagemCategorias />
  </PageNoSidebar>
);
