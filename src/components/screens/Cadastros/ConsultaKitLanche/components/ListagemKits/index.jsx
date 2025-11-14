import React from "react";

import "./styles.scss";
import { useNavigate } from "react-router-dom";

const ListagemKits = ({ kits }) => {
  const navigate = useNavigate();

  return (
    <section className="resultado-consulta-kit">
      <article>
        <div className="grid-table header-table">
          <div>Nome do Kit</div>
          <div>Descrição</div>
          <div>Nº do Edital</div>
          <div>Tipo de Unidade</div>
          <div>Status</div>
          <div />
        </div>
        {kits.map((kit) => {
          return (
            <div key={kit.uuid} className="grid-table body-table">
              <div>{kit.nome}</div>
              <div dangerouslySetInnerHTML={{ __html: kit.descricao }} />
              <div>{kit.edital ? kit.edital.numero : ""}</div>
              <div>{kit.tipos_unidades.map((t) => t.iniciais).join(", ")}</div>
              <div>{kit.status}</div>
              <div>
                <button
                  className="botaoEditar"
                  data-testid={`editar-kit-${kit.uuid}`}
                  onClick={() =>
                    navigate(`/codae/cadastros/kits/${kit.uuid}/editar`)
                  }
                >
                  Editar
                </button>
              </div>
            </div>
          );
        })}
      </article>
    </section>
  );
};

export default ListagemKits;
