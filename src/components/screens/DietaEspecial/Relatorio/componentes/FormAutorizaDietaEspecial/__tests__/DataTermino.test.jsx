import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { Form } from "react-final-form";
import DataTermino from "src/components/screens/DietaEspecial/Relatorio/componentes/FormAutorizaDietaEspecial/componentes/DataTermino";
import { TIPO_SOLICITACAO_DIETA } from "src/constants/shared";

const setup = (tipoSolicitacao, temData = true) => {
  return render(
    <Form
      onSubmit={jest.fn()}
      render={() => (
        <form>
          <DataTermino
            dietaEspecial={{
              tipo_solicitacao: tipoSolicitacao,
              dieta_para_recreio_ferias: false,
            }}
            temData={temData}
          />
        </form>
      )}
    />,
  );
};

describe("Testa o componente DataTermino", () => {
  it("renderiza InputComData para aluno não matriculado", () => {
    setup(TIPO_SOLICITACAO_DIETA.ALUNO_NAO_MATRICULADO);

    const wrapper = screen.getByText("Data de Término").closest("div");
    const input = wrapper.querySelector("input");

    fireEvent.change(input, { target: { value: "24/12/2025" } });
  });

  it("renderiza DataOpcional com radio selecionado e preenche input", () => {
    setup(TIPO_SOLICITACAO_DIETA.COMUM, true);

    const radioComData = screen.getByRole("radio", {
      name: /com data de término/i,
    });
    const radioSemData = screen.getByRole("radio", {
      name: /sem data de término/i,
    });

    expect(radioComData).toBeChecked();
    expect(radioSemData).not.toBeChecked();

    const textInput = screen.getByRole("textbox");
    fireEvent.change(textInput, { target: { value: "25/12/2025" } });
    expect(textInput).toHaveValue("25/12/2025");
  });

  it("não renderiza input se radio 'sem data de término' estiver selecionado", () => {
    setup(TIPO_SOLICITACAO_DIETA.COMUM, false);

    const radioSemData = screen.getByRole("radio", {
      name: /sem data de término/i,
    });
    expect(radioSemData).toBeChecked();

    const textInput = screen.queryByRole("textbox");
    expect(textInput).toBeDisabled();
  });
});
