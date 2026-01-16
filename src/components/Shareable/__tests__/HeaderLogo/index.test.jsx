import React from "react";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import { HeaderLogo } from "src/components/Shareable/HeaderLogo";

jest.mock("src/components/Shareable/HeaderLogo/style.scss", () => ({}));

describe("Teste do componente HeaderLogo", () => {
  it("deve renderizar o componente corretamente", () => {
    const { container } = render(<HeaderLogo />);
    const logoContainer = container.querySelector(".header-logo");
    expect(logoContainer).toBeInTheDocument();
    const image = logoContainer.querySelector("img");
    expect(image).toBeInTheDocument();
  });

  it("deve renderizar uma imagem com o src correto", () => {
    const { container } = render(<HeaderLogo />);

    const image = container.querySelector("img");
    expect(image).toBeInTheDocument();
    expect(image).toHaveAttribute(
      "src",
      "/assets/image/logo-sigpae-com-texto.png",
    );
  });

  it("deve ter um atributo alt vazio para acessibilidade", () => {
    const { container } = render(<HeaderLogo />);

    const image = container.querySelector("img");
    expect(image).toHaveAttribute("alt", "");
  });
  it("deve ter a estrutura HTML correta", () => {
    const { container } = render(<HeaderLogo />);
    const div = container.querySelector(".header-logo");
    expect(div).toBeInTheDocument();

    const img = div.querySelector("img");
    expect(img).toBeInTheDocument();
    expect(div.children).toHaveLength(1);
    expect(div.children[0].tagName).toBe("IMG");
  });

  it("deve usar querySelector para encontrar a imagem quando alt estiver vazio", () => {
    render(<HeaderLogo />);
    const image = screen.getByAltText("");
    expect(image).toBeInTheDocument();
    expect(image).toHaveAttribute(
      "src",
      "/assets/image/logo-sigpae-com-texto.png",
    );
  });
});
