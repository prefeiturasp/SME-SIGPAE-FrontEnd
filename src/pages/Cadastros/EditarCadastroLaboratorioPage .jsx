import React from "react";
import Breadcrumb from "../../components/Shareable/Breadcrumb";
import CadastroLaboratorio from "src/components/screens/Cadastros/Laboratorios/components/CadastroLaboratorio";
import Page from "../../components/Shareable/Page/Page";
import {
  CADASTROS,
  CONFIGURACOES,
  LABORATORIOS_CADASTRADOS,
} from "../../configs/constants";

const atual = {
  titulo: "Editar Cadastro de Laboratório",
};

const anteriores = [
  {
    href: `/${CONFIGURACOES}/${CADASTROS}`,
    titulo: "Cadastros",
  },
  {
    href: `/${CONFIGURACOES}/${CADASTROS}/${LABORATORIOS_CADASTRADOS}`,
    titulo: "Laboratórios Cadastrados",
  },
];

export default () => (
  <Page
    titulo={atual.titulo}
    botaoVoltar
    voltarPara={`/${CONFIGURACOES}/${CADASTROS}/${LABORATORIOS_CADASTRADOS}`}
  >
    <Breadcrumb home={"/"} anteriores={anteriores} atual={atual} />
    <CadastroLaboratorio />
  </Page>
);
