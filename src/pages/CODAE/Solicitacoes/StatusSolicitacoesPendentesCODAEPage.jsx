import React from "react";
import Breadcrumb from "src/components/Shareable/Breadcrumb";
import Page from "src/components/Shareable/Page/Page";
import { HOME } from "../constants";
import { CODAE, SOLICITACOES_PENDENTES } from "src/configs/constants";
import SolicitacoesPorStatusGenerico from "src/components/screens/SolicitacoesPorStatusGenerico";
import {
  CARD_TYPE_ENUM,
  ICON_CARD_TYPE_ENUM,
} from "src/components/Shareable/CardStatusDeSolicitacao/CardStatusDeSolicitacao";
import { getSolicitacoesPendentesAutorizacaoCodaeSemFiltro } from "src/services/painelCODAE.service";
import CardLegendas from "src/components/Shareable/CardLegendas";
import { PAGINACAO_DEFAULT } from "src/constants/shared";

const atual = {
  href: `/${CODAE}/${SOLICITACOES_PENDENTES}`,
  titulo: "Solicitações Pendentes",
};

export default () => (
  <Page titulo={atual.titulo} botaoVoltar>
    <Breadcrumb home={HOME} atual={atual} />
    <SolicitacoesPorStatusGenerico
      tipoCard={CARD_TYPE_ENUM.PENDENTE}
      icone={ICON_CARD_TYPE_ENUM.PENDENTE}
      titulo={"Pendentes"}
      getSolicitacoes={getSolicitacoesPendentesAutorizacaoCodaeSemFiltro}
      Legendas={CardLegendas}
      tipoPaginacao="OFFSET"
      limit={PAGINACAO_DEFAULT}
    />
  </Page>
);
