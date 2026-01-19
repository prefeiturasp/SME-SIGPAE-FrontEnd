import "@testing-library/jest-dom";
import { render, screen, fireEvent } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import {
  CardPendenteAcao,
  TIPO_CARD_ENUM,
} from "../../components/CardPendenteAcao";
import { mockSuspensaoAlimentacao } from "src/mocks/SuspensaoDeAlimentacao/mockSuspensaoAlimentacao";

const pedidosMock = [
  mockSuspensaoAlimentacao,
  {
    ...mockSuspensaoAlimentacao,
    uuid: "a7f2c8e1-4b6d-4f0e-9f3b-6d91b0f2e4a9",
    escola: {
      ...mockSuspensaoAlimentacao.escola,
      codigo_eol: "132233",
      nome: "CEI JOSEFA RIBEIRO DOS SANTOS",
      uuid: "b1c2d3e4-f5a6-7b8c-9d0e-1f2a3b4c5d6e",
    },
    id_externo: "35678",
    criado_em: "02/01/2025",
  },
];

const setup = (props = {}) =>
  render(
    <MemoryRouter>
      <CardPendenteAcao
        titulo="Pendentes"
        pedidos={pedidosMock}
        tipoDeCard={TIPO_CARD_ENUM.REGULAR}
        {...props}
      />
    </MemoryRouter>,
  );

describe("Testes de comportamento do componente Card Pendente de Ação", () => {
  it("deve renderizar título e quantidade de solicitações", () => {
    setup();

    expect(screen.getByText("Pendentes")).toBeInTheDocument();
    expect(screen.getAllByText("2")).toHaveLength(2);
    expect(screen.getByText("solicitações")).toBeInTheDocument();
  });

  it("deve renderizar informações de escolas únicas", () => {
    setup();

    expect(screen.getAllByText("2")).toHaveLength(2);
    expect(screen.getByText(/escolas/i)).toBeInTheDocument();
    expect(screen.getByText(/solicitantes/i)).toBeInTheDocument();
  });

  it("deve expandir e colapsar o card ao clicar no ToggleExpandir", () => {
    const { container } = setup();

    const toggle = container.querySelector("[data-cy='botao-expandir']");
    expect(toggle).toBeInTheDocument();

    fireEvent.click(toggle);
    expect(screen.getByPlaceholderText("Pesquisar")).toBeInTheDocument();
  });

  it("deve filtrar pedidos pelo código do pedido", () => {
    const { container } = setup();

    fireEvent.click(container.querySelector("[data-cy='botao-expandir']"));

    const input = screen.getByPlaceholderText("Pesquisar");
    fireEvent.change(input, { target: { value: "35678" } });

    expect(screen.getByText("35678")).toBeInTheDocument();
    expect(screen.queryByText("13222")).not.toBeInTheDocument();
  });

  it("deve filtrar pedidos pelo nome da escola", () => {
    const { container } = setup();

    fireEvent.click(container.querySelector("[data-cy='botao-expandir']"));

    const input = screen.getByPlaceholderText("Pesquisar");
    fireEvent.change(input, { target: { value: "EMEF PERICLES" } });

    expect(screen.getByText("13222")).toBeInTheDocument();
    expect(screen.queryByText("35678")).not.toBeInTheDocument();
  });

  it("deve renderizar links corretamente para cada pedido", () => {
    const { container } = setup();

    fireEvent.click(container.querySelector("[data-cy='botao-expandir']"));

    const links = container.querySelectorAll("a");
    expect(links).toHaveLength(2);
    expect(links[0].getAttribute("href")).toContain(
      "/suspensao-de-alimentacao/relatorio?uuid=13222563-d4fc-41db-ba00-f9f3a74d0f31",
    );
  });

  it("não deve renderizar ToggleExpandir quando não houver pedidos", () => {
    const { container } = render(
      <MemoryRouter>
        <CardPendenteAcao
          titulo="Pendentes"
          pedidos={[]}
          tipoDeCard={TIPO_CARD_ENUM.REGULAR}
        />
      </MemoryRouter>,
    );

    expect(container.querySelector("[data-cy='botao-expandir']")).toBeNull();
  });
});
