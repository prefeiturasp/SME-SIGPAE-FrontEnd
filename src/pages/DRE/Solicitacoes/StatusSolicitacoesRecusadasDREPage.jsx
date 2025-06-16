import React, { useContext } from "react";
import Breadcrumb from "src/components/Shareable/Breadcrumb";
import Page from "src/components/Shareable/Page/Page";
import { HOME } from "../constants";
import { DRE, SOLICITACOES_NEGADAS } from "src/configs/constants";
import SolicitacoesPorStatusGenerico from "src/components/screens/SolicitacoesPorStatusGenerico";
import {
  CARD_TYPE_ENUM,
  ICON_CARD_TYPE_ENUM,
} from "src/components/Shareable/CardStatusDeSolicitacao/CardStatusDeSolicitacao";
import { getSolicitacoesNegadasDRE } from "src/services/painelDRE.service";
import CardLegendas from "src/components/Shareable/CardLegendas";
import { PAGINACAO_DEFAULT } from "src/constants/shared";
import { formatarLotesParaVisao } from "src/helpers/utilities";
import { MeusDadosContext } from "src/context/MeusDadosContext";

const atual = {
  href: `/${DRE}/${SOLICITACOES_NEGADAS}`,
  titulo: "Solicitações Negadas",
};

export default () => {
  const { meusDados } = useContext(MeusDadosContext);

  return (
    <Page titulo={atual.titulo} botaoVoltar>
      <Breadcrumb home={HOME} atual={atual} />
      <SolicitacoesPorStatusGenerico
        tipoCard={CARD_TYPE_ENUM.NEGADO}
        icone={ICON_CARD_TYPE_ENUM.NEGADO}
        titulo={"Negadas"}
        getSolicitacoes={getSolicitacoesNegadasDRE}
        Legendas={CardLegendas}
        tipoPaginacao="OFFSET"
        limit={PAGINACAO_DEFAULT}
        lotes={formatarLotesParaVisao(
          meusDados.vinculo_atual.instituicao.lotes
        )}
      />
    </Page>
  );
};
