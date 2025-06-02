import React from "react";
import Breadcrumb from "src/components/Shareable/Breadcrumb";
import Page from "src/components/Shareable/Page/Page";
import Relatorio from "src/components/SuspensaoAlimentacaoDeCEI/Relatorio";
import {
  TERCEIRIZADA,
  SUSPENSAO_ALIMENTACAO,
  ESCOLA,
  DRE,
  CODAE,
} from "src/configs/constants";
import {
  usuarioEhDRE,
  usuarioEhEmpresaTerceirizada,
} from "src/helpers/utilities";

let voltarPara = "/painel-gestao-alimentacao";

if (usuarioEhEmpresaTerceirizada())
  voltarPara = `/${TERCEIRIZADA}/${SUSPENSAO_ALIMENTACAO}`;

let visao = ESCOLA;
if (usuarioEhEmpresaTerceirizada()) {
  visao = TERCEIRIZADA;
} else if (usuarioEhDRE()) {
  visao = DRE;
} else {
  visao = CODAE;
}

const atual = {
  href: "#",
  titulo: "Relatório",
};

export default () => (
  <Page botaoVoltar voltarPara={voltarPara}>
    <Breadcrumb home="/" atual={atual} />
    <Relatorio visao={visao} />
  </Page>
);
