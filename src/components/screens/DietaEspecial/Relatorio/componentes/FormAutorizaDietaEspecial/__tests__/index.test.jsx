import "@testing-library/jest-dom";
import {
  act,
  fireEvent,
  render,
  screen,
  waitFor,
} from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { mockSolicitacoesAbertas } from "src/mocks/DietaEspecial/Relatorio/mockSolicitacoesAbertas";
import { CODAE } from "src/configs/constants";
import { localStorageMock } from "src/mocks/localStorageMock";
import {
  getAlergiasIntolerancias,
  getAlimentos,
  getClassificacoesDietaEspecial,
  getNomesProtocolosValidos,
  getProtocoloPadrao,
  getSolicitacoesDietaEspecial,
  atualizaDietaEspecial,
} from "src/services/dietaEspecial.service";
import { getMotivosNegacaoDietaEspecial } from "src/services/painelNutricionista.service";
import FormAutorizaDietaEspecial from "src/components/screens/DietaEspecial/Relatorio/componentes/FormAutorizaDietaEspecial";
import {
  toastError,
  toastSuccess,
} from "src/components/Shareable/Toast/dialogs";

import { mockDietaEspecialComum } from "src/mocks/DietaEspecial/mockDietaAvalidar";
import preview from "jest-preview";

jest.mock("src/components/Shareable/Toast/dialogs", () => ({
  toastSuccess: jest.fn(),
  toastError: jest.fn(),
}));
jest.mock("src/services/dietaEspecial.service");
jest.mock("src/services/painelNutricionista.service");

jest.mock("src/services/websocket", () => {
  return {
    Websocket: jest
      .fn()
      .mockImplementation((url, onmessage, onclose, onopen) => {
        const mockSocket = {
          onmessage: null,
          onclose: null,
          onopen: null,
          close: jest.fn(),
          simulateMessage: function () {
            if (this.onmessage) {
              this.onmessage({ data: JSON.stringify(mockSolicitacoesAbertas) });
            }
          },
          simulateClose: function () {
            if (this.onclose) {
              this.onclose();
            }
          },
          simulateOpen: function (event) {
            if (this.onopen) {
              this.onopen(event);
            }
          },
        };

        if (onmessage) {
          mockSocket.onmessage = onmessage;
          mockSocket.simulateMessage();
        }
        if (onclose) mockSocket.onclose = onclose;
        if (onopen) mockSocket.onopen = onopen;

        return { socket: mockSocket };
      }),
  };
});

jest.mock("src/components/Shareable/CKEditorField", () => ({
  __esModule: true,
  default: ({ input, label, name }) => (
    <div>
      <label>{label}</label>
      <textarea {...input} data-testid={`ckeditor-${input?.name || name}`} />
    </div>
  ),
}));

const awaitServices = async () => {
  await waitFor(() => {
    expect(getSolicitacoesDietaEspecial).toHaveBeenCalled();
    expect(getAlergiasIntolerancias).toHaveBeenCalled();
    expect(getClassificacoesDietaEspecial).toHaveBeenCalled();
    expect(getNomesProtocolosValidos).toHaveBeenCalled();
    expect(getAlimentos).toHaveBeenCalled();
    expect(getMotivosNegacaoDietaEspecial).toHaveBeenCalled();
    expect(getProtocoloPadrao).toHaveBeenCalled();
  });
};

describe("Test <Relatorio> - Dieta Especial - Solicitação de Inclusão - Visão Coordenador Dieta Especial", () => {
  beforeEach(async () => {
    getSolicitacoesDietaEspecial.mockResolvedValue({
      data: { results: [mockDietaEspecialComum] },
      status: 200,
    });
    getAlergiasIntolerancias.mockResolvedValue({
      data: [
        { id: 127, descricao: "ARGININEMIA" },
        { id: 137, descricao: "BRONQUITE" },
      ],
      status: 200,
    });
    getClassificacoesDietaEspecial.mockResolvedValue({
      data: [
        {
          id: 7,
          descricao:
            "Para dietas de fenilcetonúria, Homocistinúria e Tirosemia",
          nome: "Tipo A RESTRIÇÃO DE AMINOÁCIDOS",
        },
        {
          id: 5,
          descricao:
            "Classificação da dieta tipo tipo A Enteral deve vir aqui.",
          nome: "Tipo A ENTERAL",
        },
      ],
      status: 200,
    });
    getNomesProtocolosValidos.mockResolvedValue({
      data: {
        results: [
          {
            nome_protocolo: "ALERGIA - CARNE SUÍNA",
            uuid: "3a4ae301-d1e6-4e1a-9429-a4a324513383",
          },
          {
            nome_protocolo: "ALERGIA - OVO",
            uuid: "4a4c8e48-1f76-4e9e-b6b5-d776ae350839",
          },
        ],
      },
      status: 200,
    });

    getAlimentos.mockResolvedValue({
      data: [
        {
          id: 489,
          marca: null,
          nome: "ABACATE",
          ativo: true,
          uuid: "b48dc997-2cbd-4c10-9766-711f41637922",
          tipo: "E",
          outras_informacoes: "",
          tipo_listagem_protocolo: "SO_ALIMENTOS",
        },
        {
          id: 495,
          marca: null,
          nome: "ACEROLA",
          ativo: true,
          uuid: "8617806d-f03e-4d15-a1e3-fd93efe4f277",
          tipo: "E",
          outras_informacoes: "",
          tipo_listagem_protocolo: "SO_ALIMENTOS",
        },
      ],
      status: 200,
    });

    getMotivosNegacaoDietaEspecial.mockResolvedValue({
      data: [
        {
          id: 1,
          descricao: "Detalhamento da dieta enteral",
          processo: "INCLUSAO",
        },
        {
          id: 2,
          descricao: "Detalhamento da dieta pastosa",
          processo: "INCLUSAO",
        },
      ],
      status: 200,
    });
    getProtocoloPadrao.mockResolvedValue({
      data: [
        {
          id: 1,
          descricao: "Detalhamento da dieta enteral",
          processo: "INCLUSAO",
        },
        {
          id: 2,
          descricao: "Detalhamento da dieta pastosa",
          processo: "INCLUSAO",
        },
      ],
      status: 200,
    });

    atualizaDietaEspecial.mockResolvedValue({ status: 200, data: {} });

    Object.defineProperty(global, "localStorage", { value: localStorageMock });
    localStorage.setItem("tipo_perfil", `"dieta_especial"`);

    await act(async () => {
      render(
        <MemoryRouter
          initialEntries={[{ pathname: "/" }]}
          future={{
            v7_startTransition: true,
            v7_relativeSplatPath: true,
          }}
        >
          <FormAutorizaDietaEspecial
            visao={CODAE}
            dietaEspecial={mockDietaEspecialComum}
            onAutorizarOuNegar={jest.fn()}
            editar={false}
          />
        </MemoryRouter>,
      );
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
    jest.restoreAllMocks();
  });

  it("Testa o botão de Salvar Rascunho", async () => {
    await awaitServices();
    preview.debug();

    const btnRascunho = screen.getByRole("button", {
      name: /salvar rascunho/i,
    });
    const campoOrientacoes = screen.getByTestId("ckeditor-orientacoes_gerais");
    fireEvent.change(campoOrientacoes, {
      target: { value: "Cuidado com o cozimento" },
    });

    await fireEvent.click(btnRascunho);

    await waitFor(() => {
      expect(atualizaDietaEspecial).toHaveBeenCalledWith(
        mockDietaEspecialComum.uuid,
        expect.objectContaining({
          orientacoes_gerais: expect.stringContaining(
            "Cuidado com o cozimento",
          ),
        }),
      );
      expect(toastSuccess).toHaveBeenCalledWith("Rascunho salvo com sucesso!");
    });
  });

  it("deve exibir toast de erro quando a API de rascunho falhar", async () => {
    atualizaDietaEspecial.mockRejectedValue(
      new Error("Erro interno do servidor"),
    );
    await awaitServices();
    const campoOrientacoes = screen.getByTestId("ckeditor-orientacoes_gerais");
    fireEvent.change(campoOrientacoes, { target: { value: "Teste de falha" } });

    const btnRascunho = screen.getByRole("button", {
      name: /salvar rascunho/i,
    });
    fireEvent.click(btnRascunho);

    await waitFor(() => {
      expect(toastError).toHaveBeenCalledWith(
        "Houve um erro ao salvar o rascunho.",
      );
    });
  });
});
