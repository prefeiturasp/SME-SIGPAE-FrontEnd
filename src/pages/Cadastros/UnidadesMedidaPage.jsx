import React from "react";
import Breadcrumb from "../../components/Shareable/Breadcrumb";
import UnidadesMedida from "src/components/screens/Cadastros/UnidadesMedida";
import Page from "../../components/Shareable/Page/Page";
import {
  CADASTROS,
  CONFIGURACOES,
  UNIDADES_MEDIDA,
} from "../../configs/constants";

const atual = {
  href: `/${CONFIGURACOES}/${CADASTROS}/${UNIDADES_MEDIDA}`,
  titulo: "Unidades de Medida",
};

const anteriores = [
  {
    href: `/${CONFIGURACOES}/${CADASTROS}`,
    titulo: "Cadastros",
  },
];

export default () => (
  <Page titulo={atual.titulo} botaoVoltar voltarPara={"/"}>
    <Breadcrumb home={"/"} anteriores={anteriores} atual={atual} />
    <UnidadesMedida />
  </Page>
);
