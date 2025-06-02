import "@testing-library/jest-dom";
import {
  act,
  fireEvent,
  render,
  screen,
  waitFor,
} from "@testing-library/react";
import { PERFIL, TIPO_PERFIL } from "src/constants/shared";
import { mockInclusaoAlimentacaoAutorizada } from "mocks/InclusaoAlimentacao/mockInclusaoAlimentacaoAutorizada";
import { mockInclusaoAlimentacaoNegada } from "mocks/InclusaoAlimentacao/mockInclusaoAlimentacaoNegada";
import { mockInclusaoAlimentacaoValidada } from "mocks/InclusaoAlimentacao/mockInclusaoAlimentacaoValidada";
import { localStorageMock } from "mocks/localStorageMock";
import { mockMeusDadosCODAEGA } from "mocks/meusDados/CODAE-GA";
import { mockMotivosDRENaoValida } from "mocks/services/relatorios.service/mockMotivosDRENaoValida";
import * as RelatoriosInclusaoDeAlimentacao from "src/pages/InclusaoDeAlimentacao/RelatorioPage";
import { MemoryRouter } from "react-router-dom";
import mock from "src/services/_mock";

jest.mock("components/Shareable/CKEditorField", () => ({
  __esModule: true,
  default: () => <textarea data-testid="ckeditor-mock" name="justificativa" />,
}));

describe("Relatório Inclusão de Alimentação - Visão CODAE", () => {
  beforeEach(async () => {
    mock.onGet("/usuarios/meus-dados/").reply(200, mockMeusDadosCODAEGA);
    mock.onGet("/motivos-dre-nao-valida/").reply(200, mockMotivosDRENaoValida);
    mock
      .onGet(
        "/grupos-inclusao-alimentacao-normal/d0f4faf0-519b-4a1a-a1bf-ae39c45d1f64/"
      )
      .replyOnce(200, mockInclusaoAlimentacaoValidada);

    mock
      .onPatch(
        "/grupos-inclusao-alimentacao-normal/d0f4faf0-519b-4a1a-a1bf-ae39c45d1f64/codae-cancela-pedido/"
      )
      .reply(200, {});
    mock
      .onPatch(
        "/grupos-inclusao-alimentacao-normal/d0f4faf0-519b-4a1a-a1bf-ae39c45d1f64/codae-autoriza-pedido/"
      )
      .reply(200, {});

    Object.defineProperty(global, "localStorage", { value: localStorageMock });
    localStorage.setItem(
      "tipo_perfil",
      TIPO_PERFIL.GESTAO_ALIMENTACAO_TERCEIRIZADA
    );
    localStorage.setItem(
      "perfil",
      PERFIL.COORDENADOR_GESTAO_ALIMENTACAO_TERCEIRIZADA
    );

    const search = `?uuid=d0f4faf0-519b-4a1a-a1bf-ae39c45d1f64&ehInclusaoContinua=false&tipoSolicitacao=solicitacao-normal`;
    Object.defineProperty(window, "location", {
      value: {
        search: search,
      },
    });

    await act(async () => {
      render(
        <MemoryRouter
          future={{
            v7_startTransition: true,
            v7_relativeSplatPath: true,
          }}
        >
          <RelatoriosInclusaoDeAlimentacao.RelatorioCODAE />
        </MemoryRouter>
      );
    });
  });

  it("renderiza título da página `Inclusão de Alimentação - Solicitação # D0F4F`", async () => {
    expect(
      screen.getByText("Inclusão de Alimentação - Solicitação # D0F4F")
    ).toBeInTheDocument();
  });

  it("renderiza label `Solicitação no prazo regular`", async () => {
    expect(
      screen.getByText("Solicitação no prazo regular")
    ).toBeInTheDocument();
  });

  it("renderiza motivo e data", async () => {
    expect(screen.getByText("Motivo")).toBeInTheDocument();
    expect(screen.getByText("Reposição de aula")).toBeInTheDocument();

    expect(screen.getByText("Dia(s) de inclusão")).toBeInTheDocument();
    expect(screen.getByText("02/04/2025")).toBeInTheDocument();
  });

  it("renderiza tabela com período, tipos de alimentação e nº de alunos", async () => {
    expect(screen.getByText("Período")).toBeInTheDocument();
    expect(screen.getByText("MANHA")).toBeInTheDocument();

    expect(screen.getByText("Tipos de Alimentação")).toBeInTheDocument();
    expect(screen.getByText("Lanche")).toBeInTheDocument();

    expect(screen.getByText("Nº de Alunos")).toBeInTheDocument();
    expect(screen.getByText("123")).toBeInTheDocument();
  });

  it("exibe modal negar", async () => {
    const botaoNegar = screen.getByText("Negar").closest("button");
    fireEvent.click(botaoNegar);

    await waitFor(() => {
      expect(
        screen.getByText("Deseja negar a solicitação?")
      ).toBeInTheDocument();
    });
  });

  it("fecha modal negar", async () => {
    const botaoNegar = screen.getByText("Negar").closest("button");
    fireEvent.click(botaoNegar);

    await waitFor(() => {
      expect(
        screen.getByText("Deseja negar a solicitação?")
      ).toBeInTheDocument();
    });

    const botaoNao = screen.getByText("Não").closest("button");
    fireEvent.click(botaoNao);

    await waitFor(() => {
      expect(
        screen.queryByText("Deseja negar a solicitação?")
      ).not.toBeInTheDocument();
    });
  });

  it("nega a solicitação", async () => {
    const botaoNegar = screen.getByText("Negar").closest("button");
    fireEvent.click(botaoNegar);

    await waitFor(() => {
      expect(
        screen.getByText("Deseja negar a solicitação?")
      ).toBeInTheDocument();
    });

    const textarea = screen.getByTestId("ckeditor-mock");
    fireEvent.change(textarea, {
      target: { value: "negado." },
    });

    const botaoSim = screen.getByText("Sim").closest("button");
    fireEvent.click(botaoSim);

    mock
      .onGet(
        "/grupos-inclusao-alimentacao-normal/d0f4faf0-519b-4a1a-a1bf-ae39c45d1f64/"
      )
      .replyOnce(200, mockInclusaoAlimentacaoNegada);

    await waitFor(() => {
      expect(
        screen.queryByText("Deseja negar a solicitação?")
      ).not.toBeInTheDocument();
    });

    expect(screen.queryByText("Negar")).not.toBeInTheDocument();
    expect(screen.queryByText("Autorizar")).not.toBeInTheDocument();

    expect(screen.getByText("CODAE negou")).toBeInTheDocument();
  });

  it("autoriza a solicitação", async () => {
    const botaoValidar = screen.getByText("Autorizar").closest("button");
    fireEvent.click(botaoValidar);

    await waitFor(() => {
      expect(
        screen.queryByText("Deseja autorizar a solicitação?")
      ).toBeInTheDocument();
    });

    const textarea = screen.getByTestId("ckeditor-mock");
    fireEvent.change(textarea, {
      target: { value: "negado." },
    });

    const botaoSim = screen.getByText("Sim").closest("button");
    fireEvent.click(botaoSim);

    mock
      .onGet(
        "/grupos-inclusao-alimentacao-normal/d0f4faf0-519b-4a1a-a1bf-ae39c45d1f64/"
      )
      .replyOnce(200, mockInclusaoAlimentacaoAutorizada);

    await waitFor(() => {
      expect(
        screen.queryByText("Deseja autorizar a solicitação?")
      ).not.toBeInTheDocument();
    });

    expect(screen.queryByText("Negar")).not.toBeInTheDocument();
    expect(screen.queryByText("Autorizar")).not.toBeInTheDocument();

    expect(screen.getByText("CODAE autorizou")).toBeInTheDocument();
    expect(
      screen.getByText("27/02/2025 13:37:34 - Informações da CODAE")
    ).toBeInTheDocument();
    expect(screen.getByText("sim, eu autorizo")).toBeInTheDocument();
  });
});
