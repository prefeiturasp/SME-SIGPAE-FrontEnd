import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import BotaoConferir from "src/components/screens/PreRecebimento/FichaTecnica/components/Analisar/components/BotaoConferir";

describe("Testa o componente BotaoConferir", () => {
  const mockAprovaCollapse = jest.fn();
  const mockName = "sessao-produtos";

  const renderComponent = (mockName, mockAprovaCollapse) => {
    return render(
      <BotaoConferir name={mockName} aprovaCollapse={mockAprovaCollapse} />,
    );
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("deve renderizar o botão com o texto 'Conferido'", () => {
    renderComponent(mockName, mockAprovaCollapse);
    const botao = screen.getByRole("button", { name: /conferido/i });
    expect(botao).toBeInTheDocument();
    expect(botao).toHaveClass("float-end", "ms-3");
  });

  it("deve chamar aprovaCollapse com o nome correto ao ser clicado", () => {
    renderComponent(mockName, mockAprovaCollapse);

    const botao = screen.getByRole("button", { name: /conferido/i });
    fireEvent.click(botao);
    expect(mockAprovaCollapse).toHaveBeenCalledTimes(1);
    expect(mockAprovaCollapse).toHaveBeenCalledWith(mockName);
  });

  it("deve garantir que o container principal tenha a classe CSS correta", () => {
    const { container } = renderComponent(mockName, mockAprovaCollapse);

    const divPrincipal = container.querySelector(".botao-conferir");
    expect(divPrincipal).toBeInTheDocument();

    const divEspacamento = container.querySelector(".mt-4");
    expect(divEspacamento).toBeInTheDocument();
  });
});
