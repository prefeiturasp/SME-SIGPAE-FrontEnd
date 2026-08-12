import { usuarioComAcessoAoCadastroDeCategorias } from "src/helpers/utilities";
import FaqPage from "src/pages/Faq/FaqPage";
import PaginaListagemCategorias from "src/components/screens/Faq/CadastroCategoria/Listagem";
import PaginaEdicaoCategoria from "src/components/screens/Faq/CadastroCategoria/Edicao";
import PaginaCadastroCategoria from "src/components/screens/Faq/CadastroCategoria/Formulario";
import * as constants from "../../constants";
import { RotaInterface } from "../interfaces";

export const rotasFaq: Array<RotaInterface> = [
  {
    path: `/${constants.AJUDA}`,
    component: FaqPage,
    tipoUsuario: constants.QUALQUER_USUARIO,
  },
  {
    path: `/${constants.AJUDA}/${constants.CADASTRO_CATEGORIA}`,
    component: PaginaListagemCategorias,
    tipoUsuario: usuarioComAcessoAoCadastroDeCategorias(),
  },
  {
    path: `/${constants.AJUDA}/${constants.CADASTRO_CATEGORIA}/${constants.CADASTRAR_CATEGORIA}`,
    component: PaginaCadastroCategoria,
    tipoUsuario: usuarioComAcessoAoCadastroDeCategorias(),
  },
  {
    path: `/${constants.AJUDA}/${constants.CADASTRO_CATEGORIA}/:uuid/${constants.EDITAR_CATEGORIA}`,
    component: PaginaEdicaoCategoria,
    tipoUsuario: usuarioComAcessoAoCadastroDeCategorias(),
  },
];
