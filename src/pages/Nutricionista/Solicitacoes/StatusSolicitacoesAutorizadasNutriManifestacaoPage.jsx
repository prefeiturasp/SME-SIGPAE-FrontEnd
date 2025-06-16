import React from "react";
import Breadcrumb from "src/components/Shareable/Breadcrumb";
import Page from "src/components/Shareable/Page/Page";
import { HOME } from "../constants";
import {
  NUTRIMANIFESTACAO,
  SOLICITACOES_AUTORIZADAS,
} from "src/configs/constants";
import SolicitacoesPorStatusGenerico from "src/components/screens/SolicitacoesPorStatusGenerico";
import {
  CARD_TYPE_ENUM,
  ICON_CARD_TYPE_ENUM,
} from "src/components/Shareable/CardStatusDeSolicitacao/CardStatusDeSolicitacao";
import { getSolicitacoesAutorizadasNutrimanifestacao } from "src/services/painelNutricionista.service";
import CardLegendas from "src/components/Shareable/CardLegendas";
import { PAGINACAO_DEFAULT } from "src/constants/shared";

const atual = {
  href: `/${NUTRIMANIFESTACAO}/${SOLICITACOES_AUTORIZADAS}`,
  titulo: "Solicitações Autorizadas",
};

export default () => (
  <Page titulo={atual.titulo} botaoVoltar>
    <Breadcrumb home={HOME} atual={atual} />
    <SolicitacoesPorStatusGenerico
      tipoCard={CARD_TYPE_ENUM.AUTORIZADO}
      icone={ICON_CARD_TYPE_ENUM.AUTORIZADO}
      titulo={"Autorizadas"}
      getSolicitacoes={getSolicitacoesAutorizadasNutrimanifestacao}
      Legendas={CardLegendas}
      tipoPaginacao="OFFSET"
      limit={PAGINACAO_DEFAULT}
    />
  </Page>
);
