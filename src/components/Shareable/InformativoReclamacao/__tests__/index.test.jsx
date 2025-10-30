import { act, render, screen, waitFor } from "@testing-library/react";
import InformativoReclamacao from "../index";
import { mockHomologacao } from "src/mocks/Produto/Homologacao/mockHomologacao";
import mock from "src/services/_mock";

describe("Testes comportamento componente - InformativoReclamacao", () => {
  const mockResponse = {
    ultimo_log: {
      criado_em: "2025-10-28 15:45:00",
    },
  };

  afterEach(() => {
    jest.clearAllMocks();
    mock.reset();
  });

  const setup = async () => {
    await act(async () => {
      render(<InformativoReclamacao homologacao={mockHomologacao} />);
    });
  };

  it("deve renderizar o texto corretamente após o carregamento da reclamação", async () => {
    mock
      .onGet(`/homologacoes-produtos/${mockHomologacao.uuid}/reclamacao/`)
      .reply(200, mockResponse);

    await setup();

    await waitFor(() => {
      expect(
        screen.getByText(
          "Reclamação aceita pela equipe de gestão de produto CODAE em 2025-10-28.",
        ),
      ).toBeInTheDocument();
    });

    expect(
      screen.getByText(
        /Para mais detalhes favor extrair o relatório de reclamação de produto/,
      ),
    ).toBeInTheDocument();
  });

  it("não deve renderizar nada enquanto a reclamação não estiver carregada", async () => {
    mock
      .onGet(`/homologacoes-produtos/${mockHomologacao.uuid}/reclamacao/`)
      .reply(() => new Promise(() => {}));

    await setup();

    expect(
      screen.queryByText(/Reclamação aceita pela equipe/),
    ).not.toBeInTheDocument();
  });
});
