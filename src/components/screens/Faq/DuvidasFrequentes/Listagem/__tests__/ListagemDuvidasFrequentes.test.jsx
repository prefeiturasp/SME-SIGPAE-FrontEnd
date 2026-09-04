import React from "react";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { useNavigate } from "react-router-dom";
import {
  toastError,
  toastSuccess,
} from "src/components/Shareable/Toast/dialogs";
import {
  AJUDA,
  CADASTRO_DUVIDAS_FREQUENTES,
  EDITAR_DUVIDA_FREQUENTE,
} from "src/configs/constants";
import {
  excluirPerguntaFrequente,
  listarPerguntasFrequentes,
} from "src/services/faq.service";
import ListagemDuvidasFrequentes from "..";

jest.mock("react-router-dom", () => ({
  useNavigate: jest.fn(),
}));

jest.mock("src/services/faq.service", () => ({
  excluirPerguntaFrequente: jest.fn(),
  listarPerguntasFrequentes: jest.fn(),
}));

jest.mock("src/components/Shareable/Toast/dialogs", () => ({
  toastError: jest.fn(),
  toastSuccess: jest.fn(),
}));

jest.mock("src/components/Shareable/SigpaeLogoLoader", () => ({
  SigpaeLogoLoader: () => <div>Carregando dúvidas</div>,
}));

jest.mock("src/components/Shareable/Paginacao", () => ({
  Paginacao: ({ current, onChange }) => (
    <button type="button" onClick={() => onChange(current + 1)}>
      Próxima página
    </button>
  ),
}));

jest.mock("../../components/BotaoCadastroDuvidasFrequentes", () => ({
  __esModule: true,
  default: () => <button>Cadastrar Dúvidas Frequentes</button>,
}));

jest.mock("src/components/Shareable/ModalGenerico", () => ({
  __esModule: true,
  default: ({ show, titulo, texto, handleClose, handleSim, loading }) => {
    if (!show) {
      return null;
    }

    return (
      <div>
        <h2>{titulo}</h2>
        <div>{texto}</div>
        <button type="button" onClick={handleClose}>
          Não
        </button>
        <button type="button" onClick={handleSim} data-loading={loading}>
          Sim
        </button>
      </div>
    );
  },
}));

jest.mock("../../components/TabelaDuvidasFrequentes", () => ({
  __esModule: true,
  default: ({ aoEditar, aoExcluir, duvidas }) => (
    <div data-testid="tabela-duvidas">
      {duvidas.map((duvida) => (
        <div key={duvida.uuid}>
          <span>{duvida.titulo}</span>
          <span>{duvida.categoria}</span>
          <span>{duvida.perfis}</span>
          <button type="button" onClick={() => aoEditar(duvida)}>
            Editar {duvida.titulo}
          </button>
          <button type="button" onClick={() => aoExcluir(duvida)}>
            Excluir {duvida.titulo}
          </button>
        </div>
      ))}
    </div>
  ),
}));

const UUID_DUVIDA = "22b0d5e4-50f1-46cc-9cee-5fa30b7d7f57";
const UUID_DUVIDA_ULTIMA_PAGINA = "56fd6872-eccb-45b0-959b-c73bba8d429e";
const UUID_CATEGORIA = "96da837c-009f-41f2-ae46-d4a7fa52aa30";
const UUID_PERFIL = "996c50ce-ea3c-450f-8af0-f19940de223e";

const respostaPaginada = {
  data: {
    count: 14,
    next: "http://localhost/perguntas-frequentes/?page=2&page_size=10",
    previous: null,
    results: [
      {
        categoria: {
          nome: "Gestão de Alimentação",
          uuid: UUID_CATEGORIA,
        },
        pergunta: "Como solicitar uma dieta?",
        perfis: [
          {
            nome: "QUALIDADE",
            uuid: UUID_PERFIL,
          },
        ],
        todos_os_perfis: false,
        uuid: UUID_DUVIDA,
      },
    ],
  },
};

describe("ListagemDuvidasFrequentes", () => {
  const navegar = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    useNavigate.mockReturnValue(navegar);
    listarPerguntasFrequentes.mockResolvedValue(respostaPaginada);
  });

  it("lista as dúvidas formatadas e apresenta cadastro e paginação", async () => {
    render(<ListagemDuvidasFrequentes />);

    expect(screen.getByText("Carregando dúvidas")).toBeInTheDocument();

    await waitFor(() => {
      expect(screen.getByText("Como solicitar uma dieta?")).toBeInTheDocument();
    });

    expect(
      screen.getByText("Cadastrar Dúvidas Frequentes"),
    ).toBeInTheDocument();
    expect(
      screen.getByText("Dúvidas Frequentes Cadastradas"),
    ).toBeInTheDocument();
    expect(screen.getByText("Gestão de Alimentação")).toBeInTheDocument();
    expect(screen.getByText("QUALIDADE")).toBeInTheDocument();
    expect(listarPerguntasFrequentes).toHaveBeenCalledWith({
      ordering: "-criado_em",
      page: 1,
      page_size: 10,
    });
    expect(
      screen.getByRole("button", { name: "Próxima página" }),
    ).toBeInTheDocument();
  });

  it("consulta a página selecionada na paginação", async () => {
    render(<ListagemDuvidasFrequentes />);

    await screen.findByRole("button", { name: "Próxima página" });
    fireEvent.click(screen.getByRole("button", { name: "Próxima página" }));

    await waitFor(() => {
      expect(listarPerguntasFrequentes).toHaveBeenLastCalledWith({
        ordering: "-criado_em",
        page: 2,
        page_size: 10,
      });
    });
  });

  it("direciona para a edição da dúvida selecionada", async () => {
    render(<ListagemDuvidasFrequentes />);

    fireEvent.click(
      await screen.findByRole("button", {
        name: "Editar Como solicitar uma dieta?",
      }),
    );

    expect(navegar).toHaveBeenCalledWith(
      `/${AJUDA}/${CADASTRO_DUVIDAS_FREQUENTES}/${UUID_DUVIDA}/${EDITAR_DUVIDA_FREQUENTE}`,
    );
  });

  it("cancela a exclusão da dúvida", async () => {
    render(<ListagemDuvidasFrequentes />);

    fireEvent.click(
      await screen.findByRole("button", {
        name: "Excluir Como solicitar uma dieta?",
      }),
    );

    expect(screen.getByText("Excluir Dúvida")).toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: "Não" }));

    expect(screen.queryByText("Excluir Dúvida")).not.toBeInTheDocument();
    expect(excluirPerguntaFrequente).not.toHaveBeenCalled();
  });

  it("exclui a dúvida e atualiza a listagem", async () => {
    listarPerguntasFrequentes
      .mockResolvedValueOnce(respostaPaginada)
      .mockResolvedValueOnce({
        data: { count: 0, next: null, previous: null, results: [] },
      });
    excluirPerguntaFrequente.mockResolvedValue({ status: 204 });

    render(<ListagemDuvidasFrequentes />);

    fireEvent.click(
      await screen.findByRole("button", {
        name: "Excluir Como solicitar uma dieta?",
      }),
    );
    fireEvent.click(screen.getByRole("button", { name: "Sim" }));

    await waitFor(() => {
      expect(excluirPerguntaFrequente).toHaveBeenCalledWith(UUID_DUVIDA);
    });

    expect(toastSuccess).toHaveBeenCalledWith("Dúvida Excluída com Sucesso!");
    expect(listarPerguntasFrequentes).toHaveBeenCalledTimes(2);
    expect(
      await screen.findByText(/Ainda não há dúvidas frequentes cadastradas/),
    ).toBeInTheDocument();
  });

  it("informa erro quando a exclusão da dúvida falha", async () => {
    excluirPerguntaFrequente.mockRejectedValue(
      new Error("Falha ao excluir dúvida"),
    );

    render(<ListagemDuvidasFrequentes />);

    fireEvent.click(
      await screen.findByRole("button", {
        name: "Excluir Como solicitar uma dieta?",
      }),
    );
    fireEvent.click(screen.getByRole("button", { name: "Sim" }));

    await waitFor(() => {
      expect(toastError).toHaveBeenCalledWith(
        "Houve um erro ao excluir a dúvida",
      );
    });

    expect(toastSuccess).not.toHaveBeenCalled();
    expect(screen.getByText("Excluir Dúvida")).toBeInTheDocument();
  });

  it("volta à página anterior ao excluir a única dúvida da página atual", async () => {
    const duvidaUltimaPagina = {
      categoria: {
        nome: "Abastecimento",
        uuid: UUID_CATEGORIA,
      },
      pergunta: "Como conferir uma guia?",
      perfis: [],
      todos_os_perfis: true,
      uuid: UUID_DUVIDA_ULTIMA_PAGINA,
    };

    listarPerguntasFrequentes
      .mockResolvedValueOnce(respostaPaginada)
      .mockResolvedValueOnce({
        data: {
          count: 11,
          next: null,
          previous: "http://localhost/perguntas-frequentes/?page=1",
          results: [duvidaUltimaPagina],
        },
      })
      .mockResolvedValueOnce({
        data: {
          count: 10,
          next: null,
          previous: null,
          results: respostaPaginada.data.results,
        },
      });
    excluirPerguntaFrequente.mockResolvedValue({ status: 204 });

    render(<ListagemDuvidasFrequentes />);

    fireEvent.click(
      await screen.findByRole("button", { name: "Próxima página" }),
    );

    fireEvent.click(
      await screen.findByRole("button", {
        name: "Excluir Como conferir uma guia?",
      }),
    );
    fireEvent.click(screen.getByRole("button", { name: "Sim" }));

    await waitFor(() => {
      expect(excluirPerguntaFrequente).toHaveBeenCalledWith(
        UUID_DUVIDA_ULTIMA_PAGINA,
      );
      expect(listarPerguntasFrequentes).toHaveBeenLastCalledWith({
        ordering: "-criado_em",
        page: 1,
        page_size: 10,
      });
    });
  });

  it("não repete a exclusão enquanto a requisição está em andamento", async () => {
    let concluirExclusao;

    excluirPerguntaFrequente.mockImplementation(
      () =>
        new Promise((resolve) => {
          concluirExclusao = resolve;
        }),
    );

    render(<ListagemDuvidasFrequentes />);

    fireEvent.click(
      await screen.findByRole("button", {
        name: "Excluir Como solicitar uma dieta?",
      }),
    );
    fireEvent.click(screen.getByRole("button", { name: "Sim" }));

    await waitFor(() => {
      expect(screen.getByRole("button", { name: "Sim" })).toHaveAttribute(
        "data-loading",
        "true",
      );
    });

    fireEvent.click(screen.getByRole("button", { name: "Sim" }));

    expect(excluirPerguntaFrequente).toHaveBeenCalledTimes(1);

    concluirExclusao({ status: 204 });

    await waitFor(() => {
      expect(toastSuccess).toHaveBeenCalledWith("Dúvida Excluída com Sucesso!");
    });
  });

  it("apresenta a mensagem prevista quando não há dúvidas cadastradas", async () => {
    listarPerguntasFrequentes.mockResolvedValue({
      data: { count: 0, next: null, previous: null, results: [] },
    });

    render(<ListagemDuvidasFrequentes />);

    expect(
      await screen.findByText(/Ainda não há dúvidas frequentes cadastradas/),
    ).toHaveTextContent(
      'Ainda não há dúvidas frequentes cadastradas. Utilize o botão "Cadastrar Dúvidas Frequentes" para realizar o primeiro cadastro.',
    );
  });

  it("limpa a listagem e informa erro quando a consulta falha", async () => {
    listarPerguntasFrequentes.mockRejectedValue(new Error("Falha na API"));

    render(<ListagemDuvidasFrequentes />);

    await waitFor(() => {
      expect(toastError).toHaveBeenCalledWith(
        "Não foi possível carregar as dúvidas frequentes.",
      );
    });
  });
});
