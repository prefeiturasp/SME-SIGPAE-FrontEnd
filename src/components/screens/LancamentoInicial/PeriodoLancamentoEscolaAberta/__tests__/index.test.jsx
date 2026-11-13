import "@testing-library/jest-dom";
import {
  cleanup,
  fireEvent,
  render,
  screen,
  waitFor,
} from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import mock from "src/services/_mock";
import { PeriodoLancamentoEscolaAberta } from "..";

const solicitacao = {
  uuid: "1e1ca513-5b44-44e4-9c3b-ad5307613466",
  escola_uuid: "3c32be8e-f191-468d-a4e2-3dd8751e5e7a",
  mes: "10",
  ano: "2026",
};

const cadastro = {
  possui_cadastro: true,
  cadastro: {
    uuid: "0b5f0f48-0e3d-4d05-9f19-1f3e6d10b5f8",
    data_inicial: "01/10/2026",
    data_final: "31/10/2026",
    dias_semana: ["0", "2"],
    num_participantes: 50,
    tipos_alimentacao: [
      { uuid: "uuid-lanche-4h", nome: "Lanche 4h" },
      { uuid: "uuid-lanche", nome: "Lanche" },
    ],
  },
};

const renderComponente = () =>
  render(
    <MemoryRouter
      initialEntries={[
        {
          pathname:
            "/lancamento-inicial/lancamento-medicao-inicial/periodo-lancamento",
          search: `?uuid=${solicitacao.uuid}`,
          state: {
            grupo: "Escola Aberta",
            solicitacaoMedicaoInicial: solicitacao,
          },
        },
      ]}
      future={{ v7_startTransition: true, v7_relativeSplatPath: true }}
    >
      <PeriodoLancamentoEscolaAberta />
      <ToastContainer />
    </MemoryRouter>,
  );

const renderComRotas = () =>
  render(
    <MemoryRouter
      initialEntries={[
        { pathname: "/tela-anterior" },
        {
          pathname:
            "/lancamento-inicial/lancamento-medicao-inicial/periodo-lancamento",
          search: `?uuid=${solicitacao.uuid}`,
          state: {
            grupo: "Escola Aberta",
            solicitacaoMedicaoInicial: solicitacao,
          },
        },
      ]}
      initialIndex={1}
      future={{ v7_startTransition: true, v7_relativeSplatPath: true }}
    >
      <Routes>
        <Route path="/tela-anterior" element={<div>Tela anterior</div>} />
        <Route
          path="/lancamento-inicial/lancamento-medicao-inicial/periodo-lancamento"
          element={<PeriodoLancamentoEscolaAberta />}
        />
      </Routes>
      <ToastContainer />
    </MemoryRouter>,
  );

describe("PeriodoLancamentoEscolaAberta", () => {
  beforeEach(() => {
    mock.reset();
    mock.onGet("/escola-aberta/por-escola/").reply(200, cadastro);
    mock
      .onGet("/medicao-inicial/categorias-medicao/")
      .reply(200, [{ id: 1, nome: "ALIMENTAÇÃO" }]);
    mock.onGet("/medicao-inicial/valores-medicao/").reply(200, []);
  });

  afterEach(() => {
    cleanup();
    mock.reset();
  });

  it("renderiza mês, período, semanas e tipos de alimentação do cadastro", async () => {
    renderComponente();

    expect(await screen.findByText("Participantes")).toBeInTheDocument();
    expect(screen.getByText("Lanche 4h")).toBeInTheDocument();
    expect(screen.getByText("Lanche")).toBeInTheDocument();
    expect(screen.getByText("Observações")).toBeInTheDocument();
    expect(screen.getByDisplayValue("Outubro / 2026")).toBeInTheDocument();
    expect(screen.getByDisplayValue("Escola Aberta")).toBeInTheDocument();
    expect(screen.getByText("Semana 1")).toBeInTheDocument();
    expect(screen.getByText("Semana 5")).toBeInTheDocument();
    expect(screen.getAllByDisplayValue("Mês anterior").length).toBeGreaterThan(
      0,
    );
  });

  it("habilita somente as datas previstas no cadastro de Escola Aberta", async () => {
    renderComponente();
    await screen.findByText("Participantes");

    fireEvent.click(screen.getByText("Semana 2"));

    const inputSegunda = await screen.findByTestId(
      "lanche__dia_05__categoria_1",
    );
    const inputTerca = screen.getByTestId("lanche__dia_06__categoria_1");

    expect(inputSegunda).not.toBeDisabled();
    expect(inputTerca).toBeDisabled();
    expect(screen.getAllByDisplayValue("50")).toHaveLength(2);
  });

  it("abre e fecha o modal de observação de uma data habilitada", async () => {
    renderComponente();
    await screen.findByText("Participantes");

    fireEvent.click(screen.getByText("Semana 2"));
    fireEvent.click(
      await screen.findByTestId("botao-observacao-escola-aberta-05"),
    );

    expect(await screen.findByText("Observação Diária")).toBeInTheDocument();

    fireEvent.click(screen.getByTestId("botao-voltar"));

    await waitFor(() => {
      expect(screen.queryByText("Observação Diária")).not.toBeInTheDocument();
    });
  });

  it("bloqueia Salvar Lançamentos quando o valor excede os participantes", async () => {
    renderComponente();
    await screen.findByText("Participantes");

    fireEvent.click(screen.getByText("Semana 2"));

    const inputLanche = await screen.findByTestId(
      "lanche__dia_05__categoria_1",
    );
    fireEvent.change(inputLanche, { target: { value: "51" } });

    await waitFor(() => {
      expect(inputLanche).toHaveClass("invalid-field");
    });

    expect(
      screen.getByText("Salvar Lançamentos").closest("button"),
    ).toBeDisabled();
    expect(screen.getByTestId("icone-tooltip-info")).toHaveClass(
      "icone-info-invalid",
    );
  });

  it("não permite trocar de semana quando há erro de preenchimento", async () => {
    renderComponente();
    await screen.findByText("Participantes");

    fireEvent.click(screen.getByText("Semana 2"));

    const inputLanche = await screen.findByTestId(
      "lanche__dia_05__categoria_1",
    );
    fireEvent.change(inputLanche, { target: { value: "51" } });

    await waitFor(() => {
      expect(inputLanche).toHaveClass("invalid-field");
    });

    fireEvent.click(screen.getByText("Semana 3"));

    expect(await screen.findByText("Aviso de Erro")).toBeInTheDocument();
    expect(screen.getByText("Semana 2").closest(".ant-tabs-tab")).toHaveClass(
      "ant-tabs-tab-active",
    );
  });

  it("carrega valores salvos e atualiza a medição existente", async () => {
    let payloadAtualizacao;

    mock.onGet("/medicao-inicial/valores-medicao/").reply(200, [
      {
        nome_campo: "lanche",
        dia: "05",
        valor: "10",
        categoria_medicao: 1,
        medicao_uuid: "uuid-medicao",
      },
    ]);
    mock.onPatch("/medicao-inicial/medicao/uuid-medicao/").reply((config) => {
      payloadAtualizacao = JSON.parse(config.data);
      return [200, { valores_medicao: [] }];
    });

    renderComponente();
    await screen.findByText("Participantes");

    fireEvent.click(screen.getByText("Semana 2"));

    const inputLanche = await screen.findByTestId(
      "lanche__dia_05__categoria_1",
    );

    expect(inputLanche).toHaveValue("10");

    fireEvent.change(inputLanche, { target: { value: "12" } });
    fireEvent.click(screen.getByText("Salvar Lançamentos"));

    await waitFor(() => {
      expect(payloadAtualizacao).toBeTruthy();
    });

    expect(payloadAtualizacao.valores_medicao).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          dia: "05",
          valor: "12",
          nome_campo: "lanche",
          tipo_alimentacao: "uuid-lanche",
        }),
      ]),
    );
  });

  it("envia remoção ao apagar um valor já salvo", async () => {
    let payloadAtualizacao;

    mock.onGet("/medicao-inicial/valores-medicao/").reply(200, [
      {
        nome_campo: "lanche",
        dia: "05",
        valor: "10",
        categoria_medicao: 1,
        medicao_uuid: "uuid-medicao",
      },
    ]);
    mock.onPatch("/medicao-inicial/medicao/uuid-medicao/").reply((config) => {
      payloadAtualizacao = JSON.parse(config.data);
      return [200, { valores_medicao: [] }];
    });

    renderComponente();
    await screen.findByText("Participantes");

    fireEvent.click(screen.getByText("Semana 2"));

    const inputLanche = await screen.findByTestId(
      "lanche__dia_05__categoria_1",
    );
    expect(inputLanche).toHaveValue("10");

    fireEvent.change(inputLanche, { target: { value: "" } });
    fireEvent.click(screen.getByText("Salvar Lançamentos"));

    await waitFor(() => {
      expect(payloadAtualizacao).toBeTruthy();
    });

    expect(payloadAtualizacao.valores_medicao).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          dia: "05",
          valor: "-1",
          nome_campo: "lanche",
          tipo_alimentacao: "uuid-lanche",
        }),
      ]),
    );
  });

  it("volta direto quando não há alterações não salvas", async () => {
    renderComRotas();
    await screen.findByText("Participantes");

    fireEvent.click(screen.getByText("Voltar"));

    expect(await screen.findByText("Tela anterior")).toBeInTheDocument();
  });

  it("pede confirmação ao voltar com alterações não salvas", async () => {
    renderComRotas();
    await screen.findByText("Participantes");

    fireEvent.click(screen.getByText("Semana 2"));

    const inputLanche = await screen.findByTestId(
      "lanche__dia_05__categoria_1",
    );
    fireEvent.change(inputLanche, { target: { value: "5" } });

    fireEvent.click(screen.getByText("Voltar"));

    expect(
      await screen.findByText(
        'Deseja realmente sair da página de lançamento em edição? Caso opte por "Sim", você poderá perder os dados inseridos!',
      ),
    ).toBeInTheDocument();

    fireEvent.click(screen.getByText("Sim"));

    expect(await screen.findByText("Tela anterior")).toBeInTheDocument();
  });

  it("preenche participantes somente nas datas habilitadas e salva a semana", async () => {
    let payloadSalvo;

    mock.onPost("/medicao-inicial/medicao/").reply((config) => {
      payloadSalvo = JSON.parse(config.data);
      return [201, { valores_medicao: [] }];
    });

    renderComponente();
    await screen.findByText("Participantes");

    fireEvent.click(screen.getByText("Semana 2"));

    await waitFor(() => {
      expect(screen.getAllByDisplayValue("50")).toHaveLength(2);
    });

    fireEvent.click(screen.getByText("Salvar Lançamentos"));

    await waitFor(() => {
      expect(payloadSalvo).toBeTruthy();
    });

    expect(payloadSalvo.grupo).toBe("Escola Aberta");
    expect(payloadSalvo.solicitacao_medicao_inicial).toBe(solicitacao.uuid);
    expect(payloadSalvo.valores_medicao).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          dia: "05",
          valor: "50",
          nome_campo: "participantes",
          categoria_medicao: 1,
        }),
        expect.objectContaining({
          dia: "07",
          valor: "50",
          nome_campo: "participantes",
          categoria_medicao: 1,
        }),
      ]),
    );
  });
});
