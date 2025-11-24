import Breadcrumb from "src/components/Shareable/Breadcrumb";
import Page from "src/components/Shareable/Page/Page";
import {
  CADASTROS,
  CONFIGURACOES,
  RECREIO_NAS_FERIAS,
} from "src/configs/constants";
import { EdicaoRecreioFerias } from "../../components/screens/Cadastros/RecreioFerias/EdicaoRecreioFerias";

const atual = {
  href: `/${CONFIGURACOES}/${CADASTROS}/${RECREIO_NAS_FERIAS}/editar`,
  titulo: "Editar Cadastro Recreio nas Férias",
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
      <EdicaoRecreioFerias />
    </Page>
  );
};

export default RecreioFeriasPage;
