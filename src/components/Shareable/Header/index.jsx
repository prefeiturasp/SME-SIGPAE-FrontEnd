import React, { useContext } from "react";
import { Link } from "react-router-dom";
import authService from "../../../services/auth";
import "./style.scss";
import { ENVIRONMENT } from "constants/config";
import NotificacoesNavbar from "../NotificacoesNavbar";
import DownloadsNavbar from "../DownloadsNavbar";
import { CENTRAL_DOWNLOADS } from "configs/constants";
import { usuarioEhEscolaAbastecimento } from "helpers/utilities";
import { temas, TemaContext } from "context/TemaContext";

export const Header = ({ toggled }) => {
  const temaContext = useContext(TemaContext);

  const getTema = () => (temaContext.tema === temas.dark ? "dark" : "light");

  const retornaMarcaDagua = ambiente => {
    let path = `/assets/image/marca-${ambiente}-${getTema()}.png`;
    return <img className="marca-d-agua" src={path} alt="" />;
  };

  return (
    <div>
      <nav className="navbar navbar-expand-lg navbar-light bg-white static-top navbar-sme fixed-top">
        <div className="container-fluid">
          <div
            className={`nav-bar ${toggled && "toggled"} ${
              ENVIRONMENT !== "production" ? "p-0" : ""
            }`}
          >
            <Link className="navbar-brand" to="/">
              <img src={`/assets/image/logo-sigpae-${getTema()}.png`} alt="" />
            </Link>
            {ENVIRONMENT === "development" && retornaMarcaDagua("dev")}
            {ENVIRONMENT === "homolog" && retornaMarcaDagua("hom")}
            {ENVIRONMENT === "treinamento" && retornaMarcaDagua("tre")}
          </div>
          <button
            className="navbar-toggler"
            type="button"
            data-toggle="collapse"
            data-target="#navbarResponsive"
            aria-controls="navbarResponsive"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon" />
          </button>

          <div className="collapse navbar-collapse" id="navbarResponsive">
            <ul className="navbar-nav ml-auto">
              <li className="nav-item">
                <Link
                  to={{
                    pathname: `/ajuda`,
                    state: {
                      prevPath: window.location.pathname
                    }
                  }}
                  className="nav-link"
                >
                  <img src="/assets/image/ajuda.svg" alt="Ícone de ajuda" />
                </Link>
                <p className="title">Ajuda</p>
              </li>
              {!usuarioEhEscolaAbastecimento() && (
                <li className="nav-item">
                  <Link
                    to={{
                      pathname: `/${CENTRAL_DOWNLOADS}`
                    }}
                  >
                    <DownloadsNavbar />
                  </Link>
                </li>
              )}
              <li className="nav-item">
                <NotificacoesNavbar />
              </li>
              <li onClick={() => authService.logout()} className="nav-item">
                <div className="nav-link">
                  <div className="icone-verde-fundo">
                    <i className="fas fa-power-off icone-verde" />
                  </div>
                </div>
                <p className="title">Sair</p>
              </li>
            </ul>
          </div>
        </div>
      </nav>
    </div>
  );
};
