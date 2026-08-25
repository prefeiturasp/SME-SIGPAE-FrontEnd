import React from "react";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { useParams } from "react-router-dom";
import {
  toastError,
  toastSuccess,
} from "src/components/Shareable/Toast/dialogs";
import { getError } from "src/helpers/utilities";
import {
  atualizarPerguntaFrequente,
  buscarPerguntaFrequente,
} from "src/services/faq.service";
import { useOpcoesCadastroDuvida } from "../../hooks/useOpcoesCadastroDuvida";
import EdicaoDuvidasFrequentes from "..";

jest.mock("react-router-dom", () => ({
  useParams: jest.fn(),
}));

jest.mock("src/services/faq.service", () => ({
  atualizarPerguntaFrequente: jest.fn(),
  buscarPerguntaFrequente: jest.fn(),
}));

jest.mock("src/components/Shareable/Toast/dialogs", () => ({
  toastError: jest.fn(),
  toastSuccess: jest.fn(),
}));

jest.mock("src/helpers/utilities", () => ({
  getError: jest.fn(),
}));

jest.mock("../../hooks/useOpcoesCadastroDuvida", () => ({
  useOpcoesCadastroDuvida: jest.fn(),
}));

jest.mock("src/components/Shareable/SigpaeLogoLoader", () => ({
  SigpaeLogoLoader: () => <div>Carregando edição</div>,
}));

jest.mock("../../components/FormularioDuvidaFrequente", () => ({
  __esModule: true,
  default: ({
    desabilitarSalvar,
    onAlterarBuscaCategoria,
    onAlterarDescricao,
    onAlterarPerfis,
    onAlterarTitulo,
    onCancelar,
    onSalvar,
    onSelecionarCategoria,
    textoBotaoSalvar,
    valores,
  }) => (
    <form onSubmit={onSalvar}>
      <input
        aria-label="Categoria"
        value={valores.buscaCategoria}
        onChange={(evento) => onAlterarBuscaCategoria(evento.target.value)}
      />
      <input
        aria-label="Título"
        value={valores.titulo}
        onChange={(evento) => onAlterarTitulo(evento.target.value)}
      />
      <textarea
        aria-label="Descrição Detalhada"
        value={valores.descricaoDetalhada}
        onChange={(evento) => onAlterarDescricao(evento.target.value)}
      />
      <span data-testid="perfis">{valores.perfisAcesso.join(";")}</span>
      <button
        type="button"
        onClick={() =>
          onSelecionarCategoria("Outra categoria", {
            label: "Outra categoria",
            uuid: "5c2517c7-7daf-4e56-a627-d80eb51cfca7",
            value: "Outra categoria",
          })
        }
      >
        Selecionar outra categoria
      </button>
      <button type="button" onClick={() => onAlterarPerfis([])}>
        Remover perfis
      </button>
      <button type="button" onClick={onCancelar}>
        Cancelar
      </button>
      <button
        type="button"
        onClick={() => onSalvar({ preventDefault: jest.fn() })}
      >
        Forçar salvamento
      </button>
      <button type="submit" disabled={desabilitarSalvar}>
        {textoBotaoSalvar}
      </button>
    </form>
  ),
}));

const UUID_DUVIDA = "b94a1c05-4f00-44d2-b73a-7d8c79fa6021";
const UUID_CATEGORIA = "62edbea5-ee3e-42d3-b18a-071599c010fd";
const UUID_PERFIL = "59a1332f-dcf3-454d-a904-2592979137c0";

const opcoesEdicao = {
  categorias: [
    {
      nome: "Gestão de Alimentação",
      uuid: UUID_CATEGORIA,
    },
  ],
  carregandoCategorias: false,
  opcoesPerfisAcesso: [{ label: "QUALIDADE", value: UUID_PERFIL }],
  carregandoPerfis: false,
};

const duvida = {
  categoria: {
    nome: "Gestão de Alimentação",
    uuid: UUID_CATEGORIA,
  },
  pergunta: "Como solicitar uma dieta?",
  perfis: [{ nome: "QUALIDADE", uuid: UUID_PERFIL }],
  resposta: "Consulte as orientações.",
  todos_os_perfis: false,
  uuid: UUID_DUVIDA,
};

describe("EdicaoDuvidasFrequentes", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    useParams.mockReturnValue({ uuid: UUID_DUVIDA });
    useOpcoesCadastroDuvida.mockReturnValue(opcoesEdicao);
    buscarPerguntaFrequente.mockResolvedValue({ data: duvida });
    atualizarPerguntaFrequente.mockResolvedValue({ status: 200 });
  });

  it("carrega os dados da dúvida e mantém o salvamento desabilitado sem alterações", async () => {
    render(<EdicaoDuvidasFrequentes />);

    expect(screen.getByText("Carregando edição")).toBeInTheDocument();
    expect(await screen.findByLabelText("Título")).toHaveValue(
      "Como solicitar uma dieta?",
    );
    expect(screen.getByLabelText("Categoria")).toHaveValue(
      "Gestão de Alimentação",
    );
    expect(screen.getByLabelText("Descrição Detalhada")).toHaveValue(
      "Consulte as orientações.",
    );
    expect(screen.getByTestId("perfis")).toHaveTextContent(UUID_PERFIL);
    expect(buscarPerguntaFrequente).toHaveBeenCalledWith(UUID_DUVIDA);
    expect(
      screen.getByRole("button", { name: "Salvar Alterações" }),
    ).toBeDisabled();
  });

  it("restaura todos os valores originais ao cancelar", async () => {
    render(<EdicaoDuvidasFrequentes />);
    await screen.findByLabelText("Título");

    fireEvent.change(screen.getByLabelText("Título"), {
      target: { value: "Título alterado" },
    });
    fireEvent.change(screen.getByLabelText("Descrição Detalhada"), {
      target: { value: "Descrição alterada" },
    });
    fireEvent.click(
      screen.getByRole("button", { name: "Selecionar outra categoria" }),
    );
    fireEvent.click(screen.getByRole("button", { name: "Remover perfis" }));
    fireEvent.click(screen.getByRole("button", { name: "Cancelar" }));

    expect(screen.getByLabelText("Título")).toHaveValue(
      "Como solicitar uma dieta?",
    );
    expect(screen.getByLabelText("Categoria")).toHaveValue(
      "Gestão de Alimentação",
    );
    expect(screen.getByLabelText("Descrição Detalhada")).toHaveValue(
      "Consulte as orientações.",
    );
    expect(screen.getByTestId("perfis")).toHaveTextContent(UUID_PERFIL);
  });

  it("limpa a categoria e os perfis ao alterar a busca da categoria", async () => {
    render(<EdicaoDuvidasFrequentes />);
    await screen.findByLabelText("Categoria");

    fireEvent.change(screen.getByLabelText("Categoria"), {
      target: { value: "Nova busca" },
    });

    expect(screen.getByLabelText("Categoria")).toHaveValue("Nova busca");
    expect(screen.getByTestId("perfis")).toBeEmptyDOMElement();
    expect(
      screen.getByRole("button", { name: "Salvar Alterações" }),
    ).toBeDisabled();
  });

  it("não salva quando o formulário não foi alterado", async () => {
    render(<EdicaoDuvidasFrequentes />);
    await screen.findByLabelText("Título");

    fireEvent.click(screen.getByRole("button", { name: "Forçar salvamento" }));

    expect(atualizarPerguntaFrequente).not.toHaveBeenCalled();
  });

  it("não salva quando o formulário está inválido", async () => {
    render(<EdicaoDuvidasFrequentes />);
    await screen.findByLabelText("Título");

    fireEvent.click(screen.getByRole("button", { name: "Remover perfis" }));
    fireEvent.click(screen.getByRole("button", { name: "Forçar salvamento" }));

    expect(atualizarPerguntaFrequente).not.toHaveBeenCalled();
  });

  it("não inicia outro salvamento enquanto uma atualização está em andamento", async () => {
    let concluirAtualizacao;
    atualizarPerguntaFrequente.mockImplementation(
      () =>
        new Promise((resolve) => {
          concluirAtualizacao = resolve;
        }),
    );

    render(<EdicaoDuvidasFrequentes />);
    await screen.findByLabelText("Título");

    fireEvent.change(screen.getByLabelText("Título"), {
      target: { value: "Título alterado" },
    });
    fireEvent.click(screen.getByRole("button", { name: "Salvar Alterações" }));

    await waitFor(() => {
      expect(atualizarPerguntaFrequente).toHaveBeenCalledTimes(1);
    });

    fireEvent.click(screen.getByRole("button", { name: "Forçar salvamento" }));
    expect(atualizarPerguntaFrequente).toHaveBeenCalledTimes(1);

    concluirAtualizacao({ status: 200 });

    await waitFor(() => {
      expect(toastSuccess).toHaveBeenCalledWith(
        "Dúvida Frequente Atualizada com Sucesso!",
      );
    });
  });

  it("salva as alterações, apresenta o toast e permanece no formulário", async () => {
    render(<EdicaoDuvidasFrequentes />);
    await screen.findByLabelText("Título");

    fireEvent.change(screen.getByLabelText("Título"), {
      target: { value: "  Como atualizar uma dieta?  " },
    });
    fireEvent.click(screen.getByRole("button", { name: "Salvar Alterações" }));

    await waitFor(() => {
      expect(atualizarPerguntaFrequente).toHaveBeenCalledWith(UUID_DUVIDA, {
        categoria: UUID_CATEGORIA,
        perfis: [],
        todos_os_perfis: true,
        pergunta: "Como atualizar uma dieta?",
        resposta: "Consulte as orientações.",
      });
    });

    expect(toastSuccess).toHaveBeenCalledWith(
      "Dúvida Frequente Atualizada com Sucesso!",
    );
    expect(screen.getByLabelText("Título")).toHaveValue(
      "Como atualizar uma dieta?",
    );
    expect(
      screen.getByRole("button", { name: "Salvar Alterações" }),
    ).toBeDisabled();
  });

  it("carrega categoria e perfis quando a API retorna identificadores simples", async () => {
    buscarPerguntaFrequente.mockResolvedValue({
      data: {
        ...duvida,
        categoria: UUID_CATEGORIA,
        perfis: [],
        todos_os_perfis: true,
      },
    });

    render(<EdicaoDuvidasFrequentes />);

    expect(await screen.findByLabelText("Categoria")).toHaveValue(
      "Gestão de Alimentação",
    );
    expect(screen.getByTestId("perfis")).toHaveTextContent(UUID_PERFIL);
  });

  it("apresenta o erro retornado pela API quando a atualização falha", async () => {
    const dadosErro = { pergunta: ["Já existe uma dúvida com este título."] };
    getError.mockReturnValue("Já existe uma dúvida com este título.");
    atualizarPerguntaFrequente.mockRejectedValue({
      response: { data: dadosErro },
    });

    render(<EdicaoDuvidasFrequentes />);
    await screen.findByLabelText("Título");

    fireEvent.change(screen.getByLabelText("Título"), {
      target: { value: "Título duplicado" },
    });
    fireEvent.click(screen.getByRole("button", { name: "Salvar Alterações" }));

    await waitFor(() => {
      expect(getError).toHaveBeenCalledWith(dadosErro);
      expect(toastError).toHaveBeenCalledWith(
        "Já existe uma dúvida com este título.",
      );
    });
  });

  it("apresenta uma mensagem padrão quando a atualização falha sem resposta", async () => {
    atualizarPerguntaFrequente.mockRejectedValue(new Error("Falha na API"));

    render(<EdicaoDuvidasFrequentes />);
    await screen.findByLabelText("Título");

    fireEvent.change(screen.getByLabelText("Título"), {
      target: { value: "Título alterado" },
    });
    fireEvent.click(screen.getByRole("button", { name: "Salvar Alterações" }));

    await waitFor(() => {
      expect(toastError).toHaveBeenCalledWith(
        "Não foi possível atualizar a dúvida frequente.",
      );
    });
  });

  it("apresenta erro quando não consegue carregar a dúvida", async () => {
    buscarPerguntaFrequente.mockRejectedValue(new Error("Falha na API"));

    render(<EdicaoDuvidasFrequentes />);

    expect(
      await screen.findByText(
        "Não foi possível carregar os dados da dúvida frequente.",
      ),
    ).toBeInTheDocument();
    expect(toastError).toHaveBeenCalledWith(
      "Não foi possível carregar a dúvida frequente.",
    );
  });
});
