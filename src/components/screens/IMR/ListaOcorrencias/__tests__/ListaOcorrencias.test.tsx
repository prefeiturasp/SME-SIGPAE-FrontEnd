import "@testing-library/jest-dom";
import { fireEvent, render, screen } from "@testing-library/react";
import React from "react";

import { ListaOcorrencias } from "../index";

const mockNavigate = jest.fn();
const mockUseSearchParams = jest.fn();
const mockFormataMesNome = jest.fn();

const MockForm = ({ children, onSubmit }: any) =>
  children({
    handleSubmit: (event: React.FormEvent<HTMLFormElement>) => {
      event?.preventDefault();
      return onSubmit();
    },
  });

const MockField = ({ component: Component, ...props }: any) => (
  <Component {...props} />
);

const MockSelect = ({ name, label, options, disabled }: any) => (
  <label>
    {label}
    <select name={name} aria-label={label} disabled={disabled}>
      {options.map((option: any) => (
        <option key={option.uuid} value={option.uuid}>
          {option.nome}
        </option>
      ))}
    </select>
  </label>
);

const MockBotao = ({ texto, type, onClick }: any) => (
  <button type={type} onClick={onClick}>
    {texto}
  </button>
);

jest.mock("react-router-dom", () => ({
  useNavigate: () => mockNavigate,
  useSearchParams: () => mockUseSearchParams(),
}));

jest.mock("react-final-form", () => ({
  Field: (props: any) => <MockField {...props} />,
  Form: (props: any) => <MockForm {...props} />,
}));

jest.mock("src/components/Shareable/Botao", () => ({
  __esModule: true,
  default: (props: any) => <MockBotao {...props} />,
}));

jest.mock("src/components/Shareable/Select", () => ({
  Select: (props: any) => <MockSelect {...props} />,
}));

jest.mock("src/components/Shareable/Botao/constants", () => ({
  BUTTON_STYLE: {
    GREEN_OUTLINE: "green-outline",
  },
  BUTTON_TYPE: {
    BUTTON: "button",
  },
}));

jest.mock("src/helpers/utilities", () => ({
  formataMesNome: (mes: string) => mockFormataMesNome(mes),
}));

jest.mock("src/configs/constants", () => ({
  LANCAMENTO_INICIAL: "lancamento-inicial",
  LANCAMENTO_MEDICAO_INICIAL: "lancamento-medicao-inicial",
  REGISTRAR_OCORRENCIAS: "registrar-ocorrencias",
  REGISTRAR_NOVA_OCORRENCIA: "registrar-nova-ocorrencia",
}));

const EDITAL_UUID = "11111111-1111-4111-8111-111111111111";
const SOLICITACAO_UUID = "22222222-2222-4222-8222-222222222222";

const configurarParametrosBusca = () => {
  const searchParams = new URLSearchParams({
    mes: "1",
    ano: "2026",
    editalUuid: EDITAL_UUID,
    solicitacaoMedicaoInicialUuid: SOLICITACAO_UUID,
  });

  mockUseSearchParams.mockReturnValue([searchParams]);
};

describe("ListaOcorrencias", () => {
  beforeEach(() => {
    jest.clearAllMocks();

    configurarParametrosBusca();
    mockFormataMesNome.mockReturnValue("Janeiro");
  });

  it("renderiza o período de lançamento da medição", () => {
    render(<ListaOcorrencias />);

    expect(mockFormataMesNome).toHaveBeenCalledWith("1");

    expect(
      screen.getByLabelText("Período de Lançamento da Medição"),
    ).toBeInTheDocument();

    expect(
      screen.getByRole("option", {
        name: "Janeiro / 2026",
      }),
    ).toBeInTheDocument();
  });

  it("navega para o registro de uma nova ocorrência", () => {
    render(<ListaOcorrencias />);

    fireEvent.click(
      screen.getByRole("button", {
        name: "Registrar Nova Ocorrência",
      }),
    );

    expect(mockNavigate).toHaveBeenCalledTimes(1);

    expect(mockNavigate).toHaveBeenCalledWith(
      "/lancamento-inicial/lancamento-medicao-inicial/registrar-ocorrencias/registrar-nova-ocorrencia",
      {
        state: {
          editalUuid: EDITAL_UUID,
          solicitacaoMedicaoInicialUuid: SOLICITACAO_UUID,
        },
      },
    );
  });
});
