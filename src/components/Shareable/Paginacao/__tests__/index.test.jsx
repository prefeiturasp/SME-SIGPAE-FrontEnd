import React from "react";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";

import { Paginacao } from "src/components/Shareable/Paginacao";

describe("Paginacao", () => {
  it("deve renderizar os textos do quick jumper em portugues", () => {
    render(
      <Paginacao
        current={1}
        total={100}
        onChange={jest.fn()}
        showQuickJumper
      />,
    );

    const inputPagina = screen.getByRole("textbox", { name: "Página" });
    const quickJumper = inputPagina.closest(
      ".ant-pagination-options-quick-jumper",
    );

    expect(inputPagina).toBeInTheDocument();
    expect(quickJumper).toHaveTextContent("Vá até");
    expect(quickJumper).toHaveTextContent("Página");
  });
});
