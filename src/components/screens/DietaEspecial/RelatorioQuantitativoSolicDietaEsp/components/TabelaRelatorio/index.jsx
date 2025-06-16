import React, { Fragment } from "react";

import { TIPO_PERFIL } from "src/constants/shared";

import "./styles.scss";

export default ({ dadosRelatorio, filtros }) => {
  if (dadosRelatorio.length === 0) return false;
  const primeiroRegistro = dadosRelatorio[0];
  const tipoUsuario = localStorage.getItem("tipo_perfil");
  const perfilGrid =
    tipoUsuario === TIPO_PERFIL.ESCOLA
      ? "escola"
      : tipoUsuario === TIPO_PERFIL.DIRETORIA_REGIONAL
      ? "dre"
      : "nutri";
  const tipoGrid = filtros.status ? "unico" : "todos";
  const semEscola = primeiroRegistro.escola === undefined ? "-sem-escola" : "";
  const classeGrid = `grid-${perfilGrid}-${tipoGrid}${semEscola}`;
  return (
    <section className="tabela-relatorio-quant-solic-dieta-esp mt-3">
      <div className={`header-quantitativo-por-terceirizada ${classeGrid}`}>
        <div>Diretoria Regional de Educação</div>
        {primeiroRegistro.escola && <div>Unidade Escolar</div>}
        {[undefined, "pendentes"].includes(filtros.status) && (
          <div>
            Dietas
            <br />
            pendentes
          </div>
        )}
        {[undefined, "ativas"].includes(filtros.status) && (
          <div>
            Dietas
            <br />
            ativas
          </div>
        )}
        {[undefined, "inativas"].includes(filtros.status) && (
          <div>
            Dietas
            <br />
            inativas
          </div>
        )}
      </div>
      {dadosRelatorio.map((item, index) => {
        return (
          <Fragment key={index}>
            <div className={`row-quantitativo-nome ${classeGrid}`}>
              <div>{item.dre}</div>
              {primeiroRegistro.escola && <div>{item.escola}</div>}
              {[undefined, "pendentes"].includes(filtros.status) && (
                <div>{item.qtde_pendentes}</div>
              )}
              {[undefined, "ativas"].includes(filtros.status) && (
                <div>{item.qtde_ativas}</div>
              )}
              {[undefined, "inativas"].includes(filtros.status) && (
                <div>{item.qtde_inativas}</div>
              )}
            </div>
          </Fragment>
        );
      })}
    </section>
  );
};
