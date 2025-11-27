import Breadcrumb from "src/components/Shareable/Breadcrumb";
import Page from "src/components/Shareable/Page/Page";
import {
  CADASTROS,
  CONFIGURACOES,
  RECREIO_NAS_FERIAS,
} from "src/configs/constants";
import { CadastroRecreioFerias } from "../../components/screens/Cadastros/RecreioFerias/CadastroRecreioFerias";

const atual = {
  href: `/${CONFIGURACOES}/${CADASTROS}/${RECREIO_NAS_FERIAS}`,
  titulo: "Cadastrar Recreio nas Férias",
};

const anteriores = [
  {
    href: `/${CONFIGURACOES}/${CADASTROS}`,
    titulo: "Cadastros",
  },
];

export const RecreioFeriasPage = () => {
  return (
    <Page titulo={atual.titulo} botaoVoltar>
      <Breadcrumb home={"/"} anteriores={anteriores} atual={atual} />
      <CadastroRecreioFerias />
    </Page>
  );
};

export default RecreioFeriasPage;
