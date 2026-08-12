import "@testing-library/jest-dom";
import { render, screen } from "@testing-library/react";
import React from "react";
import InputText from "../index";

const getInputByName = (name) => screen.getByTestId(name);

describe("InputValueMedicao - validação Preenchimento obrigatório.", () => {
  it("aplica classe invalid-field quando meta.error é 'Preenchimento obrigatório.'", () => {
    render(
      <InputText
        className="teste"
        name="frequencia__dia_01__categoria_1"
        input={{ name: "frequencia__dia_01__categoria_1" }}
        meta={{ error: "Preenchimento obrigatório." }}
      />,
    );
    expect(getInputByName("frequencia__dia_01__categoria_1")).toHaveClass(
      "invalid-field",
    );
  });

  it("aplica classe invalid-field quando meta.error é 'Preenchimento obrigatório.' em campo de frequencia", () => {
    render(
      <InputText
        className="teste"
        name="frequencia__dia_15__categoria_2"
        input={{ name: "frequencia__dia_15__categoria_2" }}
        meta={{ error: "Preenchimento obrigatório." }}
      />,
    );
    expect(getInputByName("frequencia__dia_15__categoria_2")).toHaveClass(
      "invalid-field",
    );
  });

  it("aplica classe invalid-field para campo de refeicao com erro Preenchimento obrigatório.", () => {
    render(
      <InputText
        className="teste"
        name="refeicao__dia_01__categoria_1"
        input={{ name: "refeicao__dia_01__categoria_1" }}
        meta={{ error: "Preenchimento obrigatório." }}
      />,
    );
    expect(getInputByName("refeicao__dia_01__categoria_1")).toHaveClass(
      "invalid-field",
    );
  });

  it("NÃO aplica classe invalid-field quando meta.error é diferente de 'Preenchimento obrigatório.' e campo não é frequencia/lanche/refeicao/sobremesa", () => {
    render(
      <InputText
        className="teste"
        name="dietas_autorizadas__dia_01__categoria_1"
        input={{ name: "dietas_autorizadas__dia_01__categoria_1" }}
        meta={{ error: "Outro erro qualquer" }}
      />,
    );
    expect(
      getInputByName("dietas_autorizadas__dia_01__categoria_1"),
    ).not.toHaveClass("invalid-field");
  });

  it("NÃO aplica classe invalid-field quando não há meta.error", () => {
    render(
      <InputText
        className="teste"
        name="dietas_autorizadas__dia_01__categoria_1"
        input={{ name: "dietas_autorizadas__dia_01__categoria_1" }}
        meta={{}}
      />,
    );
    expect(
      getInputByName("dietas_autorizadas__dia_01__categoria_1"),
    ).not.toHaveClass("invalid-field");
  });

  it("aplica classe invalid-field para campo dietas_autorizadas com erro Preenchimento obrigatório.", () => {
    render(
      <InputText
        className="teste"
        name="dietas_autorizadas__dia_01__categoria_1"
        input={{ name: "dietas_autorizadas__dia_01__categoria_1" }}
        meta={{ error: "Preenchimento obrigatório." }}
      />,
    );
    expect(
      getInputByName("dietas_autorizadas__dia_01__categoria_1"),
    ).toHaveClass("invalid-field");
  });

  it("aplica classe invalid-field para campo de lanche com erro Preenchimento obrigatório.", () => {
    render(
      <InputText
        className="teste"
        name="lanche__dia_10__categoria_1"
        input={{ name: "lanche__dia_10__categoria_1" }}
        meta={{ error: "Preenchimento obrigatório." }}
      />,
    );
    expect(getInputByName("lanche__dia_10__categoria_1")).toHaveClass(
      "invalid-field",
    );
  });

  it("aplica classe invalid-field para campo de sobremesa com erro Preenchimento obrigatório.", () => {
    render(
      <InputText
        className="teste"
        name="sobremesa__dia_01__categoria_1"
        input={{ name: "sobremesa__dia_01__categoria_1" }}
        meta={{ error: "Preenchimento obrigatório." }}
      />,
    );
    expect(getInputByName("sobremesa__dia_01__categoria_1")).toHaveClass(
      "invalid-field",
    );
  });

  it("aplica classe invalid-field para campo de repeticao com erro Preenchimento obrigatório.", () => {
    render(
      <InputText
        className="teste"
        name="repeticao_refeicao__dia_01__categoria_1"
        input={{ name: "repeticao_refeicao__dia_01__categoria_1" }}
        meta={{ error: "Preenchimento obrigatório." }}
      />,
    );
    expect(
      getInputByName("repeticao_refeicao__dia_01__categoria_1"),
    ).toHaveClass("invalid-field");
  });

  it("aplica classe invalid-field para campo kit_lanche com erro Preenchimento obrigatório.", () => {
    render(
      <InputText
        className="teste"
        name="kit_lanche__dia_01__categoria_1"
        input={{ name: "kit_lanche__dia_01__categoria_1" }}
        meta={{ error: "Preenchimento obrigatório." }}
      />,
    );
    expect(getInputByName("kit_lanche__dia_01__categoria_1")).toHaveClass(
      "invalid-field",
    );
  });

  it("aplica classe invalid-field para campo lanche_emergencial com erro Preenchimento obrigatório.", () => {
    render(
      <InputText
        className="teste"
        name="lanche_emergencial__dia_01__categoria_1"
        input={{ name: "lanche_emergencial__dia_01__categoria_1" }}
        meta={{ error: "Preenchimento obrigatório." }}
      />,
    );
    expect(
      getInputByName("lanche_emergencial__dia_01__categoria_1"),
    ).toHaveClass("invalid-field");
  });

  it("meta.error Preenchimento obrigatório. mostra icone de erro para campo de frequencia", () => {
    render(
      <InputText
        className="teste"
        name="frequencia__dia_01__categoria_1"
        input={{ name: "frequencia__dia_01__categoria_1" }}
        meta={{ error: "Preenchimento obrigatório." }}
      />,
    );
    const iconElement = document.querySelector(".fa-info.icone-info-error");
    expect(iconElement).toBeInTheDocument();
  });
});

describe("InputValueMedicao - Sobremesa AF DreCodae", () => {
  it("exibe tooltip verde quando exibeTooltipSobremesaAFDreCodae true e valor indefinido", () => {
    render(
      <InputText
        className="teste"
        name="sobremesa__dia_05__categoria_1"
        input={{ name: "sobremesa__dia_05__categoria_1", value: undefined }}
        meta={{}}
        exibeTooltipSobremesaAFDreCodae={true}
      />,
    );
    const iconElement = document.querySelector(".fa-info.icone-info-success");
    expect(iconElement).toBeInTheDocument();
  });

  it("exibe tooltip verde quando exibeTooltipSobremesaAFDreCodae true e valor é 0", () => {
    render(
      <InputText
        className="teste"
        name="sobremesa__dia_05__categoria_1"
        input={{ name: "sobremesa__dia_05__categoria_1", value: "0" }}
        meta={{}}
        exibeTooltipSobremesaAFDreCodae={true}
      />,
    );
    const iconElement = document.querySelector(".fa-info.icone-info-success");
    expect(iconElement).toBeInTheDocument();
  });

  it("exibe tooltip laranja quando exibeTooltipSobremesaAFDreCodae true e valor > 0", () => {
    render(
      <InputText
        className="teste"
        name="sobremesa__dia_05__categoria_1"
        input={{ name: "sobremesa__dia_05__categoria_1", value: "5" }}
        meta={{}}
        exibeTooltipSobremesaAFDreCodae={true}
      />,
    );
    const iconElement = document.querySelector(".fa-info.icone-info-warning");
    expect(iconElement).toBeInTheDocument();
  });

  it("exibe tooltip verde para repeticao_sobremesa quando valor é 0", () => {
    render(
      <InputText
        className="teste"
        name="repeticao_sobremesa__dia_05__categoria_1"
        input={{
          name: "repeticao_sobremesa__dia_05__categoria_1",
          value: "0",
        }}
        meta={{}}
        exibeTooltipSobremesaAFDreCodae={true}
      />,
    );
    const iconElement = document.querySelector(".fa-info.icone-info-success");
    expect(iconElement).toBeInTheDocument();
  });

  it("exibe tooltip laranja para repeticao_sobremesa quando valor > 0", () => {
    render(
      <InputText
        className="teste"
        name="repeticao_sobremesa__dia_05__categoria_1"
        input={{
          name: "repeticao_sobremesa__dia_05__categoria_1",
          value: "3",
        }}
        meta={{}}
        exibeTooltipSobremesaAFDreCodae={true}
      />,
    );
    const iconElement = document.querySelector(".fa-info.icone-info-warning");
    expect(iconElement).toBeInTheDocument();
  });

  it("nao exibe tooltip quando exibeTooltipSobremesaAFDreCodae é false", () => {
    render(
      <InputText
        className="teste"
        name="sobremesa__dia_05__categoria_1"
        input={{ name: "sobremesa__dia_05__categoria_1", value: "0" }}
        meta={{}}
        exibeTooltipSobremesaAFDreCodae={false}
      />,
    );
    const iconSuccess = document.querySelector(".fa-info.icone-info-success");
    const iconWarning = document.querySelector(".fa-info.icone-info-warning");
    expect(iconSuccess).not.toBeInTheDocument();
    expect(iconWarning).not.toBeInTheDocument();
  });
});
