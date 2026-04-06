import Breadcrumb from "src/components/Shareable/Breadcrumb";
import Page from "src/components/Shareable/Page/Page";
import { ConferenciaDosLancamentos } from "src/components/screens/LancamentoInicial/ConferenciaDosLancamentos";
import {
  ACOMPANHAMENTO_DE_LANCAMENTOS,
  CONFERENCIA_DOS_LANCAMENTOS,
  MEDICAO_INICIAL,
} from "src/configs/constants";
import { HOME } from "src/constants/config";
import { useLocation } from "react-router-dom";

export const ConferenciaDosLancamentosPage = () => {
  const location = useLocation();
  const voltarPara =
    location.state?.voltarPara ||
    `/${MEDICAO_INICIAL}/${ACOMPANHAMENTO_DE_LANCAMENTOS}`;

  const atual = {
    href: `/${MEDICAO_INICIAL}/${CONFERENCIA_DOS_LANCAMENTOS}`,
    titulo: "Conferência dos Lançamentos",
  };

  const anteriores = [
    {
      href: voltarPara,
      titulo: "Medição Inicial",
    },
    {
      href: voltarPara,
      titulo: "Acompanhamento de Lançamentos",
    },
  ];

  return (
    <Page
      botaoVoltar
      voltarPara={voltarPara}
      titulo={"Conferência dos Lançamentos"}
    >
      <Breadcrumb home={HOME} anteriores={anteriores} atual={atual} />
      <ConferenciaDosLancamentos />
    </Page>
  );
};
