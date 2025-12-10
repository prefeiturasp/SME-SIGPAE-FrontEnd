import React from "react";
import {
  render,
  screen,
  act,
  waitFor,
  fireEvent,
} from "@testing-library/react";
import "@testing-library/jest-dom";
import { MemoryRouter } from "react-router-dom";
import mock from "src/services/_mock";
import DetalharCronogramaPage from "src/pages/PreRecebimento/DetalharCronogramaPage";
import { PERFIL, TIPO_SERVICO } from "../../../../../constants/shared";
import {
  mockCronogramaAssinadoAbastecimento,
  mockCronogramaAssinadoCODAE,
  mockCronogramaAssinadoFornecedor,
  mockCronogramaEnviadoFornecedor,
} from "../../../../../mocks/cronograma.service/mockGetCronogramaDetalhar";

const setWindowLocation = (search) => {
  const newLocation = {
    ...window.location,
    search: search,
  };
  delete window.location;
  window.location = newLocation;
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
      </MemoryRouter>,
    );
  });
};

describe("Testa página Detalhar Cronograma (Perfil Cronograma)", () => {
  beforeAll(() => {
    localStorage.setItem("perfil", PERFIL.DILOG_CRONOGRAMA);
    mock
      .onGet(
        `/cronogramas/${mockCronogramaAssinadoCODAE.uuid}/detalhar-com-log/`,
      )
      .reply(200, mockCronogramaAssinadoCODAE);

    setWindowLocation(`?uuid=${mockCronogramaAssinadoCODAE.uuid}`);
  });

  it("carrega cronograma detalhado", async () => {
    await setup();
    await waitFor(() =>
      expect(screen.getByText(`Status do Cronograma`)).toBeInTheDocument(),
    );

    expect(screen.getByText(`Assinado Abastecimento`)).toBeInTheDocument();
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

    expect(btnVoltar).toBeInTheDocument();
  });

  it("baixa PDF do cronograma", async () => {
    let createObjectURL = jest.fn();
    window.URL.createObjectURL = createObjectURL;
    await setup();
    await waitFor(() =>
      expect(screen.getByText(`Status do Cronograma`)).toBeInTheDocument(),
    );

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

    expect(btnBaixar).toBeInTheDocument();
  });
});

describe("Testa página de Detalhar Cronograma (Perfil Fornecedor)", () => {
  beforeAll(() => {
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
    mock
      .onPatch(
        `/cronogramas/${mockCronogramaEnviadoFornecedor.uuid}/fornecedor-assina-cronograma/`,
      )
      .reply(200, {});

    setWindowLocation(`?uuid=${mockCronogramaEnviadoFornecedor.uuid}`);
  });

  it("carrega cronograma detalhado e assina", async () => {
    await setup();
    await waitFor(() =>
      expect(screen.getByText(`Status do Cronograma`)).toBeInTheDocument(),
    );

    expect(
      screen.queryByText(`Assinado e Enviado ao Fornecedor`),
    ).toBeInTheDocument();
    expect(
      screen.queryByText(`Assinado Abastecimento`),
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

    const btnFechar = screen.getByText("Não").closest("button");
    fireEvent.click(btnFechar);
    fireEvent.click(btnAssinar);

    const btnAssinarModal = screen
      .getByText("Sim, assinar cronograma")
      .closest("button");
    fireEvent.click(btnAssinarModal);

    let inputNumeroFicha = screen.getByTestId("password");
    fireEvent.change(inputNumeroFicha, {
      target: { value: "111" },
    });

    const btnConfirmar = screen.getByText("Confirmar").closest("button");
    fireEvent.click(btnConfirmar);

    expect(btnConfirmar).toBeInTheDocument();
  });

  it("mostra erro de senha inválida", async () => {
    mock
      .onPatch(
        `/cronogramas/${mockCronogramaEnviadoFornecedor.uuid}/fornecedor-assina-cronograma/`,
      )
      .reply(401, {});
    await setup();
    await waitFor(() =>
      expect(screen.getByText(`Status do Cronograma`)).toBeInTheDocument(),
    );

    const btnAssinar = screen.getByText("Assinar Cronograma").closest("button");
    fireEvent.click(btnAssinar);

    const btnAssinarModal = screen
      .getByText("Sim, assinar cronograma")
      .closest("button");
    fireEvent.click(btnAssinarModal);

    let inputNumeroFicha = screen.getByTestId("password");
    fireEvent.change(inputNumeroFicha, {
      target: { value: "111" },
    });

    const btnConfirmar = screen.getByText("Confirmar").closest("button");
    fireEvent.click(btnConfirmar);

    expect(btnConfirmar).toBeInTheDocument();
  });
});

describe("Testa página de Detalhar Cronograma (Perfil Abastecimento)", () => {
  beforeAll(() => {
    localStorage.setItem("perfil", PERFIL.DILOG_ABASTECIMENTO);

    mock
      .onGet(
        `/cronogramas/${mockCronogramaAssinadoFornecedor.uuid}/detalhar-com-log/`,
      )
      .reply(200, mockCronogramaAssinadoFornecedor);
    mock
      .onPatch(
        `/cronogramas/${mockCronogramaAssinadoFornecedor.uuid}/abastecimento-assina/`,
      )
      .reply(200, {});

    setWindowLocation(`?uuid=${mockCronogramaAssinadoFornecedor.uuid}`);
  });

  it("carrega cronograma detalhado e assina", async () => {
    await setup();
    await waitFor(() =>
      expect(screen.getByText(`Status do Cronograma`)).toBeInTheDocument(),
    );

    expect(screen.queryByText(`Assinado Fornecedor`)).toBeInTheDocument();
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

    const btnFechar = screen.getByText("Não").closest("button");
    fireEvent.click(btnFechar);
    fireEvent.click(btnAssinar);

    const btnAssinarModal = screen
      .getByText("Sim, assinar cronograma")
      .closest("button");
    fireEvent.click(btnAssinarModal);

    let inputNumeroFicha = screen.getByTestId("password");
    fireEvent.change(inputNumeroFicha, {
      target: { value: "111" },
    });

    const btnConfirmar = screen.getByText("Confirmar").closest("button");
    fireEvent.click(btnConfirmar);

    expect(btnConfirmar).toBeInTheDocument();
  });

  it("mostra erro de senha inválida", async () => {
    mock
      .onPatch(
        `/cronogramas/${mockCronogramaAssinadoFornecedor.uuid}/abastecimento-assina/`,
      )
      .reply(401, {});
    await setup();
    await waitFor(() =>
      expect(screen.getByText(`Status do Cronograma`)).toBeInTheDocument(),
    );

    const btnAssinar = screen.getByText("Assinar Cronograma").closest("button");
    fireEvent.click(btnAssinar);

    const btnAssinarModal = screen
      .getByText("Sim, assinar cronograma")
      .closest("button");
    fireEvent.click(btnAssinarModal);

    let inputNumeroFicha = screen.getByTestId("password");
    fireEvent.change(inputNumeroFicha, {
      target: { value: "111" },
    });

    const btnConfirmar = screen.getByText("Confirmar").closest("button");
    fireEvent.click(btnConfirmar);

    expect(btnConfirmar).toBeInTheDocument();
  });
});

describe("Testa página de Detalhar Cronograma (Perfil Dilog Diretoria)", () => {
  beforeAll(() => {
    localStorage.setItem("perfil", PERFIL.DILOG_DIRETORIA);

    mock
      .onGet(
        `/cronogramas/${mockCronogramaAssinadoAbastecimento.uuid}/detalhar-com-log/`,
      )
      .reply(200, mockCronogramaAssinadoAbastecimento);
    mock
      .onPatch(
        `/cronogramas/${mockCronogramaAssinadoAbastecimento.uuid}/codae-assina/`,
      )
      .reply(200, {});

    setWindowLocation(`?uuid=${mockCronogramaAssinadoAbastecimento.uuid}`);
  });

  it("carrega cronograma detalhado e assina", async () => {
    await setup();
    await waitFor(() =>
      expect(screen.getByText(`Status do Cronograma`)).toBeInTheDocument(),
    );

    expect(screen.queryByText(`Assinado Abastecimento`)).toBeInTheDocument();
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

    const btnFechar = screen.getByText("Não").closest("button");
    fireEvent.click(btnFechar);
    fireEvent.click(btnAssinar);

    const btnAssinarModal = screen
      .getByText("Sim, assinar cronograma")
      .closest("button");
    fireEvent.click(btnAssinarModal);

    let inputNumeroFicha = screen.getByTestId("password");
    fireEvent.change(inputNumeroFicha, {
      target: { value: "111" },
    });

    const btnConfirmar = screen.getByText("Confirmar").closest("button");
    fireEvent.click(btnConfirmar);

    expect(btnConfirmar).toBeInTheDocument();
  });

  it("mostra erro de senha inválida", async () => {
    mock
      .onPatch(
        `/cronogramas/${mockCronogramaAssinadoAbastecimento.uuid}/codae-assina/`,
      )
      .reply(401, {});
    await setup();
    await waitFor(() =>
      expect(screen.getByText(`Status do Cronograma`)).toBeInTheDocument(),
    );

    const btnAssinar = screen.getByText("Assinar Cronograma").closest("button");
    fireEvent.click(btnAssinar);

    const btnAssinarModal = screen
      .getByText("Sim, assinar cronograma")
      .closest("button");
    fireEvent.click(btnAssinarModal);

    let inputNumeroFicha = screen.getByTestId("password");
    fireEvent.change(inputNumeroFicha, {
      target: { value: "111" },
    });

    const btnConfirmar = screen.getByText("Confirmar").closest("button");
    fireEvent.click(btnConfirmar);

    expect(btnConfirmar).toBeInTheDocument();
  });
});
