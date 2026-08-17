import React from "react";
import {
  render,
  screen,
  act,
  fireEvent,
  waitFor,
} from "@testing-library/react";
import "@testing-library/jest-dom";
import { MemoryRouter } from "react-router-dom";
import CadastroTermoRecebimentoDefinitivo from "../index";
import mock from "src/services/_mock";
import { mockListaEmpresas } from "src/mocks/services/posRecebimento.service/mockListaEmpresas";
import { mockListaContratos } from "src/mocks/services/posRecebimento.service/mockListaContratos";
import { mockListaCronogramas } from "src/mocks/services/posRecebimento.service/mockListaCronogramas";
import {
  mockCronogramaDetalhe1,
  mockCronogramaDetalhe2,
} from "src/mocks/services/posRecebimento.service/mockCronogramaDetalhe";
import { mockListaFiscais } from "src/mocks/services/posRecebimento.service/mockListaFiscais";
import { cronogramasParaBloco, gerarTextoTermo } from "../helpers";

const EMPRESA_NOME = mockListaEmpresas.results[0].nome_fantasia;
const EMPRESA_UUID = mockListaEmpresas.results[0].uuid;
const CONTRATO_NUMERO = mockListaContratos.results[0].numero;
const CONTRATO_UUID = mockListaContratos.results[0].uuid;
const CRONOGRAMA_1_NUMERO = mockListaCronogramas.results[0].numero;
const CRONOGRAMA_1_UUID = mockListaCronogramas.results[0].uuid;
const CRONOGRAMA_2_NUMERO = mockListaCronogramas.results[1].numero;
const CRONOGRAMA_2_UUID = mockListaCronogramas.results[1].uuid;
const FISCAL_1_NOME = mockListaFiscais.results[0].nome;
const FISCAL_2_NOME = mockListaFiscais.results[1].nome;
const FISCAL_3_NOME = mockListaFiscais.results[2].nome;
const FISCAL_1_UUID = mockListaFiscais.results[0].uuid;
const FISCAL_2_UUID = mockListaFiscais.results[1].uuid;
const FISCAL_3_UUID = mockListaFiscais.results[2].uuid;

const mockNavigate = jest.fn();
jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: () => mockNavigate,
}));

jest.mock("src/components/Shareable/CKEditorField", () => {
  const CKEditorField = ({ input, label }) => (
    <div>
      {label && <label className="col-form-label">{label}</label>}
      <textarea
        data-testid="texto-termo"
        value={input.value || ""}
        onChange={(event) => input.onChange(event.target.value)}
        onBlur={() => input.onBlur && input.onBlur()}
      />
    </div>
  );
  return { __esModule: true, default: CKEditorField, CKEditorField };
});

let payloadEnviado = null;

beforeEach(() => {
  payloadEnviado = null;

  mock
    .onGet("/terceirizadas/lista-empresas-pos-recebimento/")
    .reply(200, mockListaEmpresas);
  mock.onGet("/usuarios/fiscais/").reply(200, mockListaFiscais);

  mock.onGet("/contratos/lista-contratos-pos-recebimento/").reply((config) => {
    const empresaId = config.params?.empresa_id;
    return [
      200,
      {
        results: empresaId === EMPRESA_UUID ? mockListaContratos.results : [],
      },
    ];
  });

  mock
    .onGet("/cronogramas/lista-cronogramas-pos-recebimento/")
    .reply((config) => {
      const contratoId = config.params?.contrato_id;
      return [
        200,
        {
          results:
            contratoId === CONTRATO_UUID ? mockListaCronogramas.results : [],
        },
      ];
    });

  mock
    .onGet(
      `/cronogramas/${CRONOGRAMA_1_UUID}/dados-cronograma-pos-recebimento/`,
    )
    .reply(200, mockCronogramaDetalhe1);
  mock
    .onGet(
      `/cronogramas/${CRONOGRAMA_2_UUID}/dados-cronograma-pos-recebimento/`,
    )
    .reply(200, mockCronogramaDetalhe2);

  mock.onPost("/pos-recebimento/termos/").reply((config) => {
    payloadEnviado = JSON.parse(config.data);
    return [201, { uuid: "termo-1" }];
  });
});

afterEach(() => {
  mock.reset();
  jest.clearAllMocks();
});

const setup = async () => {
  await act(async () => {
    render(
      <MemoryRouter>
        <CadastroTermoRecebimentoDefinitivo />
      </MemoryRouter>,
    );
  });
};

const selecionarAutoComplete = async (dataTestId, texto) => {
  const input = screen.getByTestId(dataTestId);
  await waitFor(() => expect(input).not.toBeDisabled());
  fireEvent.change(input, { target: { value: texto } });
  fireEvent.blur(input);
};

const preencherDadosBasicos = async () => {
  await selecionarAutoComplete("empresa", EMPRESA_NOME);
  await waitFor(() =>
    expect(screen.getByTestId("contrato")).not.toBeDisabled(),
  );
  await selecionarAutoComplete("contrato", CONTRATO_NUMERO);
  await waitFor(() =>
    expect(screen.getByTestId("cronograma-0")).not.toBeDisabled(),
  );
  await selecionarAutoComplete("cronograma-0", CRONOGRAMA_1_NUMERO);
  fireEvent.input(screen.getByTestId("valor-contrato-0"), {
    target: { value: "150000" },
  });
  fireEvent.input(screen.getByTestId("quantidade-total-recebida-0"), {
    target: { value: "123456" },
  });
  await selecionarAutoComplete("fiscal-1", FISCAL_1_NOME);
  await selecionarAutoComplete("fiscal-2", FISCAL_2_NOME);
  await selecionarAutoComplete("fiscal-3", FISCAL_3_NOME);
};

describe("CadastroTermoRecebimentoDefinitivo", () => {
  it("carrega empresas e fiscais via useEffect ao montar a tela", async () => {
    await setup();

    await selecionarAutoComplete("empresa", EMPRESA_NOME);

    expect(screen.getByTestId("empresa").value).toBe(EMPRESA_NOME);
    expect(
      screen.getByTestId("valor-contrato-0").closest("input"),
    ).toBeInTheDocument();
  });

  it("faz a seleção em cascata e preenche automaticamente produto, processo SEI, unidade de medida e texto do termo", async () => {
    await setup();

    await selecionarAutoComplete("empresa", EMPRESA_NOME);
    await waitFor(() =>
      expect(screen.getByTestId("contrato")).not.toBeDisabled(),
    );
    await selecionarAutoComplete("contrato", CONTRATO_NUMERO);
    await waitFor(() =>
      expect(screen.getByTestId("cronograma-0")).not.toBeDisabled(),
    );
    await selecionarAutoComplete("cronograma-0", CRONOGRAMA_1_NUMERO);

    await waitFor(() => {
      expect(screen.getByTestId("produto-0").value).toBe("Arroz Parboilizado");
      expect(screen.getByTestId("processo-sei-0").value).toBe("SEI-12345");
    });

    const quantidade = screen.getByTestId("quantidade-total-recebida-0");
    const container = quantidade.closest(".input-com-sufixo");
    expect(container.textContent).toContain("Kg");

    const textoTermo = screen.getByTestId("texto-termo");
    await waitFor(() => {
      expect(textoTermo.value).toContain("Arroz Parboilizado");
      expect(textoTermo.value).toContain("TERMO DE RECEBIMENTO DEFINITIVO");
      expect(textoTermo.value).toContain("art. 73 da Lei 8.666/93");
    });
  });

  it("aplica máscara monetária e numérica nos campos de valor e quantidade", async () => {
    await setup();

    fireEvent.input(screen.getByTestId("valor-contrato-0"), {
      target: { value: "150000" },
    });
    fireEvent.input(screen.getByTestId("quantidade-total-recebida-0"), {
      target: { value: "123456" },
    });

    expect(screen.getByTestId("valor-contrato-0").value).toBe("1.500,00");
    expect(screen.getByTestId("quantidade-total-recebida-0").value).toBe(
      "1.234,56",
    );
  });

  it("adiciona múltiplos cronogramas, remove os já selecionados das opções e permite remover via lixeira", async () => {
    await setup();

    await selecionarAutoComplete("empresa", EMPRESA_NOME);
    await waitFor(() =>
      expect(screen.getByTestId("contrato")).not.toBeDisabled(),
    );
    await selecionarAutoComplete("contrato", CONTRATO_NUMERO);
    await waitFor(() =>
      expect(screen.getByTestId("cronograma-0")).not.toBeDisabled(),
    );
    await selecionarAutoComplete("cronograma-0", CRONOGRAMA_1_NUMERO);

    const botaoAdicionar = screen.getByTestId("adicionar-cronograma");
    await waitFor(() => expect(botaoAdicionar).not.toBeDisabled());
    fireEvent.click(botaoAdicionar);

    expect(screen.getByTestId("cronograma-1")).toBeInTheDocument();

    // O cronograma já selecionado no primeiro bloco não deve aparecer nas
    // opções do segundo bloco (regra de exclusão testada no helper puro).
    const opcoesBloco2 = cronogramasParaBloco(
      mockListaCronogramas.results,
      [CRONOGRAMA_1_NUMERO],
      "",
    );
    expect(opcoesBloco2.map((c) => c.numero)).not.toContain(
      CRONOGRAMA_1_NUMERO,
    );
    expect(opcoesBloco2.map((c) => c.numero)).toContain(CRONOGRAMA_2_NUMERO);

    await selecionarAutoComplete("cronograma-1", CRONOGRAMA_2_NUMERO);

    const textoTermo = screen.getByTestId("texto-termo");
    await waitFor(() => {
      expect(textoTermo.value).toContain("Arroz Parboilizado");
      expect(textoTermo.value).toContain("Feijão Carioca");
    });

    // A lixeira verde remove o bloco extra, volta a ter apenas o primeiro
    // bloco e regenera o texto do termo sem o produto removido.
    fireEvent.click(screen.getByTestId("remover-cronograma-1"));

    await waitFor(() => {
      expect(screen.queryByTestId("cronograma-1")).not.toBeInTheDocument();
      expect(textoTermo.value).toContain("Arroz Parboilizado");
      expect(textoTermo.value).not.toContain("Feijão Carioca");
    });
  });

  it("mantém o botão Salvar e Enviar desabilitado até todos os campos obrigatórios estarem preenchidos", async () => {
    await setup();

    const botaoSalvar = screen.getByTestId("salvar-enviar");
    expect(botaoSalvar).toBeDisabled();

    await preencherDadosBasicos();

    await waitFor(() => {
      expect(botaoSalvar).not.toBeDisabled();
    });
  });

  it("abre modal de cancelamento e cancela o cadastro ao confirmar", async () => {
    await setup();

    fireEvent.click(screen.getByTestId("cancelar"));

    expect(screen.getByText("Cancelar Preenchimento")).toBeInTheDocument();

    // "Não" apenas fecha o modal
    const botaoNao = screen.getByText("Não");
    fireEvent.click(botaoNao);
    await waitFor(() => {
      expect(
        screen.queryByText("Cancelar Preenchimento"),
      ).not.toBeInTheDocument();
    });

    // "Sim" volta a página
    fireEvent.click(screen.getByTestId("cancelar"));
    const botaoSim = screen.getByText("Sim");
    fireEvent.click(botaoSim);
    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith(
        "/pos-recebimento/termo-recebimento-definitivo",
      );
    });
  });

  it("salva e envia o termo ao confirmar no modal, com payload correto", async () => {
    await setup();
    await preencherDadosBasicos();

    const botaoSalvar = screen.getByTestId("salvar-enviar");
    await waitFor(() => expect(botaoSalvar).not.toBeDisabled());
    fireEvent.click(botaoSalvar);

    expect(screen.getByText("Salvar e Enviar Termo")).toBeInTheDocument();

    // "Não" apenas fecha o modal
    fireEvent.click(screen.getByText("Não"));
    await waitFor(() => {
      expect(
        screen.queryByText("Salvar e Enviar Termo"),
      ).not.toBeInTheDocument();
    });

    fireEvent.click(botaoSalvar);
    fireEvent.click(screen.getByText("Sim"));

    await waitFor(() => {
      expect(payloadEnviado).not.toBeNull();
    });

    expect(payloadEnviado.empresa).toBe(EMPRESA_UUID);
    expect(payloadEnviado.contrato).toBe(CONTRATO_UUID);
    expect(payloadEnviado.cronogramas).toEqual([
      {
        cronograma: CRONOGRAMA_1_UUID,
        valor_contrato: "1500.00",
        quantidade_total_recebida: "1234.56",
      },
    ]);
    expect(payloadEnviado.fiscal_1).toBe(FISCAL_1_UUID);
    expect(payloadEnviado.fiscal_2).toBe(FISCAL_2_UUID);
    expect(payloadEnviado.fiscal_3).toBe(FISCAL_3_UUID);
    expect(payloadEnviado.texto_termo).toContain("Arroz Parboilizado");

    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith(
        "/pos-recebimento/termo-recebimento-definitivo",
      );
    });
  });
});

describe("gerarTextoTermo", () => {
  it("substitui [PRODUTO] por produtos concatenados por vírgula", () => {
    const texto = gerarTextoTermo(["Arroz", "Feijão"]);
    expect(texto).toContain("Arroz, Feijão");
    expect(texto).not.toContain("[PRODUTO]");
  });
});
