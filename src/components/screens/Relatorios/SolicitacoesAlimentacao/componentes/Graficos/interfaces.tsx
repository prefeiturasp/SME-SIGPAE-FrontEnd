import { ChartData } from "src/components/Shareable/Graficos/interfaces";
import { ResponseInterface } from "src/interfaces/responses.interface";

export interface ResponseDatasetsGraficos extends ResponseInterface {
  data: Array<ChartData>;
}
