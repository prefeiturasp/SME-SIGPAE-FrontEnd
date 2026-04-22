import { CronogramaMensalSimples } from "src/interfaces/cronograma_semanal.interface";

export const mockCronogramasMensalAssinados: CronogramaMensalSimples[] = [
  {
    uuid: "cronograma-uuid-1",
    numero: "CR-001/2024",
    produto_nome: "Alface Crespa",
    fornecedor_nome: "Hortifruti São Paulo",
    numero_contrato: "0001/2024",
  },
  {
    uuid: "cronograma-uuid-2",
    numero: "CR-002/2024",
    produto_nome: "Tomate Italiano",
    fornecedor_nome: "Hortifruti Minas Gerais",
    numero_contrato: "0002/2024",
  },
  {
    uuid: "cronograma-uuid-3",
    numero: "CR-003/2024",
    produto_nome: "Cenoura",
    fornecedor_nome: "Hortifruti São Paulo",
    numero_contrato: "0001/2024",
  },
];

export const mockGetCronogramasMensalAssinados2 = [
  {
    uuid: "e10b7e33-7763-42da-8071-d9a06ec04849",
    numero: "001/2026P",
    produto_nome: "DOCE DE BANANA",
    fornecedor_nome: "JP Alimentos",
    numero_contrato: "837834",
  },
];
