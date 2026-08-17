import React from "react";
import Breadcrumb from "src/components/Shareable/Breadcrumb";
import PageNoSidebar from "src/components/Shareable/Page/PageNoSidebar";
import CadastroDuvidasFrequentes from "src/components/screens/Faq/DuvidasFrequentes/Cadastro";
import { AJUDA, CADASTRO_DUVIDAS_FREQUENTES } from "src/configs/constants";
import { HOME } from "src/constants/config";

const caminhoFaq = `/${AJUDA}`;
const caminhoCadastroDuvidasFrequentes = `/${AJUDA}/${CADASTRO_DUVIDAS_FREQUENTES}`;
const caminhoCadastrarDuvidasFrequentes = `/${AJUDA}/${CADASTRO_DUVIDAS_FREQUENTES}/${CADASTRO_DUVIDAS_FREQUENTES}`;

const atual = {
  href: caminhoCadastrarDuvidasFrequentes,
  titulo: "Cadastrar Dúvidas Frequentes",
};

export const CadastrarDuvidasFrequentes = () => (
  <PageNoSidebar
    titulo="Cadastrar Dúvidas Frequentes"
    botaoVoltar
    voltarPara={caminhoCadastroDuvidasFrequentes}
    breadcrumb={
      <Breadcrumb
        home={HOME}
        anteriores={[
          {
            href: caminhoFaq,
            titulo: "Ajuda",
          },
          {
            href: caminhoCadastroDuvidasFrequentes,
            titulo: "Cadastro Dúvidas Frequentes",
          },
        ]}
        atual={atual}
      />
    }
  >
    <CadastroDuvidasFrequentes />
  </PageNoSidebar>
);
