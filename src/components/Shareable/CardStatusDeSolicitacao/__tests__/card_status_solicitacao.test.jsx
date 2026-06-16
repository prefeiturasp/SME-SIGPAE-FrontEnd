import React from "react";
import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { PERFIL, TIPO_PERFIL } from "src/constants/shared";
import { localStorageMock } from "src/mocks/localStorageMock";
import CardStatusDeSolicitacao from "../CardStatusDeSolicitacao";

describe("Testes de comportamentos componente - CardStatusDeSolicitacao", () => {
  const defaultProps = {
    cardTitle: "Solicitações Pendentes",
    cardType: "card-pending",
    solicitations: [
      {
        text: "Solicitação 1",
        date: "01/01/2026",
        link: "/solicitacao-1",
      },
    ],
    icon: "fa-clock",
    href: "/ver-mais",
    loading: false,
    hrefCard: "",
    dataTestId: "card-status",
  };

  const setup = (props = {}) => {
    return render(
      <MemoryRouter>
        <CardStatusDeSolicitacao {...defaultProps} {...props} />
      </MemoryRouter>,
    );
  };

  beforeEach(() => {
    Object.defineProperty(global, "localStorage", { value: localStorageMock });
    localStorage.setItem("tipo_perfil", TIPO_PERFIL.DIETA_ESPECIAL);
    localStorage.setItem("perfil", PERFIL.COORDENADOR_DIETA_ESPECIAL);
  });

  it("deve renderizar o card corretamente", () => {
    setup();

    expect(screen.getByTestId("card-status")).toBeInTheDocument();

    expect(screen.getByText("Solicitações Pendentes")).toBeInTheDocument();

    expect(screen.getByText("Data/Hora")).toBeInTheDocument();

    expect(screen.getByText("Solicitação 1")).toBeInTheDocument();

    expect(screen.getByText("01/01/2026")).toBeInTheDocument();
  });

  it("deve renderizar o ícone informado", () => {
    const { container } = setup();

    expect(container.querySelector(".fa-clock")).toBeInTheDocument();
  });

  it("deve renderizar o loader quando loading for true", () => {
    setup({ loading: true });

    expect(screen.getByAltText("ajax-loader")).toBeInTheDocument();
  });

  it("não deve renderizar o loader quando loading for false", () => {
    setup();

    expect(screen.queryByAltText("ajax-loader")).not.toBeInTheDocument();
  });

  it("deve renderizar os links das solicitações", () => {
    setup();

    const link = screen.getByRole("link", {
      name: /Solicitação 1/i,
    });

    expect(link).toHaveAttribute("href", "/solicitacao-1");
  });

  it("deve renderizar no máximo 5 solicitações", () => {
    setup({
      solicitations: [
        { text: "1", date: "01", link: "/1" },
        { text: "2", date: "02", link: "/2" },
        { text: "3", date: "03", link: "/3" },
        { text: "4", date: "04", link: "/4" },
        { text: "5", date: "05", link: "/5" },
        { text: "6", date: "06", link: "/6" },
      ],
    });

    expect(screen.getByText("1")).toBeInTheDocument();
    expect(screen.getByText("2")).toBeInTheDocument();
    expect(screen.getByText("3")).toBeInTheDocument();
    expect(screen.getByText("4")).toBeInTheDocument();
    expect(screen.getByText("5")).toBeInTheDocument();

    expect(screen.queryByText("6")).not.toBeInTheDocument();
  });

  it("deve renderizar o link 'Ver Mais' quando houver mais de 5 solicitações", () => {
    setup({
      solicitations: [
        { text: "1", date: "01", link: "/1" },
        { text: "2", date: "02", link: "/2" },
        { text: "3", date: "03", link: "/3" },
        { text: "4", date: "04", link: "/4" },
        { text: "5", date: "05", link: "/5" },
        { text: "6", date: "06", link: "/6" },
      ],
    });

    const verMais = screen.getByRole("link", {
      name: "Ver Mais",
    });

    expect(verMais).toBeInTheDocument();

    expect(verMais).toHaveAttribute("href", "/ver-mais");
  });

  it("não deve renderizar o link 'Ver Mais' quando houver 5 ou menos solicitações", () => {
    setup();

    expect(
      screen.queryByRole("link", { name: "Ver Mais" }),
    ).not.toBeInTheDocument();
  });
});
