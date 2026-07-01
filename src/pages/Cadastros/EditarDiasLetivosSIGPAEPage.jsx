import { EditarDiasLetivosSIGPAE } from "src/components/screens/Cadastros/DiasLetivosSIGPAE/Editar";
import Breadcrumb from "src/components/Shareable/Breadcrumb";
import Page from "src/components/Shareable/Page/Page";
import { CADASTROS, CONFIGURACOES, DIAS_LETIVOS } from "src/configs/constants";

const atual = {
  href: `/${CONFIGURACOES}/${CADASTROS}/${DIAS_LETIVOS}/editar`,
  titulo: "Cadastrar Dias Letivos",
};

const anteriores = [
  {
    href: `/${CONFIGURACOES}/${CADASTROS}`,
    titulo: "Cadastros",
  },
  {
    href: `/${CONFIGURACOES}/${CADASTROS}/${DIAS_LETIVOS}`,
    titulo: "Dias Letivos",
  },
];

export const EditarDiasLetivosPage = () => {
  return (
    <Page titulo={atual.titulo} botaoVoltar>
      <Breadcrumb home={"/"} anteriores={anteriores} atual={atual} />
      <EditarDiasLetivosSIGPAE />
    </Page>
  );
};
