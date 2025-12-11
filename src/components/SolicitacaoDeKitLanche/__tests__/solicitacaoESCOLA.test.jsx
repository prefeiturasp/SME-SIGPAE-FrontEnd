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
import { mockDietasAtivasInativas } from "src/mocks/DietaEspecial/mockAtivasInativasEMEFPericles";
import SolicitacaoDeKitLanche from "src/components/SolicitacaoDeKitLanche/Container/base";
import { renderWithProvider } from "src/utils/test-utils";
import { localStorageMock } from "src/mocks/localStorageMock";
import userEvent from "@testing-library/user-event";
import { dataParaUTC } from "src/helpers/utilities";
import { PERFIL } from "src/constants/shared";

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

    window.HTMLElement.prototype.scrollIntoView = jest.fn();

    Object.defineProperty(global, "localStorage", { value: localStorageMock });
    localStorage.setItem("perfil", PERFIL.DIRETOR_UE);
    localStorage.setItem("eh_cemei", false);

    await act(async () => {
      renderWithProvider(
        <MemoryRouter
          future={{
            v7_startTransition: true,
            v7_relativeSplatPath: true,
          }}
        >
          <SolicitacaoDeKitLanche
            meusDados={mockMeusDadosEscolaEMEFPericles}
            proximos_dois_dias_uteis={dataParaUTC(new Date("2025-07-31"))}
            proximos_cinco_dias_uteis={dataParaUTC(new Date("2025-08-04"))}
          />
        </MemoryRouter>,
      );
    });
  });

  beforeAll(async () => {
    const RealDate = Date;
    jest.spyOn(global, "Date").mockImplementation((...args) => {
      if (args.length) {
        return new RealDate(...args);
      }
      return new RealDate("2025-07-01T12:00:00Z");
    });

    global.Date.now = RealDate.now;
    global.Date.UTC = RealDate.UTC;
    global.Date.parse = RealDate.parse;
  });

  afterAll(async () => {
    global.Date.mockRestore();
  });

  it("Testa card Matriculados", async () => {
    await waitFor(() => {
      expect(screen.getAllByText(/Nº de Matriculados/i)).toHaveLength(1);
      expect(screen.getAllByText(/524/i)).toHaveLength(1);
      expect(
        screen.getAllByText(
          /Informação automática disponibilizada pelo Cadastro da Unidade Escolar/i,
        ),
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
        /Solicitação de Kit Lanche Passeio #73D27/i,
      ),
    ).toBeInTheDocument();
    expect(
      within(primeiroRascunho).getByText(/Data do evento/i),
    ).toBeInTheDocument();
    expect(
      within(primeiroRascunho).getByText("24/03/2025"),
    ).toBeInTheDocument();
    expect(
      within(primeiroRascunho).getByText(/Local do passeio/i),
    ).toBeInTheDocument();
    expect(within(primeiroRascunho).getByText(/dasdasd/i)).toBeInTheDocument();
    expect(
      within(primeiroRascunho).getByText(/Nº de Alunos participantes/i),
    ).toBeInTheDocument();
    expect(within(primeiroRascunho).getByText("1")).toBeInTheDocument();
    expect(
      within(primeiroRascunho).getByText("Salvo em: 12/03/2025 17:04:12"),
    ).toBeInTheDocument();
    expect(within(primeiroRascunho).getByText(/RASCUNHO/i)).toBeInTheDocument();
    fireEvent.click(botaoDeletarPrimeiro);
    fireEvent.click(botaoEditarPrimeiro);

    const segundoRascunho = screen.getByTestId(`card-rascunho-1`);
    const botaoDeletarSegundo = screen.getByTestId("btn-delete-rascunho-1");
    const botaoEditarSegundo = screen.getByTestId("btn-edit-rascunho-1");
    expect(
      within(segundoRascunho).getByText(
        /Solicitação de Kit Lanche Passeio #F0835/i,
      ),
    ).toBeInTheDocument();
    expect(
      within(segundoRascunho).getByText(/Data do evento/i),
    ).toBeInTheDocument();
    expect(within(segundoRascunho).getByText("02/04/2025")).toBeInTheDocument();
    expect(
      within(segundoRascunho).getByText(/Local do passeio/i),
    ).toBeInTheDocument();
    expect(within(segundoRascunho).getByText(/asdasdasd/i)).toBeInTheDocument();
    expect(
      within(segundoRascunho).getByText(/Nº de Alunos participantes/i),
    ).toBeInTheDocument();
    expect(within(segundoRascunho).getByText("123")).toBeInTheDocument();
    expect(
      within(segundoRascunho).getByText("Salvo em: 17/03/2025 14:43:45"),
    ).toBeInTheDocument();
    expect(within(segundoRascunho).getByText(/RASCUNHO/i)).toBeInTheDocument();
    fireEvent.click(botaoDeletarSegundo);
    fireEvent.click(botaoEditarSegundo);
  });

  it("Testa card Nova Solicitação", async () => {
    const cardSolicitacao = screen.getByTestId(`card-solicitacao`);
    expect(
      within(cardSolicitacao).getAllByText(/Data do passeio/i),
    ).toHaveLength(1);
    expect(
      within(cardSolicitacao).getAllByText(/Local do passeio/i),
    ).toHaveLength(1);
    expect(
      within(cardSolicitacao).getAllByText(/Número de alunos/i),
    ).toHaveLength(1);
    expect(
      within(cardSolicitacao).getAllByText("Evento/Atividade"),
    ).toHaveLength(1);
    expect(
      within(cardSolicitacao).getAllByText(/Tempo previsto do passeio/i),
    ).toHaveLength(1);
    expect(
      within(cardSolicitacao).getAllByText("até 4 horas (1 Kit)"),
    ).toHaveLength(1);
    expect(
      within(cardSolicitacao).getAllByText("de 5 a 7 horas (2 Kits)"),
    ).toHaveLength(1);
    expect(
      within(cardSolicitacao).getAllByText("8 horas ou mais (3 Kits)"),
    ).toHaveLength(1);

    expect(
      within(cardSolicitacao).getAllByText(/Selecione a opção desejada/i),
    ).toHaveLength(1);
    expect(within(cardSolicitacao).getAllByText("KIT")).toHaveLength(1);
    expect(within(cardSolicitacao).getAllByText(/teste/i)).toHaveLength(1);
    expect(
      within(cardSolicitacao).getAllByText(/Número total de kits/i),
    ).toHaveLength(1);
    expect(
      within(cardSolicitacao).getAllByText(
        /Selecionar alunos com dieta especial/i,
      ),
    ).toHaveLength(1);
    expect(within(cardSolicitacao).getAllByText(/Código EOL/i)).toHaveLength(1);
    expect(within(cardSolicitacao).getAllByText(/Nome do Aluno/i)).toHaveLength(
      1,
    );
  });

  it("Testa o input local do Passeio", async () => {
    const usuario = userEvent.setup();
    const campoInput = screen.getByTestId("local-passeio");

    expect(campoInput).toHaveValue("");
    await usuario.type(campoInput, "Texto de teste");
    expect(campoInput).toHaveValue("Texto de teste");

    await usuario.clear(campoInput);
    expect(campoInput).toHaveValue("");
  });

  it("Testa o input número de alunos", async () => {
    const usuario = userEvent.setup();
    const campoInput = screen.getByTestId("numero-alunos");
    expect(campoInput).toHaveValue("");

    await usuario.type(campoInput, "521");
    expect(campoInput).toHaveValue("521");

    const mensagemErro = screen.queryByTestId("erro-numero-alunos");
    expect(mensagemErro).not.toBeInTheDocument();

    await usuario.clear(campoInput);
    expect(campoInput).toHaveValue("");
  });

  it("Testa o input número de alunos quando número de alunos for maior que o permitido", async () => {
    const usuario = userEvent.setup();
    const campoInput = screen.getByTestId("numero-alunos");
    expect(campoInput).toHaveValue("");

    await usuario.type(campoInput, "621");
    expect(campoInput).toHaveValue("621");

    const iconeErro = screen.getByTestId("erro-numero-alunos");
    expect(iconeErro).toBeInTheDocument();

    await usuario.hover(iconeErro);
    const tooltip = await screen.findByRole("tooltip");
    expect(tooltip).toHaveTextContent(
      /O número de alunos não pode ser maior que 524/i,
    );
    expect(screen.getByText(/Não pode ser maior que 524/i)).toBeInTheDocument();
  });

  it("Testa o input do nome do evento", async () => {
    const usuario = userEvent.setup();
    const campoInput = screen.getByTestId("nome-evento-atividade");

    expect(campoInput).toHaveValue("");
    await usuario.type(campoInput, "Texto de teste");
    expect(campoInput).toHaveValue("Texto de teste");

    await usuario.clear(campoInput);
    expect(campoInput).toHaveValue("");
  });

  it("Testa a seleção de opções de tempo do passeio", async () => {
    const user = userEvent.setup();
    const radio4h = screen.getByRole("radio", { name: /até 4 horas/i });
    const radio5a7h = screen.getByRole("radio", { name: /de 5 a 7 horas/i });
    const radio8h = screen.getByRole("radio", { name: /8 horas ou mais/i });

    await user.click(radio4h);
    expect(radio4h).toBeChecked();
    expect(radio5a7h).not.toBeChecked();
    expect(radio8h).not.toBeChecked();

    await user.click(radio5a7h);
    expect(radio4h).not.toBeChecked();
    expect(radio5a7h).toBeChecked();
    expect(radio8h).not.toBeChecked();

    await user.click(radio8h);
    expect(radio4h).not.toBeChecked();
    expect(radio5a7h).not.toBeChecked();
    expect(radio8h).toBeChecked();
  });

  it("Testa a seleção de opções de kit lanche", async () => {
    const checkbox = screen.getByTestId("kit-1");
    expect(checkbox).not.toBeChecked();
    fireEvent.click(checkbox);
    expect(checkbox).toBeChecked();
  });

  it("Testa a seleção de alunos com dieta especial", async () => {
    const iconeSeta = screen.getByTestId("colapse-alunos");
    fireEvent.click(iconeSeta);
    await waitFor(() => {
      expect(screen.getByTestId("alunos-dieta-especial-0")).toBeInTheDocument();
    });

    const linha = screen.getByTestId("alunos-dieta-especial-0");
    expect(linha).toHaveTextContent("ARTHUR SANTOS MACEDO DE JESUS");
    expect(linha).toHaveTextContent("8199500");

    const checkbox = linha.querySelector('input[type="checkbox"]');
    expect(checkbox).toBeInTheDocument();
    fireEvent.click(checkbox);
  });

  it("Testa a lista de alunos com dieta especial", async () => {
    const iconeSeta = screen.getByTestId("colapse-alunos");
    fireEvent.click(iconeSeta);

    mockDietasAtivasInativas.solicitacoes.map(async (solicitacao, index) => {
      await waitFor(() => {
        const linha = screen.getByTestId(`alunos-dieta-especial-${index}`);
        expect(linha).toBeInTheDocument();
        expect(linha).toHaveTextContent(solicitacao.nome);
        expect(linha).toHaveTextContent(solicitacao.codigo_eol);
      });
    });
  });

  it("Testa botão Cancelar", async () => {
    const botaoCancelar = screen.getByText("Cancelar").closest("button");
    fireEvent.click(botaoCancelar);
  });

  it("Testa botão Salvar Rascunho", async () => {
    const botaoSalvarRascunho = screen
      .getByText("Salvar Rascunho")
      .closest("button");
    fireEvent.click(botaoSalvarRascunho);
  });

  it("Testa botão Enviar", async () => {
    const botaoEnviar = screen.getByText("Enviar").closest("button");
    fireEvent.click(botaoEnviar);
  });
});
