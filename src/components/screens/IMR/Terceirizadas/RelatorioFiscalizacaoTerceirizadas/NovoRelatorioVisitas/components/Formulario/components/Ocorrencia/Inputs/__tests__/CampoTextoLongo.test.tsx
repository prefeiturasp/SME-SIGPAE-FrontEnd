import "@testing-library/jest-dom";
import { render, screen } from "@testing-library/react";
import { required } from "src/helpers/fieldValidators";
import { CampoTextoLongo } from "../CampoTextoLongo";

const mockTextArea = jest.fn();

jest.mock("react-final-form", () => {
  const React = require("react");

  return {
    Field: ({ component, ...props }) => React.createElement(component, props),
  };
});

jest.mock("src/components/Shareable/TextArea/TextArea", () => {
  const React = require("react");

  return {
    TextArea: (props) => {
      mockTextArea(props);

      return React.createElement("textarea", {
        "aria-label": props.label,
        disabled: props.disabled,
        name: props.name,
        required: props.required,
        style: { height: `${props.height}px` },
      });
    },
  };
});

const UUID_OCORRENCIA = "39623502-eb01-4bb2-b8d5-0ced722f90cd";
const UUID_PARAMETRIZACAO = "88a4368e-3d2b-4592-b379-e2af14323b19";
const UUID_RESPOSTA = "f7b7f8f3-b4c7-4c96-a586-e72307c47f52";
const TITULO = "Descrição detalhada da ocorrência";
const NOME_CAMPO =
  `grupos_${UUID_OCORRENCIA}[0].tipoocorrencia_${UUID_OCORRENCIA}_` +
  `parametrizacao_${UUID_PARAMETRIZACAO}_uuid_${UUID_RESPOSTA}`;

const criarProps = (sobrescritas = {}) => ({
  titulo: TITULO,
  name: NOME_CAMPO,
  somenteLeitura: false,
  ...sobrescritas,
});

const renderizarCampo = (sobrescritas = {}) => {
  const props = criarProps(sobrescritas);
  render(<CampoTextoLongo {...props} />);
  return props;
};

describe("Campo de texto longo da ocorrência", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renderiza uma área de texto obrigatória com a altura configurada", () => {
    renderizarCampo();

    const campo = screen.getByRole("textbox", { name: TITULO });
    const propriedades = mockTextArea.mock.calls[0][0];

    expect(campo).toBeEnabled();
    expect(campo).toBeRequired();
    expect(campo).toHaveStyle({ height: "100px" });
    expect(campo).toHaveAttribute("name", NOME_CAMPO);
    expect(propriedades).toEqual(
      expect.objectContaining({
        disabled: false,
        height: "100",
        label: TITULO,
        name: NOME_CAMPO,
        required: true,
        validate: required,
      }),
    );
  });

  it("utiliza a validação de preenchimento obrigatório", () => {
    renderizarCampo();

    const validar = mockTextArea.mock.calls[0][0].validate;

    expect(validar("")).toBe("Campo obrigatório");
    expect(validar(null)).toBe("Campo obrigatório");
    expect(validar("Descrição detalhada preenchida")).toBeUndefined();
  });

  it("desabilita a área de texto no modo somente leitura", () => {
    renderizarCampo({ somenteLeitura: true });

    expect(screen.getByRole("textbox", { name: TITULO })).toBeDisabled();
    expect(mockTextArea.mock.calls[0][0]).toEqual(
      expect.objectContaining({ disabled: true }),
    );
  });
});
