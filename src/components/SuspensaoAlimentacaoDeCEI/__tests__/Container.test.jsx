import "@testing-library/jest-dom";
import { act, screen } from "@testing-library/react";
import { Container } from "src/components/SuspensaoAlimentacaoDeCEI/Container";
import { MODULO_GESTAO, PERFIL, TIPO_PERFIL } from "src/constants/shared";
import { MeusDadosContext } from "src/context/MeusDadosContext";
import { mockDiasUteis } from "src/mocks/diasUseisMock";
import { localStorageMock } from "src/mocks/localStorageMock";
import { mockMeusDadosEscolaCEIcomMANHAeTARDE } from "src/mocks/meusDados/escola/CEIcomMANHAeTARDE";
import { mockRascunhosSuspensaoAlimentacaoCEI } from "src/mocks/services/suspensaoAlimentacaoCei.service/mockRascunhosSuspensaoAlimentacaoCEI";
import { mockMotivosSuspensaoCardapio } from "src/mocks/services/suspensaoDeAlimentacao.service/mockMotivosSuspensaoCardapio";
import mock from "src/services/_mock";
import { renderWithProvider } from "src/utils/test-utils";

const URL_MOTIVOS = "/motivos-suspensao-cardapio/";
const URL_DIAS_UTEIS = "/dias-uteis/";
const URL_RASCUNHOS = "/suspensao-alimentacao-de-cei/meus_rascunhos/";

const clonar = (objeto) => JSON.parse(JSON.stringify(objeto));

const setup = async (
  meusDados = clonar(mockMeusDadosEscolaCEIcomMANHAeTARDE),
) => {
  await act(async () => {
    renderWithProvider(
      <MeusDadosContext.Provider value={{ meusDados }}>
        <Container />
      </MeusDadosContext.Provider>,
    );
  });
};

describe("SuspensaoAlimentacaoDeCEI - Container", () => {
  beforeEach(() => {
    mock.reset();
    mock.onGet(URL_MOTIVOS).reply(200, mockMotivosSuspensaoCardapio);
    mock.onGet(URL_DIAS_UTEIS).reply(200, mockDiasUteis);
    mock.onGet(URL_RASCUNHOS).reply(200, mockRascunhosSuspensaoAlimentacaoCEI);

    Object.defineProperty(global, "localStorage", { value: localStorageMock });
    localStorage.setItem("tipo_perfil", TIPO_PERFIL.ESCOLA);
    localStorage.setItem("perfil", PERFIL.ADMINISTRADOR_UE);
    localStorage.setItem("modulo_gestao", MODULO_GESTAO.TERCEIRIZADA);
  });

  afterEach(() => {
    localStorage.clear();
  });

  it("carrega motivos, dias úteis e períodos e renderiza o formulário", async () => {
    await setup();

    expect(
      await screen.findByText("Descrição da Suspensão"),
    ).toBeInTheDocument();
    expect(screen.queryByText("Carregando...")).not.toBeInTheDocument();

    const requisicaoDiasUteis = mock.history.get.find((requisicao) =>
      requisicao.url.endsWith(URL_DIAS_UTEIS),
    );
    expect(requisicaoDiasUteis.params).toEqual({
      escola_uuid:
        mockMeusDadosEscolaCEIcomMANHAeTARDE.vinculo_atual.instituicao.uuid,
    });

    expect(
      screen.getByRole("option", { name: "Selecione" }),
    ).toBeInTheDocument();
    mockMotivosSuspensaoCardapio.results.forEach((motivo) => {
      expect(
        screen.getByRole("option", { name: motivo.nome }),
      ).toBeInTheDocument();
    });
  });

  it("exibe o loader e não busca os dias úteis enquanto não há dados do usuário", async () => {
    await setup(null);

    expect(screen.getByText("Carregando...")).toBeInTheDocument();
    expect(screen.getByAltText("sigpae-loader")).toBeInTheDocument();
    expect(
      mock.history.get.some((requisicao) =>
        requisicao.url.endsWith(URL_DIAS_UTEIS),
      ),
    ).toBe(false);
  });

  it("exibe mensagem de erro quando falha ao carregar os motivos de suspensão", async () => {
    mock.onGet(URL_MOTIVOS).reply(400, {});

    await setup();

    expect(
      await screen.findByText(
        "Erro ao carregar motivos de suspensão. Tente novamente mais tarde.",
      ),
    ).toBeInTheDocument();
    expect(screen.queryByText("Carregando...")).not.toBeInTheDocument();
    expect(
      screen.queryByText("Descrição da Suspensão"),
    ).not.toBeInTheDocument();
  });

  it("exibe mensagem de erro quando falha ao carregar os dias úteis", async () => {
    mock.onGet(URL_DIAS_UTEIS).reply(400, {});

    await setup();

    expect(
      await screen.findByText(
        "Erro ao carregar dias úteis. Tente novamente mais tarde.",
      ),
    ).toBeInTheDocument();
    expect(
      screen.queryByText("Descrição da Suspensão"),
    ).not.toBeInTheDocument();
  });
});
