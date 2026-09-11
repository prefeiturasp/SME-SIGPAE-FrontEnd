import "@testing-library/jest-dom";
import { fireEvent, render, screen } from "@testing-library/react";

import { checaSeDataEstaEntre2e5DiasUteis } from "src/helpers/utilities";
import { DatasReferenciaAplicarEm } from "../index";

jest.mock("react-final-form", () => ({
  Field: ({ component: Componente, ...propriedades }) => (
    <Componente {...propriedades} />
  ),
}));

jest.mock("src/components/Shareable/DatePicker", () => ({
  InputComData: ({ dataTestId, inputOnChange }) => (
    <input
      data-testid={dataTestId}
      defaultValue="14/09/2026"
      onChange={(evento) => inputOnChange(evento.target.value)}
    />
  ),
}));

jest.mock("src/helpers/utilities", () => ({
  ...jest.requireActual("src/helpers/utilities"),
  checaSeDataEstaEntre2e5DiasUteis: jest.fn(),
  escolaEhCEMEI: jest.fn(() => false),
}));

const proximosDoisDiasUteis = new Date(2026, 8, 3);
const proximosCincoDiasUteis = new Date(2026, 8, 8);

const criarPropriedades = () => ({
  name_data_de: "data_de",
  name_data_para: "data_para",
  name_alunos: "alunos_da_cemei",
  proximosDoisDiasUteis,
  proximosCincoDiasUteis,
  setShowModalDataPrioritaria: jest.fn(),
  form: {
    getState: jest.fn(() => ({ values: {} })),
    change: jest.fn(),
  },
  setAdicionarOutroDia: jest.fn(),
});

describe("DatasReferenciaAplicarEm", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("deve interromper a validação quando a data for removida", () => {
    const propriedades = criarPropriedades();
    render(<DatasReferenciaAplicarEm {...propriedades} />);

    const campoData = screen.getByTestId("div-input-data_de");

    fireEvent.change(campoData, {
      target: { value: "15/09/2026" },
    });
    fireEvent.change(campoData, {
      target: { value: "" },
    });

    expect(checaSeDataEstaEntre2e5DiasUteis).toHaveBeenCalledTimes(1);
    expect(propriedades.setShowModalDataPrioritaria).not.toHaveBeenCalled();
  });
});
