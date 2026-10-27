import {
  act,
  fireEvent,
  render,
  screen,
  waitFor,
} from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import * as escolaAbertaService from "../escolaAberta.service";
import { EscolaAbertaCadastradas } from "../EscolaAbertaCadastradas";

jest.mock("../escolaAberta.service", () => ({
  listarEscolaAberta: jest.fn(),
}));

const mockLista = [
  {
    uuid: "ea-1",
    data_inicial: "13/10/2099",
    data_final: "23/10/2099",
    dias_semana: ["6", "0"],
    unidades_participantes: [
      {
        uuid: "u-1",
        lote_nome: "3567-1 - IP",
        unidade_educacional: "escola-1",
        unidade_educacional_nome: "EMEF João Silva",
        num_participantes: 12,
        tipos_alimentacao: [{ uuid: "a-1", nome: "Lanche" }],
      },
      {
        uuid: "u-2",
        lote_nome: "3567-1 - IP",
        unidade_educacional: "escola-2",
        unidade_educacional_nome: "EMEF Maria Santos",
        num_participantes: 8,
        tipos_alimentacao: [{ uuid: "a-1", nome: "Lanche" }],
      },
    ],
  },
  {
    uuid: "ea-2",
    data_inicial: "11/11/1911",
    data_final: "11/11/1911",
    dias_semana: ["4"],
    unidades_participantes: [
      {
        uuid: "u-3",
        lote_nome: "1234-5 - BT",
        unidade_educacional: "escola-3",
        unidade_educacional_nome: "EMEF Pedro Alves",
        num_participantes: 5,
        tipos_alimentacao: [{ uuid: "a-1", nome: "Lanche" }],
      },
    ],
  },
];

const renderComponent = async () => {
  await act(async () => {
    render(
      <MemoryRouter
        future={{ v7_startTransition: true, v7_relativeSplatPath: true }}
      >
        <EscolaAbertaCadastradas />
        <ToastContainer />
      </MemoryRouter>,
    );
  });
};

describe("EscolaAbertaCadastradas", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (escolaAbertaService.listarEscolaAberta as jest.Mock).mockResolvedValue({
      data: { results: mockLista },
    });
  });

  it("deve listar os cadastros com período e quantidade de UEs", async () => {
    await renderComponent();

    expect(
      await screen.findByText("13/10/2099 até 23/10/2099"),
    ).toBeInTheDocument();
    expect(screen.getByText("11/11/1911 até 11/11/1911")).toBeInTheDocument();
    expect(screen.getByText("2 UEs")).toBeInTheDocument();
    expect(screen.getByText("1 UE")).toBeInTheDocument();
  });

  it("deve exibir os dias da semana por extenso, com Segunda = 0", async () => {
    await renderComponent();

    expect(
      await screen.findByText("Segunda-feira, Domingo"),
    ).toBeInTheDocument();
    expect(screen.getByText("Sexta-feira")).toBeInTheDocument();
  });

  it("deve filtrar pela pesquisa de dia da semana", async () => {
    await renderComponent();
    await screen.findByText("13/10/2099 até 23/10/2099");

    fireEvent.change(screen.getByPlaceholderText("Pesquisar"), {
      target: { value: "sexta" },
    });

    await waitFor(() => {
      expect(
        screen.queryByText("13/10/2099 até 23/10/2099"),
      ).not.toBeInTheDocument();
    });
    expect(screen.getByText("11/11/1911 até 11/11/1911")).toBeInTheDocument();
  });

  it("deve filtrar pela quantidade de unidades", async () => {
    await renderComponent();
    await screen.findByText("13/10/2099 até 23/10/2099");

    fireEvent.change(screen.getByPlaceholderText("Pesquisar"), {
      target: { value: "2" },
    });

    await waitFor(() => {
      expect(
        screen.queryByText("11/11/1911 até 11/11/1911"),
      ).not.toBeInTheDocument();
    });
    expect(screen.getByText("13/10/2099 até 23/10/2099")).toBeInTheDocument();
  });

  it("deve expandir e mostrar o lote com a DRE e as unidades", async () => {
    await renderComponent();
    await screen.findByText("13/10/2099 até 23/10/2099");

    fireEvent.click(screen.getByTestId("toggle-ea-1"));

    expect(await screen.findByText("EMEF João Silva")).toBeInTheDocument();
    expect(screen.getByText("EMEF Maria Santos")).toBeInTheDocument();
    expect(screen.getAllByText("3567-1 - IP")).toHaveLength(2);
  });

  it("deve mostrar o link de edição só para período editável", async () => {
    await renderComponent();
    await screen.findByText("13/10/2099 até 23/10/2099");

    const links = document.querySelectorAll("a.botao-editar");
    expect(links).toHaveLength(1);
    expect(links[0].getAttribute("href")).toContain("/ea-1");
  });

  it("deve exibir erro quando a listagem falhar", async () => {
    (escolaAbertaService.listarEscolaAberta as jest.Mock).mockRejectedValue(
      new Error("falha"),
    );

    await renderComponent();

    expect(
      await screen.findByText("Erro ao listar Escola Aberta."),
    ).toBeInTheDocument();
  });
});
