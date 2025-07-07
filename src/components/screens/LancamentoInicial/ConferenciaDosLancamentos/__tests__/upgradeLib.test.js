import { format } from "date-fns";
import { ptBR } from "date-fns/locale/pt-BR";

describe("date-fns upgrade", () => {
  it("deve formatar a data corretamente com locale ptBR", () => {
    const data = new Date(2024, 5, 1);
    const mesFormatado = format(data, "LLLL", { locale: ptBR });

    expect(mesFormatado).toMatch(/junho/i);
  });
});
