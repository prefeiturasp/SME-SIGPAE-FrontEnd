import { usuarioComAcessoAoCadastroDeCategorias } from "src/helpers/utilities";
import FaqPage from "src/pages/Faq/FaqPage";
import PaginaEdicaoCategoria from "src/pages/Faq/CadastroCategoria/Edicao";
import PaginaFormularioCategoria from "src/pages/Faq/CadastroCategoria/Formulario";
import PaginaListagemCategorias from "src/pages/Faq/CadastroCategoria/Listagem";
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
    component: PaginaFormularioCategoria,
    tipoUsuario: usuarioComAcessoAoCadastroDeCategorias(),
  },
  {
    path: `/${constants.AJUDA}/${constants.CADASTRO_CATEGORIA}/:uuid/${constants.EDITAR_CATEGORIA}`,
    component: PaginaEdicaoCategoria,
    tipoUsuario: usuarioComAcessoAoCadastroDeCategorias(),
  },
];
