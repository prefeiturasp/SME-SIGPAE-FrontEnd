import React from "react";
import Breadcrumb from "src/components/Shareable/Breadcrumb";
import PageNoSidebar from "src/components/Shareable/Page/PageNoSidebar";
import { AJUDA, CADASTRO_DUVIDAS_FREQUENTES } from "src/configs/constants";
import { HOME } from "src/constants/config";

const caminhoFaq = `/${AJUDA}`;
const caminhoListagemCategorias = `/${AJUDA}/${CADASTRO_DUVIDAS_FREQUENTES}`;

const atual = {
  href: caminhoListagemCategorias,
  titulo: "Cadastro Dúvidas Frequentes",
};

export const ListagemDuvidasFrequentes = () => (
  <PageNoSidebar
    titulo="Cadastro Dúvidas Frequentes"
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
  ></PageNoSidebar>
);
