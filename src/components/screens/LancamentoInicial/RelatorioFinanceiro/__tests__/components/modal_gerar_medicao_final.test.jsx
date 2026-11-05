import {
  act,
  fireEvent,
  render,
  screen,
  waitFor,
} from "@testing-library/react";
import { useState } from "react";
import ModalGerarMedicaoFinal from "../../components/ModalGerarMedicaoFinal";
import {
  toastError,
  toastSuccess,
} from "src/components/Shareable/Toast/dialogs";
import mock from "src/services/_mock";

jest.mock("src/components/Shareable/Toast/dialogs");

const UUID = "uuid-relatorio";
const URL_DADOS = `/medicao-inicial/relatorio-financeiro/${UUID}/dados-medicao-final/`;
const URL_RESPONSAVEL =
  "/medicao-inicial/relatorio-financeiro/buscar-responsavel/";
const URL_GERAR = `/medicao-inicial/relatorio-financeiro/${UUID}/gerar-medicao-final/`;

const dadosMedicaoFinal = {
  empresa_contratada: "EMPRESA TESTE LTDA",
  periodo_inicio: "01/03/2025",
  periodo_fim: "31/03/2025",
  lote: "3567-1",
  dre: "DRE IPIRANGA",
  tipos_unidade: "CEMEI, CEU CEMEI",
  numero_contrato: "123/2024",
  numero_processo_administrativo: null,
};

const MSG_NAO_LOCALIZADO = "RF não localizado. Verifique o número informado.";

describe("Testes do Modal Gerar Medição Final", () => {
  const setShowModal = jest.fn();
  const onSucesso = jest.fn();

  const Wrapper = () => {
    const [show, setShow] = useState(true);
    return (
      <>
        <button data-testid="reabrir" onClick={() => setShow(true)} />
        <ModalGerarMedicaoFinal
          showModal={show}
          setShowModal={(valor) => {
            setShowModal(valor);
            setShow(valor);
          }}
          uuidRelatorio={UUID}
          onSucesso={onSucesso}
        />
      </>
    );
  };

  const abrir = async () => {
    await act(async () => {
      render(<Wrapper />);
    });
  };

  const digitar = (testId, valor) => {
    const input = screen.getByTestId(testId);
    fireEvent.change(input, { target: { value: valor } });
    return input;
  };

  const preencherRfValido = async (rf = "1234567") => {
    const input = digitar("rf", rf);
    await act(async () => {
      fireEvent.blur(input);
    });
    await waitFor(() =>
      expect(screen.getByTestId("nome_responsavel")).toHaveValue(
        "FULANO DE TAL",
      ),
    );
  };

  beforeEach(() => {
    mock.onGet(URL_DADOS).reply(200, dadosMedicaoFinal);
    mock
      .onGet(URL_RESPONSAVEL, { params: { rf: "1234567" } })
      .reply(200, { rf: "1234567", nome: "FULANO DE TAL" });
    mock
      .onGet(URL_RESPONSAVEL, { params: { rf: "9999999" } })
      .reply(404, { detail: MSG_NAO_LOCALIZADO });
  });

  afterEach(() => {
    jest.clearAllMocks();
    mock.reset();
  });

  it("carrega e exibe os dados somente leitura, com '-' para valores nulos", async () => {
    await abrir();

    expect(screen.getByText("Gerar Medição Final")).toBeInTheDocument();
    const bloco = screen.getByTestId("dados-medicao-final");
    expect(bloco).toHaveTextContent("EMPRESA TESTE LTDA");
    expect(bloco).toHaveTextContent("01/03/2025 a 31/03/2025");
    expect(bloco).toHaveTextContent("3567-1 - DRE IPIRANGA");
    expect(bloco).toHaveTextContent("CEMEI, CEU CEMEI");
    expect(bloco).toHaveTextContent("123/2024");
    expect(bloco).toHaveTextContent("Nº do processo administrativo: -");
    expect(bloco.querySelector("input")).toBeNull();
  });

  it("exibe toast de erro quando falha ao carregar os dados", async () => {
    mock.onGet(URL_DADOS).reply(500);
    await abrir();

    expect(toastError).toHaveBeenCalledWith(
      "Erro ao carregar os dados da Medição Final.",
    );
  });

  it("aceita somente números no campo RF", async () => {
    await abrir();

    const input = digitar("rf", "12a3-4b5");

    expect(input).toHaveValue("12345");
  });

  it("preenche o nome do responsável quando o RF é encontrado", async () => {
    await abrir();

    await preencherRfValido();

    expect(screen.getByTestId("nome_responsavel")).toBeDisabled();
    expect(screen.queryByText(MSG_NAO_LOCALIZADO)).not.toBeInTheDocument();
  });

  it("exibe a mensagem e limpa o nome quando o RF não é localizado", async () => {
    await abrir();
    await preencherRfValido();

    const input = digitar("rf", "9999999");
    await act(async () => {
      fireEvent.blur(input);
    });

    expect(await screen.findByText(MSG_NAO_LOCALIZADO)).toBeInTheDocument();
    expect(screen.getByTestId("nome_responsavel")).toHaveValue("");
  });

  it("limpa nome e erro ao alterar o RF após uma busca", async () => {
    await abrir();
    const input = digitar("rf", "9999999");
    await act(async () => {
      fireEvent.blur(input);
    });
    await screen.findByText(MSG_NAO_LOCALIZADO);

    digitar("rf", "99999998");

    expect(screen.queryByText(MSG_NAO_LOCALIZADO)).not.toBeInTheDocument();
    expect(screen.getByTestId("nome_responsavel")).toHaveValue("");
  });

  it("descarta a resposta de uma busca antiga quando o RF muda durante a requisição", async () => {
    let resolverBuscaAntiga;
    mock.onGet(URL_RESPONSAVEL, { params: { rf: "1234567" } }).reply(
      () =>
        new Promise((resolve) => {
          resolverBuscaAntiga = () =>
            resolve([200, { rf: "1234567", nome: "FULANO DE TAL" }]);
        }),
    );
    await abrir();

    const input = digitar("rf", "1234567");
    await act(async () => {
      fireEvent.blur(input);
    });
    expect(screen.getByTestId("buscando-rf")).toBeInTheDocument();

    digitar("rf", "12345678");
    await act(async () => {
      resolverBuscaAntiga();
    });

    expect(screen.getByTestId("nome_responsavel")).toHaveValue("");
    expect(screen.queryByTestId("buscando-rf")).not.toBeInTheDocument();
  });

  it("mantém Salvar desabilitado enquanto a busca do RF está em andamento", async () => {
    mock
      .onGet(URL_RESPONSAVEL, { params: { rf: "1234567" } })
      .reply(() => new Promise(() => {}));
    await abrir();
    digitar("numero_processo_pagamento", "2025/001");

    const input = digitar("rf", "1234567");
    await act(async () => {
      fireEvent.blur(input);
    });

    expect(screen.getByTestId("buscando-rf")).toBeInTheDocument();
    expect(screen.getByTestId("botao-salvar")).toBeDisabled();
  });

  it("habilita/desabilita o Salvar conforme as regras de preenchimento", async () => {
    await abrir();
    const salvar = screen.getByTestId("botao-salvar");
    expect(salvar).toBeDisabled();

    await preencherRfValido();
    expect(salvar).toBeDisabled();

    digitar("numero_processo_pagamento", "   ");
    expect(salvar).toBeDisabled();

    digitar("numero_processo_pagamento", "2025/001");
    expect(salvar).toBeEnabled();

    const rf = digitar("rf", "9999999");
    await act(async () => {
      fireEvent.blur(rf);
    });
    await screen.findByText(MSG_NAO_LOCALIZADO);
    expect(salvar).toBeDisabled();
  });

  it("Cancelar fecha o modal sem chamar a API de geração", async () => {
    await abrir();

    fireEvent.click(screen.getByTestId("botao-cancelar"));

    expect(setShowModal).toHaveBeenCalledWith(false);
    expect(mock.history.post).toHaveLength(0);
    expect(mock.history.patch).toHaveLength(0);
  });

  it("o X fecha o modal sem chamar a API de geração", async () => {
    await abrir();

    fireEvent.click(screen.getByRole("button", { name: /close/i }));

    expect(setShowModal).toHaveBeenCalledWith(false);
    expect(mock.history.post).toHaveLength(0);
  });

  it("ao reabrir o modal o formulário está limpo", async () => {
    await abrir();
    await preencherRfValido();
    digitar("numero_processo_pagamento", "2025/001");

    fireEvent.click(screen.getByTestId("botao-cancelar"));
    await waitFor(() =>
      expect(screen.queryByTestId("rf")).not.toBeInTheDocument(),
    );
    fireEvent.click(screen.getByTestId("reabrir"));

    expect(await screen.findByTestId("rf")).toHaveValue("");
    expect(screen.getByTestId("nome_responsavel")).toHaveValue("");
    expect(screen.getByTestId("numero_processo_pagamento")).toHaveValue("");
  });

  it("ao salvar com sucesso exibe o toast, fecha o modal e aciona o redirecionamento", async () => {
    mock.onPost(URL_GERAR).reply(200, { uuid: UUID });
    await abrir();
    await preencherRfValido();
    digitar("numero_processo_pagamento", " 2025/001 ");

    await act(async () => {
      fireEvent.click(screen.getByTestId("botao-salvar"));
    });

    await waitFor(() => expect(onSucesso).toHaveBeenCalledTimes(1));
    expect(JSON.parse(mock.history.post[0].data)).toEqual({
      rf_responsavel_conferencia: "1234567",
      numero_processo_pagamento: "2025/001",
    });
    expect(toastSuccess).toHaveBeenCalledWith(
      "Medição Final Gerada com sucesso",
    );
    expect(setShowModal).toHaveBeenCalledWith(false);
  });

  it("ao falhar exibe o detail do backend e mantém o modal aberto com os dados", async () => {
    mock
      .onPost(URL_GERAR)
      .reply(400, { detail: "Relatório não está em análise." });
    await abrir();
    await preencherRfValido();
    digitar("numero_processo_pagamento", "2025/001");

    await act(async () => {
      fireEvent.click(screen.getByTestId("botao-salvar"));
    });

    await waitFor(() =>
      expect(toastError).toHaveBeenCalledWith("Relatório não está em análise."),
    );
    expect(onSucesso).not.toHaveBeenCalled();
    expect(setShowModal).not.toHaveBeenCalled();
    expect(screen.getByTestId("rf")).toHaveValue("1234567");
    expect(screen.getByTestId("numero_processo_pagamento")).toHaveValue(
      "2025/001",
    );
  });

  it("ao falhar sem detail exibe mensagem genérica", async () => {
    mock.onPost(URL_GERAR).reply(500, "erro");
    await abrir();
    await preencherRfValido();
    digitar("numero_processo_pagamento", "2025/001");

    await act(async () => {
      fireEvent.click(screen.getByTestId("botao-salvar"));
    });

    await waitFor(() =>
      expect(toastError).toHaveBeenCalledWith(
        "Erro ao gerar a Medição Final. Tente novamente.",
      ),
    );
  });
  const salvarComErro = async (status, corpo) => {
    mock.onPost(URL_GERAR).reply(status, corpo);
    await abrir();
    await preencherRfValido();
    digitar("numero_processo_pagamento", "2025/001");
    await act(async () => {
      fireEvent.click(screen.getByTestId("botao-salvar"));
    });
  };

  it("exibe no campo RF o erro rf_responsavel_conferencia retornado pelo POST", async () => {
    await salvarComErro(400, {
      rf_responsavel_conferencia: [MSG_NAO_LOCALIZADO],
    });

    expect(await screen.findByText(MSG_NAO_LOCALIZADO)).toBeInTheDocument();
    expect(toastError).not.toHaveBeenCalled();
    expect(screen.getByTestId("botao-salvar")).toBeDisabled();
  });

  it("exibe non_field_errors do POST em toast", async () => {
    await salvarComErro(400, { non_field_errors: ["Medição já gerada."] });

    await waitFor(() =>
      expect(toastError).toHaveBeenCalledWith("Medição já gerada."),
    );
  });

  it("exibe erro de campo do POST em toast", async () => {
    await salvarComErro(400, {
      numero_processo_pagamento: ["Este campo não pode ser em branco."],
    });

    await waitFor(() =>
      expect(toastError).toHaveBeenCalledWith(
        "Este campo não pode ser em branco.",
      ),
    );
  });

  it("exibe o detail de um 503 do POST em toast", async () => {
    await salvarComErro(503, { detail: "Integração indisponível." });

    await waitFor(() =>
      expect(toastError).toHaveBeenCalledWith("Integração indisponível."),
    );
  });

  it("trata de forma genérica o 400 em lista do buscar-responsavel", async () => {
    mock
      .onGet(URL_RESPONSAVEL, { params: { rf: "1234567" } })
      .reply(400, ["Deve ter somente dígitos"]);
    await abrir();

    const input = digitar("rf", "1234567");
    await act(async () => {
      fireEvent.blur(input);
    });

    await waitFor(() =>
      expect(toastError).toHaveBeenCalledWith(
        "Erro ao buscar o responsável pelo RF. Tente novamente.",
      ),
    );
    expect(screen.queryByText(MSG_NAO_LOCALIZADO)).not.toBeInTheDocument();
    expect(screen.getByTestId("botao-salvar")).toBeDisabled();
  });

  it("limita o RF a 20 dígitos", async () => {
    await abrir();

    expect(screen.getByTestId("rf")).toHaveAttribute("maxlength", "20");
  });

  it("não quebra quando lote sem DRE, empresa e contrato vêm nulos", async () => {
    mock.onGet(URL_DADOS).reply(200, {
      ...dadosMedicaoFinal,
      empresa_contratada: null,
      dre: null,
      numero_contrato: null,
    });
    await abrir();

    const bloco = screen.getByTestId("dados-medicao-final");
    expect(bloco).toHaveTextContent("Empresa Contratada: -");
    expect(bloco).toHaveTextContent("Lote/DRE: 3567-1");
    expect(bloco).not.toHaveTextContent("3567-1 -");
    expect(bloco).toHaveTextContent("Nº do contrato: -");
  });
});
