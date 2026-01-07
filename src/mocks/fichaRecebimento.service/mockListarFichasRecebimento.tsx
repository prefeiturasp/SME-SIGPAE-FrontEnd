import { FichaDeRecebimentoItemListagem } from "../../components/screens/Recebimento/FichaRecebimento/interfaces";

export const mockFichas: FichaDeRecebimentoItemListagem[] = [
  {
    uuid: "1",
    numero_cronograma: "CRONO-001",
    nome_produto: "Produto Teste 1 com nome muito longo que deve ser truncado",
    fornecedor: "Fornecedor Teste com nome muito longo que deve ser truncado",
    pregao_chamada_publica: "PC-001",
    data_recebimento: "2023-10-01",
    status: "Assinado CODAE",
    programa_leve_leite: true,
  },
  {
    uuid: "2",
    numero_cronograma: "CRONO-002",
    nome_produto: "Produto Teste 2",
    fornecedor: "Fornecedor Teste 2",
    pregao_chamada_publica: "PC-002",
    data_recebimento: "2023-10-02",
    status: "Rascunho",
    programa_leve_leite: false,
  },
];
