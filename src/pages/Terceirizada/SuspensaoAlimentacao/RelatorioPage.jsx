import React from "react";
import Breadcrumb from "src/components/Shareable/Breadcrumb";
import Page from "src/components/Shareable/Page/Page";
import Relatorio from "src/components/SuspensaoDeAlimentacao/Relatorio";
import { HOME } from "../constants";
import { TERCEIRIZADA, SUSPENSAO_ALIMENTACAO } from "src/configs/constants";
import { usuarioEhEmpresaTerceirizada } from "src/helpers/utilities";

let voltarPara = "/painel-gestao-alimentacao";

if (usuarioEhEmpresaTerceirizada())
  voltarPara = `/${TERCEIRIZADA}/${SUSPENSAO_ALIMENTACAO}`;

const atual = {
  href: "#",
  titulo: "Relatório",
};

export default () => (
  <Page botaoVoltar voltarPara={voltarPara}>
    <Breadcrumb home={HOME} atual={atual} />
    <Relatorio />
  </Page>
);
