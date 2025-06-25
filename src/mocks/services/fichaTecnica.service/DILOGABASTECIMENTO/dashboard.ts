import { FichaTecnicaDashboard } from "src/interfaces/pre_recebimento.interface";

type IFichasTecnicasPorStatusDashboard = {
  results: Array<{
    status: string;
    dados: Array<FichaTecnicaDashboard>;
  }>;
};

export const mockDashboardDILOGABASTECIMENTO: IFichasTecnicasPorStatusDashboard =
  {
    results: [
      {
        status: "ENVIADA_PARA_ANALISE",
        dados: [
          {
            uuid: "d2b75164-7ec1-45be-a7ce-1bf99261d5f4",
            numero_ficha: "FT071",
            nome_produto: "BANANA NANICA",
            nome_empresa: "JP Alimentos",
            status: "Enviada para Análise",
            log_mais_recente: "10/04/2025 14:41",
          },
          {
            uuid: "07b9fcc4-a1ef-4a1b-865f-46aca6457fbf",
            numero_ficha: "FT070",
            nome_produto: "CARAMBOLA AMARELA",
            nome_empresa: "JP Alimentos",
            status: "Enviada para Análise",
            log_mais_recente: "09/04/2025",
          },
          {
            uuid: "e9ae1776-ab71-4501-a994-b5867fb70e0b",
            numero_ficha: "FT006",
            nome_produto: "BOLO INDIVIDUAL",
            nome_empresa: "JP Alimentos",
            status: "Enviada para Análise",
            log_mais_recente: "27/03/2025",
          },
          {
            uuid: "8f00b71c-42fa-40eb-b7ca-637fbf33345a",
            numero_ficha: "FT051",
            nome_produto: "TATUZINHO",
            nome_empresa: "JP Alimentos",
            status: "Enviada para Análise",
            log_mais_recente: "27/03/2025",
          },
          {
            uuid: "9a43d2e6-e755-489d-8039-f419efcfbde2",
            numero_ficha: "FT056",
            nome_produto: "BOLACHINHA DE NATA",
            nome_empresa: "JP Alimentos",
            status: "Enviada para Análise",
            log_mais_recente: "27/03/2025",
          },
          {
            uuid: "21484136-8512-48a5-ac15-f0b7ea4d81bb",
            numero_ficha: "FT007",
            nome_produto: "CALDO",
            nome_empresa: "JP Alimentos",
            status: "Enviada para Análise",
            log_mais_recente: "27/03/2025",
          },
        ],
      },
      {
        status: "APROVADA",
        dados: [
          {
            uuid: "02b3a5a5-6799-4d8e-bae0-80dc4b293f6e",
            numero_ficha: "FT069",
            nome_produto: "BANANA PRATA",
            nome_empresa: "JP Alimentos",
            status: "Aprovada",
            log_mais_recente: "27/03/2025",
          },
          {
            uuid: "0dd86db6-e6e7-4791-8f1b-23b68cf3bf5e",
            numero_ficha: "FT068",
            nome_produto: "BANANA PRATA",
            nome_empresa: "JP Alimentos",
            status: "Aprovada",
            log_mais_recente: "27/03/2025",
          },
          {
            uuid: "0447e774-e7b8-4666-84f3-30c6f53092dc",
            numero_ficha: "FT061",
            nome_produto: "POLPA DE TOMATE ORGANICO",
            nome_empresa: "Empresa do Luis Zimmermann",
            status: "Aprovada",
            log_mais_recente: "02/01/2025",
          },
          {
            uuid: "73a3d550-07db-4871-b496-058da527e14e",
            numero_ficha: "FT060",
            nome_produto: "BISCOITO SALGADO INTEGRAL",
            nome_empresa: "Empresa do Luis Zimmermann",
            status: "Aprovada",
            log_mais_recente: "20/08/2024",
          },
          {
            uuid: "b48bcc79-685e-4ed3-815c-90459f3d24c6",
            numero_ficha: "FT059",
            nome_produto: "SUCO DE LARANJA",
            nome_empresa: "Empresa do Luis Zimmermann",
            status: "Aprovada",
            log_mais_recente: "09/08/2024",
          },
          {
            uuid: "3964d2af-f8dd-44bc-8f44-1eb5dbad21c0",
            numero_ficha: "FT058",
            nome_produto: "ATUM",
            nome_empresa: "Empresa do Luis Zimmermann",
            status: "Aprovada",
            log_mais_recente: "31/07/2024",
          },
        ],
      },
      {
        status: "ENVIADA_PARA_CORRECAO",
        dados: [
          {
            uuid: "4393c796-fdad-4d7b-b637-d121bb9fc4cf",
            numero_ficha: "FT031",
            nome_produto: "SDDSDS",
            nome_empresa: "JP Alimentos",
            status: "Enviada para Correção",
            log_mais_recente: "31/03/2025",
          },
          {
            uuid: "f41680e1-36ad-4820-88bc-44848c1a5159",
            numero_ficha: "FT032",
            nome_produto: "FORMIGA",
            nome_empresa: "JP Alimentos",
            status: "Enviada para Correção",
            log_mais_recente: "31/03/2025",
          },
          {
            uuid: "1edec32e-f106-44ef-9e3a-a8c9712c8b9f",
            numero_ficha: "FT046",
            nome_produto: "ATUM",
            nome_empresa: "Empresa do Luis Zimmermann",
            status: "Enviada para Correção",
            log_mais_recente: "10/02/2025",
          },
        ],
      },
    ],
  };
