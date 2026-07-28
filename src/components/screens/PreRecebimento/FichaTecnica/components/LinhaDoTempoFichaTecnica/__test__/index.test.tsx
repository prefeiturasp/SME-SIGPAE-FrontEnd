import React from "react";
import {
  act,
  fireEvent,
  render,
  screen,
  waitFor,
} from "@testing-library/react";

import { LogFichaTecnica } from "src/interfaces/pre_recebimento.interface";

import { montarLinhaDoTempoFichaTecnica } from "../helpers";
import type { EtapaLinhaDoTempoFichaTecnica } from "../helpers";
import LinhaDoTempoFichaTecnica from "../index";

jest.mock("../helpers", () => ({
  montarLinhaDoTempoFichaTecnica: jest.fn(),
}));

const montarLinhaDoTempoFichaTecnicaMock =
  montarLinhaDoTempoFichaTecnica as jest.MockedFunction<
    typeof montarLinhaDoTempoFichaTecnica
  >;

const logsMock = [
  {
    criado_em: "27/07/2026 10:00",
    status_evento_explicacao: "Ficha Técnica cadastrada",
    usuario: {
      nome: "Usuário da Empresa",
    },
  },
] as LogFichaTecnica[];

const etapasMock: EtapaLinhaDoTempoFichaTecnica[] = [
  {
    titulo: "Ficha Técnica Cadastrada",
    criadoEm: "27/07/2026 10:00",
    nomeUsuario: "Usuário da Empresa",
    tipo: "concluida",
  },
  {
    titulo: "Correção Solicitada",
    criadoEm: "27/07/2026 11:00",
    nomeUsuario: "Usuário da Gestão de Produto",
    tipo: "alerta",
  },
];

let larguraDoConteudo = 640;
let larguraDoContainer = 640;

const scrollByMock = jest.fn();

const scrollWidthOriginal = Object.getOwnPropertyDescriptor(
  HTMLElement.prototype,
  "scrollWidth",
);

const clientWidthOriginal = Object.getOwnPropertyDescriptor(
  HTMLElement.prototype,
  "clientWidth",
);

const scrollByOriginal = Object.getOwnPropertyDescriptor(
  HTMLElement.prototype,
  "scrollBy",
);

const restaurarPropriedade = (
  propriedade: string,
  descritorOriginal?: PropertyDescriptor,
) => {
  if (descritorOriginal) {
    Object.defineProperty(
      HTMLElement.prototype,
      propriedade,
      descritorOriginal,
    );
    return;
  }

  delete (HTMLElement.prototype as unknown as Record<string, unknown>)[
    propriedade
  ];
};

beforeAll(() => {
  Object.defineProperty(HTMLElement.prototype, "scrollWidth", {
    configurable: true,
    get: () => larguraDoConteudo,
  });

  Object.defineProperty(HTMLElement.prototype, "clientWidth", {
    configurable: true,
    get: () => larguraDoContainer,
  });

  Object.defineProperty(HTMLElement.prototype, "scrollBy", {
    configurable: true,
    value: scrollByMock,
  });
});

beforeEach(() => {
  larguraDoConteudo = 640;
  larguraDoContainer = 640;

  scrollByMock.mockClear();
  montarLinhaDoTempoFichaTecnicaMock.mockReset();
});

afterEach(() => {
  jest.useRealTimers();
});

afterAll(() => {
  restaurarPropriedade("scrollWidth", scrollWidthOriginal);
  restaurarPropriedade("clientWidth", clientWidthOriginal);
  restaurarPropriedade("scrollBy", scrollByOriginal);
});

describe("LinhaDoTempoFichaTecnica", () => {
  it("não renderiza a linha do tempo quando não existem etapas", () => {
    montarLinhaDoTempoFichaTecnicaMock.mockReturnValue([]);

    const { container } = render(<LinhaDoTempoFichaTecnica logs={logsMock} />);

    expect(montarLinhaDoTempoFichaTecnicaMock).toHaveBeenCalledWith(logsMock);
    expect(container).toBeEmptyDOMElement();
  });

  it("exibe as setas e navega pela linha do tempo quando existe overflow", async () => {
    larguraDoConteudo = 1000;
    larguraDoContainer = 400;

    montarLinhaDoTempoFichaTecnicaMock.mockReturnValue(etapasMock);

    render(<LinhaDoTempoFichaTecnica logs={logsMock} />);

    const linhaDoTempo = screen.getByLabelText(
      "Histórico de status da Ficha Técnica",
    );

    await waitFor(() => {
      expect(linhaDoTempo).toHaveClass(
        "linha-do-tempo-ficha-tecnica-wrapper--com-overflow",
      );
    });

    const botaoAnterior = screen.getByRole("button", {
      name: "Visualizar status anteriores",
    });

    const botaoProximo = screen.getByRole("button", {
      name: "Visualizar próximos status",
    });

    fireEvent.click(botaoAnterior);

    expect(scrollByMock).toHaveBeenCalledWith({
      left: -300,
      behavior: "smooth",
    });

    fireEvent.click(botaoProximo);

    expect(scrollByMock).toHaveBeenCalledWith({
      left: 300,
      behavior: "smooth",
    });
  });

  it("posiciona a linha do tempo no status mais recente após o carregamento", () => {
    jest.useFakeTimers();

    larguraDoConteudo = 1000;
    larguraDoContainer = 400;

    montarLinhaDoTempoFichaTecnicaMock.mockReturnValue(etapasMock);

    const { container } = render(<LinhaDoTempoFichaTecnica logs={logsMock} />);

    const containerDeScroll = container.querySelector<HTMLDivElement>(
      ".linha-do-tempo-ficha-tecnica__scroll",
    );

    expect(containerDeScroll).not.toBeNull();

    act(() => {
      jest.advanceTimersByTime(200);
    });

    expect(containerDeScroll?.scrollLeft).toBe(1000);
  });
});
