export const mockDetalharLayoutEmbalagem = {
  uuid: "18143fe7-b9dd-4bb6-8c82-92337ced7b9c",
  observacoes: "",
  criado_em: "19/09/2025 16:05:34",
  status: "Solicitado Correção",
  tipos_de_embalagens: [
    {
      imagens: [
        {
          arquivo:
            "http://localhost:8000/media/layouts_de_embalagens/a4e26aab-d35a-43ac-af1d-af3ae866984e.pdf",
          nome: "relatorio_historico_dietas_especiais_17_04_2025 (1).pdf",
        },
      ],
      uuid: "e9a46aaf-2a3b-46bb-90e4-ef3863acefc1",
      tipo_embalagem: "PRIMARIA",
      status: "REPROVADO",
      complemento_do_status: "Teste 1",
    },
    {
      imagens: [
        {
          arquivo:
            "http://localhost:8000/media/layouts_de_embalagens/49023fda-3280-4bd8-ab04-569a3afa36bf.pdf",
          nome: "relatorio_historico_dietas_especiais_12_02_2024 (57).pdf",
        },
      ],
      uuid: "c2df974f-dc3b-4c56-bda6-f26a2eb49733",
      tipo_embalagem: "SECUNDARIA",
      status: "REPROVADO",
      complemento_do_status: "Teste 2",
    },
    null,
  ],
  numero_ficha_tecnica: "FT023",
  pregao_chamada_publica: "7625364",
  nome_produto: "BOLACHINHA DE NATA",
  nome_empresa: "JP Alimentos / JP Alimentos LTDA",
  log_mais_recente: "19/09/2025 - 16:06",
  primeira_analise: true,
  logs: [
    {
      status_evento_explicacao: "Enviado para Análise",
      usuario: {
        uuid: "9f34bc68-ae58-41b1-a605-189824c9f7ef",
        nome: "FORNECEDOR ADMIN",
      },
      criado_em: "19/09/2025 16:05:35",
      justificativa: "",
    },
    {
      status_evento_explicacao: "Solicitado Correção",
      usuario: {
        uuid: "9878774c-6264-47db-991c-ca30591138e1",
        nome: "QUALIDADE",
      },
      criado_em: "19/09/2025 16:06:53",
      justificativa: "",
    },
  ],
};

export const mockDetalharLayoutEmbalagemSemSecundaria = {
  uuid: "18143fe7-b9dd-4bb6-8c82-92337ced7b9c",
  observacoes: "",
  criado_em: "19/09/2025 16:05:34",
  status: "Solicitado Correção",
  tipos_de_embalagens: [
    {
      imagens: [
        {
          arquivo:
            "http://localhost:8000/media/layouts_de_embalagens/a4e26aab-d35a-43ac-af1d-af3ae866984e.pdf",
          nome: "relatorio_historico_dietas_especiais_17_04_2025 (1).pdf",
        },
      ],
      uuid: "e9a46aaf-2a3b-46bb-90e4-ef3863acefc1",
      tipo_embalagem: "PRIMARIA",
      status: "REPROVADO",
      complemento_do_status: "Teste 1",
    },
    null,
    null,
  ],
  numero_ficha_tecnica: "FT023",
  pregao_chamada_publica: "7625364",
  nome_produto: "BOLACHINHA DE NATA",
  nome_empresa: "JP Alimentos / JP Alimentos LTDA",
  log_mais_recente: "19/09/2025 - 16:06",
  primeira_analise: true,
  logs: [
    {
      status_evento_explicacao: "Enviado para Análise",
      usuario: {
        uuid: "9f34bc68-ae58-41b1-a605-189824c9f7ef",
        nome: "FORNECEDOR ADMIN",
      },
      criado_em: "19/09/2025 16:05:35",
      justificativa: "",
    },
    {
      status_evento_explicacao: "Solicitado Correção",
      usuario: {
        uuid: "9878774c-6264-47db-991c-ca30591138e1",
        nome: "QUALIDADE",
      },
      criado_em: "19/09/2025 16:06:53",
      justificativa: "",
    },
  ],
};
