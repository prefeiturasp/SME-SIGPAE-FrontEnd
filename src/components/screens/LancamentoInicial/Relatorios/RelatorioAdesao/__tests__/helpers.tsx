import { getMesAno } from "../components/FormFiltro/helpers";

describe("getMesAno", () => {
  it('deve lançar um erro se "values_mes" não for informado', () => {
    expect(() => {
      getMesAno();
    }).toThrow("Parâmetro 'values_mes' é obrigatório.");
  });

  it("deve retornar o mês e ano corretamente se informado corretamente", () => {
    expect(getMesAno("05_2025")).toEqual({ mes: 5, ano: 2025 });
  });
});
