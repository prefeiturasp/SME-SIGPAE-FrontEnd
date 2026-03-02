import HTTP_STATUS from "http-status-codes";
import { useState } from "react";
import { formataAlergias } from "src/components/screens/DietaEspecial/Relatorio/componentes/FormAutorizaDietaEspecial/helper";
import { Paginacao } from "src/components/Shareable/Paginacao";
import { usuarioEhEmpresaTerceirizada } from "src/helpers/utilities";
import { getSolicitacoesRelatorioDietasEspeciais } from "src/services/dietaEspecial.service";

import { toastError } from "src/components/Shareable/Toast/dialogs";
import "./styles.scss";

export const ListagemDietas = ({ ...props }) => {
  const [paginaAtual, setPaginaAtual] = useState(1);

  const {
    dietasEspeciais,
    meusDados,
    setDietasEspeciais,
    setLoadingDietas,
    values,
  } = props;

  const PAGE_SIZE = 10;
  const ehAutorizadaTerceirizada =
    values.status_selecionado === "AUTORIZADAS" &&
    usuarioEhEmpresaTerceirizada();

  const onChangePage = async (page, values) => {
    setPaginaAtual(page);
    setLoadingDietas(true);
    let params = {
      limit: PAGE_SIZE,
      offset: (page - 1) * PAGE_SIZE,
      ...values,
    };
    if (usuarioEhEmpresaTerceirizada()) {
      params["terceirizada_uuid"] = meusDados.vinculo_atual.instituicao.uuid;
    }
    const response = await getSolicitacoesRelatorioDietasEspeciais(params);
    if (response.status === HTTP_STATUS.OK) {
      setDietasEspeciais(response.data);
    } else {
      toastError(
        "Erro ao carregar dados das dietas especiais. Tente novamente mais tarde.",
      );
    }
    setLoadingDietas(false);
  };

  return (
    <section className="tabela-dietas-especiais">
      <article>
        <div
          className={`grid-table-rel-dietas dietas-${values.status_selecionado.toLowerCase()} ${ehAutorizadaTerceirizada && "autorizada-terceirizada"} header-table`}
        >
          <div>DRE/Lote</div>
          <div>Unidade Escolar</div>
          <div>Nome do Aluno</div>
          {values.status_selecionado === "AUTORIZADAS" && (
            <div>Data de Nascimento</div>
          )}
          <div>Classificação da Dieta</div>
          <div>
            {!usuarioEhEmpresaTerceirizada()
              ? "Relação por Diagnóstico"
              : "Protocolo Padrão"}
          </div>
          {values.status_selecionado === "AUTORIZADAS" &&
            !usuarioEhEmpresaTerceirizada() && <div>Protocolo Padrão</div>}
          {values.status_selecionado === "CANCELADAS" && (
            <div>Data de cancelamento</div>
          )}
        </div>
        {dietasEspeciais.results.map((dietaEspecial, index) => {
          return (
            <div key={index}>
              <div
                className={`grid-table-rel-dietas dietas-${values.status_selecionado.toLowerCase()} ${ehAutorizadaTerceirizada && "autorizada-terceirizada"} body-table`}
              >
                <div>{dietaEspecial.dre}</div>
                <div>{dietaEspecial.nome_escola}</div>
                <div>
                  {dietaEspecial.cod_eol_aluno} - {dietaEspecial.nome_aluno}
                </div>
                {values.status_selecionado === "AUTORIZADAS" && (
                  <div>{dietaEspecial.data_nascimento_aluno}</div>
                )}
                <div>
                  {dietaEspecial.classificacao
                    ? dietaEspecial.classificacao.nome
                    : "--"}
                </div>
                <div>
                  {!usuarioEhEmpresaTerceirizada()
                    ? formataAlergias(dietaEspecial)
                        .map((a) => a.nome)
                        .join("; ")
                    : dietaEspecial.nome_protocolo ||
                      (dietaEspecial.protocolo_padrao &&
                        dietaEspecial.protocolo_padrao.nome_protocolo)}
                </div>
                {values.status_selecionado === "AUTORIZADAS" &&
                  !usuarioEhEmpresaTerceirizada() && (
                    <div>
                      {dietaEspecial.nome_protocolo ||
                        (dietaEspecial.protocolo_padrao &&
                          dietaEspecial.protocolo_padrao.nome_protocolo)}
                    </div>
                  )}
                {values.status_selecionado === "CANCELADAS" && (
                  <div>{dietaEspecial.data_ultimo_log}</div>
                )}
              </div>
            </div>
          );
        })}
      </article>
      <Paginacao
        onChange={(page) => onChangePage(page, values)}
        total={dietasEspeciais.count}
        pageSize={PAGE_SIZE}
        current={paginaAtual}
      />
    </section>
  );
};
