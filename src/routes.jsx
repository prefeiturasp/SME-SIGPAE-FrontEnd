import React from "react";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { Login } from "./components/LoginNovo";
import { rotas } from "./configs/rotas";
import ConfirmarEmailPage from "./pages/ConfirmarEmailPage";
import NotFoundPage from "./pages/NotFoundPage";
import RecuperarSenhaPage from "./pages/RecuperarSenhaPage";
import SemPermissaoPage from "./pages/SemPermissaoPage";
import authService from "./services/auth";

const PrivateRoute = ({ component: Component, tipoUsuario: tipoUsuario }) => {
  return authService.isLoggedIn() ? (
    tipoUsuario ? (
      <Component />
    ) : (
      <Navigate to={{ pathname: "/403" }} />
    )
  ) : (
    <Navigate to={{ pathname: "/login" }} />
  );
};

const AppRoutes = () => (
  <BrowserRouter>
    <Routes>
      <Route path="/login" element={<Login />} />
      {rotas.map((value, key) => {
        return (
          <Route
            key={key}
            path={value.path}
            element={
              <PrivateRoute
                component={value.component}
                tipoUsuario={value.tipoUsuario}
              />
            }
          />
        );
      })}
      <Route path="/confirmar-email" element={<ConfirmarEmailPage />} />
      <Route path="/recuperar-senha" element={<RecuperarSenhaPage />} />
      <Route path="/403" element={<SemPermissaoPage />} />
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  </BrowserRouter>
);

export default AppRoutes;
