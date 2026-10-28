import React from "react";

import {
  act,
  fireEvent,
  render,
  screen,
  waitFor,
} from "@testing-library/react";
import "@testing-library/jest-dom";
import { MemoryRouter } from "react-router-dom";
import { CadastroEmpresa } from "../CadastroEmpresa";
import { TIPO_PERFIL } from "../../../../../constants/shared";
import mock from "src/services/_mock";
import {
  mockContratosCadastrados,
  mockListaModalidades,
} from "../../../../../mocks/Cadastros/CadastroEmpresa/mocksCadastroEmpresa";
import {
  mockCEP,
  mockLotes,
} from "../../../../../mocks/Cadastros/CadastroEmpresa/mocksHelper";
import {
  mockEmpresa,
  mockEmpresaSemNutri,
} from "../../../../../mocks/terceirizada.service/mockGetTerceirizadaUUID";
import {
  toastError,
  toastSuccess,
} from "src/components/Shareable/Toast/dialogs";
import {
  createNaoTerceirizada,
  createTerceirizada,
  updateTerceirizada,
} from "src/services/terceirizada.service";
import * as terceirizadaService from "src/services/terceirizada.service";

const MENSAGEM_CNPJ_DUPLICADO =
  "Não foi possível concluir o cadastro, pois já existe uma empresa cadastrada com o CNPJ informado.";

jest.mock("src/components/Shareable/Toast/dialogs", () => ({
  toastError: jest.fn(),
  toastSuccess: jest.fn(),
}));

const clonar = (objeto) => JSON.parse(JSON.stringify(objeto));

const empresaDistribuidor = () => clonar(mockEmpresa);

const empresaFornecedor = () => ({
  ...clonar(mockEmpresa),
  representante_legal: "Representante Legal",
  nutricionistas: [
    {
      nome: "Nutri 1",
      crn_numero: "123",
      super_admin_terceirizadas: true,
      contatos: [{ telefone: "(11) 11111-1111", email: "nutri@email.com" }],
    },
  ],
});

const configurarMocksApi = (empresa = empresaDistribuidor()) => {
  mock.reset();

  mock.onGet(`/terceirizadas/${mockEmpresa.uuid}/`).reply(200, empresa);
  mock
    .onGet("/contratos/numeros-contratos-cadastrados/")
    .reply(200, mockContratosCadastrados);
  mock.onGet("/modalidades/").reply(200, { results: mockListaModalidades });
  mock.onGet(/\/lotes-simples\//).reply(200, { results: mockLotes });
};

const setup = async () => {
  await act(async () => {
    render(
      <MemoryRouter
        future={{
          v7_startTransition: true,
          v7_relativeSplatPath: true,
        }}
      >
        <CadastroEmpresa />
      </MemoryRouter>,
      {},
    );
  });
};

const alterarCampo = (seletorOuElemento, valor) => {
  const elemento =
    typeof seletorOuElemento === "string"
      ? document.querySelector(seletorOuElemento)
      : seletorOuElemento;

  fireEvent.change(elemento, {
    target: { value: valor },
  });
};

const preencherFormularioFornecedor = async () => {
  alterarCampo('[data-cy="razao_social"]', "Empresa Teste LTDA");
  alterarCampo('[data-cy="nome_fantasia"]', "Empresa Teste");
  alterarCampo('[data-testid="cnpj-input"]', "10558126000130");
  alterarCampo("#cep", "05307190");

  await waitFor(() =>
    expect(document.querySelector('[data-cy="endereco"]')).toHaveValue(
      mockCEP.logradouro,
    ),
  );

  alterarCampo("#telefone_empresa_0", "11999999999");
  alterarCampo('[data-cy="email_empresa_0"]', "empresa@email.com");
  alterarCampo('[data-cy="representante_legal"]', "Representante Legal");
  alterarCampo('[data-cy="responsavel_email"]', "responsavel@email.com");
  alterarCampo('[data-cy="responsavel_nome"]', "Responsável");
  alterarCampo('[data-testid="responsavel-cpf-input"]', "02434368077");
  alterarCampo('[data-testid="responsavel-telefone-input"]', "11999999999");
  alterarCampo('[data-cy="responsavel_cargo"]', "Cargo");
  alterarCampo('[data-cy="nutricionista_nome_0"]', "Nutri");
  alterarCampo('[data-cy="nutricionista_crn_0"]', "123");
  alterarCampo("#telefone_terceirizada_0", "11999999999");
  alterarCampo('[data-cy="email_terceirizada_0"]', "nutri@email.com");
};

const confirmarEnvio = async (textoBotao) => {
  fireEvent.click(screen.getByRole("button", { name: textoBotao }));
  fireEvent.click(screen.getByRole("button", { name: "Sim" }));
};

beforeEach(() => {
  jest.clearAllMocks();
  window.history.pushState({}, "", "/");
  localStorage.clear();
  configurarMocksApi();

  global.fetch = jest.fn((url) => {
    if (String(url).includes("viacep.com.br")) {
      return Promise.resolve({
        status: 200,
        json: () => Promise.resolve(mockCEP),
      });
    }

    return Promise.reject(new Error(`fetch inesperado: ${url}`));
  });
});

afterEach(() => {
  jest.restoreAllMocks();
  delete global.fetch;
});

describe("Carrega página de Empresas visão Fornecedor", () => {
  beforeEach(() => {
    localStorage.setItem("tipo_perfil", TIPO_PERFIL.GESTAO_PRODUTO);
  });

  it("adiciona e deleta Contatos", async () => {
    await setup();

    let inputNome = document.getElementById("nome_contato_0");
    let inputTelefone = document.getElementById("telefone_contato_0");
    let inputEmail = document.getElementById("email_contato_0");

    fireEvent.change(inputNome, { target: { value: "Nome 1" } });
    fireEvent.change(inputTelefone, { target: { value: "(12) 3123-12312" } });
    fireEvent.change(inputEmail, { target: { value: "aaaa@aaa.com" } });

    let botaoAdicionar = screen.getByTestId("btn-add-contato");
    fireEvent.click(botaoAdicionar);

    let inputNome2 = document.getElementById("nome_contato_1");
    expect(inputNome2).toBeVisible();

    let botaoRemover = screen.getByTestId("btn-delete-contato");
    fireEvent.click(botaoRemover);

    expect(inputNome2).not.toBeVisible();
  });

  it("carrega no modo Edição", async () => {
    window.history.pushState({}, "", `?uuid=${mockEmpresa.uuid}`);

    await setup();

    await waitFor(() =>
      expect(document.querySelector('[data-cy="razao_social"]')).toHaveValue(
        mockEmpresa.razao_social,
      ),
    );

    expect(screen.getByText(/Dados da Empresa/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /Atualizar/i })).toBeEnabled();
  });

  it("exibe a mensagem da história ao editar empresa com CNPJ duplicado", async () => {
    window.history.pushState({}, "", `?uuid=${mockEmpresa.uuid}`);
    mock
      .onPatch(`/empresas-nao-terceirizadas/${mockEmpresa.uuid}/`)
      .reply(400, { cnpj: [MENSAGEM_CNPJ_DUPLICADO] });

    await setup();
    await waitFor(() =>
      expect(screen.getByRole("button", { name: /Atualizar/i })).toBeEnabled(),
    );
    await confirmarEnvio(/Atualizar/i);

    await waitFor(() =>
      expect(toastError).toHaveBeenCalledWith(MENSAGEM_CNPJ_DUPLICADO),
    );
  });

  it("confirma a edição com sucesso", async () => {
    window.history.pushState({}, "", `?uuid=${mockEmpresa.uuid}`);
    mock
      .onPatch(`/empresas-nao-terceirizadas/${mockEmpresa.uuid}/`)
      .reply(200, {});

    await setup();
    await waitFor(() =>
      expect(screen.getByRole("button", { name: /Atualizar/i })).toBeEnabled(),
    );
    await confirmarEnvio(/Atualizar/i);

    await waitFor(() =>
      expect(toastSuccess).toHaveBeenCalledWith(
        "Empresa atualizada com sucesso!",
      ),
    );
  });

  it("exibe mensagem genérica quando a edição falha por rede", async () => {
    window.history.pushState({}, "", `?uuid=${mockEmpresa.uuid}`);
    mock
      .onPatch(`/empresas-nao-terceirizadas/${mockEmpresa.uuid}/`)
      .networkError();

    await setup();
    await waitFor(() =>
      expect(screen.getByRole("button", { name: /Atualizar/i })).toBeEnabled(),
    );
    await confirmarEnvio(/Atualizar/i);

    await waitFor(() =>
      expect(toastError).toHaveBeenCalledWith(
        "Erro ao atualizar cadastro de empresa",
      ),
    );
  });
});

describe("Carrega página de Empresas visão não Fornecedor", () => {
  beforeEach(() => {
    localStorage.setItem("tipo_perfil", "");
  });

  it("carrega sem nutricionistas", async () => {
    configurarMocksApi(clonar(mockEmpresaSemNutri));
    window.history.pushState({}, "", `?uuid=${mockEmpresa.uuid}`);

    await setup();

    await waitFor(() =>
      expect(document.querySelector('[data-cy="razao_social"]')).toHaveValue(
        mockEmpresa.razao_social,
      ),
    );

    expect(screen.getByText(/Dados da Empresa/i)).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /Atualizar/i }),
    ).toBeInTheDocument();
  });

  it("exibe a mensagem da história ao cadastrar empresa com CNPJ duplicado", async () => {
    mock.onPost("/terceirizadas/").reply(400, {
      cnpj: [MENSAGEM_CNPJ_DUPLICADO],
    });

    await setup();
    await preencherFormularioFornecedor();
    await confirmarEnvio(/Salvar/i);

    await waitFor(() =>
      expect(toastError).toHaveBeenCalledWith(MENSAGEM_CNPJ_DUPLICADO),
    );
  });

  it("mantém a mensagem genérica quando o erro do cadastro não é de CNPJ", async () => {
    mock.onPost("/terceirizadas/").reply(400, {
      razao_social: ["Razão social inválida"],
    });

    await setup();
    await preencherFormularioFornecedor();
    await confirmarEnvio(/Salvar/i);

    await waitFor(() =>
      expect(toastError).toHaveBeenCalledWith(
        "Erro ao cadastrar empresa: Razão social inválida",
      ),
    );
  });

  it("confirma o cadastro de empresa com CNPJ válido e inexistente", async () => {
    mock.onPost("/terceirizadas/").reply(201, {});

    await setup();
    await preencherFormularioFornecedor();
    await confirmarEnvio(/Salvar/i);

    await waitFor(() =>
      expect(toastSuccess).toHaveBeenCalledWith(
        "Empresa cadastrada com sucesso!",
      ),
    );
  });

  it("exibe a mensagem da história ao editar empresa com CNPJ duplicado", async () => {
    configurarMocksApi(empresaFornecedor());
    window.history.pushState({}, "", `?uuid=${mockEmpresa.uuid}`);
    mock
      .onPut(`/terceirizadas/${mockEmpresa.uuid}/`)
      .reply(400, { cnpj: [MENSAGEM_CNPJ_DUPLICADO] });

    await setup();
    await waitFor(() =>
      expect(screen.getByRole("button", { name: /Atualizar/i })).toBeEnabled(),
    );
    await confirmarEnvio(/Atualizar/i);

    await waitFor(() =>
      expect(toastError).toHaveBeenCalledWith(MENSAGEM_CNPJ_DUPLICADO),
    );
  });

  it("mantém a mensagem genérica quando o erro da edição não é de CNPJ", async () => {
    configurarMocksApi(empresaFornecedor());
    window.history.pushState({}, "", `?uuid=${mockEmpresa.uuid}`);
    mock
      .onPut(`/terceirizadas/${mockEmpresa.uuid}/`)
      .reply(400, { razao_social: ["Razão social inválida"] });

    await setup();
    await waitFor(() =>
      expect(screen.getByRole("button", { name: /Atualizar/i })).toBeEnabled(),
    );
    await confirmarEnvio(/Atualizar/i);

    await waitFor(() =>
      expect(toastError).toHaveBeenCalledWith(
        "Erro ao atualizar cadastro de empresa: Razão social inválida",
      ),
    );
  });

  it("exibe mensagem genérica quando o cadastro retorna erro não mapeado", async () => {
    mock.onPost("/terceirizadas/").reply(500, {});

    await setup();
    await preencherFormularioFornecedor();
    await confirmarEnvio(/Salvar/i);

    await waitFor(() =>
      expect(toastError).toHaveBeenCalledWith("Erro ao cadastrar empresa"),
    );
  });

  it("exibe mensagem genérica quando a requisição de cadastro falha", async () => {
    mock.onPost("/terceirizadas/").networkError();

    await setup();
    await preencherFormularioFornecedor();
    await confirmarEnvio(/Salvar/i);

    await waitFor(() =>
      expect(toastError).toHaveBeenCalledWith("Erro ao cadastrar empresa"),
    );
  });

  it("exibe mensagem genérica quando a requisição de edição falha", async () => {
    configurarMocksApi(empresaFornecedor());
    window.history.pushState({}, "", `?uuid=${mockEmpresa.uuid}`);
    mock.onPut(`/terceirizadas/${mockEmpresa.uuid}/`).networkError();

    await setup();
    await waitFor(() =>
      expect(screen.getByRole("button", { name: /Atualizar/i })).toBeEnabled(),
    );
    await confirmarEnvio(/Atualizar/i);

    await waitFor(() =>
      expect(toastError).toHaveBeenCalledWith(
        "Erro ao atualizar cadastro de empresa",
      ),
    );
  });

  it("limpa o formulário ao clicar em Cancelar", async () => {
    await setup();

    alterarCampo('[data-cy="razao_social"]', "Empresa Teste");
    expect(document.querySelector('[data-cy="razao_social"]')).toHaveValue(
      "Empresa Teste",
    );

    fireEvent.click(screen.getByRole("button", { name: /Cancelar/i }));

    expect(document.querySelector('[data-cy="razao_social"]')).toHaveValue("");
  });

  it("exibe a mensagem de CNPJ mesmo quando o status não é 400", async () => {
    mock.onPost("/terceirizadas/").reply(500, {
      cnpj: [MENSAGEM_CNPJ_DUPLICADO],
    });

    await setup();
    await preencherFormularioFornecedor();
    await confirmarEnvio(/Salvar/i);

    await waitFor(() =>
      expect(toastError).toHaveBeenCalledWith(MENSAGEM_CNPJ_DUPLICADO),
    );
  });

  it("exibe a mensagem de CNPJ quando o serviço devolve o body cru", async () => {
    jest
      .spyOn(terceirizadaService, "createTerceirizada")
      .mockResolvedValueOnce({ cnpj: [MENSAGEM_CNPJ_DUPLICADO] });

    await setup();
    await preencherFormularioFornecedor();
    await confirmarEnvio(/Salvar/i);

    await waitFor(() =>
      expect(toastError).toHaveBeenCalledWith(MENSAGEM_CNPJ_DUPLICADO),
    );
  });

  it("exibe mensagem genérica quando o serviço de cadastro lança exceção", async () => {
    jest
      .spyOn(terceirizadaService, "createTerceirizada")
      .mockRejectedValueOnce(new Error("falha"));

    await setup();
    await preencherFormularioFornecedor();
    await confirmarEnvio(/Salvar/i);

    await waitFor(() =>
      expect(toastError).toHaveBeenCalledWith("Erro ao cadastrar empresa"),
    );
  });

  it("exibe mensagem genérica quando o serviço de edição lança exceção", async () => {
    configurarMocksApi(empresaFornecedor());
    window.history.pushState({}, "", `?uuid=${mockEmpresa.uuid}`);
    jest
      .spyOn(terceirizadaService, "updateTerceirizada")
      .mockRejectedValueOnce(new Error("falha"));

    await setup();
    await waitFor(() =>
      expect(screen.getByRole("button", { name: /Atualizar/i })).toBeEnabled(),
    );
    await confirmarEnvio(/Atualizar/i);

    await waitFor(() =>
      expect(toastError).toHaveBeenCalledWith(
        "Erro ao atualizar cadastro de empresa",
      ),
    );
  });
});

describe("Services de empresa", () => {
  it("createNaoTerceirizada devolve o erro de CNPJ duplicado", async () => {
    mock.onPost("/empresas-nao-terceirizadas/").reply(400, {
      cnpj: [MENSAGEM_CNPJ_DUPLICADO],
    });

    const response = await createNaoTerceirizada({ cnpj: "10558126000130" });

    expect(response).toEqual({
      data: { cnpj: [MENSAGEM_CNPJ_DUPLICADO] },
      status: 400,
    });
  });

  it("createTerceirizada devolve o erro de CNPJ duplicado", async () => {
    mock.onPost("/terceirizadas/").reply(400, {
      cnpj: [MENSAGEM_CNPJ_DUPLICADO],
    });

    const response = await createTerceirizada({ cnpj: "10558126000130" });

    expect(response).toEqual({
      data: { cnpj: [MENSAGEM_CNPJ_DUPLICADO] },
      status: 400,
    });
  });

  it("updateTerceirizada devolve o erro de CNPJ duplicado", async () => {
    mock
      .onPut(`/terceirizadas/${mockEmpresa.uuid}/`)
      .reply(400, { cnpj: [MENSAGEM_CNPJ_DUPLICADO] });

    const response = await updateTerceirizada(mockEmpresa.uuid, {
      cnpj: "10558126000130",
    });

    expect(response).toEqual({
      data: { cnpj: [MENSAGEM_CNPJ_DUPLICADO] },
      status: 400,
    });
  });
});
