import { formataEditalContratoParaForm } from "../Cadastro/helper";
import "@testing-library/jest-dom";

jest.mock("src/helpers/utilities", () => ({
  deepCopy: jest.fn((value: unknown) => JSON.parse(JSON.stringify(value))),
}));

const editalContratoMock = {
  eh_imr: true,
  contratos: [
    {
      terceirizada: {
        uuid: "8c8c9c4d-6406-4d88-8d6d-7c6c6ef905a1",
      },
      diretorias_regionais: [
        {
          uuid: "cfd2c975-d8a0-43e5-a513-80ee19c1ef93",
        },
        {
          uuid: "c793ee68-d59a-4ef6-a384-df2c89503f49",
        },
      ],
      lotes: [
        {
          uuid: "7c95f2e8-bf0e-46ff-9f4f-95360e4862f3",
        },
        {
          uuid: "31e0e056-06c8-4126-a3e6-3bf1ffde7f3a",
        },
      ],
    },
  ],
};

describe("formataEditalContratoParaForm", () => {
  it("formata terceirizada, diretorias regionais e lotes para uuid", () => {
    const setSwitchAtivoImrl = jest.fn();

    const result = formataEditalContratoParaForm(
      editalContratoMock as any,
      setSwitchAtivoImrl,
    );

    expect(result.contratos[0].terceirizada).toBe(
      "8c8c9c4d-6406-4d88-8d6d-7c6c6ef905a1",
    );

    expect(result.contratos[0].diretorias_regionais).toEqual([
      "cfd2c975-d8a0-43e5-a513-80ee19c1ef93",
      "c793ee68-d59a-4ef6-a384-df2c89503f49",
    ]);

    expect(result.contratos[0].lotes).toEqual([
      "7c95f2e8-bf0e-46ff-9f4f-95360e4862f3",
      "31e0e056-06c8-4126-a3e6-3bf1ffde7f3a",
    ]);
  });
});
