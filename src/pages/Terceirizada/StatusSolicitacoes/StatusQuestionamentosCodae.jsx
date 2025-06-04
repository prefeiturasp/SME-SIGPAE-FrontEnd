import React, { useContext } from "react";
import Breadcrumb from "src/components/Shareable/Breadcrumb";
import Page from "src/components/Shareable/Page/Page";
import {
  SOLICITACOES_COM_QUESTIONAMENTO,
  TERCEIRIZADA,
} from "src/configs/constants";
import { HOME } from "../constants";
import { ICON_CARD_TYPE_ENUM } from "src/components/Shareable/CardStatusDeSolicitacao/CardStatusDeSolicitacao";
import { getSolicitacoesComQuestionamento } from "src/services/painelTerceirizada.service";
import { CARD_TYPE_ENUM } from "src/components/Shareable/CardStatusDeSolicitacao/CardStatusDeSolicitacao";
import SolicitacoesPorStatusGenerico from "src/components/screens/SolicitacoesPorStatusGenerico";
import CardLegendas from "src/components/Shareable/CardLegendas";
import { PAGINACAO_DEFAULT } from "src/constants/shared";
import { MeusDadosContext } from "src/context/MeusDadosContext";
import { formatarLotesParaVisao } from "src/helpers/utilities";

const atual = {
  href: `/${TERCEIRIZADA}/${SOLICITACOES_COM_QUESTIONAMENTO}`,
  titulo: "Solicitações com questionamentos da CODAE",
};

export const StatusQuestionamentosCodae = () => {
  const { meusDados } = useContext(MeusDadosContext);

  return (
    <Page titulo={atual.titulo} botaoVoltar>
      <Breadcrumb home={HOME} atual={atual} />
      {meusDados && (
        <SolicitacoesPorStatusGenerico
          tipoCard={CARD_TYPE_ENUM.PENDENTE}
          icone={ICON_CARD_TYPE_ENUM.PENDENTE}
          titulo="Questionamentos da CODAE"
          getSolicitacoes={getSolicitacoesComQuestionamento}
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
