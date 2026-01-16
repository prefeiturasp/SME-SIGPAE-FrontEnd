import {
  usuarioEhRecebimento,
  usuarioEhCodaeDilog,
  usuarioEhCronograma,
  usuarioEhDilogAbastecimento,
  usuarioEhDilogDiretoria,
} from "src/helpers/utilities";

import CadastroFichaRecebimentoPage from "src/pages/Recebimento/FichaRecebimento/CadastroFichaRecebimentoPage";
import DetalharFichaRecebimentoPage from "src/pages/Recebimento/FichaRecebimento/DetalharFichaRecebimentoPage";
import EditarFichaRecebimentoPage from "src/pages/Recebimento/FichaRecebimento/EditarFichaRecebimentoPage";
import FichaRecebimentoPage from "src/pages/Recebimento/FichaRecebimento/FichaRecebimentoPage";
import AtribuirQuestoesPage from "src/pages/Recebimento/QuestoesPorProduto/AtribuirQuestoesPage";
import CopiarAtribuicaoQuestoesPage from "src/pages/Recebimento/QuestoesPorProduto/CopiarAtribuicaoQuestoesPage";
import EditarAtribuicaoQuestoesPage from "src/pages/Recebimento/QuestoesPorProduto/EditarAtribuicaoQuestoesPage";
import QuestoesPorProdutoPage from "src/pages/Recebimento/QuestoesPorProduto/QuestoesPorProdutoPage";

import * as constants from "../../constants";
import { RotaInterface } from "../interfaces";

export const rotasRecebimento: Array<RotaInterface> = [
  {
    path: `/${constants.RECEBIMENTO}/${constants.QUESTOES_POR_PRODUTO}`,
    component: QuestoesPorProdutoPage,
    tipoUsuario: usuarioEhRecebimento(),
  },
  {
    path: `/${constants.RECEBIMENTO}/${constants.ATRIBUIR_QUESTOES_CONFERENCIA}`,
    component: AtribuirQuestoesPage,
    tipoUsuario: usuarioEhRecebimento(),
  },
  {
    path: `/${constants.RECEBIMENTO}/${constants.EDITAR_ATRIBUICAO_QUESTOES_CONFERENCIA}`,
    component: EditarAtribuicaoQuestoesPage,
    tipoUsuario: usuarioEhRecebimento(),
  },
  {
    path: `/${constants.RECEBIMENTO}/${constants.COPIAR_ATRIBUICAO_QUESTOES_CONFERENCIA}`,
    component: CopiarAtribuicaoQuestoesPage,
    tipoUsuario: usuarioEhRecebimento(),
  },
  {
    path: `/${constants.RECEBIMENTO}/${constants.FICHA_RECEBIMENTO}`,
    component: FichaRecebimentoPage,
    tipoUsuario:
      usuarioEhRecebimento() ||
      usuarioEhCronograma() ||
      usuarioEhDilogAbastecimento() ||
      usuarioEhCodaeDilog() ||
      usuarioEhDilogDiretoria(),
  },
  {
    path: `/${constants.RECEBIMENTO}/${constants.CADASTRO_FICHA_RECEBIMENTO}`,
    component: CadastroFichaRecebimentoPage,
    tipoUsuario: usuarioEhRecebimento(),
  },
  {
    path: `/${constants.RECEBIMENTO}/${constants.EDITAR_FICHA_RECEBIMENTO}`,
    component: EditarFichaRecebimentoPage,
    tipoUsuario: usuarioEhRecebimento(),
  },
  {
    path: `/${constants.RECEBIMENTO}/${constants.DETALHAR_FICHA_RECEBIMENTO}`,
    component: DetalharFichaRecebimentoPage,
    tipoUsuario:
      usuarioEhRecebimento() ||
      usuarioEhCronograma() ||
      usuarioEhDilogAbastecimento() ||
      usuarioEhCodaeDilog() ||
      usuarioEhDilogDiretoria(),
  },
];
