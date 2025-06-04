import React from "react";
import Breadcrumb from "src/components/Shareable/Breadcrumb";
import Page from "src/components/Shareable/Page/Page";
import { HOME } from "../constants";
import { NUTRISUPERVISAO, SOLICITACOES_PENDENTES } from "src/configs/constants";
import SolicitacoesPorStatusGenerico from "src/components/screens/SolicitacoesPorStatusGenerico";
import {
  CARD_TYPE_ENUM,
  ICON_CARD_TYPE_ENUM,
} from "src/components/Shareable/CardStatusDeSolicitacao/CardStatusDeSolicitacao";
import CardLegendas from "src/components/Shareable/CardLegendas";
import { PAGINACAO_DEFAULT } from "src/constants/shared";
import { getSolicitacoesPendentesAutorizacaoNutrisupervisaoSemFiltro } from "src/services/painelNutricionista.service";

const atual = {
  href: `/${NUTRISUPERVISAO}/${SOLICITACOES_PENDENTES}`,
  titulo: "Solicitações Pendentes",
};

export default () => (
  <Page titulo={atual.titulo} botaoVoltar>
    <Breadcrumb home={HOME} atual={atual} />
    <SolicitacoesPorStatusGenerico
      tipoCard={CARD_TYPE_ENUM.PENDENTE}
      icone={ICON_CARD_TYPE_ENUM.PENDENTE}
      titulo={"Pendentes"}
      getSolicitacoes={
        getSolicitacoesPendentesAutorizacaoNutrisupervisaoSemFiltro
      }
      Legendas={CardLegendas}
      tipoPaginacao="OFFSET"
      limit={PAGINACAO_DEFAULT}
    />
  </Page>
);
