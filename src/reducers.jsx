import { combineReducers } from "redux";
import { reducer as formReducer } from "redux-form";
import avaliarReclamacaoProdutoReducer from "./reducers/avaliarReclamacaoProduto";
import buscaAvancadaProdutoReducer from "./reducers/buscaAvancadaProduto";
import dietasAtivasInativasPorAlunoReducer from "./reducers/dietasAtivasInativasPorAlunoReducer";
import { filtersAlimentacaoReducer } from "./reducers/filtersAlimentacaoReducer";
import { filtersDietaReducer } from "./reducers/filtersDietaReducer";
import { filtersProdutoReducer } from "./reducers/filtersProdutoReducer";
import finalFormReducer from "./reducers/finalForm";
import incluirDietaEspecialReducer from "./reducers/incluirDietaEspecialReducer";
import kitLancheReducer from "./reducers/kitLanche.reducer";
import loadFiltroBusca from "./reducers/loadFiltroBusca";
import loteReducer from "./reducers/lote.reducer";
import loadProduto from "./reducers/produto.reducer";
import { produtoReducer } from "./reducers/produtoReducer";
import reclamacaoProdutoReducer from "./reducers/reclamacaoProduto";
import responderAnaliseSensorialReducer from "./reducers/responderAnaliseSensorial";
import responderReclamacaoProdutoReducer from "./reducers/responderReclamacaoProduto";
import suspensaoDeAlimentacaoReducer from "./reducers/suspensaoDeAlimentacaoReducer";
import loadTipoAlimentacao from "./reducers/tipoAlimentacaoReducer";

// Junta todos os reducers do sistema! Vai pra store
const rootReducer = combineReducers({
  form: formReducer,
  loteForm: loteReducer,
  suspensaoDeAlimentacao: suspensaoDeAlimentacaoReducer,
  TipoDeAlimentacaoForm: loadTipoAlimentacao,
  FiltrosDeBuscaForm: loadFiltroBusca,
  kitLanche: kitLancheReducer,
  cadastroProduto: loadProduto,
  produtos: produtoReducer,
  finalForm: finalFormReducer,
  avaliarReclamacaoProduto: avaliarReclamacaoProdutoReducer,
  reclamacaoProduto: reclamacaoProdutoReducer,
  responderAnaliseSensorial: responderAnaliseSensorialReducer,
  buscaAvancadaProduto: buscaAvancadaProdutoReducer,
  responderReclamacaoProduto: responderReclamacaoProdutoReducer,
  incluirDietaEspecial: incluirDietaEspecialReducer,
  dietasAtivasInativasPorAluno: dietasAtivasInativasPorAlunoReducer,
  filtersDieta: filtersDietaReducer,
  filtersProduto: filtersProdutoReducer,
  filtersAlimentacao: filtersAlimentacaoReducer,
});

export default rootReducer;
