import React from "react";
import { render, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import * as perfilService from "src/services/perfil.service";
import * as utilities from "src/helpers/utilities";
import {
  PainelPedidosEscola,
  PainelPedidosDRE,
  PainelPedidosCODAE,
} from "../ContainerPage";

jest.mock("src/components/Shareable/Breadcrumb", () => () => (
  <div>Breadcrumb</div>
));
jest.mock("src/components/Shareable/Page/Page", () => ({ children }) => (
  <div>{children}</div>
));
jest.mock("src/components/SolicitacaoDeKitLanche/Container", () => ({
  Container: () => <div>Container Escola</div>,
}));
jest.mock(
  "src/components/SolicitacaoKitLancheCEMEI/componentes/Container",
  () => ({
    Container: () => <div>Container CEMEI</div>,
  }),
);
jest.mock(
  "src/components/SolicitacaoDeKitLanche/DRE/PainelPedidos/Container",
  () => () => <div>Container DRE</div>,
);
jest.mock(
  "src/components/SolicitacaoDeKitLanche/CODAE/PainelPedidos/Container",
  () => () => <div>Container CODAE</div>,
);

describe("ContainerPage - Testes completos", () => {
  const mockDados = {
    vinculo_atual: {
      instituicao: {
        quantidade_alunos: 123,
      },
    },
  };

  beforeEach(() => {
    jest.spyOn(perfilService, "meusDados").mockResolvedValue(mockDados);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("Renderiza corretamente para ESCOLA sem ser CEMEI", async () => {
    jest.spyOn(utilities, "escolaEhCEMEI").mockReturnValue(false);
    const { getByText } = render(<PainelPedidosEscola />);
    await waitFor(() => {
      expect(getByText("Container Escola")).toBeInTheDocument();
      expect(getByText("Breadcrumb")).toBeInTheDocument();
    });
  });

  it("Renderiza corretamente para ESCOLA sendo CEMEI", async () => {
    jest.spyOn(utilities, "escolaEhCEMEI").mockReturnValue(true);
    const { getByText } = render(<PainelPedidosEscola />);
    await waitFor(() => {
      expect(getByText("Container CEMEI")).toBeInTheDocument();
    });
  });

  it("Renderiza corretamente para DRE", async () => {
    const { getByText } = render(
      <MemoryRouter initialEntries={[{ state: { filtros: {} } }]}>
        <PainelPedidosDRE />
      </MemoryRouter>,
    );
    await waitFor(() => {
      expect(getByText("Container DRE")).toBeInTheDocument();
    });
  });

  it("Renderiza corretamente para CODAE", async () => {
    const { getByText } = render(
      <MemoryRouter initialEntries={[{ state: { filtros: {} } }]}>
        <PainelPedidosCODAE />
      </MemoryRouter>,
    );
    await waitFor(() => {
      expect(getByText("Container CODAE")).toBeInTheDocument();
    });
  });
});
