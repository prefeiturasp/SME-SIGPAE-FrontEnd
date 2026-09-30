import { fireEvent, render, screen } from "@testing-library/react";
import { createRef } from "react";

import {
  getEmbalagensProduto,
  getUnidadesDeMedidaProduto,
} from "src/services/produto.service";
import Step3 from "../index";

jest.mock("redux-form", () => ({
  Field: ({ component: Componente, ...props }) => <Componente {...props} />,
  FieldArray: ({ component: Componente, ...props }) => (
    <Componente {...props} />
  ),
}));

jest.mock("src/components/Shareable/Input/InputText", () => ({
  __esModule: true,
  default: ({ label, name, placeholder }) => (
    <input aria-label={label || name} name={name} placeholder={placeholder} />
  ),
}));

jest.mock("src/components/Shareable/TextArea/TextArea", () => ({
  TextArea: ({ label, name, placeholder }) => (
    <textarea
      aria-label={label || name}
      name={name}
      placeholder={placeholder}
    />
  ),
}));

jest.mock("src/components/Shareable/Input/InputFile/ManagedField", () => ({
  __esModule: true,
  default: ({ onChange, removeFile, validate }) => (
    <div data-testid="campo-arquivos" data-validacoes={validate.length}>
      <button type="button" onClick={() => onChange(["imagem.png"])}>
        Selecionar arquivo
      </button>
      <button type="button" onClick={() => removeFile("imagem.png")}>
        Remover arquivo novo
      </button>
    </div>
  ),
}));

jest.mock("src/components/Shareable/TooltipIcone", () => ({
  __esModule: true,
  default: ({ tooltipText }) => <span>{tooltipText}</span>,
}));

jest.mock("../components/Especificacoes", () => ({
  __esModule: true,
  default: ({
    embalagens,
    especificacoesIniciais,
    unidades_de_medida,
    updateOpcoesItensCadastrados,
  }) => (
    <div data-testid="especificacoes">
      <span>{unidades_de_medida?.map((item) => item.nome).join("|")}</span>
      <span>{embalagens?.map((item) => item.nome).join("|")}</span>
      <span data-testid="quantidade-especificacoes">
        {especificacoesIniciais?.length || 0}
      </span>
      <button type="button" onClick={updateOpcoesItensCadastrados}>
        Atualizar opções
      </button>
    </div>
  ),
}));

jest.mock("src/services/produto.service", () => ({
  getUnidadesDeMedidaProduto: jest.fn(),
  getEmbalagensProduto: jest.fn(),
}));

jest.mock("src/helpers/utilities", () => ({
  acionaComEnterOuEspaco: (evento, acao) => {
    if (["Enter", " "].includes(evento.key)) {
      acao();
    }
  },
}));

const UUID_UNIDADE = "11111111-1111-4111-8111-111111111111";
const UUID_EMBALAGEM = "22222222-2222-4222-8222-222222222222";
const UUID_ANEXO_1 = "33333333-3333-4333-8333-333333333333";
const UUID_ANEXO_2 = "44444444-4444-4444-8444-444444444444";

const criarPayload = (sobrescritas = {}) => ({
  especificacoes: [
    {
      volume: "1",
      unidade_de_medida: UUID_UNIDADE,
      embalagem_produto: UUID_EMBALAGEM,
    },
  ],
  ultima_homologacao: { status: "HOMOLOGADO" },
  imagens_salvas: [],
  ...sobrescritas,
});

const criarProps = (sobrescritas = {}) => ({
  payload: criarPayload(),
  setFiles: jest.fn(),
  removeFile: jest.fn(),
  removerAnexo: jest.fn(),
  ...sobrescritas,
});

const renderizarComponente = (props = criarProps()) => {
  const referencia = createRef();
  const resultado = render(<Step3 ref={referencia} {...props} />);

  return { ...resultado, props, referencia };
};

const aguardarCarregamento = async () => {
  await screen.findByText("QUILOGRAMA");
};

describe("Step3 do cadastro de produto", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    getUnidadesDeMedidaProduto.mockResolvedValue({
      data: {
        results: [{ uuid: UUID_UNIDADE, nome: "QUILOGRAMA" }],
      },
    });
    getEmbalagensProduto.mockResolvedValue({
      data: {
        results: [{ uuid: UUID_EMBALAGEM, nome: "PACOTE" }],
      },
    });
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it("carrega as unidades, embalagens e especificações iniciais", async () => {
    renderizarComponente();

    expect(
      screen.getByText("Informação do Produto (classificação)"),
    ).toBeInTheDocument();
    expect(
      screen.getByLabelText("N° de registro do produto no órgão competente"),
    ).toBeInTheDocument();
    expect(screen.getByLabelText("Prazo de Validade")).toBeInTheDocument();
    await aguardarCarregamento();
    expect(screen.getByText("PACOTE")).toBeInTheDocument();
    expect(screen.getByTestId("quantidade-especificacoes")).toHaveTextContent(
      "1",
    );
    expect(getUnidadesDeMedidaProduto).toHaveBeenCalled();
    expect(getEmbalagensProduto).toHaveBeenCalled();
  });

  it("atualiza as opções de especificações", async () => {
    renderizarComponente();
    await aguardarCarregamento();

    getUnidadesDeMedidaProduto.mockResolvedValue({
      data: {
        results: [
          {
            uuid: "55555555-5555-4555-8555-555555555555",
            nome: "LITRO",
          },
        ],
      },
    });
    getEmbalagensProduto.mockResolvedValue({
      data: {
        results: [
          {
            uuid: "66666666-6666-4666-8666-666666666666",
            nome: "CAIXA",
          },
        ],
      },
    });

    fireEvent.click(screen.getByRole("button", { name: "Atualizar opções" }));

    expect(await screen.findByText("LITRO")).toBeInTheDocument();
    expect(screen.getByText("CAIXA")).toBeInTheDocument();
  });

  it("encaminha as ações do campo de novos arquivos", async () => {
    const { props } = renderizarComponente();
    await aguardarCarregamento();

    expect(screen.getByTestId("campo-arquivos")).toHaveAttribute(
      "data-validacoes",
      "1",
    );

    fireEvent.click(screen.getByRole("button", { name: "Selecionar arquivo" }));
    fireEvent.click(
      screen.getByRole("button", { name: "Remover arquivo novo" }),
    );

    expect(props.setFiles).toHaveBeenCalledWith(["imagem.png"]);
    expect(props.removeFile).toHaveBeenCalledWith("imagem.png");
  });

  it("abre arquivos por URL, baixa documentos e exibe arquivos em base64", async () => {
    const { referencia } = renderizarComponente();
    await aguardarCarregamento();

    const escreverDocumento = jest.fn();
    const abrirJanela = jest
      .spyOn(window, "open")
      .mockImplementation((endereco) =>
        endereco === "" ? { document: { write: escreverDocumento } } : null,
      );
    const clicarLink = jest.fn();
    const criarElemento = jest
      .spyOn(document, "createElement")
      .mockReturnValueOnce({ click: clicarLink });

    referencia.current.openFile({
      arquivo: "https://arquivos.exemplo/imagem.png",
      nome: "imagem.png",
    });
    referencia.current.openFile({
      arquivo: null,
      nome: "documento.docx",
      base64: "data:application/msword;base64,arquivo",
    });
    referencia.current.openFile({
      arquivo: null,
      nome: "documento.pdf",
      base64: "data:application/pdf;base64,arquivo",
    });

    expect(abrirJanela).toHaveBeenCalledWith(
      "https://arquivos.exemplo/imagem.png",
    );
    expect(criarElemento).toHaveBeenCalledWith("a");
    expect(clicarLink).toHaveBeenCalledTimes(1);
    expect(escreverDocumento).toHaveBeenCalledWith(
      expect.stringContaining("data:application/pdf;base64,arquivo"),
    );
  });

  it("valida tamanho máximo, rascunho e existência de imagens salvas", async () => {
    const { referencia } = renderizarComponente();
    await aguardarCarregamento();
    const validarCincoCaracteres = referencia.current.maxLengthCaracteres(5);

    expect(validarCincoCaracteres("123456")).toBe(
      "Limite máximo de 5 caracteres",
    );
    expect(validarCincoCaracteres("12345")).toBeUndefined();
    expect(validarCincoCaracteres(undefined)).toBeUndefined();
    expect(
      referencia.current.ehRascunho({
        ultima_homologacao: { status: "RASCUNHO" },
      }),
    ).toBe(true);
    expect(
      referencia.current.ehRascunho({
        ultima_homologacao: { status: "HOMOLOGADO" },
      }),
    ).toBe(false);
    expect(
      referencia.current.ehRascunho({ ultima_homologacao: null }),
    ).toBeNull();
    expect(referencia.current.temImagensSalvas({ imagens_salvas: [{}] })).toBe(
      true,
    );
    expect(referencia.current.temImagensSalvas({ imagens_salvas: [] })).toBe(
      false,
    );
    expect(
      referencia.current.temImagensSalvas({ imagens_salvas: null }),
    ).toBeNull();
  });

  it("exibe e permite abrir ou remover as imagens salvas do rascunho", async () => {
    const imagensSalvas = [
      {
        uuid: UUID_ANEXO_1,
        nome: "imagem-1.png",
        arquivo: "https://arquivos.exemplo/media/imagem-1.png",
      },
      {
        uuid: "77777777-7777-4777-8777-777777777777",
        nome: "ignorada.png",
        arquivo: "https://arquivos.exemplo/externo/ignorada.png",
      },
      {
        uuid: UUID_ANEXO_2,
        nome: "imagem-2.png",
        arquivo: "https://arquivos.exemplo/media/imagem-2.png",
      },
    ];
    const props = criarProps({
      payload: criarPayload({
        ultima_homologacao: { status: "RASCUNHO" },
        imagens_salvas: imagensSalvas,
      }),
    });
    const { referencia } = renderizarComponente(props);
    await aguardarCarregamento();
    const abrirArquivo = jest
      .spyOn(referencia.current, "openFile")
      .mockImplementation(() => {});

    expect(screen.getByTestId("campo-arquivos")).toHaveAttribute(
      "data-validacoes",
      "0",
    );
    expect(screen.getByText("imagem-1.png")).toBeInTheDocument();
    expect(screen.getByText("imagem-2.png")).toBeInTheDocument();
    expect(screen.queryByText("ignorada.png")).not.toBeInTheDocument();

    const primeiraLinha = screen
      .getByText("imagem-1.png")
      .closest(".arquivos-anexados");
    const segundaLinha = screen
      .getByText("imagem-2.png")
      .closest(".arquivos-anexados");
    const [abrirPrimeiro, removerPrimeiro] =
      primeiraLinha.querySelectorAll('[role="button"]');
    const [abrirSegundo, removerSegundo] =
      segundaLinha.querySelectorAll('[role="button"]');

    fireEvent.click(abrirPrimeiro);
    fireEvent.keyDown(abrirSegundo, { key: "Enter" });
    fireEvent.click(removerPrimeiro);
    fireEvent.keyDown(removerSegundo, { key: " " });

    expect(abrirArquivo).toHaveBeenCalledWith(imagensSalvas[0]);
    expect(abrirArquivo).toHaveBeenCalledWith(imagensSalvas[2]);
    expect(props.removerAnexo).toHaveBeenCalledWith(UUID_ANEXO_1, 0);
    expect(props.removerAnexo).toHaveBeenCalledWith(UUID_ANEXO_2, 1);
    expect(segundaLinha).toHaveClass("mt-1");
  });

  it.each([null, []])(
    "não exibe os arquivos salvos quando não houver imagens",
    async (imagensSalvas) => {
      renderizarComponente(
        criarProps({
          payload: criarPayload({
            ultima_homologacao: { status: "RASCUNHO" },
            imagens_salvas: imagensSalvas,
          }),
        }),
      );

      await aguardarCarregamento();
      expect(screen.queryByText("imagem-1.png")).not.toBeInTheDocument();
    },
  );
});
