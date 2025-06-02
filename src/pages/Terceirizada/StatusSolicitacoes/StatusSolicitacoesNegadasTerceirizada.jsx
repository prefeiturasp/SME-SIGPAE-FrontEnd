import React, { useContext } from "react";
import Breadcrumb from "src/components/Shareable/Breadcrumb";
import Page from "src/components/Shareable/Page/Page";
import { SOLICITACOES_NEGADAS, TERCEIRIZADA } from "src/configs/constants";
import { HOME } from "../constants";
import { CARD_TYPE_ENUM } from "src/components/Shareable/CardStatusDeSolicitacao/CardStatusDeSolicitacao";
import { getSolicitacoesNegadasTerceirizada } from "src/services/painelTerceirizada.service";
import { ICON_CARD_TYPE_ENUM } from "src/components/Shareable/CardStatusDeSolicitacao/CardStatusDeSolicitacao";
import CardLegendas from "src/components/Shareable/CardLegendas";
import { PAGINACAO_DEFAULT } from "src/constants/shared";
import { formatarLotesParaVisao } from "src/helpers/utilities";
import SolicitacoesPorStatusGenerico from "src/components/screens/SolicitacoesPorStatusGenerico";
import { MeusDadosContext } from "src/context/MeusDadosContext";

const atual = {
  href: `/${TERCEIRIZADA}/${SOLICITACOES_NEGADAS}`,
  titulo: "Solicitações Negadas",
};

export const StatusSolicitacoesNegadasTerceirizadaPage = () => {
  const { meusDados } = useContext(MeusDadosContext);

  return (
    <Page titulo={atual.titulo} botaoVoltar>
      <Breadcrumb home={HOME} atual={atual} />
      {meusDados && (
        <SolicitacoesPorStatusGenerico
          tipoCard={CARD_TYPE_ENUM.NEGADO}
          icone={ICON_CARD_TYPE_ENUM.NEGADO}
          titulo="Negadas"
          getSolicitacoes={getSolicitacoesNegadasTerceirizada}
          Legendas={CardLegendas}
          tipoPaginacao="OFFSET"
          limit={PAGINACAO_DEFAULT}
          lotes={formatarLotesParaVisao(
            meusDados.vinculo_atual.instituicao.lotes
          )}
        />
      )}
    </Page>
  );
};
