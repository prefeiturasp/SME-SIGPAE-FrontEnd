import {
  act,
  fireEvent,
  render,
  screen,
  waitFor,
} from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import { MeusDadosContext } from "src/context/MeusDadosContext";
import { mockMeusDadosCODAEADMIN } from "src/mocks/meusDados/CODAE/admin";
import * as cadastroTipoAlimentacaoService from "src/services/cadastroTipoAlimentacao.service";
import * as escolaService from "src/services/escola.service";
import * as loteService from "src/services/lote.service";
import { CadastrarEscolaAberta } from "../CadastrarEscolaAberta";
import * as escolaAbertaService from "../escolaAberta.service";

jest.mock("src/services/cadastroTipoAlimentacao.service");
jest.mock("src/services/escola.service");
jest.mock("src/services/lote.service");
jest.mock("../escolaAberta.service", () => ({
  cadastrarEscolaAberta: jest.fn().mockResolvedValue({ status: 201 }),
}));

const mockNavigate = jest.fn();
jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: () => mockNavigate,
}));

jest.mock("../escolaAberta.service", () => ({
  cadastrarEscolaAberta: jest.fn().mockResolvedValue({ status: 201 }),
  atualizarEscolaAberta: jest.fn().mockResolvedValue({ status: 200 }),
  getEscolaAberta: jest.fn(),
}));

const mockTiposUnidadeEscolar = {
  data: {
    results: [
      { uuid: "tipo-1", iniciais: "EMEF" },
      { uuid: "tipo-2", iniciais: "EMEFM" },
      { uuid: "tipo-3", iniciais: "CEU EMEF" },
      { uuid: "tipo-4", iniciais: "CEI" },
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

const mockEscolaAberta = {
  uuid: "5cd5a205-8469-43ad-9413-658102e569f1",
  data_inicial: "17/11/2026",
  data_final: "18/11/2026",
  dias_semana: ["1", "3"],
  unidades_participantes: [
    {
      uuid: "unidade-1",
      lote: "lote-1",
      lote_nome: "3567-1",
      unidade_educacional: "escola-1",
      unidade_educacional_nome: "EMEF João Silva",
      num_participantes: 12,
      tipos_alimentacao: [{ uuid: "alim-1", nome: "Lanche" }],
    },
  ],
};

const abrirModal = async () => {
  fireEvent.click(screen.getByText("+ Adicionar Unidades"));
  await waitFor(() => {
    expect(
      screen.getByText("Adicionar Unidades Educacionais"),
    ).toBeInTheDocument();
  });
};

const setupMocks = () => {
  (
    cadastroTipoAlimentacaoService.getTiposUnidadeEscolar as jest.Mock
  ).mockResolvedValue(mockTiposUnidadeEscolar);

  (loteService.getLotesAsync as jest.Mock).mockImplementation((setter: any) => {
    setter(mockLotes);
  });

  (escolaService.getEscolasTercTotal as jest.Mock).mockResolvedValue(
    mockEscolas,
  );

  (
    cadastroTipoAlimentacaoService.getVinculosTipoAlimentacaoPorTipoUnidadeEscolar as jest.Mock
  ).mockResolvedValue(mockTiposAlimentacao);
};

const renderComponent = async (props: { uuid?: string } = {}) => {
  await act(async () => {
    render(
      <MemoryRouter
        future={{ v7_startTransition: true, v7_relativeSplatPath: true }}
      >
        <MeusDadosContext.Provider
          value={{
            meusDados: mockMeusDadosCODAEADMIN,
            setMeusDados: jest.fn(),
          }}
        >
          <CadastrarEscolaAberta {...props} />
          <ToastContainer />
        </MeusDadosContext.Provider>
      </MemoryRouter>,
    );
  });
};

describe("CadastrarEscolaAberta - Fluxo de Interação do Usuário", () => {
  beforeEach(async () => {
    jest.clearAllMocks();
    setupMocks();
    await renderComponent();
  });

  it("deve renderizar o componente corretamente", () => {
    expect(screen.getByText("Escola Aberta Cadastradas")).toBeInTheDocument();
    expect(screen.getByText("Período de Realização")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("De")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Até")).toBeInTheDocument();
    expect(screen.getByText("Repetir")).toBeInTheDocument();
    expect(screen.getByText("+ Adicionar Unidades")).toBeInTheDocument();
    expect(screen.getByText("Salvar Escola Aberta")).toBeInTheDocument();
  });

  it("deve navegar para Escola Aberta Cadastradas ao clicar no botão", () => {
    fireEvent.click(screen.getByText("Escola Aberta Cadastradas"));

    expect(mockNavigate).toHaveBeenCalledTimes(1);
    expect(mockNavigate.mock.calls[0][0]).toContain("escola-aberta");
  });

  it("deve cancelar a adição de unidade ao clicar em cancelar no modal", async () => {
    await abrirModal();

    expect(
      screen.queryByTestId("multiselect-tipos-alimentacao-inscritos-infantil"),
    ).not.toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: /Cancelar/i }));

    await waitFor(() => {
      expect(
        screen.queryByText("Adicionar Unidades Educacionais"),
      ).not.toBeInTheDocument();
    });

    expect(screen.getByText("Unidades Participantes: 0")).toBeInTheDocument();
  });

  it("deve exibir alerta ao tentar salvar sem unidades participantes", async () => {
    await act(async () => {
      fireEvent.click(screen.getByText("Salvar Escola Aberta"));
    });

    await waitFor(() => {
      expect(
        screen.getByText(/Não é possível salvar a Escola Aberta sem Unidades/i),
      ).toBeInTheDocument();
    });
  });
});

describe("CadastrarEscolaAberta - Modo edição", () => {
  const uuid = "5cd5a205-8469-43ad-9413-658102e569f1";

  beforeEach(() => {
    jest.clearAllMocks();
    setupMocks();
  });

  it("deve buscar o registro e preencher o formulário", async () => {
    (escolaAbertaService.getEscolaAberta as jest.Mock).mockResolvedValue({
      data: mockEscolaAberta,
    });

    await renderComponent({ uuid });

    expect(escolaAbertaService.getEscolaAberta).toHaveBeenCalledWith(uuid);

    await waitFor(() => {
      expect(screen.getByPlaceholderText("De")).toHaveValue("17/11/2026");
    });
    expect(screen.getByPlaceholderText("Até")).toHaveValue("18/11/2026");
    expect(screen.getByText("Unidades Participantes: 1")).toBeInTheDocument();
    expect(screen.getByText(/EMEF João Silva/)).toBeInTheDocument();
    expect(screen.getByText("Cancelar")).toBeInTheDocument();
  });

  it("deve enviar num_participantes e voltar para a rota sem uuid", async () => {
    (escolaAbertaService.getEscolaAberta as jest.Mock).mockResolvedValue({
      data: mockEscolaAberta,
    });

    await renderComponent({ uuid });

    await waitFor(() => {
      expect(screen.getByPlaceholderText("De")).toHaveValue("17/11/2026");
    });

    await act(async () => {
      fireEvent.click(screen.getByText("Salvar Escola Aberta"));
    });

    await waitFor(() => {
      expect(escolaAbertaService.atualizarEscolaAberta).toHaveBeenCalledTimes(
        1,
      );
    });

    const [uuidEnviado, payload] = (
      escolaAbertaService.atualizarEscolaAberta as jest.Mock
    ).mock.calls[0];

    expect(uuidEnviado).toBe(uuid);
    expect(payload.unidades_participantes[0]).toEqual({
      lote: "lote-1",
      unidade_educacional: "escola-1",
      tipos_alimentacao: ["alim-1"],
      num_participantes: 12,
    });
    expect(escolaAbertaService.cadastrarEscolaAberta).not.toHaveBeenCalled();

    expect(mockNavigate).toHaveBeenCalledTimes(1);
    expect(mockNavigate.mock.calls[0][0]).toContain("escola-aberta");
    expect(mockNavigate.mock.calls[0][0]).not.toContain(uuid);
  });

  it("deve exibir loading enquanto busca o registro", async () => {
    let resolver: any;
    (escolaAbertaService.getEscolaAberta as jest.Mock).mockReturnValue(
      new Promise((resolve) => {
        resolver = resolve;
      }),
    );

    await renderComponent({ uuid });

    expect(screen.queryByText("Salvar Escola Aberta")).not.toBeInTheDocument();

    await act(async () => {
      resolver({ data: mockEscolaAberta });
    });

    expect(await screen.findByText("Salvar Escola Aberta")).toBeInTheDocument();
  });
});
