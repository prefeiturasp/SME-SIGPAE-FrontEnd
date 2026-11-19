import React, { useEffect, useContext } from "react";
import "./style.scss";
import { CentralDeDownloadContext } from "../../../context/CentralDeDownloads";

export default () => {
  const centralDownloadContext = useContext(CentralDeDownloadContext);

  const qtdeCentralDeDownloadNaoLidas = () => {
    centralDownloadContext.getQtdeDownloadsNaoLidas();
  };

  useEffect(() => {
    qtdeCentralDeDownloadNaoLidas();
  }, []);

  return (
    <div className="navbar-notificacoes">
      <div className="nav-link text-center">
        <div className="icone-verde-fundo">
          <i className="fas fa-file-download icone-verde" />
          {centralDownloadContext.qtdeDownloadsNaoLidas > 0 && (
            <span className="span-notificacoes-menor-que-10">
              {centralDownloadContext.qtdeDownloadsNaoLidas}
            </span>
          )}
        </div>
      </div>
      <p className="title">Downloads</p>
    </div>
  );
};
