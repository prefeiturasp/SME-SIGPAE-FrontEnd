import "@testing-library/jest-dom";
import { act, render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import mock from "src/services/_mock";
import { MeusDadosContext } from "src/context/MeusDadosContext";
import { mockMeusDadosDilogQualidade } from "src/mocks/meusDados/dilog-qualidade";
import DetalharTermoRecebimentoDefinitivoPage from "src/pages/PosRecebimento/DetalharTermoRecebimentoDefinitivoPage";
import { mockTermoRecebimentoDetalhe } from "src/mocks/services/posRecebimento.service/mockTermoRecebimentoDetalhe";
import { mockGetNotificacoes } from "src/mocks/services/notificacoes.service/mockGetNotificacoes";
import { mockGetQtdNaoLidas } from "src/mocks/services/notificacoes.service/mockGetQtdNaoLidas";
import {
  getNotificacoes,
  getQtdNaoLidas,
} from "src/services/notificacoes.service";

const TERMO_UUID = mockTermoRecebimentoDetalhe.uuid;

const normalizar = (texto) => texto.replace(/\s+/g, " ").trim();

jest.mock("src/services/notificacoes.service");

const setup = async () => {
  let utils;
  await act(async () => {
    utils = render(
      <MemoryRouter>
        <MeusDadosContext.Provider
          value={{
            meusDados: mockMeusDadosDilogQualidade,
            setMeusDados: jest.fn(),
          }}
        >
          <DetalharTermoRecebimentoDefinitivoPage />
        </MeusDadosContext.Provider>
      </MemoryRouter>,
    );
  });
  return utils;
};

describe("DetalharTermoRecebimentoDefinitivoPage", () => {
  beforeEach(() => {
    getNotificacoes.mockResolvedValue({
      data: mockGetNotificacoes,
      status: 200,
    });

    getQtdNaoLidas.mockResolvedValue({
      data: mockGetQtdNaoLidas,
      status: 200,
    });

    localStorage.setItem(
      "meusDados",
      JSON.stringify(mockMeusDadosDilogQualidade),
    );
    window.history.pushState({}, "", `?uuid=${TERMO_UUID}`);

    mock.reset();
    mock
      .onGet(`/pos-recebimento/termos/${TERMO_UUID}/`)
      .reply(200, mockTermoRecebimentoDetalhe);
  });

  afterEach(() => {
    localStorage.clear();
  });

  it("carrega e exibe os dados principais do termo", async () => {
    await setup();

    expect(
      await screen.findByText("Empresa do Luis Zimmermann"),
    ).toBeInTheDocument();

    expect(screen.getByText("135/2024 | 142/2024A")).toBeInTheDocument();

    expect(screen.getByText("12345/22")).toBeInTheDocument();
    expect(screen.getByText("123456789012")).toBeInTheDocument();

    expect(screen.getByTestId("voltar")).toBeInTheDocument();
  });

  it("monta o Objeto do Contrato no padrão esperado", async () => {
    const { container } = await setup();

    await screen.findByText("Empresa do Luis Zimmermann");

    const objeto = normalizar(
      container.querySelector(".objeto-contrato").textContent,
    );
    expect(objeto).toBe(
      "Aquisição de 17,00 kg de MANGA e 19,00 kg de BANANA NANICA, para atendimento ao Programa Nacional de Alimentação Escolar - PNAE.",
    );
  });

  it("lista a quantidade total recebida por produto e o valor do contrato", async () => {
    const { container } = await setup();

    await screen.findByText("Empresa do Luis Zimmermann");

    const dados = normalizar(
      container.querySelector(".dados-contrato").textContent,
    );
    expect(dados).toContain("135/2024 - MANGA: 17,00 kg");
    expect(dados).toContain("142/2024A - BANANA NANICA: 19,00 kg");
    expect(dados).toContain("R$ 2.000,00");
  });

  it("renderiza o texto do termo (HTML) como conteúdo", async () => {
    await setup();

    expect(
      await screen.findByText("Texto do termo de recebimento definitivo."),
    ).toBeInTheDocument();
  });
});
