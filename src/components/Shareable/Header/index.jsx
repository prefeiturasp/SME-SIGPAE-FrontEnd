import HTTP_STATUS from "http-status-codes";
import { useContext, useEffect, useState } from "react";
import { slide as Menu } from "react-burger-menu";
import { Link } from "react-router-dom";
import { SidebarContent } from "src/components/Shareable/Sidebar/SidebarContent";
import { CENTRAL_DOWNLOADS } from "src/configs/constants";
import { ENVIRONMENT } from "src/constants/config";
import { TemaContext, temas } from "src/context/TemaContext";
import {
  usuarioEhEscolaAbastecimento,
  usuarioEhEscolaAbastecimentoDiretor,
} from "src/helpers/utilities";
import { getAPIVersion } from "src/services/api.service";
import authService from "../../../services/auth";
import DownloadsNavbar from "../DownloadsNavbar";
import NotificacoesNavbar from "../NotificacoesNavbar";
import "./style.scss";

export const Header = ({ toggled }) => {
  const temaContext = useContext(TemaContext);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 992);
  const [apiVersion, setApiVersion] = useState("");

  const getAPIVersionAsync = async () => {
    const response = await getAPIVersion();
    if (response.status === HTTP_STATUS.OK) {
      setApiVersion(response.data.API_Version);
    }
  };

  useEffect(() => {
    getAPIVersionAsync();
  }, [apiVersion]);

  useEffect(() => {
    const onResize = () => setIsMobile(window.innerWidth < 992);
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  const sidebarContent = <SidebarContent />;

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
          {isMobile && (
            <Menu right>
              <div className="sidebar-wrapper div-submenu">
                {sidebarContent}
              </div>
              <div className="text-center page-footer mx-auto justify-content-center mb-1 pb-2">
                <img
                  src="/assets/image/logo-sme-branco.svg"
                  className="rounded logo-sme"
                  alt="SME Educação"
                />
                {apiVersion && (
                  <div className="sidebar-wrapper">
                    <div className="text-center mx-auto justify-content-center p-2 conteudo-detalhes">
                      <span className="text-white small">
                        Licença AGPL V3 (API: {apiVersion})
                      </span>
                    </div>
                  </div>
                )}
              </div>
            </Menu>
          )}
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
