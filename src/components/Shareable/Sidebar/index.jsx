import React, { Component } from "react";
import { Link } from "react-router-dom";
import { SidebarContent } from "./SidebarContent";
import "./style.scss";
import { getAPIVersion } from "../../../services/api.service";
import retornaAvatar from "helpers/retornaAvatar";

export class Sidebar extends Component {
  constructor(props) {
    super(props);
    this.state = {
      toggled: false,
      API_VERSION: ""
    };
  }

  async componentDidMount() {
    try {
      const response = await getAPIVersion();
      this.setState({ API_VERSION: response.API_Version });
    } catch (error) {
      // keep going
    }
  }

  render() {
    const { API_VERSION } = this.state;
    const { nome, nomeEscola, toggle, toggled } = this.props;
    return (
      <div>
        <div className="mb-5" />
        <ul
          className={`navbar-nav bg-gradiente-sme sidebar sidebar-dark accordion pl-2 pt-5
          ${toggled && "toggled"}`}
          id="accordionSidebar"
        >
          <div className="sidebar-divider my-0" />
          {/* Somente para testar o sidebar enquanto ainda não há perfil/permissões */}
          <p onClick={() => toggle()} className="text-right c-pointer">
            <i
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
              {nomeEscola && (
                <div className="sidebar-brand-text text-center text-bold text-white small mt-3">
                  <span>{nomeEscola}</span>
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
              <div className="sidebar-wrapper">
                <div className="text-center mx-auto justify-content-center p-2 conteudo-detalhes">
                  <span className="text-white small">
                    Licença AGPL V3 (API: {API_VERSION})
                  </span>
                </div>
              </div>
            </div>
          )}
        </ul>
      </div>
    );
  }
}
