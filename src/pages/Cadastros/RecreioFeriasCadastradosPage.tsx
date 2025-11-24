import Breadcrumb from "src/components/Shareable/Breadcrumb";
import Page from "src/components/Shareable/Page/Page";
import {
  CADASTROS,
  CONFIGURACOES,
  RECREIO_NAS_FERIAS,
  RECREIO_NAS_FERIAS_CADASTRADOS,
} from "src/configs/constants";
import { RecreioFeriasCadastrados } from "../../components/screens/Cadastros/RecreioFerias/RecreioFeriasCadastrados";

const atual = {
  href: `/${CONFIGURACOES}/${CADASTROS}/${RECREIO_NAS_FERIAS_CADASTRADOS}`,
  titulo: "Recreios Cadastrados",
};

const anteriores = [
  {
    href: `/${CONFIGURACOES}/${CADASTROS}`,
    titulo: "Cadastros",
  },
  {
    href: `/${CONFIGURACOES}/${CADASTROS}/${RECREIO_NAS_FERIAS}`,
    titulo: "Cadastrar Recreio nas Férias",
  },
];

export const RecreioFeriasPage = () => {
  return (
    <Page titulo={atual.titulo} botaoVoltar>
      <Breadcrumb home={"/"} anteriores={anteriores} atual={atual} />
      <RecreioFeriasCadastrados />
    </Page>
  );
};

export default RecreioFeriasPage;
