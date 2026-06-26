import "@testing-library/jest-dom";
import {
  act,
  fireEvent,
  render,
  screen,
  waitFor,
} from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { PERFIL, TIPO_PERFIL } from "src/constants/shared";
import { MeusDadosContext } from "src/context/MeusDadosContext";
import { localStorageMock } from "src/mocks/localStorageMock";
import { mockMeusDadosCODAEGA } from "src/mocks/meusDados/CODAE-GA";
import { CadastroDiasLetivosPage } from "src/pages/Cadastros/CadastroDiasLetivosSIGPAEPage";
import mock from "src/services/_mock";

jest.mock("moment/dist/locale/pt-br", () => {
  require("moment/locale/pt-br");
});

jest.mock("moment", () => {
  const mockActualMoment = jest.requireActual("moment");
  mockActualMoment.locale("pt-br");
  const mockFn = (...args) => {
    if (args.length === 0) {
      return mockActualMoment("2026-06-15T12:00:00");
    }
    return mockActualMoment(...args);
  };
  return Object.assign(mockFn, mockActualMoment);
});

jest.mock("react-big-calendar/lib/addons/dragAndDrop", () => ({
  default: (Calendar) => Calendar,
}));

jest.mock("moment/dist/locale/pt-br", () => {});

jest.mock("react-big-calendar", () => {
  const actual = jest.requireActual("react-big-calendar");
  const React = require("react");
  return {
    ...actual,
    Calendar: jest.fn(
      ({ events, onSelectEvent, eventPropGetter, dayPropGetter }) =>
        React.createElement(
          "div",
          { "data-testid": "calendar" },
          (events || []).map((event, i) => {
            const props = eventPropGetter ? eventPropGetter(event) : {};
            const dayProps =
              dayPropGetter && event.start ? dayPropGetter(event.start) : {};
            return React.createElement(
              "div",
              {
                key: i,
                className: `rbc-event ${props.className || ""}`,
                style: { ...dayProps.style },
                onClick: () => onSelectEvent && onSelectEvent(event),
                "data-testid": `event-${i}`,
              },
              React.createElement(
                "div",
                { className: "rbc-event-content" },
                event.title,
              ),
            );
          }),
        ),
    ),
  };
});

jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: () => jest.fn(),
}));

const mockDiasLetivos = {
  results: [
    {
      uuid: "6f8e51e3-2e36-4d19-adb5-a5cb8e6be4bb",
      data: "24/06/2026",
      lotes: [
        {
          uuid: "5a928f0b-ee45-402b-9673-adbaa71d24aa",
          nome: "LOTE 12",
          iniciais: "PJ",
        },
      ],
      tipos_unidade_escolar: [
        {
          uuid: "9c86c534-48f3-4c5f-8dde-b686e2ccb0df",
          iniciais: "CCI/CIPS",
        },
        {
          uuid: "e89a165b-b714-471a-b86c-2c714aa000a8",
          iniciais: "CEI",
        },
        {
          uuid: "550c4f7f-a5b7-4d42-81e6-a190f23f0287",
          iniciais: "CEI CEU",
        },
        {
          uuid: "31567907-6867-43b6-ae77-3ef73f9a4bcf",
          iniciais: "CEI DIRET",
        },
        {
          uuid: "761f961d-cb86-4ec9-a52f-04be13dca51a",
          iniciais: "CEMEI",
        },
        {
          uuid: "3b24531b-5d1d-4783-87f0-8e56796d1865",
          iniciais: "CEU CEI",
        },
        {
          uuid: "86a99a7a-66bd-4b8e-9307-ab2951e9053b",
          iniciais: "CEU CEMEI",
        },
        {
          uuid: "44bf5010-74cc-4e1c-a3fe-017d6d1bca97",
          iniciais: "CEU EMEF",
        },
        {
          uuid: "33ad6632-bfde-47be-89dd-853ea2f9ae74",
          iniciais: "CEU EMEI",
        },
        {
          uuid: "80149d59-0ba3-483b-a2ea-fb078315a3d1",
          iniciais: "CEU GESTAO",
        },
        {
          uuid: "4eef85dd-feb9-4d13-b5c8-a369762f1974",
          iniciais: "CEU POLO",
        },
        {
          uuid: "15bd0547-413d-4b89-af4d-d75079e21dc7",
          iniciais: "CIEJA",
        },
        {
          uuid: "d7f81968-6cfc-4331-821d-ddc428cfb97d",
          iniciais: "EMEBS",
        },
        {
          uuid: "be5dcccc-be9a-4703-a7fa-5ccc23f4d6a0",
          iniciais: "EMEF",
        },
        {
          uuid: "d15aabc7-4277-4deb-a2e6-a77862ed5af6",
          iniciais: "EMEF P FOM",
        },
        {
          uuid: "97b4636b-7d3b-4787-be27-e33ebe94e1e2",
          iniciais: "EMEFM",
        },
        {
          uuid: "789d7af7-3970-4455-9d5c-80118b91d652",
          iniciais: "EMEI",
        },
        {
          uuid: "cb5a8bbe-9777-43e9-8268-aebcf74d5cf8",
          iniciais: "EMEI P FOM",
        },
        {
          uuid: "a97d9435-42dd-49e0-b39c-f6d01e3f0af5",
          iniciais: "EMFORPEF",
        },
        {
          uuid: "d78bc2c0-4e43-4d60-a898-cee63153acf5",
          iniciais: "PBA",
        },
      ],
      periodos_escolares: [
        {
          uuid: "01660a0a-95e3-43c4-a591-86558f96663e",
          nome: "INTERMEDIARIO",
        },
      ],
      unidades_escolares: null,
      editais_numeros: ["Edital de pregão n° 28/SME/2022"],
    },
  ],
};

const mockFeriados = {
  results: [{ dia: "04", feriado: "Corpus Christi" }],
};

const setup = async () => {
  mock.reset();
  mock.onGet("/dias-letivos/").reply(200, mockDiasLetivos);
  mock
    .onGet("medicao-inicial/medicao/feriados-no-mes-com-nome/")
    .reply(200, mockFeriados);
  mock.onGet("/usuarios/meus-dados/").reply(200, mockMeusDadosCODAEGA);
  mock.onGet("/notificacoes/").reply(200, { results: [] });
  mock
    .onGet("/notificacoes/quantidade-nao-lidos/")
    .reply(200, { quantidade: 0 });

  Object.defineProperty(global, "localStorage", { value: localStorageMock });
  localStorage.setItem(
    "tipo_perfil",
    TIPO_PERFIL.GESTAO_ALIMENTACAO_TERCEIRIZADA,
  );
  localStorage.setItem(
    "perfil",
    PERFIL.COORDENADOR_GESTAO_ALIMENTACAO_TERCEIRIZADA,
  );

  await act(async () => {
    render(
      <MemoryRouter
        future={{
          v7_startTransition: true,
          v7_relativeSplatPath: true,
        }}
      >
        <MeusDadosContext.Provider
          value={{
            meusDados: mockMeusDadosCODAEGA,
            setMeusDados: jest.fn(),
          }}
        >
          <CadastroDiasLetivosPage />
        </MeusDadosContext.Provider>
      </MemoryRouter>,
    );
  });
};

describe("Calendário de Dias Letivos SIGPAE", () => {
  beforeEach(async () => {
    jest.clearAllMocks();
    mock.reset();
    await setup();
  });

  it("deve renderizar a label FERIADO no dia 04", async () => {
    await waitFor(() => {
      expect(screen.getByText("FERIADO")).toBeInTheDocument();
    });
  });

  it("deve renderizar a label Dia Letivo no dia 24", async () => {
    await waitFor(() => {
      expect(screen.getByText(/Dia Letivo: CCI\/CIPS/)).toBeInTheDocument();
    });
  });

  it("deve abrir o modal de Feriado ao clicar na label FERIADO e exibir o conteúdo correto", async () => {
    await waitFor(() => {
      expect(screen.getByText("FERIADO")).toBeInTheDocument();
    });

    const feriadoEvent = document.querySelector(".rbc-event-feriado");
    fireEvent.click(feriadoEvent);

    await waitFor(() => {
      const modalTitle = document.querySelector(".modal-title");
      expect(modalTitle).toHaveTextContent("Feriado");
    });
    expect(screen.getByText("Corpus Christi")).toBeInTheDocument();
    expect(screen.getByText(/Dia:/)).toBeInTheDocument();
  });

  it("deve abrir o modal de Dia Letivo ao clicar na label e exibir o conteúdo correto", async () => {
    await waitFor(() => {
      expect(screen.getByText(/Dia Letivo: CCI\/CIPS/)).toBeInTheDocument();
    });

    const diaLetivoElements = document.querySelectorAll(
      ".rbc-event:not(.rbc-event-feriado)",
    );
    const diaLetivoEvent = diaLetivoElements[0];
    fireEvent.click(diaLetivoEvent);

    await waitFor(() => {
      const modalTitle = document.querySelector(".modal-title");
      expect(modalTitle).toHaveTextContent("Informações de Dia Letivo");
    });
    expect(screen.getByText(/Editais:/)).toBeInTheDocument();
    expect(screen.getByText(/Tipos de Unidades:/)).toBeInTheDocument();
    expect(screen.getByText(/DREs:/)).toBeInTheDocument();
    expect(screen.getByText(/Períodos Escolares:/)).toBeInTheDocument();
  });

  it("deve fechar o modal de Dia Letivo ao clicar no botão Manter", async () => {
    await waitFor(() => {
      expect(screen.getByText(/Dia Letivo: CCI\/CIPS/)).toBeInTheDocument();
    });

    const diaLetivoElements = document.querySelectorAll(
      ".rbc-event:not(.rbc-event-feriado)",
    );
    const diaLetivoEvent = diaLetivoElements[0];
    fireEvent.click(diaLetivoEvent);

    await waitFor(() => {
      const modalTitle = document.querySelector(".modal-title");
      expect(modalTitle).toHaveTextContent("Informações de Dia Letivo");
    });

    fireEvent.click(screen.getByText("Manter"));

    await waitFor(() => {
      expect(document.querySelector(".modal-title")).not.toBeInTheDocument();
    });
  });
});
