import { useSearchParams } from "react-router-dom";

import {
  EDITAR_PARAMETRIZACAO_FINANCEIRA,
  PARAMETRIZACAO_FINANCEIRA,
  MEDICAO_INICIAL,
} from "../../../configs/constants";

import Breadcrumb from "../../../components/Shareable/Breadcrumb";
import Page from "../../../components/Shareable/Page/Page";

import AdicionarParametrizacaoFinanceira from "src/components/screens/LancamentoInicial/ParametrizacaoFinanceira/AdicionarParametrizacaoFinanceira";

export const EditarParametrizacaoFinanceiraPage = () => {
  const [searchParams] = useSearchParams();

  const criandoCopia = !!searchParams.get("uuid_origem");

  const titulo = criandoCopia
    ? "Cópia da Parametrização Financeira"
    : "Editar Parametrização Financeira";

  const atual = {
    href: `/${MEDICAO_INICIAL}/${PARAMETRIZACAO_FINANCEIRA}/${EDITAR_PARAMETRIZACAO_FINANCEIRA}`,
    titulo: criandoCopia ? "Cópia da Parametrização" : "Editar Parametrização",
  };

  const anterior = [
    { href: "#", titulo: "Medição Inicial" },
    { href: "#", titulo: "Cadastros" },
    {
      href: `/${MEDICAO_INICIAL}/${PARAMETRIZACAO_FINANCEIRA}/`,
      titulo: "Parametrização Financeira",
    },
  ];

  return (
    <Page
      titulo={titulo}
      botaoVoltar
      voltarPara={`/${MEDICAO_INICIAL}/${PARAMETRIZACAO_FINANCEIRA}/`}
    >
      <Breadcrumb home={"/"} anteriores={anterior} atual={atual} />
      <AdicionarParametrizacaoFinanceira />
    </Page>
  );
};
