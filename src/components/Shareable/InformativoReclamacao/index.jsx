import React, { useEffect, useState } from "react";
import { getReclamacaoDeProduto } from "src/services/produto.service";
import "./styles.scss";

const InformativoReclamacao = ({ homologacao }) => {
  const [reclamacao, setReclamacao] = useState(null);

  useEffect(() => {
    const { uuid } = homologacao;
    getReclamacaoDeProduto(uuid).then((response) => {
      setReclamacao(response.data);
    });
  }, []);

  return (
    reclamacao && (
      <section className="descricao-reclamação">
        <article className="box-detalhe-reclamacao pt-2">
          <p>
            Reclamação aceita pela equipe de gestão de produto CODAE em{" "}
            {reclamacao.ultimo_log.criado_em.split(" ")[0]}.
          </p>
          <label>
            Para mais detalhes favor extrair o relatório de reclamação de
            produto
          </label>
        </article>
      </section>
    )
  );
};

export default InformativoReclamacao;
