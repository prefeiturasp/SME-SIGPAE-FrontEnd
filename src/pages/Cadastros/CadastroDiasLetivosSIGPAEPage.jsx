import Breadcrumb from "src/components/Shareable/Breadcrumb";
import Page from "src/components/Shareable/Page/Page";
import { CADASTROS, CONFIGURACOES, DIAS_LETIVOS } from "src/configs/constants";
import { DiasLetivosSIGPAE } from "src/components/screens/Cadastros/DiasLetivosSIGPAE";

const atual = {
  href: `/${CONFIGURACOES}/${CADASTROS}/${DIAS_LETIVOS}`,
  titulo: "Dias Letivos",
};

const anteriores = [
  {
    href: `/${CONFIGURACOES}/${CADASTROS}`,
    titulo: "Cadastros",
  },
];

export const CadastroDiasLetivosPage = () => {
  return (
    <Page titulo={atual.titulo} botaoVoltar>
      <Breadcrumb home={"/"} anteriores={anteriores} atual={atual} />
      <DiasLetivosSIGPAE />
    </Page>
  );
};
