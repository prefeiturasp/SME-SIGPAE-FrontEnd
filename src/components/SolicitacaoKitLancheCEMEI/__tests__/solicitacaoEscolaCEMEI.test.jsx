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
import { renderWithProvider } from "src/utils/test-utils";
import { MemoryRouter } from "react-router-dom";
import { mockMeusDadosEscolaCEMEISuzanaCampos } from "src/mocks/meusDados/escolaCEMEISuzanaCampos";
import { APIMockVersion } from "src/mocks/apiVersionMock";
import { mockConsultakits } from "src/mocks/SolicitacaoKitLancheCEMEI/mockGetConsultaKits";
import { mockDietasAtivasInativas } from "src/mocks/DietaEspecial/mockAtivasInativasCEMEISuzana";
import { mockConsultaRascunhos } from "src/mocks/SolicitacaoKitLancheCEMEI/mockGetSolicitacaoRascunho";
import { SolicitacaoKitLancheCEMEI } from "src/components/SolicitacaoKitLancheCEMEI/index";
import { localStorageMock } from "src/mocks/localStorageMock";
import userEvent from "@testing-library/user-event";
import { dataParaUTC } from "src/helpers/utilities";

describe("Teste de Solicitação de Kit Lanche CEMEI", () => {
  const escolaUuid =
    mockMeusDadosEscolaCEMEISuzanaCampos.vinculo_atual.instituicao.uuid;

  async function selecionarDataNoDatepicker(
    usuario,
    dataDesejada = "15 de agosto de 2025"
  ) {
    const calendarioIcone = screen
      .getByTestId("data-passeio-cemei")
      .querySelector(".fa-calendar-alt");
    await usuario.click(calendarioIcone);
    const datepickerModal = document.querySelector(".react-datepicker");
    const nextButton = screen.getByRole("button", { name: /Next Month/i });
    await usuario.click(nextButton);
    const dataSelecionada = datepickerModal?.querySelector(
      `[role="option"][aria-label*="${dataDesejada}"]`
    );
    await usuario.click(dataSelecionada);
  }

  const responseFaixasEtarias = {
    count: 1,
    results: [
      {
        faixa_etaria: {
          __str__: "01 ano a 03 anos e 11 meses",
          uuid: "e3030bd1-2e85-4676-87b3-96b4032370d4",
          inicio: 12,
          fim: 48,
        },
        count: 50,
      },
    ],
  };

  beforeEach(async () => {
    mock
      .onGet("/usuarios/meus-dados/")
      .reply(200, mockMeusDadosEscolaCEMEISuzanaCampos);
    mock
      .onGet("/downloads/quantidade-nao-vistos/")
      .reply(200, { quantidade_nao_vistos: 31 });
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
    mock.onGet("/kit-lanches/consulta-kits/").reply(200, mockConsultakits);
    mock
      .onGet("/solicitacoes-dieta-especial-ativas-inativas/")
      .reply((config) => {
        if (config.params.incluir_alteracao_ue === true) {
          return [200, mockDietasAtivasInativas];
        }
      });
    mock.onGet(`/dias-uteis/?escola_uuid=${escolaUuid}/`).reply(200, {
      proximos_cinco_dias_uteis: "2025-08-04",
      proximos_dois_dias_uteis: "2025-07-31",
    });
    mock.onGet("/solicitacao-kit-lanche-cemei/").reply((config) => {
      if (config.params.status === "RASCUNHO") {
        return [200, mockConsultaRascunhos];
      }
    });
    mock
      .onGet(
        "/periodos-escolares/e17e2405-36be-4981-a09c-35c89ae0f8b7/alunos-por-faixa-etaria/2025-08-15/"
      )
      .reply(200, responseFaixasEtarias);

    window.HTMLElement.prototype.scrollIntoView = jest.fn();

    Object.defineProperty(global, "localStorage", { value: localStorageMock });
    localStorage.setItem("eh_cemei", true);

    await act(async () => {
      renderWithProvider(
        <MemoryRouter
          future={{
            v7_startTransition: true,
            v7_relativeSplatPath: true,
          }}
        >
          <SolicitacaoKitLancheCEMEI
            meusDados={mockMeusDadosEscolaCEMEISuzanaCampos}
            kits={mockConsultakits.results}
            alunosComDietaEspecial={mockDietasAtivasInativas.solicitacoes}
            proximosCincoDiasUteis={dataParaUTC(new Date("2025-08-04"))}
            proximosDoisDiasUteis={dataParaUTC(new Date("2025-07-31"))}
          />
        </MemoryRouter>
      );
    });
  });

  it("Testa card Matriculados", async () => {
    await waitFor(() => {
      expect(screen.getAllByText(/Total de Matriculados/i)).toHaveLength(1);
      expect(screen.getAllByText(/187/i)).toHaveLength(1);
      expect(screen.getAllByText(/Matriculados CE/i)).toHaveLength(1);
      expect(screen.getAllByText(/79/i)).toHaveLength(1);
      expect(screen.getAllByText(/Matriculados EMEI/i)).toHaveLength(1);
      expect(screen.getAllByText(/108/i)).toHaveLength(1);
      expect(
        screen.getAllByText(
          /Informação automática disponibilizada pelo Cadastro da Unidade Escolar/i
        )
      ).toHaveLength(1);
    });
  });

  it("Testa card Rascunhos", async () => {
    expect(screen.getAllByText(/Rascunhos/i)).toHaveLength(1);
    const primeiroRascunho = screen.getByTestId(`card-rascunho-cemei-0`);
    const botaoDeletarPrimeiro = screen.getByTestId(
      "btn-delete-rascunho-cemei-0"
    );
    expect(
      within(primeiroRascunho).getByText(
        /Solicitação de Kit Lanche Passeio #35F81/i
      )
    ).toBeInTheDocument();
    expect(
      within(primeiroRascunho).getByText(/Data do evento/i)
    ).toBeInTheDocument();
    expect(
      within(primeiroRascunho).getByText("15/08/2025")
    ).toBeInTheDocument();
    expect(
      within(primeiroRascunho).getByText(/Local do passeio/i)
    ).toBeInTheDocument();
    expect(
      within(primeiroRascunho).getByText(/Fazenda Boa Fazendinha/i)
    ).toBeInTheDocument();
    expect(within(primeiroRascunho).getByText(/EMEI/i)).toBeInTheDocument();
    expect(
      within(primeiroRascunho).getByText("Salvo em: 30/07/2025 11:43:07")
    ).toBeInTheDocument();
    expect(within(primeiroRascunho).getByText(/RASCUNHO/i)).toBeInTheDocument();
    fireEvent.click(botaoDeletarPrimeiro);

    const segundoRascunho = screen.getByTestId(`card-rascunho-cemei-1`);
    const botaoDeletarSegundo = screen.getByTestId(
      "btn-delete-rascunho-cemei-1"
    );
    expect(
      within(segundoRascunho).getByText(
        /Solicitação de Kit Lanche Passeio #CEEDE/i
      )
    ).toBeInTheDocument();
    expect(
      within(segundoRascunho).getByText(/Data do evento/i)
    ).toBeInTheDocument();
    expect(within(segundoRascunho).getByText("21/08/2025")).toBeInTheDocument();
    expect(
      within(segundoRascunho).getByText(/Local do passeio/i)
    ).toBeInTheDocument();
    expect(
      within(segundoRascunho).getByText(/Prefeitura/i)
    ).toBeInTheDocument();
    expect(within(segundoRascunho).getByText(/CEI/i)).toBeInTheDocument();
    expect(
      within(segundoRascunho).getByText("Salvo em: 30/07/2025 11:41:03")
    ).toBeInTheDocument();
    expect(within(segundoRascunho).getByText(/RASCUNHO/i)).toBeInTheDocument();
    fireEvent.click(botaoDeletarSegundo);

    const terceiroRascunho = screen.getByTestId(`card-rascunho-cemei-2`);
    const botaoDeletarTerceiro = screen.getByTestId(
      "btn-delete-rascunho-cemei-2"
    );
    expect(
      within(terceiroRascunho).getByText(
        /Solicitação de Kit Lanche Passeio #04BBA/i
      )
    ).toBeInTheDocument();
    expect(
      within(terceiroRascunho).getByText(/Data do evento/i)
    ).toBeInTheDocument();
    expect(
      within(terceiroRascunho).getByText("20/08/2025")
    ).toBeInTheDocument();
    expect(
      within(terceiroRascunho).getByText(/Local do passeio/i)
    ).toBeInTheDocument();
    expect(within(terceiroRascunho).getByText(/Museu/i)).toBeInTheDocument();
    expect(within(terceiroRascunho).getByText(/TODOS/i)).toBeInTheDocument();
    expect(
      within(terceiroRascunho).getByText("Salvo em: 30/07/2025 10:33:15")
    ).toBeInTheDocument();
    expect(within(terceiroRascunho).getByText(/RASCUNHO/i)).toBeInTheDocument();
    fireEvent.click(botaoDeletarTerceiro);
  });

  it("Testa card Nova Solicitação", async () => {
    const cardSolicitacao = screen.getByTestId(`card-solicitacao-cemei`);
    expect(
      within(cardSolicitacao).getAllByText(/Data do passeio/i)
    ).toHaveLength(1);
    expect(
      within(cardSolicitacao).getAllByText(/Local do passeio/i)
    ).toHaveLength(1);
    expect(within(cardSolicitacao).getAllByText(/Alunos/i)).toHaveLength(1);
    expect(within(cardSolicitacao).getAllByText(/Selecione/i)).toHaveLength(1);
    expect(within(cardSolicitacao).getAllByText(/Todos/i)).toHaveLength(1);
    expect(within(cardSolicitacao).getAllByText(/CEI/i)).toHaveLength(1);
    expect(within(cardSolicitacao).getAllByText(/EMEI/i)).toHaveLength(1);
    expect(
      within(cardSolicitacao).getAllByText("Evento/Atividade")
    ).toHaveLength(1);
    expect(
      within(cardSolicitacao).getAllByText(/Número total de kits/i)
    ).toHaveLength(1);
    expect(within(cardSolicitacao).getAllByText(/Observações/i)).toHaveLength(
      1
    );
  });

  it("Testa a seleção de data do passeio", async () => {
    const usuario = userEvent.setup();
    const datepickerInput = screen
      .getByTestId("data-passeio-cemei")
      .querySelector("input");
    expect(datepickerInput).toHaveValue("");

    const calendarioIcone = screen
      .getByTestId("data-passeio-cemei")
      .querySelector(".fa-calendar-alt");
    await usuario.click(calendarioIcone);
    const datepickerModal = document.querySelector(".react-datepicker");
    expect(datepickerModal).toBeInTheDocument();

    const diaSeisDeAgosto = datepickerModal?.querySelector(
      '[role="option"][aria-label*="6 de agosto de 2025"]'
    );
    expect(diaSeisDeAgosto).not.toBeInTheDocument();

    const nextButton = screen.getByRole("button", { name: /Next Month/i });
    await usuario.click(nextButton);

    await waitFor(async () => {
      const diaSeisDeAgosto = datepickerModal?.querySelector(
        '[role="option"][aria-label*="6 de agosto de 2025"]'
      );
      expect(diaSeisDeAgosto).toBeInTheDocument();
      await usuario.click(diaSeisDeAgosto);
    });

    const inputViaCalendario = screen
      .getByTestId("data-passeio-cemei")
      .querySelector("input");
    await waitFor(() => {
      expect(inputViaCalendario).toHaveValue("06/08/2025");
    });

    const inputManual = screen
      .getByTestId("data-passeio-cemei")
      .querySelector("input");
    fireEvent.change(inputManual, { target: { value: "06/08/2025" } });
    expect(inputManual).toHaveValue("06/08/2025");
  });

  it("Testa o input local do Passeio", async () => {
    const usuario = userEvent.setup();
    const campoInput = screen.getByTestId("local-passeio-cemei");

    expect(campoInput).toHaveValue("");
    await usuario.type(campoInput, "Texto de teste");
    expect(campoInput).toHaveValue("Texto de teste");

    await usuario.clear(campoInput);
    expect(campoInput).toHaveValue("");
  });

  it("Testa o input do nome do evento", async () => {
    const usuario = userEvent.setup();
    const campoInput = screen.getByTestId("nome-evento-atividade-cemei");

    expect(campoInput).toHaveValue("");
    await usuario.type(campoInput, "Texto de teste");
    expect(campoInput).toHaveValue("Texto de teste");

    await usuario.clear(campoInput);
    expect(campoInput).toHaveValue("");
  });

  it("Testa o input de observação", async () => {
    const container = screen.getByTestId("observacao-solicitacao-cemei");
    const editable = container.querySelector(".ck-editor__editable");
    await waitFor(() => {
      expect(editable).toBeInTheDocument();
    });

    fireEvent.input(editable, { target: { innerHTML: "Texto de teste" } });
    expect(editable).toHaveTextContent("Texto de teste");
  });

  it("Testa botão Cancelar", async () => {
    const botaoCancelar = screen.getByText("Cancelar").closest("button");
    fireEvent.click(botaoCancelar);
  });

  it("Testa botão Salvar Rascunho", async () => {
    const botaoSalvarRascunho = screen
      .getByText("Salvar rascunho")
      .closest("button");
    fireEvent.click(botaoSalvarRascunho);
  });

  it("Testa botão Enviar", async () => {
    const botaoEnviar = screen.getByText("Enviar").closest("button");
    fireEvent.click(botaoEnviar);
  });

  it("Testa a seleção de alunos", async () => {
    const usuario = userEvent.setup();
    const seletorStatus = screen
      .getByTestId("alunos-cemei")
      .querySelector("select");
    const opcoes = within(seletorStatus).getAllByRole("option");
    expect(opcoes).toHaveLength(4);

    const textosDasOpcoes = opcoes.map((opt) => opt.textContent);
    expect(textosDasOpcoes).toEqual(["Selecione", "Todos", "CEI", "EMEI"]);

    expect(seletorStatus).toHaveValue("");
    expect(seletorStatus).toHaveTextContent("Selecione");

    await selecionarDataNoDatepicker(usuario);

    await usuario.selectOptions(seletorStatus, "Todos");
    expect(seletorStatus).toHaveValue("TODOS");
    expect(seletorStatus).toHaveTextContent("Todos");

    await usuario.selectOptions(seletorStatus, "CEI");
    expect(seletorStatus).toHaveValue("CEI");
    expect(seletorStatus).toHaveTextContent("CEI");

    await usuario.selectOptions(seletorStatus, "EMEI");
    expect(seletorStatus).toHaveValue("EMEI");
    expect(seletorStatus).toHaveTextContent("EMEI");
  });

  it("Testa a solicitação CEI da CEMEI", async () => {
    const usuario = userEvent.setup();
    await selecionarDataNoDatepicker(usuario);
    const seletorStatus = screen
      .getByTestId("alunos-cemei")
      .querySelector("select");
    await usuario.selectOptions(seletorStatus, "CEI");
    expect(screen.getByText(/Alunos CEI/i)).toBeInTheDocument();
    expect(screen.getByText(/Tempo previsto do passeio/i)).toBeInTheDocument();
    expect(screen.getByText("até 4 horas (1 Kit)")).toBeInTheDocument();
    expect(screen.getByText("de 5 a 7 horas (2 Kits)")).toBeInTheDocument();
    expect(screen.getByText(/Selecione a opção desejada/i)).toBeInTheDocument();
    expect(screen.getByText("KIT")).toBeInTheDocument();
    expect(screen.getByText(/teste/i)).toBeInTheDocument();
    expect(screen.getByText(/Número total de kits/i)).toBeInTheDocument();

    const radio4h = screen.getByRole("radio", { name: /até 4 horas/i });

    await usuario.click(radio4h);
    expect(radio4h).toBeChecked();

    const checkbox = screen.getByTestId("kit-cemei-1");
    await usuario.click(checkbox);
    expect(checkbox).toBeChecked();

    const iconeSeta = screen.getByTestId("colapse-alunos");
    fireEvent.click(iconeSeta);
    expect(screen.queryByTestId("alunos-dieta-especial-0")).toBeNull();

    const quantidadeAlunos = screen.getByTestId("quantidade-aluno-cei-0");
    await usuario.type(quantidadeAlunos, "40");
    expect(quantidadeAlunos).toHaveValue(40);
  });

  it("Testa a solicitação EMEI da CEMEI", async () => {
    const usuario = userEvent.setup();
    await selecionarDataNoDatepicker(usuario);
    const seletorStatus = screen
      .getByTestId("alunos-cemei")
      .querySelector("select");
    await usuario.selectOptions(seletorStatus, "EMEI");
    expect(screen.getByText(/Alunos EMEI/i)).toBeInTheDocument();
    expect(screen.getByText(/Tempo previsto do passeio/i)).toBeInTheDocument();
    expect(screen.getByText("até 4 horas (1 Kit)")).toBeInTheDocument();
    expect(screen.getByText("de 5 a 7 horas (2 Kits)")).toBeInTheDocument();
    expect(screen.getByText("8 horas ou mais (3 Kits)")).toBeInTheDocument();
    expect(screen.getByText(/Selecione a opção desejada/i)).toBeInTheDocument();
    expect(screen.getByText("KIT")).toBeInTheDocument();
    expect(screen.getByText(/teste/i)).toBeInTheDocument();
    expect(screen.getByText(/Alunos matriculados:/i)).toBeInTheDocument();
    expect(screen.getByText(/Quantidade/i)).toBeInTheDocument();
    expect(screen.getByText(/Número total de kits:/i)).toBeInTheDocument();

    const radio4h = screen.getByRole("radio", { name: /de 5 a 7 horas/i });
    await usuario.click(radio4h);
    expect(radio4h).toBeChecked();

    const checkbox = screen.getByTestId("kit-cemei-1");
    await usuario.click(checkbox);
    expect(checkbox).toBeChecked();

    const iconeSeta = screen.getByTestId("colapse-alunos");
    fireEvent.click(iconeSeta);
    expect(screen.queryByTestId("alunos-dieta-especial-0")).toBeNull();

    const quantidadeAlunos = screen.getByTestId("quantidade-aluno-emei");
    await usuario.type(quantidadeAlunos, "100");
    expect(quantidadeAlunos).toHaveValue(100);
  });
});
