import HTTP_STATUS from "http-status-codes";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import retornaAvatar from "src/helpers/retornaAvatar";
import { getAPIVersion } from "src/services/api.service";
import { labelSidebar } from "./helpers";
import { SidebarContent } from "./SidebarContent";
import "./style.scss";

export const Sidebar = ({ ...props }) => {
  const [apiVersion, setApiVersion] = useState("");

  const { nome, nomeEscolaOuTerceirizada, toggle, toggled } = props;

  const getAPIVersionAsync = async () => {
    const response = await getAPIVersion();
    if (response.status === HTTP_STATUS.OK) {
      setApiVersion(response.data.API_Version);
    }
  };

  useEffect(() => {
    getAPIVersionAsync();
  }, [apiVersion]);

  return (
    <div className="d-none d-sm-none d-md-none d-lg-block">
      <div className="mb-5" />
      <ul
        className={`navbar-nav bg-gradiente-sme sidebar sidebar-dark accordion ps-2 pt-5
        ${toggled && "toggled"}`}
        id="accordionSidebar"
      >
        <div className="sidebar-divider my-0" />
        <p
          onClick={() => toggle()}
          className="text-end c-pointer"
          data-testid="sidebar-divider-p"
        >
          <i
            data-testid="icon-chevron-circle"
            className={
              toggled
                ? `fas fa-chevron-circle-right`
                : `fas fa-chevron-circle-left`
            }
          />
        </p>
        <Link
          className="sidebar-brand d-flex align-items-center justify-content-center"
          to="/"
        >
          <div className="sidebar-brand-icon mb-3">{retornaAvatar()}</div>
        </Link>
        <div className="justify-content-center mx-auto align-items-center sidebar-brand-text mx-3 pt-2">
          <div className="nav-item">
            {!toggled && nome && nome !== "" && (
              <div className="sidebar-brand-text text-center text-bold text-white small border border-light rounded-pill p-1 mx-3">
                <span className="d-none d-lg-inline">{nome}</span>
              </div>
            )}
            {labelSidebar(nomeEscolaOuTerceirizada) && (
              <div className="sidebar-brand-text text-center text-bold text-white small mt-3">
                <span>{labelSidebar(nomeEscolaOuTerceirizada)}</span>
              </div>
            )}
            <div className="profile mt-3">
              <i className="fas fa-user-edit" />
              <Link to="/perfil">
                <span>Perfil</span>
              </Link>
            </div>
          </div>
        </div>
        <div className="sidebar-wrapper div-submenu">
          <SidebarContent />
        </div>
        {!toggled && (
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
        )}
      </ul>
    </div>
  );
};
