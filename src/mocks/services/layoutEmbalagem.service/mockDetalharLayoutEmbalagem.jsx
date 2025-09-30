export const mockLayoutEmbalagemReprovado = {
  uuid: "mock-uuid-123",
  numero_ficha_tecnica: "12345",
  nome_produto: "Produto Teste",
  pregao_chamada_publica: "Pregão 001/2024",
  observacoes: "Observações iniciais",
  logs: [
    {
      status: "CRIADO",
      data: "2024-01-01",
      usuario: "Usuário Teste",
    },
  ],
  tipos_de_embalagens: [
    {
      uuid: "primaria-uuid",
      tipo_embalagem: "PRIMARIA",
      status: "REPROVADO",
      complemento_do_status: "Correções necessárias na embalagem primária",
      imagens: [
        {
          nome: "primaria-antiga.jpg",
          arquivo: "/api/arquivos/primaria.jpg/",
        },
      ],
    },
    {
      uuid: "secundaria-uuid",
      tipo_embalagem: "SECUNDARIA",
      status: "REPROVADO",
      complemento_do_status: "Correções necessárias na embalagem secundária",
      imagens: [
        {
          nome: "secundaria-antiga.pdf",
          arquivo: "/api/arquivos/secundaria.pdf/",
        },
      ],
    },
  ],
  log_mais_recente: "01/01/2024 10:00:00",
};

export const mockLayoutEmbalagemAprovado = {
  ...mockLayoutEmbalagemReprovado,
  tipos_de_embalagens: [
    {
      uuid: "primaria-uuid",
      tipo_embalagem: "PRIMARIA",
      status: "APROVADO",
      complemento_do_status: "2024-01-01 10:00:00|Usuário Aprovador",
      imagens: [
        {
          nome: "primaria-aprovada.jpg",
          arquivo: "/api/arquivos/primaria.jpg/",
        },
      ],
    },
    {
      uuid: "secundaria-uuid",
      tipo_embalagem: "SECUNDARIA",
      status: "APROVADO",
      complemento_do_status: "2024-01-01 10:00:00|Usuário Aprovador",
      imagens: [
        {
          nome: "secundaria-aprovada.pdf",
          arquivo: "/api/arquivos/secundaria.pdf/",
        },
      ],
    },
  ],
};

export const mockLayoutComTerciaria = {
  ...mockLayoutEmbalagemReprovado,
  tipos_de_embalagens: [
    ...mockLayoutEmbalagemReprovado.tipos_de_embalagens,
    {
      uuid: "terciaria-uuid",
      tipo_embalagem: "TERCIARIA",
      status: "REPROVADO",
      complemento_do_status: "Correções necessárias na embalagem terciária",
      imagens: [
        {
          nome: "terciaria-antiga.jpg",
          arquivo: "/api/arquivos/terciaria.jpg",
        },
      ],
    },
  ],
};
