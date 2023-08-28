import React, { useContext } from "react";
import Breadcrumb from "components/Shareable/Breadcrumb";
import Page from "components/Shareable/Page/Page";
import {
  SOLICITACOES_AUTORIZADAS,
  TERCEIRIZADA,
} from "../../../configs/constants";
import { HOME } from "../constants";
import { ICON_CARD_TYPE_ENUM } from "components/Shareable/CardStatusDeSolicitacao/CardStatusDeSolicitacao";
import { getSolicitacoesAutorizadasTerceirizada } from "services/painelTerceirizada.service";
import { CARD_TYPE_ENUM } from "components/Shareable/CardStatusDeSolicitacao/CardStatusDeSolicitacao";
import MeusDadosContext from "context/MeusDadosContext";
import SolicitacoesPorStatusGenerico from "components/screens/SolicitacoesPorStatusGenerico";
import CardLegendas from "components/Shareable/CardLegendas";
import { formatarLotesParaVisao } from "helpers/utilities";
import { PAGINACAO_DEFAULT } from "constants/shared";

const atual = {
  href: `/${TERCEIRIZADA}/${SOLICITACOES_AUTORIZADAS}`,
  titulo: "Solicitações Autorizadas",
};

export const StatusSolicitacoesAutorizadasTerceirizadaPage = () => {
  const { meusDados } = useContext(MeusDadosContext);

  return (
    <Page titulo={atual.titulo} botaoVoltar>
      <Breadcrumb home={HOME} atual={atual} />
      {meusDados && (
        <SolicitacoesPorStatusGenerico
          tipoCard={CARD_TYPE_ENUM.AUTORIZADO}
          icone={ICON_CARD_TYPE_ENUM.AUTORIZADO}
          titulo="Autorizadas"
          getSolicitacoes={getSolicitacoesAutorizadasTerceirizada}
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
