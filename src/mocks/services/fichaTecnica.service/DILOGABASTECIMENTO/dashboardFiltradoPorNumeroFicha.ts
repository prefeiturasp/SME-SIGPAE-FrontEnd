import { FichaTecnicaDashboard } from "src/interfaces/pre_recebimento.interface";

type IFichasTecnicasPorStatusDashboard = {
  results: Array<{
    status: string;
    dados: Array<FichaTecnicaDashboard>;
  }>;
};

export const mockDashboardFiltradoDILOGABASTECIMENTO: IFichasTecnicasPorStatusDashboard =
  {
    results: [
      {
        status: "ENVIADA_PARA_ANALISE",
        dados: [
          {
            uuid: "07b9fcc4-a1ef-4a1b-865f-46aca6457fbf",
            numero_ficha: "FT070",
            nome_produto: "CARAMBOLA AMARELA",
            nome_empresa: "JP Alimentos",
            status: "Enviada para Análise",
            log_mais_recente: "09/04/2025",
          },
        ],
      },
      {
        status: "APROVADA",
        dados: [],
      },
      {
        status: "ENVIADA_PARA_CORRECAO",
        dados: [],
      },
    ],
  };
