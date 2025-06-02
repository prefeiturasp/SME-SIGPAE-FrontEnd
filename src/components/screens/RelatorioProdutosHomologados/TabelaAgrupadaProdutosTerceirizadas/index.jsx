import React, { useState } from "react";

import "./style.scss";
import {
  usuarioEhCODAEGestaoAlimentacao,
  usuarioEhCODAENutriManifestacao,
  usuarioEhEscolaTerceirizadaDiretor,
  usuarioEhEscolaTerceirizada,
  usuarioEhNutricionistaSupervisao,
  usuarioEhEmpresaTerceirizada,
} from "src/helpers/utilities";
import { Paginacao } from "src/components/Shareable/Paginacao";

const TabelaAgrupadaProdutosTerceirizadas = ({
  dadosProdutos,
  filtros,
  getProdutosHomologados,
  quantidadeHomologados,
}) => {
  const [page, setPage] = useState(1);

  const onChangePagination = (page) => {
    setPage(page);
    getProdutosHomologados({
      limit: PAGE_SIZE,
      offset: (page - 1) * PAGE_SIZE,
      ...filtros,
    });
  };

  const exibirNomeTerceirizada =
    !usuarioEhEscolaTerceirizadaDiretor() &&
    !usuarioEhEscolaTerceirizada() &&
    !usuarioEhEmpresaTerceirizada() &&
    !usuarioEhCODAEGestaoAlimentacao() &&
    !usuarioEhNutricionistaSupervisao() &&
    !usuarioEhCODAENutriManifestacao() &&
    !filtros.agrupado_por_nome_e_marca;

  const PAGE_SIZE = 10;

  return dadosProdutos ? (
    <div>
      <table className="table table-bordered table-items">
        <thead>
          <tr className="table-head-items">
            {exibirNomeTerceirizada && <th>Terceirizada</th>}
            <th>Produto</th>
            <th>Marca</th>
            <th>Edital</th>
            {!filtros.agrupado_por_nome_e_marca && (
              <>
                <th>Tipo</th>
                <th>Cadastro</th>
                <th>Homologação</th>
              </>
            )}
          </tr>
        </thead>
        <tbody>
          {dadosProdutos &&
            dadosProdutos.map((produto, index) => {
              return (
                <tr key={index} className="table-body-items">
                  {exibirNomeTerceirizada && <td>{produto.terceirizada}</td>}
                  <td>{produto.nome}</td>
                  <td>{produto.marca}</td>
                  <td>{produto.edital}</td>
                  {!filtros.agrupado_por_nome_e_marca && (
                    <>
                      <td>{produto.tipo}</td>
                      <td>{produto.cadastro}</td>
                      <td>{produto.homologacao}</td>
                    </>
                  )}
                </tr>
              );
            })}
        </tbody>
      </table>
      <Paginacao
        className="mt-3 mb-3"
        total={quantidadeHomologados}
        onChange={onChangePagination}
        current={page}
        pageSize={PAGE_SIZE}
      />
    </div>
  ) : (
    <></>
  );
};

export default TabelaAgrupadaProdutosTerceirizadas;
