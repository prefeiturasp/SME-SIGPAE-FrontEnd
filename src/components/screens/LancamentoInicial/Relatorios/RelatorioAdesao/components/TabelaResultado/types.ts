import {
  RelatorioAdesaoEscola,
  RelatorioAdesaoResponse,
} from "src/services/medicaoInicial/relatorio.interface";

import { IFiltros, IResultadoIndividual } from "../../types";

export type Props = {
  params: IFiltros;
  filtros: IFiltros;
  resultado: RelatorioAdesaoResponse;
  escola?: RelatorioAdesaoEscola | null;
  resultadoIndividual?: IResultadoIndividual | null;
  exibirTitulo: boolean;
};
