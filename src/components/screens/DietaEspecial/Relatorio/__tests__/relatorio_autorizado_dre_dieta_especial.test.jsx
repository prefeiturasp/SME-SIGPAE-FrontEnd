import "@testing-library/jest-dom";
import { act, render, screen, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { ESCOLA } from "src/configs/constants";
import { mockDietaEspecialVictorAutorizada } from "src/mocks/DietaEspecial/Relatorio/mockDietaEspecialVictorAutorizada";
import { mockMotivosNegarCancelamento } from "src/mocks/DietaEspecial/Relatorio/mockMotivosNegarCancelamento";
import { mockSolicitacoesAbertas } from "src/mocks/DietaEspecial/Relatorio/mockSolicitacoesAbertas";
import { localStorageMock } from "src/mocks/localStorageMock";
import { getDietaEspecial } from "src/services/dietaEspecial.service";
import { getMotivosNegacaoDietaEspecial } from "src/services/painelNutricionista.service";
import Relatorio from "..";

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

const awaitServices = async () => {
  await waitFor(() => {
    expect(getDietaEspecial).toHaveBeenCalled();
    expect(getMotivosNegacaoDietaEspecial).toHaveBeenCalled();
  });
};

describe("Test <Relatorio> - Relatório de Dieta Especial - Pendente Autorização - Visão Coordenador Dieta Especial", () => {
  beforeEach(async () => {
    getDietaEspecial.mockResolvedValue({
      data: mockDietaEspecialVictorAutorizada,
      status: 200,
    });
    getMotivosNegacaoDietaEspecial.mockResolvedValue({
      data: mockMotivosNegarCancelamento,
      status: 200,
    });

    Object.defineProperty(global, "localStorage", { value: localStorageMock });
    localStorage.setItem("perfil", `"COGESTOR_DRE"`);

    const search = `?uuid=073b72aa-c997-489e-a1f9-5f40fbbe5ec7&ehInclusaoContinua=false&tipoSolicitacao=&card=autorizadas`;
    Object.defineProperty(window, "location", {
      value: {
        search: search,
        href: "http://localhost:3000/dieta-especial/relatorio?uuid=073b72aa-c997-489e-a1f9-5f40fbbe5ec7&ehInclusaoContinua=false&tipoSolicitacao=&card=autorizadas",
      },
    });

    await act(async () => {
      render(
        <MemoryRouter
          initialEntries={[{ pathname: "/" }]}
          future={{
            v7_startTransition: true,
            v7_relativeSplatPath: true,
          }}
        >
          <Relatorio visao={ESCOLA} />
        </MemoryRouter>
      );
    });
  });

  it("exibe label `Dados do aluno`", async () => {
    await awaitServices();
    expect(screen.getByText("Dados do aluno")).toBeInTheDocument();
  });

  it("NÃO exibe botão `Imprimir`", async () => {
    await awaitServices();
    expect(screen.queryByTestId("botao-imprimir")).not.toBeInTheDocument();
  });
});
