import "@testing-library/jest-dom";
import { fireEvent, render, screen } from "@testing-library/react";
import { required } from "src/helpers/fieldValidators";
import { OpçoesSimNao } from "../OpçoesSimNao";

const mockField = jest.fn();

jest.mock("react-final-form", () => {
  const React = require("react");

  return {
    Field: (props) => {
      mockField(props);
      const propriedadesCampo = { ...props };
      delete propriedadesCampo.component;
      delete propriedadesCampo.validate;

      return React.createElement(props.component, propriedadesCampo);
    },
  };
});

const UUID_OCORRENCIA = "39623502-eb01-4bb2-b8d5-0ced722f90cd";
const UUID_PARAMETRIZACAO = "88a4368e-3d2b-4592-b379-e2af14323b19";
const UUID_RESPOSTA = "f7b7f8f3-b4c7-4c96-a586-e72307c47f52";
const TITULO = "O equipamento está em boas condições?";
const NOME_CAMPO =
  `grupos_${UUID_OCORRENCIA}[0].tipoocorrencia_${UUID_OCORRENCIA}_` +
  `parametrizacao_${UUID_PARAMETRIZACAO}_uuid_${UUID_RESPOSTA}`;

const criarProps = (sobrescritas = {}) => ({
  titulo: TITULO,
  name: NOME_CAMPO,
  somenteLeitura: false,
  ...sobrescritas,
});

const renderizarOpcoes = (sobrescritas = {}) => {
  const props = criarProps(sobrescritas);
  const resultado = render(<OpçoesSimNao {...props} />);
  return { ...resultado, props };
};

describe("Opções Sim e Não da ocorrência", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renderiza as duas opções obrigatórias com o mesmo nome", () => {
    const { container } = renderizarOpcoes();
    const opcaoSim = screen.getByRole("radio", { name: "Sim" });
    const opcaoNao = screen.getByRole("radio", { name: "Não" });

    expect(screen.getByText(TITULO)).toBeInTheDocument();
    expect(container.querySelector(".required-asterisk")).toHaveTextContent(
      "*",
    );
    expect(opcaoSim).toHaveAttribute("name", NOME_CAMPO);
    expect(opcaoNao).toHaveAttribute("name", NOME_CAMPO);
    expect(opcaoSim).toHaveAttribute("value", "Sim");
    expect(opcaoNao).toHaveAttribute("value", "Não");
    expect(opcaoSim).toBeRequired();
    expect(opcaoNao).toBeRequired();
    expect(opcaoSim).toBeEnabled();
    expect(opcaoNao).toBeEnabled();
  });

  it("configura a validação obrigatória nos dois campos", () => {
    renderizarOpcoes();

    expect(mockField).toHaveBeenCalledTimes(2);
    expect(mockField.mock.calls[0][0]).toEqual(
      expect.objectContaining({
        component: "input",
        id: "sim",
        name: NOME_CAMPO,
        required: true,
        type: "radio",
        validate: required,
        value: "Sim",
      }),
    );
    expect(mockField.mock.calls[0][0].style).toEqual({ paddingRight: 2 });
    expect(mockField.mock.calls[1][0]).toEqual(
      expect.objectContaining({
        component: "input",
        id: "nao",
        name: NOME_CAMPO,
        required: true,
        type: "radio",
        validate: required,
        value: "Não",
      }),
    );
  });

  it("permite selecionar somente uma opção por vez", () => {
    renderizarOpcoes();
    const opcaoSim = screen.getByRole("radio", { name: "Sim" });
    const opcaoNao = screen.getByRole("radio", { name: "Não" });

    fireEvent.click(opcaoSim);

    expect(opcaoSim).toBeChecked();
    expect(opcaoNao).not.toBeChecked();

    fireEvent.click(opcaoNao);

    expect(opcaoNao).toBeChecked();
    expect(opcaoSim).not.toBeChecked();
  });

  it("desabilita as duas opções no modo somente leitura", () => {
    renderizarOpcoes({ somenteLeitura: true });

    expect(screen.getByRole("radio", { name: "Sim" })).toBeDisabled();
    expect(screen.getByRole("radio", { name: "Não" })).toBeDisabled();
    expect(mockField.mock.calls[0][0]).toEqual(
      expect.objectContaining({ disabled: true }),
    );
    expect(mockField.mock.calls[1][0]).toEqual(
      expect.objectContaining({ disabled: true }),
    );
  });
});
