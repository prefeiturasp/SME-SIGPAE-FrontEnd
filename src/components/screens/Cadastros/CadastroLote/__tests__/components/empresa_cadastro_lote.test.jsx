import { render, screen, act } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { PERFIL } from "src/constants/shared";
import mock from "src/services/_mock";
import { MeusDadosContext } from "src/context/MeusDadosContext";
import { mockMeusDadosCODAEGA } from "src/mocks/meusDados/CODAE-GA";
import EmpresaDoLote from "../../components/EmpresaDoLote";
import { mockEmpresaLote } from "../../../../../../mocks/lote.service/mockEmpresaLote";

describe("Verifica visualização de empresa do cadastro de lote", () => {
  beforeEach(async () => {
    mock.onGet("/usuarios/meus-dados/").reply(200, mockMeusDadosCODAEGA);
    localStorage.setItem(
      "perfil",
      PERFIL.COORDENADOR_GESTAO_ALIMENTACAO_TERCEIRIZADA
    );

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
              meusDados: mockMeusDadosCODAEGA,
              setMeusDados: jest.fn(),
            }}
          >
            <EmpresaDoLote empresa={mockEmpresaLote} ativo={true} />
          </MeusDadosContext.Provider>
        </MemoryRouter>
      );
    });
  });

  it("Verifica se a interface foi renderizada com as informações da empresa", () => {
    expect(screen.getByText("60.166.832/0001-04")).toBeInTheDocument();
    expect(screen.getByText(/11 99647 8503/i)).toBeInTheDocument();
    expect(screen.getByText(/APETECEa/i)).toBeInTheDocument();
  });
});
