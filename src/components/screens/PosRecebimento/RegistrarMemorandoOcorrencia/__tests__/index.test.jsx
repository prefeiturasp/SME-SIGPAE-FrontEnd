import "@testing-library/jest-dom";
import {
  act,
  fireEvent,
  render,
  screen,
  waitFor,
} from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";

import mock from "src/services/_mock";
import { MEMORANDO_OCORRENCIAS, POS_RECEBIMENTO } from "src/configs/constants";
import { mockListaUnidadesMedidaLogistica } from "src/mocks/cronograma.service/mockGetUnidadesDeMedidaLogistica";

import RegistrarMemorandoOcorrencia from "../index";

const mockNavigate = jest.fn();

jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: () => mockNavigate,
}));

jest.mock("src/components/Shareable/Toast/dialogs");

const URL_MEMORANDO = "/pos-recebimento/memorandos-ocorrencia/";
const URL_UNIDADES = "/unidades-medida-logistica/lista-nomes-abreviacoes/";
const ROTA_LISTAGEM = `/${POS_RECEBIMENTO}/${MEMORANDO_OCORRENCIAS}`;

const UUID_KG = "9fec9127-c22f-49c5-b8f4-633039bc6b7f";

const setup = async () => {
  render(
    <MemoryRouter>
      <RegistrarMemorandoOcorrencia />
    </MemoryRouter>,
  );
  await waitFor(() => {
    const unidadeSelect = screen
      .getByTestId("unidade-medida")
      .querySelector("select");
    expect(
      unidadeSelect.querySelector(`option[value="${UUID_KG}"]`),
    ).toBeTruthy();
  });
};

const selecionar = (testId, value) => {
  fireEvent.change(screen.getByTestId(testId).querySelector("select"), {
    target: { value },
  });
};

const preencherLote = (index) => {
  fireEvent.change(screen.getByTestId(`lote-${index}`), {
    target: { value: `LOTE ${index}` },
  });
  fireEvent.change(screen.getByTestId(`marca-${index}`), {
    target: { value: `MARCA ${index}` },
  });
  fireEvent.change(
    screen.getByTestId(`data-fabricacao-${index}`).querySelector("input"),
    { target: { value: "01/01/2026" } },
  );
  fireEvent.change(
    screen.getByTestId(`data-validade-${index}`).querySelector("input"),
    { target: { value: "01/01/2027" } },
  );
  fireEvent.change(screen.getByTestId(`quantidade-${index}`), {
    target: { value: "10" },
  });
};

const preencherDadosProduto = () => {
  selecionar("categoria", "NAO_PERECIVEIS");
  fireEvent.change(screen.getByTestId("produto"), {
    target: { value: "ARROZ TIPO 1" },
  });
};

describe("RegistrarMemorandoOcorrencia", () => {
  beforeEach(() => {
    mock.reset();
    mockNavigate.mockClear();
    mock.onGet(URL_UNIDADES).reply(200, mockListaUnidadesMedidaLogistica);
  });

  it("exibe os campos e placeholders do formulário", async () => {
    await setup();

    expect(screen.getByText("Dados do Produto")).toBeInTheDocument();
    expect(screen.getByText("Categoria")).toBeInTheDocument();
    expect(screen.getByText("Selecione a Categoria")).toBeInTheDocument();
    expect(
      screen.getByPlaceholderText("Digite aqui o Nome do Produto"),
    ).toBeInTheDocument();
    expect(screen.queryByText("Tipo de Ocorrência")).not.toBeInTheDocument();
    expect(screen.getByText("Unidade de Medida")).toBeInTheDocument();
    expect(
      screen.getByPlaceholderText("Digite aqui o Lote do Produto"),
    ).toBeInTheDocument();
    expect(
      screen.getByPlaceholderText("Digite aqui a Marca do Produto"),
    ).toBeInTheDocument();
    expect(screen.getAllByPlaceholderText("Selecione a data")).toHaveLength(2);
    expect(
      screen.getByText("Quantidade com Problema / Devolução"),
    ).toBeInTheDocument();
    expect(screen.getByText("+ Adicionar Novo Lote")).toBeInTheDocument();
  });

  it("mantém o botão de adicionar lote desabilitado até o lote atual estar completo e a unidade de medida selecionada", async () => {
    await setup();

    const botaoAdicionar = screen.getByTestId("adicionar-lote");
    expect(botaoAdicionar).toBeDisabled();

    preencherLote(0);
    expect(screen.getByTestId("adicionar-lote")).toBeDisabled();

    selecionar("unidade-medida", UUID_KG);
    expect(screen.getByTestId("adicionar-lote")).not.toBeDisabled();
  });

  it("exibe o tooltip do botão de adicionar lote apenas quando ele está desabilitado", async () => {
    await setup();

    const botaoDesabilitado = screen.getByTestId("adicionar-lote");
    expect(botaoDesabilitado).toBeDisabled();

    fireEvent.mouseEnter(botaoDesabilitado.parentElement);

    expect(
      await screen.findByText(
        "Preencha os dados do lote atual para adicionar um novo lote.",
      ),
    ).toBeInTheDocument();

    preencherLote(0);
    selecionar("unidade-medida", UUID_KG);
    expect(screen.getByTestId("adicionar-lote")).not.toBeDisabled();

    fireEvent.mouseEnter(screen.getByTestId("adicionar-lote"));

    await waitFor(() => {
      expect(
        screen.queryByText(
          "Preencha os dados do lote atual para adicionar um novo lote.",
        ),
      ).not.toBeInTheDocument();
    });
  });

  it("padroniza produto e marca em maiúsculas sem acentos", async () => {
    await setup();

    fireEvent.change(screen.getByTestId("produto"), {
      target: { value: "Açúcar cristal" },
    });
    fireEvent.change(screen.getByTestId("marca-0"), {
      target: { value: "Tio João" },
    });

    expect(screen.getByTestId("produto")).toHaveValue("ACUCAR CRISTAL");
    expect(screen.getByTestId("marca-0")).toHaveValue("TIO JOAO");
  });

  it("adiciona um novo lote preservando os dados do anterior e mostra a abreviação da unidade no suffix dos lotes adicionais", async () => {
    await setup();
    preencherLote(0);
    selecionar("unidade-medida", UUID_KG);
    fireEvent.click(screen.getByTestId("adicionar-lote"));

    expect(screen.getByTestId("lote-1")).toBeInTheDocument();
    expect(screen.getByTestId("lote-0")).toHaveValue("LOTE 0");
    expect(screen.getByTestId("remover-lote-1")).toBeInTheDocument();
    expect(screen.queryByTestId("remover-lote-0")).not.toBeInTheDocument();

    const containerQuantidade1 = screen
      .getByTestId("quantidade-1")
      .closest(".input-com-sufixo");
    expect(containerQuantidade1).toHaveTextContent("kg");
  });

  it("bloqueia o envio e exibe a mensagem quando há lotes duplicados", async () => {
    await setup();
    preencherDadosProduto();
    selecionar("unidade-medida", UUID_KG);
    preencherLote(0);
    fireEvent.click(screen.getByTestId("adicionar-lote"));

    fireEvent.change(screen.getByTestId("lote-1"), {
      target: { value: "LOTE 0" },
    });
    fireEvent.change(screen.getByTestId("marca-1"), {
      target: { value: "MARCA 0" },
    });
    fireEvent.change(
      screen.getByTestId("data-fabricacao-1").querySelector("input"),
      { target: { value: "01/01/2026" } },
    );
    fireEvent.change(
      screen.getByTestId("data-validade-1").querySelector("input"),
      { target: { value: "01/01/2027" } },
    );
    fireEvent.change(screen.getByTestId("quantidade-1"), {
      target: { value: "5" },
    });

    expect(
      await screen.findByTestId("erro-lote-duplicado-1"),
    ).toHaveTextContent(
      "Este lote já foi informado para o produto. Verifique os dados e tente novamente.",
    );
    expect(screen.getByTestId("salvar-ocorrencia")).toBeDisabled();
  });

  it("não exclui o lote ao cancelar o modal", async () => {
    await setup();
    preencherLote(0);
    selecionar("unidade-medida", UUID_KG);
    fireEvent.click(screen.getByTestId("adicionar-lote"));
    fireEvent.click(screen.getByTestId("remover-lote-1"));

    expect(screen.getByText("Excluir Lote")).toBeInTheDocument();
    expect(
      screen.getByText("Deseja realmente excluir o Lote?"),
    ).toBeInTheDocument();

    fireEvent.click(screen.getByText("Não"));

    expect(screen.getByTestId("lote-1")).toBeInTheDocument();
  });

  it("exclui somente o lote selecionado ao confirmar", async () => {
    await setup();
    preencherLote(0);
    selecionar("unidade-medida", UUID_KG);
    fireEvent.click(screen.getByTestId("adicionar-lote"));
    fireEvent.click(screen.getByTestId("remover-lote-1"));

    await act(async () => {
      fireEvent.click(screen.getByText("Sim"));
    });

    await waitFor(() => {
      expect(screen.queryByTestId("lote-1")).not.toBeInTheDocument();
    });
    expect(screen.getByTestId("lote-0")).toHaveValue("LOTE 0");
  });

  it("envia o payload com unidade_medida no topo, tipo_ocorrencia fixo e volta para a listagem", async () => {
    mock.onPost(URL_MEMORANDO).reply(201, { uuid: "uuid-memorando" });
    await setup();

    preencherDadosProduto();
    preencherLote(0);
    selecionar("unidade-medida", UUID_KG);

    const botaoSalvar = screen.getByTestId("salvar-ocorrencia");
    expect(botaoSalvar).not.toBeDisabled();

    await act(async () => {
      fireEvent.click(botaoSalvar);
    });

    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith(ROTA_LISTAGEM);
    });

    const payload = JSON.parse(mock.history.post[0].data);
    expect(payload).toEqual({
      categoria: "NAO_PERECIVEIS",
      produto: "ARROZ TIPO 1",
      tipo_ocorrencia: "RECLAMACAO_QUALIDADE",
      unidade_medida: UUID_KG,
      lotes: [
        {
          lote: "LOTE 0",
          marca: "MARCA 0",
          data_fabricacao: "01/01/2026",
          data_validade: "01/01/2027",
          quantidade_problema_devolucao: "10.00",
        },
      ],
    });
  });

  it("mantém o envio desabilitado com campos obrigatórios vazios", async () => {
    await setup();
    expect(screen.getByTestId("salvar-ocorrencia")).toBeDisabled();
  });
});
