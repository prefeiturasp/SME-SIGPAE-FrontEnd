import React from "react";

const OrientacoesLeitura = (orientacoes_gerais) => {
  return (
    <div className="row">
      <div className="col-md-12">
        <p className="mt-3 label">Orientações Gerais</p>
        <div
          className="orientacoes orientacoes-leitura"
          dangerouslySetInnerHTML={{
            __html: orientacoes_gerais.orientacoes_gerais,
          }}
        />
      </div>
    </div>
  );
};

export default OrientacoesLeitura;
