import "@testing-library/jest-dom";
import { act, render, screen, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { ESCOLA } from "src/configs/constants";
import { mockDietaEspecialLevi } from "src/mocks/DietaEspecial/Relatorio/mockDietaEspecialLevi";
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
      data: mockDietaEspecialLevi,
      status: 200,
    });
    getMotivosNegacaoDietaEspecial.mockResolvedValue({
      data: mockMotivosNegarCancelamento,
      status: 200,
    });

    Object.defineProperty(global, "localStorage", { value: localStorageMock });
    localStorage.setItem("tipo_perfil", `"dieta_especial"`);

    const search = `?uuid=1e255cfc-81bb-4cec-a64c-64d7021bd81c&card=pendentes-aut`;
    Object.defineProperty(window, "location", {
      value: {
        search: search,
        href: "http://localhost:3000/dieta-especial/relatorio?uuid=1e255cfc-81bb-4cec-a64c-64d7021bd81c&ehInclusaoContinua=false&tipoSolicitacao=&card=pendentes-aut",
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
});
