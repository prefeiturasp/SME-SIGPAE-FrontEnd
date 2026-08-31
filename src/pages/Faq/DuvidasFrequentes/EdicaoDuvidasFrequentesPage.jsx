import React from "react";
import Breadcrumb from "src/components/Shareable/Breadcrumb";
import PageNoSidebar from "src/components/Shareable/Page/PageNoSidebar";
import EdicaoDuvidasFrequentes from "src/components/screens/Faq/DuvidasFrequentes/Edicao";
import { AJUDA, CADASTRO_DUVIDAS_FREQUENTES } from "src/configs/constants";
import { HOME } from "src/constants/config";

const caminhoFaq = `/${AJUDA}`;
const caminhoListagemDuvidas = `/${AJUDA}/${CADASTRO_DUVIDAS_FREQUENTES}`;

const EdicaoDuvidasFrequentesPage = () => (
  <PageNoSidebar
    titulo="Editar Dúvida Frequente"
    botaoVoltar
    voltarPara={caminhoListagemDuvidas}
    breadcrumb={
      <Breadcrumb
        home={HOME}
        anteriores={[
          {
            href: caminhoFaq,
            titulo: "Ajuda",
          },
          {
            href: caminhoListagemDuvidas,
            titulo: "Cadastro Dúvidas Frequentes",
          },
        ]}
        atual={{
          href: "#",
          titulo: "Editar Dúvidas Frequentes",
        }}
      />
    }
  >
    <EdicaoDuvidasFrequentes />
  </PageNoSidebar>
);

export default EdicaoDuvidasFrequentesPage;
