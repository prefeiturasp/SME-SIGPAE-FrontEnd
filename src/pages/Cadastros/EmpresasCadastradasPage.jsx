import React from "react";
import Breadcrumb from "../../components/Shareable/Breadcrumb";
import EmpresasCadastradas from "../../components/screens/Cadastros/CadastroEmpresa/EmpresasCadastradas";
import Page from "../../components/Shareable/Page/Page";
import {
  CADASTROS,
  CONFIGURACOES,
  EMPRESA,
  EMPRESAS_CADASTRADAS,
} from "../../configs/constants";
import { PERFIL } from "../../constants/shared";

const atual = {
  href: `/${CONFIGURACOES}/${CADASTROS}/${EMPRESAS_CADASTRADAS}`,
  titulo: "Empresas Cadastradas",
};

const perfil = localStorage.getItem("perfil") || "";

const mostrarEmpresa = ![
  PERFIL.DILOG_QUALIDADE,
  PERFIL.DILOG_VISUALIZACAO,
].includes(perfil);

const anteriores = [
  {
    href: `/${CONFIGURACOES}/${CADASTROS}`,
    titulo: "Cadastros",
  },
  ...(mostrarEmpresa
    ? [
        {
          href: `/${CONFIGURACOES}/${CADASTROS}/${EMPRESA}`,
          titulo: "Empresa",
        },
      ]
    : []),
];

export default () => (
  <Page
    titulo={atual.titulo}
    botaoVoltar
    voltarPara={`/${CONFIGURACOES}/${CADASTROS}/${EMPRESA}`}
  >
    <Breadcrumb home={"/"} anteriores={anteriores} atual={atual} />
    <EmpresasCadastradas />
  </Page>
);
