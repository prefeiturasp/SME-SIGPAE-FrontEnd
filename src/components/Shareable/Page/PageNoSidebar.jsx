import React from "react";
import { useNavigate } from "react-router-dom";

import { Header } from "../Header";
import BotaoVoltar from "./BotaoVoltar";

import "./style.scss";

const PageNoSidebar = ({
  botaoVoltar = true,
  breadcrumb,
  children,
  titulo,
  voltarPara,
}) => {
  const navigate = useNavigate();

  const handleBack = () => {
    voltarPara ? navigate(voltarPara) : navigate(-1);
  };

  return (
    <div id="wrapper">
      <Header toggled={false} />
      <div id="content-wrapper" className="pt-5">
        <main className="page-no-sidebar mt-5">
          {breadcrumb}

          <div className="page-no-sidebar-header">
            <h1 className="page-title">
              <span className="texto-titulo">{titulo}</span>
            </h1>

            {botaoVoltar && <BotaoVoltar onClick={handleBack} />}
          </div>

          <section className="page-no-sidebar-card">{children}</section>
        </main>
      </div>
    </div>
  );
};

export default PageNoSidebar;
