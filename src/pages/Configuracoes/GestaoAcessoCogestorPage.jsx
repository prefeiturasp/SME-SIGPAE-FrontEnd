import GestaoAcesso from "src/components/screens/Configuracoes/GestaoAcesso";
import Breadcrumb from "src/components/Shareable/Breadcrumb";
import Page from "src/components/Shareable/Page/Page";
import { CONFIGURACOES, GESTAO_ACESSO_COGESTOR } from "src/configs/constants";
import { HOME } from "src/constants/config";

const atual = {
  href: `/${CONFIGURACOES}/${GESTAO_ACESSO_COGESTOR}`,
  titulo: "Gestão de Acesso",
};

const anteriores = [
  {
    href: `/`,
    titulo: "Configurações",
  },
  {
    href: `/`,
    titulo: "Gestão de Usuários",
  },
];

export const GestaoAcessoCogestorPage = () => (
  <Page botaoVoltar voltarPara="/" titulo={atual.titulo}>
    <Breadcrumb home={HOME} atual={atual} anteriores={anteriores} />
    <GestaoAcesso cogestor />
  </Page>
);
