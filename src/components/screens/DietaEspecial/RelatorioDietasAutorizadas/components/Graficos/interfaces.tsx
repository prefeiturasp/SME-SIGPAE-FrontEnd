import { ChartData } from "src/components/Shareable/Graficos/interfaces";
import { ResponseInterface } from "interfaces/responses.interface";

export interface ResponseDatasetsGraficos extends ResponseInterface {
  data: Array<ChartData>;
}

export interface NomeUuid {
  nome: string;
  uuid: string;
}

export interface NomeId {
  nome: string;
  id: string;
}
