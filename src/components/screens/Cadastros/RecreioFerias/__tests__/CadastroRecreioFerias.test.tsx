import {
  act,
  fireEvent,
  render,
  screen,
  waitFor,
} from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { MeusDadosContext } from "src/context/MeusDadosContext";
import { mockMeusDadosCODAEADMIN } from "src/mocks/meusDados/CODAE/admin";
import * as cadastroTipoAlimentacaoService from "src/services/cadastroTipoAlimentacao.service";
import * as escolaService from "src/services/escola.service";
import * as loteService from "src/services/lote.service";
import { CadastroRecreioFerias } from "../CadastroRecreioFerias";

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

const changeSelectValue = (testId: string, value: string) => {
  const container = screen.getByTestId(testId);
  const selectElement = container.querySelector("select");

  if (selectElement) {
    Object.defineProperty(selectElement, "value", {
      writable: true,
      value: value,
    });
    fireEvent.change(selectElement, { target: { value } });
  }
};

describe("CadastroRecreioFerias - Fluxo de Interação do Usuário", () => {
  beforeEach(async () => {
    await act(async () => {
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
            <CadastroRecreioFerias />
          </MeusDadosContext.Provider>
        </MemoryRouter>
      );
    });
  });

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

  it("deve renderizar o componente corretamente", () => {
    expect(
      screen.getByText("Informe o Período do Recreio nas Férias")
    ).toBeInTheDocument();
    expect(
      screen.getByPlaceholderText(/Título para o cadastro/i)
    ).toBeInTheDocument();
    expect(screen.getByText("+ Adicionar Unidades")).toBeInTheDocument();
  });

  it("deve preencher o título e período de realização", () => {
    const inputTitulo = screen.getByPlaceholderText(/Título para o cadastro/i);
    fireEvent.change(inputTitulo, {
      target: { value: "Recreio nas Férias - JAN 2026" },
    });

    expect(inputTitulo).toHaveValue("Recreio nas Férias - JAN 2026");
  });

  it("deve abrir o modal de adicionar unidades ao clicar no botão", async () => {
    const botaoAdicionar = screen.getByText("+ Adicionar Unidades");
    fireEvent.click(botaoAdicionar);

    await waitFor(() => {
      expect(
        screen.getByText("Adicionar Unidades Educacionais")
      ).toBeInTheDocument();
    });
  });

  it("deve mostrar seletor infantil para CEMEI e CEU CEMEI", async () => {
    const botaoAdicionar = screen.getByText("+ Adicionar Unidades");
    fireEvent.click(botaoAdicionar);

    await waitFor(() => {
      expect(
        screen.getByText("Adicionar Unidades Educacionais")
      ).toBeInTheDocument();
    });

    changeSelectValue("select-dres-lote", "lote-1");
    changeSelectValue("select-tipos-unidades", "tipo-4"); // CEMEI

    await waitFor(() => {
      expect(
        screen.getByTestId("multiselect-tipos-alimentacao-inscritos-infantil")
      ).toBeInTheDocument();
    });
  });

  it("deve cancelar a adição de unidade ao clicar em cancelar no modal", async () => {
    const botaoAdicionar = screen.getByText("+ Adicionar Unidades");
    fireEvent.click(botaoAdicionar);

    await waitFor(() => {
      expect(
        screen.getByText("Adicionar Unidades Educacionais")
      ).toBeInTheDocument();
    });

    const botaoCancelar = screen.getByRole("button", { name: /Cancelar/i });
    fireEvent.click(botaoCancelar);

    await waitFor(() => {
      expect(
        screen.queryByText("Adicionar Unidades Educacionais")
      ).not.toBeInTheDocument();
    });

    expect(screen.getByText("Unidades Participantes: 0")).toBeInTheDocument();
  });
});
