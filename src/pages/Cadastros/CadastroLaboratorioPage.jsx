import React from "react";
import Breadcrumb from "../../components/Shareable/Breadcrumb";
import CadastroLaboratorio from "src/components/screens/Cadastros/Laboratorios/components/CadastroLaboratorio";
import Page from "../../components/Shareable/Page/Page";
import {
  CADASTROS,
  CONFIGURACOES,
  CADASTRO_LABORATORIO,
  LABORATORIOS_CADASTRADOS,
} from "../../configs/constants";

const atual = {
  href: `/${CONFIGURACOES}/${CADASTROS}/${CADASTRO_LABORATORIO}`,
  titulo: "Cadastrar Laboratório",
};

const anteriores = [
  {
    href: `/${CONFIGURACOES}/${CADASTROS}`,
    titulo: "Cadastros",
  },
  {
    href: `/${CONFIGURACOES}/${CADASTROS}/${LABORATORIOS_CADASTRADOS}`,
    titulo: "Laboratórios",
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
