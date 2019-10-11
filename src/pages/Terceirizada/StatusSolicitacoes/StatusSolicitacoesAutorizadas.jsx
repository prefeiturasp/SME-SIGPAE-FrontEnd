import React from "react";
import { STATUS } from "../../../components/screens/const";
import StatusSolicitacoes from "../../../components/screens/DashboardTerceirizada/StatusSolicitacoes";
import Breadcrumb from "../../../components/Shareable/Breadcrumb";
import Page from "../../../components/Shareable/Page/Page";
import { SOLICITACOES_AUTORIZADAS, TERCEIRIZADA } from "../../../configs/constants";
import { HOME } from "../constants";

const atual = {
  href: `/${TERCEIRIZADA}/${SOLICITACOES_AUTORIZADAS}`,
  titulo: "Solicitações Autorizadas"
};

export default () => (
  <Page titulo={atual.titulo} botaoVoltar voltarPara={HOME}>
    <Breadcrumb home={HOME} atual={atual} />
    <StatusSolicitacoes tipoStatus={STATUS.AUTORIZADAS} />
  </Page>
);
