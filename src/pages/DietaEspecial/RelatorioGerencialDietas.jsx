import React from "react";

import { HOME } from "src/constants/config";

import Breadcrumb from "src/components/Shareable/Breadcrumb";
import Page from "src/components/Shareable/Page/Page";

import RelatorioGerencialDietas from "src/components/screens/DietaEspecial/RelatorioGerencialDietas";
import {
  DIETA_ESPECIAL,
  RELATORIO_GERENCIAL_DIETAS,
} from "src/configs/constants";

const atual = {
  href: `/${DIETA_ESPECIAL}/${RELATORIO_GERENCIAL_DIETAS}`,
  titulo: "Relatório Gerencial de Dietas",
};

export default () => (
  <Page botaoVoltar voltarPara="/" titulo={atual.titulo}>
    <Breadcrumb
      home={HOME}
      atual={atual}
      anteriores={[
        {
          href: "#",
          titulo: "Dieta Especial",
        },
        {
          href: "#",
          titulo: "Relatórios",
        },
      ]}
    />
    <RelatorioGerencialDietas />
  </Page>
);
