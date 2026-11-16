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

import RegistrarMemorandoOcorrencia from "../index";

const mockNavigate = jest.fn();

jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: () => mockNavigate,
}));

jest.mock("src/components/Shareable/Toast/dialogs");

const URL_MEMORANDO = "/pos-recebimento/memorandos-ocorrencia/";
const ROTA_LISTAGEM = `/${POS_RECEBIMENTO}/${MEMORANDO_OCORRENCIAS}`;

const setup = () =>
  render(
    <MemoryRouter>
      <RegistrarMemorandoOcorrencia />
    </MemoryRouter>,
  );

const selecionar = (testId, value) => {
  fireEvent.change(screen.getByTestId(testId).querySelector("select"), {
    target: { value },
  });
};

const preencherLote = (index) => {
  fireEvent.change(screen.getByTestId(`lote-${index}`), {
    target: { value: `LOTE-${index}` },
  });
  fireEvent.change(screen.getByTestId(`marca-${index}`), {
    target: { value: `Marca ${index}` },
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
    target: { value: "Arroz Tipo 1" },
  });
  selecionar("tipo-ocorrencia", "RECLAMACAO_QUALIDADE");
};

describe("RegistrarMemorandoOcorrencia", () => {
  beforeEach(() => {
    mock.reset();
    mockNavigate.mockClear();
  });

  it("exibe os campos e placeholders do formulário", () => {
    setup();

    expect(screen.getByText("Categoria")).toBeInTheDocument();
    expect(screen.getByText("Selecione a Categoria")).toBeInTheDocument();
    expect(
      screen.getByPlaceholderText("Digite aqui o Nome do Produto"),
    ).toBeInTheDocument();
    expect(screen.getByText("Tipo de Ocorrência")).toBeInTheDocument();
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
    expect(screen.getByText("+ Adicionar Lote")).toBeInTheDocument();
  });

  it("mantém o botão de adicionar lote desabilitado até o lote atual estar completo", () => {
    setup();

    const botaoAdicionar = screen.getByTestId("adicionar-lote");
    expect(botaoAdicionar).toBeDisabled();

    fireEvent.change(screen.getByTestId("lote-0"), {
      target: { value: "LOTE-0" },
    });
    expect(botaoAdicionar).toBeDisabled();

    preencherLote(0);
    expect(screen.getByTestId("adicionar-lote")).not.toBeDisabled();
  });

  it("exibe o tooltip do botão de adicionar lote apenas quando ele está desabilitado", async () => {
    setup();

    const botaoDesabilitado = screen.getByTestId("adicionar-lote");
    expect(botaoDesabilitado).toBeDisabled();

    fireEvent.mouseEnter(botaoDesabilitado.parentElement);

    expect(
      await screen.findByText(
        "Preencha os dados do lote atual para adicionar um novo lote.",
      ),
    ).toBeInTheDocument();

    preencherLote(0);
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

  it("adiciona um novo lote preservando os dados do anterior", () => {
    setup();
    preencherLote(0);
    fireEvent.click(screen.getByTestId("adicionar-lote"));

    expect(screen.getByTestId("lote-1")).toBeInTheDocument();
    expect(screen.getByTestId("lote-0")).toHaveValue("LOTE-0");
    expect(screen.getByTestId("remover-lote-1")).toBeInTheDocument();
    expect(screen.queryByTestId("remover-lote-0")).not.toBeInTheDocument();
  });

  it("não exclui o lote ao cancelar o modal", () => {
    setup();
    preencherLote(0);
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
    setup();
    preencherLote(0);
    fireEvent.click(screen.getByTestId("adicionar-lote"));
    fireEvent.click(screen.getByTestId("remover-lote-1"));

    await act(async () => {
      fireEvent.click(screen.getByText("Sim"));
    });

    await waitFor(() => {
      expect(screen.queryByTestId("lote-1")).not.toBeInTheDocument();
    });
    expect(screen.getByTestId("lote-0")).toHaveValue("LOTE-0");
  });

  it("envia o payload e volta para a listagem", async () => {
    mock.onPost(URL_MEMORANDO).reply(201, { uuid: "uuid-memorando" });
    setup();

    preencherDadosProduto();
    preencherLote(0);

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
      produto: "Arroz Tipo 1",
      tipo_ocorrencia: "RECLAMACAO_QUALIDADE",
      lotes: [
        {
          lote: "LOTE-0",
          marca: "Marca 0",
          data_fabricacao: "01/01/2026",
          data_validade: "01/01/2027",
          quantidade_problema_devolucao: "10.00",
        },
      ],
    });
  });

  it("mantém o envio desabilitado com campos obrigatórios vazios", () => {
    setup();
    expect(screen.getByTestId("salvar-ocorrencia")).toBeDisabled();
  });
});
