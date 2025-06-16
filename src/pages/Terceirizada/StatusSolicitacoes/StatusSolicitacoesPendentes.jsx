import React from "react";
import StatusSolicitacoes from "../../../components/screens/DashboardTerceirizada/StatusSolicitacoes";
import Breadcrumb from "../../../components/Shareable/Breadcrumb";
import Page from "../../../components/Shareable/Page/Page";
import {
  SOLICITACOES_PENDENTES,
  TERCEIRIZADA,
} from "../../../configs/constants";
import { HOME } from "../constants";
import { getSolicitacoesPendentesTerceirizada } from "src/services/painelTerceirizada.service";
import { CARD_TYPE_ENUM } from "src/components/Shareable/CardStatusDeSolicitacao/CardStatusDeSolicitacao";
import { ICON_CARD_TYPE_ENUM } from "src/components/Shareable/CardStatusDeSolicitacao/CardStatusDeSolicitacao";
import { ajustarFormatoLog } from "src/components/screens/helper";

const atual = {
  href: `/${TERCEIRIZADA}/${SOLICITACOES_PENDENTES}`,
  titulo: "Solicitações Pendentes",
};

export default () => (
  <Page titulo={atual.titulo} botaoVoltar>
    <Breadcrumb home={HOME} atual={atual} />
    <StatusSolicitacoes
      endpointGetSolicitacoes={getSolicitacoesPendentesTerceirizada}
      tipoCard={CARD_TYPE_ENUM.PENDENTE}
      icone={ICON_CARD_TYPE_ENUM.PENDENTE}
      titulo="Aguardando Autorização"
      formatarDadosSolicitacao={ajustarFormatoLog}
    />
  </Page>
);
