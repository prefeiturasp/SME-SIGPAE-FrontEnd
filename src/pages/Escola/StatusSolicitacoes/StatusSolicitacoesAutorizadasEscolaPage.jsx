import Breadcrumb from "src/components/Shareable/Breadcrumb";
import CardLegendas from "src/components/Shareable/CardLegendas";
import {
  CARD_TYPE_ENUM,
  ICON_CARD_TYPE_ENUM,
} from "src/components/Shareable/CardStatusDeSolicitacao/CardStatusDeSolicitacao";
import Page from "src/components/Shareable/Page/Page";
import SolicitacoesPorStatusGenerico from "src/components/screens/SolicitacoesPorStatusGenerico";
import { ESCOLA, SOLICITACOES_AUTORIZADAS } from "src/configs/constants";
import { PAGINACAO_DEFAULT } from "src/constants/shared";
import React from "react";
import { getSolicitacoesAutorizadasEscola } from "src/services/painelEscola.service";
import { HOME } from "../constants";

const atual = {
  href: `/${ESCOLA}/${SOLICITACOES_AUTORIZADAS}`,
  titulo: "Solicitações Autorizadas",
};

export const StatusSolicitacoesAutorizadasEscolaPage = () => (
  <Page titulo={atual.titulo} botaoVoltar>
    <Breadcrumb home={HOME} atual={atual} />
    <SolicitacoesPorStatusGenerico
      tipoCard={CARD_TYPE_ENUM.AUTORIZADO}
      icone={ICON_CARD_TYPE_ENUM.AUTORIZADO}
      titulo={"Autorizadas"}
      getSolicitacoes={getSolicitacoesAutorizadasEscola}
      Legendas={CardLegendas}
      tipoPaginacao="OFFSET"
      limit={PAGINACAO_DEFAULT}
    />
  </Page>
);
