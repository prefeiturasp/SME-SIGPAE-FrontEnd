import { render, screen } from "@testing-library/react";
import LabelResultadoDaBusca from "../index";

describe("Teste de componente após remoção de biblioteca 'ramda'.", () => {
  it("deve renderizar o componente de label resultado busca", () => {
    render(
      <LabelResultadoDaBusca
        filtros={{
          nome_produto: "teste",
          marca: "outro",
        }}
      />
    );
    expect(screen.getByText(/veja os resultados para/i)).toBeInTheDocument();
  });
});
