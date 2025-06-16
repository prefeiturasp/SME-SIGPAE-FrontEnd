import React, { useContext } from "react";
import Breadcrumb from "src/components/Shareable/Breadcrumb";
import Page from "src/components/Shareable/Page/Page";
import { SOLICITACOES_CANCELADAS, TERCEIRIZADA } from "src/configs/constants";
import { HOME } from "../constants";
import { CARD_TYPE_ENUM } from "src/components/Shareable/CardStatusDeSolicitacao/CardStatusDeSolicitacao";
import { ICON_CARD_TYPE_ENUM } from "src/components/Shareable/CardStatusDeSolicitacao/CardStatusDeSolicitacao";
import { getSolicitacoesCanceladasTerceirizada } from "src/services/painelTerceirizada.service";
import CardLegendas from "src/components/Shareable/CardLegendas";
import { formatarLotesParaVisao } from "src/helpers/utilities";
import SolicitacoesPorStatusGenerico from "src/components/screens/SolicitacoesPorStatusGenerico";
import { PAGINACAO_DEFAULT } from "src/constants/shared";
import { MeusDadosContext } from "src/context/MeusDadosContext";

const atual = {
  href: `/${TERCEIRIZADA}/${SOLICITACOES_CANCELADAS}`,
  titulo: "Solicitações Canceladas",
};

export const StatusSolicitacoesCanceladasTerceirizadaPage = () => {
  const { meusDados } = useContext(MeusDadosContext);

  return (
    <Page titulo={atual.titulo} botaoVoltar>
      <Breadcrumb home={HOME} atual={atual} />
      {meusDados && (
        <SolicitacoesPorStatusGenerico
          tipoCard={CARD_TYPE_ENUM.CANCELADO}
          icone={ICON_CARD_TYPE_ENUM.CANCELADO}
          titulo="Canceladas"
          getSolicitacoes={getSolicitacoesCanceladasTerceirizada}
          Legendas={CardLegendas}
          tipoPaginacao="OFFSET"
          limit={PAGINACAO_DEFAULT}
          lotes={formatarLotesParaVisao(
            meusDados.vinculo_atual.instituicao.lotes
          )}
          listaStatus={[
            { nome: "Conferência Status", uuid: "" },
            { nome: "Conferida", uuid: "1" },
            { nome: "Não Conferida", uuid: "0" },
          ]}
        />
      )}
    </Page>
  );
};
