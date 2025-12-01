import { act, render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { MeusDadosContext } from "src/context/MeusDadosContext";
import { mockMeusDadosCODAEADMIN } from "src/mocks/meusDados/CODAE/admin";
import * as cadastroTipoAlimentacaoService from "src/services/cadastroTipoAlimentacao.service";
import * as escolaService from "src/services/escola.service";
import * as loteService from "src/services/lote.service";
import { RecreioFeriasCadastrados } from "../RecreioFeriasCadastrados";

jest.mock("src/services/cadastroTipoAlimentacao.service");
jest.mock("src/services/escola.service");
jest.mock("src/services/lote.service");

const mockTiposUnidadeEscolar = {
  data: {
    results: [
      { uuid: "tipo-1", iniciais: "EMEF" },
      { uuid: "tipo-2", iniciais: "CEI DIRET" },
      { uuid: "tipo-3", iniciais: "EMEI" },
      { uuid: "tipo-4", iniciais: "CEMEI" },
      { uuid: "tipo-5", iniciais: "CEU CEMEI" },
    ],
  },
};

const mockLotes = [
  { uuid: "lote-1", nome: "DRE Butantã", dreUuid: "dre-1" },
  { uuid: "lote-2", nome: "DRE Centro", dreUuid: "dre-2" },
];

const mockEscolas = {
  status: 200,
  data: [
    { uuid: "escola-1", nome: "EMEF João Silva" },
    { uuid: "escola-2", nome: "EMEF Maria Santos" },
  ],
};

const mockTiposAlimentacao = {
  results: [
    {
      tipos_alimentacao: [
        { uuid: "alim-1", nome: "Lanche" },
        { uuid: "alim-2", nome: "Refeição" },
      ],
    },
  ],
};

const renderComponent = () =>
  act(async () => {
    render(
      <MemoryRouter
        future={{
          v7_startTransition: true,
          v7_relativeSplatPath: true,
        }}
      >
        <MeusDadosContext.Provider
          value={{
            meusDados: mockMeusDadosCODAEADMIN,
            setMeusDados: jest.fn(),
          }}
        >
          <RecreioFeriasCadastrados />
        </MeusDadosContext.Provider>
      </MemoryRouter>
    );
  });

describe("CadastroRecreioFerias - Fluxo de Interação do Usuário", () => {
  beforeEach(() => {
    jest.clearAllMocks();

    (
      cadastroTipoAlimentacaoService.getTiposUnidadeEscolar as jest.Mock
    ).mockResolvedValue(mockTiposUnidadeEscolar);

    (loteService.getLotesAsync as jest.Mock).mockImplementation(
      (setter: any) => {
        setter(mockLotes);
      }
    );

    (escolaService.getEscolasTercTotal as jest.Mock).mockResolvedValue(
      mockEscolas
    );

    (
      cadastroTipoAlimentacaoService.getVinculosTipoAlimentacaoPorTipoUnidadeEscolar as jest.Mock
    ).mockResolvedValue(mockTiposAlimentacao);
  });

  it("deve renderizar o componente corretamente", async () => {
    await renderComponent();

    expect(
      screen.getByText("Título do Recreio Cadastrado")
    ).toBeInTheDocument();
    expect(screen.getByText("Período de Realização")).toBeInTheDocument();
    expect(screen.getByText("Qtde. de Unidades")).toBeInTheDocument();
  });

  it("deve buscar e renderizar recreios retornados pelo serviço", async () => {
    const mockRecreios = [
      {
        id: "r1",
        uuid: "uuid-r1",
        titulo: "Recreio A",
        data_inicio: "01/01/2025",
        data_fim: "05/01/2025",
        unidades_participantes: [{ uuid: "u1" }, { uuid: "u2" }],
      },
      {
        id: "r2",
        uuid: "uuid-r2",
        titulo: "Recreio B",
        data_inicio: "10/01/2025",
        data_fim: "12/01/2025",
        unidades_participantes: [{ uuid: "u3" }],
      },
    ];

    const recreioService = await import(
      "../../../../../services/recreioFerias.service"
    );
    jest
      .spyOn(recreioService, "listarRecreioNasFerias")
      .mockResolvedValue({ data: { results: mockRecreios } });

    await renderComponent();

    expect(await screen.findByText("Recreio A")).toBeInTheDocument();
    expect(await screen.findByText("Recreio B")).toBeInTheDocument();

    expect(screen.getByText("01/01/2025 até 05/01/2025")).toBeInTheDocument();
    expect(screen.getByText("10/01/2025 até 12/01/2025")).toBeInTheDocument();
    expect(screen.getByText("2 UEs")).toBeInTheDocument();
    expect(screen.getByText("1 UE")).toBeInTheDocument();
  });

  it("mostra link de editar somente quando isPeriodoEditavel retorna true", async () => {
    const mockRecreios = [
      {
        id: "r1",
        uuid: "uuid-edit",
        titulo: "Editavel",
        data_inicio: "01/01/2026",
        data_fim: "02/01/2026",
        unidades_participantes: [{}],
      },
      {
        id: "r2",
        uuid: "uuid-noedit",
        titulo: "Nao Editavel",
        data_inicio: "01/01/2020",
        data_fim: "02/01/2020",
        unidades_participantes: [{}],
      },
    ];

    const recreioService = await import(
      "../../../../../services/recreioFerias.service"
    );
    jest
      .spyOn(recreioService, "listarRecreioNasFerias")
      .mockResolvedValue({ data: { results: mockRecreios } });

    const helper = await import("../helper");
    jest
      .spyOn(helper, "isPeriodoEditavel")
      .mockImplementation((start: string) => start.includes("2026"));

    await renderComponent();

    const links = screen.getAllByRole("link", { hidden: true });
    expect(
      links.some((l) => l.getAttribute("href")?.includes("uuid=uuid-edit"))
    ).toBe(true);

    const naoEditavelRow = screen.getByText("Nao Editavel").closest("tr");
    expect(naoEditavelRow?.querySelector(".esconder-icone")).toBeTruthy();
  });
});
