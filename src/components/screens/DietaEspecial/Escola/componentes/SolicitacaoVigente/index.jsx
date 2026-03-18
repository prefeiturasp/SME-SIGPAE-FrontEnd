import { useEffect, useState } from "react";
import { Collapse } from "react-collapse";
import { reduxForm } from "redux-form";
import { Botao } from "src/components/Shareable/Botao";
import {
  BUTTON_ICON,
  BUTTON_STYLE,
  BUTTON_TYPE,
} from "src/components/Shareable/Botao/constants";
import { ToggleExpandir } from "src/components/Shareable/ToggleExpandir";
import withNavigate from "src/components/Shareable/withNavigate";
import { usuarioEhNutriCODAE } from "src/helpers/utilities";

export const SolicitacaoVigente = (props) => {
  const {
    handleSubmit,
    navigate,
    onPreencherDieta,
    semSolicitacoesTexto,
    solicitacoesVigentes: solicitacoesVigentesProp,
    titulo,
    uuid,
  } = props;

  const [solicitacoesVigentes, setSolicitacoesVigentes] = useState(null);

  useEffect(() => {
    setSolicitacoesVigentes(solicitacoesVigentesProp);
  }, [solicitacoesVigentesProp]);

  const activateSolicitacao = (key) => {
    setSolicitacoesVigentes((current) =>
      current.map((solicitacao, index) =>
        index === key
          ? { ...solicitacao, active: !solicitacao.active }
          : solicitacao,
      ),
    );
  };

  const preencherDieta = (solicitacaoVigente) => {
    if (onPreencherDieta) {
      onPreencherDieta(solicitacaoVigente);
    }
  };

  return (
    <div className="current-diets">
      {!solicitacoesVigentes || solicitacoesVigentes.length === 0 ? (
        !uuid && (
          <div className="pt-2 no-diets">
            {semSolicitacoesTexto || "Não há dieta autorizada para este aluno"}
          </div>
        )
      ) : (
        <div>
          <p className="pt-3 title">{titulo || "Dietas Ativas/Inativas"}</p>
          {solicitacoesVigentes.map((solicitacaoVigente, key) => {
            const dietaEstaAtiva =
              solicitacaoVigente.ativo &&
              solicitacaoVigente.status_solicitacao === "CODAE_AUTORIZADO";
            const texto = dietaEstaAtiva ? "Dieta ativa" : "Dieta inativa";
            const iconClassName = dietaEstaAtiva
              ? "fas fa-check-circle"
              : "fas fa-ban";
            const corIcone = dietaEstaAtiva ? "green" : "red";

            return (
              <div className="pb-2" key={key}>
                <div
                  className="school-container col-md-12 me-4"
                  style={
                    solicitacaoVigente.active ? { background: "#F2FBFE" } : {}
                  }
                >
                  <div className="row pt-2 pb-2 title">
                    <div className="col-4">
                      {`Solicitação: # ${solicitacaoVigente.id_externo}`}
                    </div>
                    <div className="col-8 text-end">
                      <i
                        style={{ color: corIcone }}
                        className={iconClassName}
                      />
                      <label className="ms-1 pe-3 ">{texto}</label>
                      <ToggleExpandir
                        onClick={() => activateSolicitacao(key)}
                        ativo={solicitacaoVigente.active}
                        className="float-end"
                      />
                    </div>
                  </div>
                  <Collapse isOpened={solicitacaoVigente.active}>
                    <hr />
                    <form className="special-diet" onSubmit={handleSubmit}>
                      <div className="container mx-0">
                        <div className="flex-row report-label-value mb-3">
                          <p className="mb-0">Relação por Diagnóstico:</p>
                          {solicitacaoVigente.alergias_intolerancias.map(
                            (alergia, index) => (
                              <div className="value mx-1" key={index}>
                                {alergia.descricao}
                              </div>
                            ),
                          )}
                        </div>
                        <div className="flex-row report-label-value mb-3">
                          <p className="mb-0">
                            Classificação da Dieta Especial:
                          </p>
                          <span className="value mx-1">
                            {solicitacaoVigente?.classificacao?.nome || "--"}
                          </span>
                        </div>
                        <div className="row pb-3">
                          <div className="col-6">
                            <Botao
                              tabindex="-1"
                              onClick={() =>
                                navigate(
                                  `/dieta-especial/relatorio?uuid=${solicitacaoVigente.uuid}`,
                                )
                              }
                              texto="Visualizar Solicitação"
                              style={BUTTON_STYLE.BLUE_OUTLINE}
                              type={BUTTON_TYPE.BUTTON}
                              icon={BUTTON_ICON.FILE_ALT}
                              className="me-3"
                            />
                            {usuarioEhNutriCODAE() && (
                              <Botao
                                tabindex="-1"
                                onClick={() =>
                                  preencherDieta(solicitacaoVigente)
                                }
                                texto="Copiar Dados desta Solicitação"
                                style={BUTTON_STYLE.BLUE_OUTLINE}
                                type={BUTTON_TYPE.BUTTON}
                                icon={BUTTON_ICON.FILE_ALT}
                                className="me-3"
                              />
                            )}
                          </div>
                        </div>
                      </div>
                    </form>
                  </Collapse>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

const InativarDietaForm = reduxForm({
  form: "inativaDietaForm",
  enableReinitialize: true,
})(withNavigate(SolicitacaoVigente));

export default InativarDietaForm;
