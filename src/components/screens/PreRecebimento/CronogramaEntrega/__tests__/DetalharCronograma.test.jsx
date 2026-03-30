import "@testing-library/jest-dom";
import {
  act,
  fireEvent,
  render,
  screen,
  waitFor,
} from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import { PERFIL, TIPO_SERVICO } from "src/constants/shared";
import {
  mockCronogramaAssinadoAbastecimento,
  mockCronogramaAssinadoCODAE,
  mockCronogramaAssinadoFornecedor,
  mockCronogramaEnviadoFornecedor,
  mockCronogramaFLVPontoAPonto,
} from "src/mocks/cronograma.service/mockGetCronogramaDetalhar";
import DetalharCronogramaPage from "src/pages/PreRecebimento/DetalharCronogramaPage";
import mock from "src/services/_mock";

const setWindowLocation = (search) => {
  window.history.pushState({}, "", `${window.location.pathname}${search}`);
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
        <DetalharCronogramaPage />
        <ToastContainer />
      </MemoryRouter>,
    );
  });
};

const esperarCarregamento = async () => {
  await waitFor(() =>
    expect(screen.getByText("Status do Cronograma")).toBeInTheDocument(),
  );
};

const clicarFecharModal = () => {
  const btnFechar = screen.getByText("Não").closest("button");
  fireEvent.click(btnFechar);
};

const preencherSenhaEConfirmar = (senha = "111") => {
  const inputSenha = screen.getByTestId("password");
  fireEvent.change(inputSenha, { target: { value: senha } });
  const btnConfirmar = screen.getByText("Confirmar").closest("button");
  fireEvent.click(btnConfirmar);
  return btnConfirmar;
};

const abrirModalAssinatura = () => {
  const btnAssinar = screen.getByText("Assinar Cronograma").closest("button");
  fireEvent.click(btnAssinar);
  const btnAssinarModal = screen
    .getByText("Sim, assinar cronograma")
    .closest("button");
  fireEvent.click(btnAssinarModal);
};

const limparLocalStorage = () => {
  localStorage.removeItem("perfil");
  localStorage.removeItem("tipo_servico");
};

describe("Testa página Detalhar Cronograma (Perfil Cronograma)", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mock.resetHistory();
    localStorage.setItem("perfil", PERFIL.DILOG_CRONOGRAMA);

    mock
      .onGet(
        `/cronogramas/${mockCronogramaAssinadoCODAE.uuid}/detalhar-com-log/`,
      )
      .reply(200, mockCronogramaAssinadoCODAE);

    setWindowLocation(`?uuid=${mockCronogramaAssinadoCODAE.uuid}`);
  });

  afterAll(() => {
    limparLocalStorage();
  });

  it("carrega cronograma detalhado", async () => {
    await setup();
    await esperarCarregamento();

    expect(screen.getByText("Assinado Abastecimento")).toBeInTheDocument();
    expect(
      screen.getByText(mockCronogramaAssinadoCODAE.numero),
    ).toBeInTheDocument();
    expect(
      screen.getByText(mockCronogramaAssinadoCODAE.ficha_tecnica.produto.nome),
    ).toBeInTheDocument();
    expect(
      screen.getByText(
        `${mockCronogramaAssinadoCODAE.empresa.nome_fantasia} / ${mockCronogramaAssinadoCODAE.empresa.razao_social}`,
      ),
    ).toBeInTheDocument();

    const btnVoltar = screen.getByTestId("voltar");
    expect(btnVoltar).not.toBeDisabled();
    fireEvent.click(btnVoltar);
  });

  it("baixa PDF do cronograma", async () => {
    const createObjectURL = jest.fn();
    window.URL.createObjectURL = createObjectURL;
    await setup();
    await esperarCarregamento();

    const btnBaixar = screen
      .getByText("Baixar PDF Cronograma")
      .closest("button");
    expect(btnBaixar).not.toBeDisabled();

    mock
      .onGet(
        `/cronogramas/${mockCronogramaAssinadoCODAE.uuid}/gerar-pdf-cronograma/`,
      )
      .reply(200, new Blob());
    fireEvent.click(btnBaixar);

    await waitFor(() => {
      expect(createObjectURL).toHaveBeenCalled();
    });
  });
});

describe("Testa página de Detalhar Cronograma (Perfil Fornecedor)", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mock.resetHistory();
    localStorage.setItem("perfil", PERFIL.ADMINISTRADOR_EMPRESA);
    localStorage.setItem(
      "tipo_servico",
      TIPO_SERVICO.FORNECEDOR_E_DISTRIBUIDOR,
    );

    mock
      .onGet(
        `/cronogramas/${mockCronogramaEnviadoFornecedor.uuid}/detalhar-com-log/`,
      )
      .reply(200, mockCronogramaEnviadoFornecedor);

    setWindowLocation(`?uuid=${mockCronogramaEnviadoFornecedor.uuid}`);
  });

  afterAll(() => {
    limparLocalStorage();
  });

  it("carrega cronograma detalhado e assina", async () => {
    mock
      .onPatch(
        `/cronogramas/${mockCronogramaEnviadoFornecedor.uuid}/fornecedor-assina-cronograma/`,
      )
      .reply(200, {});

    await setup();
    await esperarCarregamento();

    expect(
      screen.queryByText("Assinado e Enviado ao Fornecedor"),
    ).toBeInTheDocument();
    expect(
      screen.queryByText("Assinado Abastecimento"),
    ).not.toBeInTheDocument();
    expect(
      screen.getByText(mockCronogramaEnviadoFornecedor.numero),
    ).toBeInTheDocument();
    expect(
      screen.getByText(
        mockCronogramaEnviadoFornecedor.ficha_tecnica.produto.nome,
      ),
    ).toBeInTheDocument();
    expect(screen.getByText("LEVE LEITE - PLL")).toBeInTheDocument();
    expect(
      screen.getByText(
        `${mockCronogramaEnviadoFornecedor.empresa.nome_fantasia} / ${mockCronogramaEnviadoFornecedor.empresa.razao_social}`,
      ),
    ).toBeInTheDocument();

    const btnAssinar = screen.getByText("Assinar Cronograma").closest("button");
    fireEvent.click(btnAssinar);
    clicarFecharModal();
    fireEvent.click(btnAssinar);

    const btnAssinarModal = screen
      .getByText("Sim, assinar cronograma")
      .closest("button");
    fireEvent.click(btnAssinarModal);

    preencherSenhaEConfirmar();
  });

  it("mostra erro de senha inválida", async () => {
    mock
      .onPatch(
        `/cronogramas/${mockCronogramaEnviadoFornecedor.uuid}/fornecedor-assina-cronograma/`,
      )
      .reply(401, {});

    await setup();
    await esperarCarregamento();

    abrirModalAssinatura();
    preencherSenhaEConfirmar();

    expect(
      await screen.findByText("Senha inválida, verifique e tente novamente."),
    ).toBeInTheDocument();
  });
});

describe("Testa página de Detalhar Cronograma (Perfil Abastecimento)", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mock.resetHistory();
    localStorage.setItem("perfil", PERFIL.DILOG_ABASTECIMENTO);

    mock
      .onGet(
        `/cronogramas/${mockCronogramaAssinadoFornecedor.uuid}/detalhar-com-log/`,
      )
      .reply(200, mockCronogramaAssinadoFornecedor);

    setWindowLocation(`?uuid=${mockCronogramaAssinadoFornecedor.uuid}`);
  });

  afterAll(() => {
    limparLocalStorage();
  });

  it("carrega cronograma detalhado e assina", async () => {
    mock
      .onPatch(
        `/cronogramas/${mockCronogramaAssinadoFornecedor.uuid}/abastecimento-assina/`,
      )
      .reply(200, {});

    await setup();
    await esperarCarregamento();

    expect(screen.queryByText("Assinado Fornecedor")).toBeInTheDocument();
    expect(
      screen.getByText(mockCronogramaAssinadoFornecedor.numero),
    ).toBeInTheDocument();
    expect(
      screen.getByText(
        mockCronogramaAssinadoFornecedor.ficha_tecnica.produto.nome,
      ),
    ).toBeInTheDocument();
    expect(
      screen.getByText(
        `${mockCronogramaAssinadoFornecedor.empresa.nome_fantasia} / ${mockCronogramaAssinadoFornecedor.empresa.razao_social}`,
      ),
    ).toBeInTheDocument();

    const btnAssinar = screen.getByText("Assinar Cronograma").closest("button");
    fireEvent.click(btnAssinar);
    clicarFecharModal();
    fireEvent.click(btnAssinar);

    const btnAssinarModal = screen
      .getByText("Sim, assinar cronograma")
      .closest("button");
    fireEvent.click(btnAssinarModal);

    preencherSenhaEConfirmar();
  });

  it("mostra erro de senha inválida", async () => {
    mock
      .onPatch(
        `/cronogramas/${mockCronogramaAssinadoFornecedor.uuid}/abastecimento-assina/`,
      )
      .reply(401, {});

    await setup();
    await esperarCarregamento();

    abrirModalAssinatura();
    preencherSenhaEConfirmar();

    expect(
      await screen.findByText("Senha inválida, verifique e tente novamente."),
    ).toBeInTheDocument();
  });
});

describe("Testa página de Detalhar Cronograma (Perfil Dilog Diretoria)", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mock.resetHistory();
    localStorage.setItem("perfil", PERFIL.DILOG_DIRETORIA);

    mock
      .onGet(
        `/cronogramas/${mockCronogramaAssinadoAbastecimento.uuid}/detalhar-com-log/`,
      )
      .reply(200, mockCronogramaAssinadoAbastecimento);

    setWindowLocation(`?uuid=${mockCronogramaAssinadoAbastecimento.uuid}`);
  });

  afterAll(() => {
    limparLocalStorage();
  });

  it("carrega cronograma detalhado e assina", async () => {
    mock
      .onPatch(
        `/cronogramas/${mockCronogramaAssinadoAbastecimento.uuid}/codae-assina/`,
      )
      .reply(200, {});

    await setup();
    await esperarCarregamento();

    expect(screen.queryByText("Assinado Abastecimento")).toBeInTheDocument();
    expect(
      screen.getByText(mockCronogramaAssinadoAbastecimento.numero),
    ).toBeInTheDocument();
    expect(
      screen.getByText(
        mockCronogramaAssinadoAbastecimento.ficha_tecnica.produto.nome,
      ),
    ).toBeInTheDocument();
    expect(
      screen.getByText(
        `${mockCronogramaAssinadoAbastecimento.empresa.nome_fantasia} / ${mockCronogramaAssinadoAbastecimento.empresa.razao_social}`,
      ),
    ).toBeInTheDocument();

    const btnAssinar = screen.getByText("Assinar Cronograma").closest("button");
    fireEvent.click(btnAssinar);
    clicarFecharModal();
    fireEvent.click(btnAssinar);

    const btnAssinarModal = screen
      .getByText("Sim, assinar cronograma")
      .closest("button");
    fireEvent.click(btnAssinarModal);

    preencherSenhaEConfirmar();
  });

  it("mostra erro de senha inválida", async () => {
    mock
      .onPatch(
        `/cronogramas/${mockCronogramaAssinadoAbastecimento.uuid}/codae-assina/`,
      )
      .reply(401, {});

    await setup();
    await esperarCarregamento();

    abrirModalAssinatura();
    preencherSenhaEConfirmar();

    expect(
      await screen.findByText("Senha inválida, verifique e tente novamente."),
    ).toBeInTheDocument();
  });
});

describe("Testa página Detalhar Cronograma FLV Ponto a Ponto", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mock.resetHistory();
    localStorage.setItem("perfil", PERFIL.ADMINISTRADOR_EMPRESA);
    localStorage.setItem(
      "tipo_servico",
      TIPO_SERVICO.FORNECEDOR_E_DISTRIBUIDOR,
    );
    mock
      .onGet(
        `/cronogramas/${mockCronogramaFLVPontoAPonto.uuid}/detalhar-com-log/`,
      )
      .reply(200, mockCronogramaFLVPontoAPonto);

    setWindowLocation(`?uuid=${mockCronogramaFLVPontoAPonto.uuid}`);
  });

  afterAll(() => {
    limparLocalStorage();
  });

  it("verifica exibição de campos específicos de FLV Ponto a Ponto", async () => {
    await setup();
    await esperarCarregamento();

    expect(
      screen.getByText(/Dados do Produto e Data de Entrega/i),
    ).toBeInTheDocument();

    expect(screen.getByText(/Nº do Empenho:/i)).toBeInTheDocument();
    expect(
      screen.getByText(mockCronogramaFLVPontoAPonto.numero_empenho),
    ).toBeInTheDocument();

    expect(screen.queryByText("Embalagem Primária:")).not.toBeInTheDocument();
    expect(screen.queryByText("Embalagem Secundária:")).not.toBeInTheDocument();

    expect(
      screen.getByText("Tabela de Distribuição de Etapas"),
    ).toBeInTheDocument();

    const tableHeaders = screen.getAllByRole("columnheader");
    const headerTexts = tableHeaders.map((h) => h.textContent);
    expect(headerTexts).not.toContain("N° do Empenho");
    expect(headerTexts).not.toContain("Qtde. Total do Empenho");
    expect(headerTexts).not.toContain("Parte");
    expect(headerTexts).not.toContain("Total de Embalagens");

    expect(screen.getByText(/Etapa 1/i)).toBeInTheDocument();
    expect(screen.getByText(/Julho\/2026/i)).toBeInTheDocument();
    expect(screen.getByText(/Outubro\/2026/i)).toBeInTheDocument();

    expect(screen.queryByText("Armazém")).not.toBeInTheDocument();
  });

  it("verifica exibição do botão de Assinar Cronograma para Fornecedor", async () => {
    await setup();
    await esperarCarregamento();

    const btnAssinar = screen.queryByText("Assinar Cronograma");
    expect(btnAssinar).toBeInTheDocument();
  });
});
