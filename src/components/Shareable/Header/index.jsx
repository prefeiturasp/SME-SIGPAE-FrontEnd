import { useContext } from "react";
import { slide as Menu } from "react-burger-menu";
import { Link } from "react-router-dom";
import { CENTRAL_DOWNLOADS } from "src/configs/constants";
import { ENVIRONMENT } from "src/constants/config";
import { TemaContext, temas } from "src/context/TemaContext";
import {
  usuarioEhEscolaAbastecimento,
  usuarioEhEscolaAbastecimentoDiretor,
} from "src/helpers/utilities";
import authService from "../../../services/auth";
import DownloadsNavbar from "../DownloadsNavbar";
import NotificacoesNavbar from "../NotificacoesNavbar";
import "./style.scss";

export const Header = ({ toggled }) => {
  const temaContext = useContext(TemaContext);

  const getTema = () => (temaContext.tema === temas.dark ? "dark" : "light");

  const retornaMarcaDagua = (ambiente) => {
    let path = `/assets/image/marca-${ambiente}-${getTema()}.png`;
    return <img className="marca-d-agua" src={path} alt="" />;
  };

  return (
    <div>
      <nav className="navbar navbar-expand-lg navbar-light bg-white static-top navbar-sme fixed-top">
        <div className="container-fluid">
          <div
            className={`nav-bar ${toggled && "toggled"} ${
              !ENVIRONMENT.includes("production") ? "p-0" : ""
            }`}
          >
            <Link className="navbar-brand" to="/">
              <img src={`/assets/image/logo-sigpae-${getTema()}.png`} alt="" />
            </Link>
            {ENVIRONMENT === "development" && retornaMarcaDagua("dev")}
            {ENVIRONMENT === "homolog" && retornaMarcaDagua("hom")}
            {ENVIRONMENT === "treinamento" && retornaMarcaDagua("tre")}
          </div>
          <Menu right>
            <a id="home" className="menu-item" href="/">
              Home
            </a>
            <a id="about" className="menu-item" href="/about">
              About
            </a>
            <a id="contact" className="menu-item" href="/contact">
              Contact
            </a>
          </Menu>

          <div className="collapse navbar-collapse" id="navbarResponsive">
            <ul className="navbar-nav ms-auto">
              <li className="nav-item">
                <Link
                  to="/ajuda"
                  state={{
                    prevPath: window.location.pathname,
                  }}
                  className="nav-link"
                >
                  <img src="/assets/image/ajuda.svg" alt="Ícone de ajuda" />
                </Link>
                <p className="title">Ajuda</p>
              </li>
              {!usuarioEhEscolaAbastecimento() &&
                !usuarioEhEscolaAbastecimentoDiretor() && (
                  <li className="nav-item">
                    <Link to={`/${CENTRAL_DOWNLOADS}`}>
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
