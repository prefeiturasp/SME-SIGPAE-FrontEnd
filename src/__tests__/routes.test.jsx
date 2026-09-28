import "@testing-library/jest-dom";
import { render, screen } from "@testing-library/react";
import React from "react";
import { isLoggedIn } from "src/services/auth";

jest.mock("src/services/auth", () => {
  const actual = jest.requireActual("src/services/auth");
  return { ...actual, isLoggedIn: jest.fn() };
});

jest.mock("src/configs/rotas", () => ({
  rotas: [
    {
      path: "/rota-com-perfil",
      component: () => <div>Rota Com Perfil</div>,
      tipoUsuario: "QUALQUER",
    },
    {
      path: "/rota-sem-perfil",
      component: () => <div>Rota Sem Perfil</div>,
    },
  ],
}));

jest.mock("src/pages/SemPermissaoPage", () => () => (
  <div>403 Sem Permissao</div>
));

jest.mock("src/components/Login", () => ({
  Login: () => <div>Login Mock</div>,
}));

import AppRoutes from "src/routes";

describe("AppRoutes", () => {
  it("renderiza a rota quando logado e com tipoUsuario", () => {
    isLoggedIn.mockReturnValue(true);
    window.history.pushState({}, "", "/rota-com-perfil");

    render(<AppRoutes />);

    expect(screen.getByText("Rota Com Perfil")).toBeInTheDocument();
  });

  it("redireciona para /403 quando logado e sem tipoUsuario", () => {
    isLoggedIn.mockReturnValue(true);
    window.history.pushState({}, "", "/rota-sem-perfil");

    render(<AppRoutes />);

    expect(screen.getByText("403 Sem Permissao")).toBeInTheDocument();
  });

  it("redireciona para /login quando não logado", () => {
    isLoggedIn.mockReturnValue(false);
    window.history.pushState({}, "", "/rota-com-perfil");

    render(<AppRoutes />);

    expect(screen.getByText("Login Mock")).toBeInTheDocument();
  });
});
