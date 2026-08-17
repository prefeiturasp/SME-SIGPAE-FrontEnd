import { usuarioComAcessoAoCadastroDeCategorias } from "src/helpers/utilities";
import FaqPage from "src/pages/Faq/FaqPage";
import ListagemCategoriasPage from "src/pages/Faq/ListagemCategoriasPage";
import CadastroCategoriaPage from "src/pages/Faq/CadastroCategoriaPage";
import EdicaoCategoriaPage from "src/pages/Faq/EdicaoCategoriaPage";
import { ListagemDuvidasFrequentes } from "src/pages/Faq/DuvidasFrequentes/Listagem/ListagemDuvidasFrequentesPage";
import { CadastrarDuvidasFrequentes } from "src/pages/Faq/DuvidasFrequentes/Cadastro/CadastroDuvidasFrequentesPage";
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
    component: ListagemCategoriasPage,
    tipoUsuario: usuarioComAcessoAoCadastroDeCategorias(),
  },
  {
    path: `/${constants.AJUDA}/${constants.CADASTRO_CATEGORIA}/${constants.CADASTRAR_CATEGORIA}`,
    component: CadastroCategoriaPage,
    tipoUsuario: usuarioComAcessoAoCadastroDeCategorias(),
  },
  {
    path: `/${constants.AJUDA}/${constants.CADASTRO_CATEGORIA}/:uuid/${constants.EDITAR_CATEGORIA}`,
    component: EdicaoCategoriaPage,
    tipoUsuario: usuarioComAcessoAoCadastroDeCategorias(),
  },
  {
    path: `/${constants.AJUDA}/${constants.CADASTRO_DUVIDAS_FREQUENTES}`,
    component: ListagemDuvidasFrequentes,
    tipoUsuario: usuarioComAcessoAoCadastroDeCategorias(),
  },
  {
    path: `/${constants.AJUDA}/${constants.CADASTRO_DUVIDAS_FREQUENTES}/${constants.CADASTRO_DUVIDAS_FREQUENTES}`,
    component: CadastrarDuvidasFrequentes,
    tipoUsuario: usuarioComAcessoAoCadastroDeCategorias(),
  },
];
