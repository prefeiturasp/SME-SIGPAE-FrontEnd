import { mockRelatorioAdesao10a20Dezenbro2023 } from "./relatorioAdesao10a20";

export const mockRelatorioAdesaoPaginado10a20Dezenbro2023 = {
  next: null,
  previous: null,
  count: 2,
  page_size: 1,
  results: [
    {
      escola: {
        nome: "EMEF PRESTES MAIA",
        codigo_eol: "015423",
      },
      resultados: mockRelatorioAdesao10a20Dezenbro2023,
    },
    {
      escola: {
        nome: "EMEF PERICLES EUGENIO DA SILVA RAMOS",
        codigo_eol: "017981",
      },
      resultados: {},
    },
  ],
};

export const mockRelatorioAdesaoPaginadoPorPagina = {
  1: {
    next: "?page=2",
    previous: null,
    count: 2,
    page_size: 1,
    results: [
      {
        escola: {
          nome: "EMEF PRESTES MAIA",
          codigo_eol: "015423",
        },
        resultados: mockRelatorioAdesao10a20Dezenbro2023,
      },
    ],
  },
  2: {
    next: null,
    previous: "?page=1",
    count: 2,
    page_size: 1,
    results: [
      {
        escola: {
          nome: "EMEF PERICLES EUGENIO DA SILVA RAMOS",
          codigo_eol: "017981",
        },
        resultados: {},
      },
    ],
  },
};
