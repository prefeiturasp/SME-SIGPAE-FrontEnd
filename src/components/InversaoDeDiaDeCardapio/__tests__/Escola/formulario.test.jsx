import "@testing-library/jest-dom";
import {
  act,
  fireEvent,
  render,
  screen,
  waitFor,
  within,
} from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import { MODULO_GESTAO, PERFIL, TIPO_PERFIL } from "src/constants/shared";
import { MeusDadosContext } from "src/context/MeusDadosContext";
import { mockDiasUteis } from "src/mocks/diasUseisMock";
import { localStorageMock } from "src/mocks/localStorageMock";
import { mockMeusDadosEscolaCEMEI } from "src/mocks/meusDados/escola/CEMEI";
import { mockGetVinculosTipoAlimentacaoPorEscolaCEMEI } from "src/mocks/services/cadastroTipoAlimentacao.service/CEMEI/vinculosTipoAlimentacaoPeriodoEscolar";
import { mockRascunhosInversaoDiaCardapioCEMEI } from "src/mocks/services/inversaoDiaCardapio.service/Escola/CEMEI/rascunhos";
import { InversaoDeDiaDeCardapioPage } from "src/pages/InversaoDeDiaDeCardapio/RelatorioPage";
import mock from "src/services/_mock";

jest.mock("src/components/Shareable/CKEditorField", () => ({
  __esModule: true,
  default: () => (
    <textarea data-testid="ckeditor-mock" name="observacoes" required={false} />
  ),
}));

describe("Teste Formulário Inversão de dia de Cardápio - Escola CEMEI", () => {
  const escolaUuid = mockMeusDadosEscolaCEMEI.vinculo_atual.instituicao.uuid;
  beforeEach(async () => {
    process.env.IS_TEST = true;

    mock.onGet("/usuarios/meus-dados/").reply(200, mockMeusDadosEscolaCEMEI);
    mock.onGet("/dias-uteis/").reply(200, mockDiasUteis);
    mock
      .onGet(
        `/vinculos-tipo-alimentacao-u-e-periodo-escolar/escola/${escolaUuid}/`
      )
      .reply(200, mockGetVinculosTipoAlimentacaoPorEscolaCEMEI);
    mock
      .onGet("/inversoes-dia-cardapio/minhas-solicitacoes/")
      .reply(200, mockRascunhosInversaoDiaCardapioCEMEI);

    Object.defineProperty(global, "localStorage", { value: localStorageMock });
    localStorage.setItem("nome_instituicao", `"CEMEI SUZANA CAMPOS TAUIL"`);
    localStorage.setItem("tipo_perfil", TIPO_PERFIL.ESCOLA);
    localStorage.setItem("perfil", PERFIL.DIRETOR_UE);
    localStorage.setItem("modulo_gestao", MODULO_GESTAO.TERCEIRIZADA);
    localStorage.setItem("eh_cemei", "true");

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
              meusDados: mockMeusDadosEscolaCEMEI,
              setMeusDados: jest.fn(),
            }}
          >
            <InversaoDeDiaDeCardapioPage />
            <ToastContainer />
          </MeusDadosContext.Provider>
        </MemoryRouter>
      );
    });
  });

  it("Renderiza título `Inversão de dia de Cardápio`", () => {
    expect(screen.queryAllByText("Inversão de dia de Cardápio")).toHaveLength(
      2
    );
  });

  it("Preenche formulario e salva rascunho", async () => {
    const selectTiposAlimentacao = screen.getByTestId(
      "select-tipos-alimentacao"
    );
    const selectControlTiposAlimentacao = within(
      selectTiposAlimentacao
    ).getByRole("combobox");
    fireEvent.mouseDown(selectControlTiposAlimentacao);
    const optionLanche = screen.getByText("Lanche");
    fireEvent.click(optionLanche);

    const divInputDataDe = screen.getByTestId("div-input-data_de");
    const inputElement1 = divInputDataDe.querySelector("input");
    fireEvent.change(inputElement1, {
      target: { value: "30/01/2025" },
    });

    const divInputDataPara = screen.getByTestId("div-input-data_para");
    const inputElement2 = divInputDataPara.querySelector("input");
    fireEvent.change(inputElement2, {
      target: { value: "31/01/2025" },
    });

    const selectAlunos1 = screen.getByTestId("select-alunos_da_cemei");
    const selectControlAlunos1 = within(selectAlunos1).getByRole("combobox");
    fireEvent.mouseDown(selectControlAlunos1);
    const optionTodosAlunos1 = screen.getByText("Todos");
    fireEvent.click(optionTodosAlunos1);

    const botaoAdicionarDia = screen
      .getByText("Adicionar Dia")
      .closest("button");
    fireEvent.click(botaoAdicionarDia);

    const divInputDataDe2 = screen.getByTestId("div-input-data_de_2");
    const inputElement3 = divInputDataDe2.querySelector("input");
    fireEvent.change(inputElement3, {
      target: { value: "01/02/2025" },
    });

    const divInputDataPara2 = screen.getByTestId("div-input-data_para_2");
    const inputElement4 = divInputDataPara2.querySelector("input");
    fireEvent.change(inputElement4, {
      target: { value: "02/02/2025" },
    });

    const selectAlunos2 = screen.getByTestId("select-alunos_da_cemei_2");
    const selectControlAlunos2 = within(selectAlunos2).getByRole("combobox");
    fireEvent.mouseDown(selectControlAlunos2);
    const optionTodosAlunos2 = screen.getByText("Todos");
    fireEvent.click(optionTodosAlunos2);

    mock.onPost("/inversoes-dia-cardapio/").reply(201, {});

    const botaoSalvarRascunho = screen
      .getByText("Salvar Rascunho")
      .closest("button");
    fireEvent.click(botaoSalvarRascunho);

    await waitFor(() => {
      expect(
        screen.getByText("Inversão de dia de Cardápio salvo com sucesso!")
      ).toBeInTheDocument();
    });
  });

  it("Carrega rascunho e envia", async () => {
    const botaoCarregarRascunho = screen.getByTestId("botao-carregar-rascunho");
    await act(async () => {
      fireEvent.click(botaoCarregarRascunho);
    });

    expect(screen.getByText("Solicitação # 2E398")).toBeInTheDocument();
    expect(screen.getByText("Atualizar")).toBeInTheDocument();

    mock
      .onPut(
        `/inversoes-dia-cardapio/${mockRascunhosInversaoDiaCardapioCEMEI.results[0].uuid}/`
      )
      .reply(200, {
        uuid: mockRascunhosInversaoDiaCardapioCEMEI.results[0].uuid,
      });
    mock
      .onPatch(
        `/inversoes-dia-cardapio/${mockRascunhosInversaoDiaCardapioCEMEI.results[0].uuid}/inicio-pedido/`
      )
      .reply(200, {});

    const botaoEnviar = screen.getByText("Enviar").closest("button");
    fireEvent.click(botaoEnviar);

    await waitFor(async () => {
      expect(
        screen.getByText("Inversão de dia de Cardápio enviada com sucesso!")
      ).toBeInTheDocument();
    });
  });
  it("Carrega rascunho e erro ao enviar", async () => {
    const botaoCarregarRascunho = screen.getByTestId("botao-carregar-rascunho");
    await act(async () => {
      fireEvent.click(botaoCarregarRascunho);
    });

    expect(screen.getByText("Solicitação # 2E398")).toBeInTheDocument();
    expect(screen.getByText("Atualizar")).toBeInTheDocument();

    mock
      .onPut(
        `/inversoes-dia-cardapio/${mockRascunhosInversaoDiaCardapioCEMEI.results[0].uuid}/`
      )
      .reply(200, {
        uuid: mockRascunhosInversaoDiaCardapioCEMEI.results[0].uuid,
      });
    mock
      .onPatch(
        `/inversoes-dia-cardapio/${mockRascunhosInversaoDiaCardapioCEMEI.results[0].uuid}/inicio-pedido/`
      )
      .reply(400, { detail: "Erro ao enviar pedido." });

    const botaoEnviar = screen.getByText("Enviar").closest("button");
    fireEvent.click(botaoEnviar);

    await waitFor(async () => {
      expect(screen.getByText("Erro ao enviar pedido.")).toBeInTheDocument();
    });
  });

  it("Exclui rascunho", async () => {
    mock
      .onDelete(
        `/inversoes-dia-cardapio/${mockRascunhosInversaoDiaCardapioCEMEI.results[0].uuid}/`
      )
      .replyOnce(204, {});
    window.confirm = jest.fn().mockImplementation(() => true);
    const botaoRemoverRascunho = screen.getByTestId("botao-remover-rascunho");
    mock.onGet("/inversoes-dia-cardapio/minhas-solicitacoes/").reply(200, []);
    await act(async () => {
      fireEvent.click(botaoRemoverRascunho);
    });
    await waitFor(() => {
      expect(screen.getByText(`Rascunho # 2E398 excluído com sucesso`));
    });
    expect(screen.queryByText("Rascunhos")).not.toBeInTheDocument();
  });

  it("Erro ao excluir rascunho", async () => {
    mock
      .onDelete(
        `/inversoes-dia-cardapio/${mockRascunhosInversaoDiaCardapioCEMEI.results[0].uuid}/`
      )
      .replyOnce(400, { detail: "Erro ao excluir rascunho" });
    window.confirm = jest.fn().mockImplementation(() => true);
    const botaoRemoverRascunho = screen.getByTestId("botao-remover-rascunho");
    await act(async () => {
      fireEvent.click(botaoRemoverRascunho);
    });
    await waitFor(() => {
      expect(
        screen.getByText(
          "Houve um erro ao excluir o rascunho. Tente novamente mais tarde."
        )
      ).toBeInTheDocument();
    });
  });

  it("Remove dia adicional", async () => {
    const botaoAdicionarDia = screen
      .getByText("Adicionar Dia")
      .closest("button");
    fireEvent.click(botaoAdicionarDia);

    await waitFor(() => {
      expect(screen.queryByText("Adicionar Dia")).not.toBeInTheDocument();
    });

    const botaoRemoverDia = screen.getByText("Remover dia").closest("button");
    fireEvent.click(botaoRemoverDia);

    await waitFor(() => {
      expect(screen.getByText("Adicionar Dia")).toBeInTheDocument();
    });
  });
});
