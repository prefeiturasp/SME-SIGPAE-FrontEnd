import "@testing-library/jest-dom";
import {
  act,
  fireEvent,
  render,
  screen,
  waitFor,
} from "@testing-library/react";
import { APIMockVersion } from "mocks/apiVersionMock";
import { localStorageMock } from "mocks/localStorageMock";
import React, { useState } from "react";
import { MemoryRouter } from "react-router-dom";
import { getAPIVersion } from "services/api.service";
import { Sidebar } from "..";

jest.mock("services/api.service");

const awaitServices = async () => {
  await waitFor(() => {
    expect(getAPIVersion).toHaveBeenCalled();
  });
};

describe("Test <Sidebar> - Usuário DINUTRE_DIRETORIA", () => {
  const nome = "DINUTRE DIRETORIA";

  const TestSidebarComponent = () => {
    const [toggled, setToggled] = useState(false);
    return (
      <Sidebar
        nome={nome}
        toggle={() => setToggled(!toggled)}
        toggled={toggled}
      />
    );
  };

  beforeEach(async () => {
    getAPIVersion.mockResolvedValue({
      data: APIMockVersion,
      status: 200,
    });

    Object.defineProperty(global, "localStorage", { value: localStorageMock });
    localStorage.setItem("perfil", `"DINUTRE_DIRETORIA"`);
    localStorage.setItem("tipo_perfil", `"pre_recebimento"`);

    await act(async () => {
      render(
        <MemoryRouter
          initialEntries={[{ pathname: "/" }]}
          future={{
            v7_startTransition: true,
            v7_relativeSplatPath: true,
          }}
        >
          <TestSidebarComponent />
        </MemoryRouter>
      );
    });
  });

  it(`renderiza o nome ${nome}`, async () => {
    await awaitServices();
    expect(screen.getByText(nome)).toBeInTheDocument();
  });

  it(`renderiza o link Perfil`, async () => {
    await awaitServices();
    expect(screen.getByText("Perfil")).toBeInTheDocument();
  });

  it("renderiza licença", async () => {
    await awaitServices();
    expect(
      screen.getByText("Licença AGPL V3 (API: 0.1.16)")
    ).toBeInTheDocument();
  });

  it("renderiza link `Painel Inicial`", async () => {
    await awaitServices();
    expect(screen.getByText("Painel Inicial")).toBeInTheDocument();
  });

  it("renderiza link `Gestão de Alimentação` com seus submenus", async () => {
    await awaitServices();
    expect(screen.getByText("Gestão de Alimentação")).toBeInTheDocument();

    const linkGestaoDeAlimentacao = screen.getByTestId("gestao-alimentacao");
    fireEvent.click(linkGestaoDeAlimentacao);

    expect(linkGestaoDeAlimentacao).toHaveTextContent("Painel de Solicitações");

    expect(linkGestaoDeAlimentacao).toHaveTextContent(
      "Consulta de Solicitações"
    );
    const linkConsultaSolicitacoes = screen.getByTestId(
      "consulta-solicitacoes"
    );
    fireEvent.click(linkConsultaSolicitacoes);

    expect(linkGestaoDeAlimentacao).toHaveTextContent("Autorizadas");
    expect(linkGestaoDeAlimentacao).toHaveTextContent("Negadas");
    expect(linkGestaoDeAlimentacao).toHaveTextContent("Canceladas");
    expect(linkGestaoDeAlimentacao).not.toHaveTextContent(
      "Aguardando resposta da empresa"
    );
    expect(linkGestaoDeAlimentacao).not.toHaveTextContent(
      "Questionamentos da CODAE"
    );
    expect(linkGestaoDeAlimentacao).not.toHaveTextContent(
      "Aguardando autorização"
    );
  });

  it("renderiza link `Dieta Especial` com seus submenus", async () => {
    await awaitServices();
    expect(screen.getByText("Dieta Especial")).toBeInTheDocument();

    const linkDietaEspecial = screen.getByTestId("dieta-especial");
    fireEvent.click(linkDietaEspecial);

    expect(linkDietaEspecial).toHaveTextContent("Painel de Solicitações");
    expect(linkDietaEspecial).toHaveTextContent("Consulta de Dieta do Aluno");
    expect(linkDietaEspecial).toHaveTextContent("Relatórios");

    const linkRelatorios = screen.getByTestId("relatorios-de");
    fireEvent.click(linkRelatorios);

    expect(linkDietaEspecial).toHaveTextContent(
      "Relatório de Dietas Autorizadas"
    );
    expect(linkDietaEspecial).toHaveTextContent(
      "Relatório de Dietas Canceladas"
    );
    expect(linkDietaEspecial).not.toHaveTextContent(
      "Relatório Gerencial de Dietas"
    );
  });

  it("renderiza link `Gestão de Produto` com seus submenus", async () => {
    await awaitServices();
    expect(screen.getByText("Gestão de Produto")).toBeInTheDocument();

    const linkGestaoDeProduto = screen.getByTestId("gestao-de-produto");
    fireEvent.click(linkGestaoDeProduto);

    expect(linkGestaoDeProduto).toHaveTextContent("Painel de Solicitações");
    expect(linkGestaoDeProduto).toHaveTextContent("Consulta de Produto");
    expect(linkGestaoDeProduto).toHaveTextContent("Consulta de Solicitações");

    const linkConsultaSolicitacoes = screen.getByTestId(
      "consulta-solicitacoes-gp"
    );
    fireEvent.click(linkConsultaSolicitacoes);

    expect(linkGestaoDeProduto).toHaveTextContent("Produtos suspensos");
    expect(linkGestaoDeProduto).toHaveTextContent("Não homologados");
    expect(linkGestaoDeProduto).toHaveTextContent("Homologados");
    expect(linkGestaoDeProduto).toHaveTextContent(
      "Ag. análise das reclamações"
    );
    expect(linkGestaoDeProduto).toHaveTextContent(
      "Responder Questionamentos da CODAE"
    );
  });

  it("renderiza link `Medição Inicial` com seus submenus", async () => {
    await awaitServices();
    expect(screen.getByText("Medição Inicial")).toBeInTheDocument();

    const linkMedicaoInicial = screen.getByTestId("medicao-inicial");
    fireEvent.click(linkMedicaoInicial);

    expect(linkMedicaoInicial).toHaveTextContent(
      "Acompanhamento de Lançamentos"
    );
    expect(linkMedicaoInicial).toHaveTextContent("Relatórios");

    const linkRelatoriosMe = screen.getByTestId("relatorios-me");
    fireEvent.click(linkRelatoriosMe);

    expect(linkMedicaoInicial).toHaveTextContent("Relatório de Adesão");
  });

  it("renderiza link `Relatórios` com seus submenus", async () => {
    await awaitServices();
    const linkRelatorios = screen.getByTestId("relatorios");
    fireEvent.click(linkRelatorios);

    expect(linkRelatorios).toHaveTextContent("Produtos Homologados");
    expect(linkRelatorios).toHaveTextContent("Produtos Suspensos");
    expect(linkRelatorios).toHaveTextContent(
      "Relatório de reclamação de produto"
    );
  });

  it("renderiza link `Pré-Recebimento` com seus submenus", async () => {
    await awaitServices();
    expect(screen.getByText("Pré-Recebimento")).toBeInTheDocument();

    const linkPreRecebimento = screen.getByTestId("pre-recebimento");
    fireEvent.click(linkPreRecebimento);

    expect(linkPreRecebimento).toHaveTextContent("Painel de Aprovações");
    expect(linkPreRecebimento).toHaveTextContent("Cronograma de Entrega");
    expect(linkPreRecebimento).toHaveTextContent(
      "Verificar Alterações de Cronograma"
    );
    expect(linkPreRecebimento).toHaveTextContent("Calendário de Cronogramas");
    expect(linkPreRecebimento).toHaveTextContent("Relatórios");

    const linkRelatoriosPr = screen.getByTestId("relatorios-pr");
    fireEvent.click(linkRelatoriosPr);

    expect(linkPreRecebimento).toHaveTextContent("Cronogramas de Entregas");
  });
});
