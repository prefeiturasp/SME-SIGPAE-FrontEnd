import React, { Component } from "react";
import { Link } from "react-router-dom";
import { SidebarCODAE } from "./SidebarCODAE";
import { SidebarDRE } from "./SidebarDRE";
import { SidebarEscola } from "./SidebarEscola";
import { SidebarTerceirizada } from "./SidebarTerceirizada";
import "./style.scss";

export class Sidebar extends Component {
  constructor(props) {
    super(props);
    this.state = {
      toggled: false
    };
  }

  render() {
    const tipo_perfil = localStorage.getItem("tipo_perfil");
    const {
      nome,
      toggle,
      toggled,
      registro_funcional,
      nome_instituicao
    } = this.props;
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
            <div className="sidebar-brand-icon rotate-n-15">
              <img
                alt="Imagem ilustrativa"
                className="img-profile rounded-circle"
                src="https://source.unsplash.com/QAB-WJcbgJk/60x60"
              />
            </div>
          </Link>
          <div className="justify-content-center mx-auto align-items-center sidebar-brand-text mx-3">
            <div className="nav-item">
              {!toggled && nome && nome !== "" && (
                <div className="sidebar-brand-text text-center">
                  <span className="d-none d-lg-inline text-bold text-white small border border-light rounded-pill p-1">
                    {nome}
                  </span>
                </div>
              )}
              <div className="profile">
                <i className="fas fa-user-edit" />
                <span>Perfil</span>
              </div>
            </div>
          </div>
          <div className="sidebar-wrapper">
            <div className="text-center mx-auto justify-content-center p-2">
              <span className="text-bold text-white small">
                RF: {registro_funcional} <br />
                {nome_instituicao}
              </span>
            </div>
          </div>
          <div className="sidebar-wrapper">
            {tipo_perfil === `"codae"` && <SidebarCODAE />}
            {tipo_perfil === `"diretoria_regional"` && <SidebarDRE />}
            {tipo_perfil === `"escola"` && <SidebarEscola />}
            {tipo_perfil === `"terceirizada"` && <SidebarTerceirizada />}
          </div>
          {!toggled && (
            <div className="text-center page-footer mx-auto justify-content-center mt-5 pb-2">
              <img
                src="/assets/image/logo-sme-branco.svg"
                className="rounded"
                alt="SME Educação"
              />
              <p>
                SME-SP-SGA - Distribuído sob <br />a Licença AGPL V3
              </p>
            </div>
          )}
        </ul>
      </div>
    );
  }
}
