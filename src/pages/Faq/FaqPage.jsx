import React from "react";
import { HOME } from "src/constants/config";
import Breadcrumb from "src/components/Shareable/Breadcrumb";
import PageNoSidebar from "src/components/Shareable/Page/PageNoSidebar";
import { AJUDA } from "src/configs/constants";
import Faq from "src/components/screens/Faq";

const atual = {
  href: `/${AJUDA}`,
  titulo: "Ajuda",
};

export default () => (
  <PageNoSidebar
    titulo="Dúvidas Frequentes"
    botaoVoltar
    voltarPara={HOME}
    breadcrumb={<Breadcrumb home={HOME} atual={atual} />}
  >
    <Faq />
  </PageNoSidebar>
);
