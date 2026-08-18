import {
  RelatorioAdesaoEscola,
  RelatorioAdesaoResponse,
} from "src/services/medicaoInicial/relatorio.interface";

import { Filtros } from "../../types";

export type Props = {
  params: Filtros;
  filtros: Filtros;
  resultado: RelatorioAdesaoResponse;
  escola?: RelatorioAdesaoEscola | null;
  exibirTitulo: boolean;
};
