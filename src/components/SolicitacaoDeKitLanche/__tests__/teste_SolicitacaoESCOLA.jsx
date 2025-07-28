import "@testing-library/jest-dom";
import React from "react";
import mock from "src/services/_mock";
import {
  act,
  fireEvent,
  screen,
  waitFor,
  within,
} from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { mockMeusDadosEscolaEMEFPericles } from "src/mocks/meusDados/escolaEMEFPericles";
import { APIMockVersion } from "src/mocks/apiVersionMock";
import { mockGetMinhasSolicitacoes } from "src/mocks/SolicitacaokitLanche/mockGetMinhasSolicitacoes";
import { mockKitLanche } from "src/mocks/SolicitacaokitLanche/mockKitLanche";
import { mockDietasAtivasInativas } from "src/mocks/DietaEspecial/mockAtivasInativas";
import SolicitacaoDeKitLanche from "src/components/SolicitacaoDeKitLanche/Container/base";
import { renderWithProvider } from "src/utils/test-utils";
import { localStorageMock } from "src/mocks/localStorageMock";

describe("Teste de Solicitação de Kit Lanche", () => {
  const escolaUuid =
    mockMeusDadosEscolaEMEFPericles.vinculo_atual.instituicao.uuid;

  beforeEach(async () => {
    mock
      .onGet("/usuarios/meus-dados/")
      .reply(200, mockMeusDadosEscolaEMEFPericles);
    mock
      .onGet("/downloads/quantidade-nao-vistos/")
      .reply(200, { quantidade_nao_vistos: 170 });
    mock.onGet("/notificacoes/").reply(200, {
      next: null,
      previous: null,
      count: 0,
      page_size: 4,
      results: [],
    });
    mock.onGet("/api-version/").reply(200, APIMockVersion);
    mock
      .onGet("/downloads/quantidade-nao-vistos/")
      .reply(200, { quantidade_nao_lidos: 0 });
    mock.onGet(`/dias-uteis/?escola_uuid=${escolaUuid}/`).reply(200, {
      proximos_cinco_dias_uteis: "2025-08-04",
      proximos_dois_dias_uteis: "2025-07-31",
    });
    mock
      .onGet("/solicitacoes-kit-lanche-avulsa/minhas-solicitacoes/")
      .reply(200, mockGetMinhasSolicitacoes);
    mock
      .onGet("/solicitacoes-dieta-especial-ativas-inativas/")
      .reply((config) => {
        if (config.params.incluir_alteracao_ue === true) {
          return [200, mockDietasAtivasInativas];
        }
      });
    mock.onGet("/kit-lanches/").reply(200, mockKitLanche);

    Object.defineProperty(global, "localStorage", { value: localStorageMock });
    localStorage.setItem("eh_cemei", false);

    await act(async () => {
      renderWithProvider(
        <MemoryRouter
          future={{
            v7_startTransition: true,
            v7_relativeSplatPath: true,
          }}
        >
          <SolicitacaoDeKitLanche meusDados={mockMeusDadosEscolaEMEFPericles} />
        </MemoryRouter>
      );
    });
  });

  it("Testa card Matriculados", async () => {
    await waitFor(() => {
      expect(screen.getAllByText(/Nº de Matriculados/i)).toHaveLength(1);
      expect(screen.getAllByText(/524/i)).toHaveLength(1);
      expect(
        screen.getAllByText(
          /Informação automática disponibilizada pelo Cadastro da Unidade Escolar/i
        )
      ).toHaveLength(1);
    });
  });

  it("Testa card Rascunhos", async () => {
    expect(screen.getAllByText(/Rascunhos/i)).toHaveLength(1);

    const primeiroRascunho = screen.getByTestId(`card-rascunho-0`);
    const botaoDeletarPrimeiro = screen.getByTestId("btn-delete-rascunho-0");
    const botaoEditarPrimeiro = screen.getByTestId("btn-edit-rascunho-0");
    expect(
      within(primeiroRascunho).getByText(
        /Solicitação de Kit Lanche Passeio #73D27/i
      )
    ).toBeInTheDocument();
    expect(
      within(primeiroRascunho).getByText(/Data do evento/i)
    ).toBeInTheDocument();
    expect(
      within(primeiroRascunho).getByText("24/03/2025")
    ).toBeInTheDocument();
    expect(
      within(primeiroRascunho).getByText(/Local do passeio/i)
    ).toBeInTheDocument();
    expect(within(primeiroRascunho).getByText(/dasdasd/i)).toBeInTheDocument();
    expect(
      within(primeiroRascunho).getByText(/Nº de Alunos participantes/i)
    ).toBeInTheDocument();
    expect(within(primeiroRascunho).getByText("1")).toBeInTheDocument();
    expect(
      within(primeiroRascunho).getByText("Salvo em: 12/03/2025 17:04:12")
    ).toBeInTheDocument();
    expect(within(primeiroRascunho).getByText(/RASCUNHO/i)).toBeInTheDocument();
    fireEvent.click(botaoDeletarPrimeiro);
    fireEvent.click(botaoEditarPrimeiro);

    const segundoRascunho = screen.getByTestId(`card-rascunho-1`);
    const botaoDeletarSegundo = screen.getByTestId("btn-delete-rascunho-1");
    const botaoEditarSegundo = screen.getByTestId("btn-edit-rascunho-1");
    expect(
      within(segundoRascunho).getByText(
        /Solicitação de Kit Lanche Passeio #F0835/i
      )
    ).toBeInTheDocument();
    expect(
      within(segundoRascunho).getByText(/Data do evento/i)
    ).toBeInTheDocument();
    expect(within(segundoRascunho).getByText("02/04/2025")).toBeInTheDocument();
    expect(
      within(segundoRascunho).getByText(/Local do passeio/i)
    ).toBeInTheDocument();
    expect(within(segundoRascunho).getByText(/asdasdasd/i)).toBeInTheDocument();
    expect(
      within(segundoRascunho).getByText(/Nº de Alunos participantes/i)
    ).toBeInTheDocument();
    expect(within(segundoRascunho).getByText("123")).toBeInTheDocument();
    expect(
      within(segundoRascunho).getByText("Salvo em: 17/03/2025 14:43:45")
    ).toBeInTheDocument();
    expect(within(segundoRascunho).getByText(/RASCUNHO/i)).toBeInTheDocument();
    fireEvent.click(botaoDeletarSegundo);
    fireEvent.click(botaoEditarSegundo);
  });

  it("Testa card Nova Solicitação", async () => {
    const cardSolicitacao = screen.getByTestId(`card-solicitacao`);
    expect(
      within(cardSolicitacao).getAllByText(/Data do passeio/i)
    ).toHaveLength(1);
    expect(
      within(cardSolicitacao).getAllByText(/Local do passeio/i)
    ).toHaveLength(1);
    expect(
      within(cardSolicitacao).getAllByText(/Número de alunos/i)
    ).toHaveLength(1);
    expect(
      within(cardSolicitacao).getAllByText("Evento/Atividade")
    ).toHaveLength(1);
    expect(
      within(cardSolicitacao).getAllByText(/Tempo previsto do passeio/i)
    ).toHaveLength(1);
    expect(
      within(cardSolicitacao).getAllByText("até 4 horas (1 Kit)")
    ).toHaveLength(1);
    expect(
      within(cardSolicitacao).getAllByText("de 5 a 7 horas (2 Kits)")
    ).toHaveLength(1);
    expect(
      within(cardSolicitacao).getAllByText("8 horas ou mais (3 Kits)")
    ).toHaveLength(1);

    // expect(within(cardSolicitacao).getAllByText("Até 4 horas:")).toHaveLength(1);
    // expect(within(cardSolicitacao).getAllByText((_, node) =>
    //     node.textContent?.includes('Até 4 horas: Escolher 1 Kit entre os modelos estabelecidos contratualmente')
    // )
    // ).toHaveLength(1);

    expect(
      within(cardSolicitacao).getAllByText(/Selecione a opção desejada/i)
    ).toHaveLength(1);
    expect(within(cardSolicitacao).getAllByText("KIT")).toHaveLength(1);
    expect(within(cardSolicitacao).getAllByText(/teste/i)).toHaveLength(1);
    expect(
      within(cardSolicitacao).getAllByText(/Número total de kits/i)
    ).toHaveLength(1);
    expect(
      within(cardSolicitacao).getAllByText(
        /Selecionar alunos com dieta especial/i
      )
    ).toHaveLength(1);
    expect(within(cardSolicitacao).getAllByText(/Código EOL/i)).toHaveLength(1);
    expect(within(cardSolicitacao).getAllByText(/Nome do Aluno/i)).toHaveLength(
      1
    );
    expect(within(cardSolicitacao).getAllByText(/Observações/i)).toHaveLength(
      1
    );
  });
});
