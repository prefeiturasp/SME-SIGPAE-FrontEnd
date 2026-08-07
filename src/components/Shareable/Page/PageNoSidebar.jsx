import React from "react";
import { useNavigate } from "react-router-dom";

import { Header } from "../Header";
import BotaoVoltar from "./BotaoVoltar";

import "./PageNoSidebar.scss";

const PageNoSidebar = ({
  botaoVoltar = true,
  breadcrumb,
  children,
  titulo,
  voltarPara,
}) => {
  const navegar = useNavigate();

  const voltar = () => {
    voltarPara ? navegar(voltarPara) : navegar(-1);
  };

  return (
    <div id="wrapper">
      <Header toggled={false} />
      <div id="content-wrapper" className="pt-5">
        <main className="page-no-sidebar pagina-sem-barra-lateral mt-5">
          {breadcrumb}

          <div className="page-no-sidebar-header cabecalho-pagina-sem-barra-lateral">
            <h1 className="page-title titulo-pagina">
              <span className="texto-titulo">{titulo}</span>
            </h1>

            {botaoVoltar && <BotaoVoltar onClick={voltar} />}
          </div>

          <section className="page-no-sidebar-card cartao-pagina-sem-barra-lateral">
            {children}
          </section>
        </main>
      </div>
    </div>
  );
};

export default PageNoSidebar;
