import { Switch, Tooltip } from "antd";
import { Collapse } from "react-collapse";
import { Field } from "react-final-form";
import InputText from "src/components/Shareable/Input/InputText";
import { ToggleExpandir } from "src/components/Shareable/ToggleExpandir";
import { required } from "src/helpers/fieldValidators";
import { truncarString } from "src/helpers/utilities";
import { formatarNomeUnidadeEducacional } from "../helper";

export const LinhaUnidade = ({
  name,
  participante,
  aberto,
  toggleExpandir,
  openRemoverModal,
  readOnly = false,
  form,
  temTiposAlimentacaoColaboradores = true,
}) => {
  const handleLiberarMedicaoChange = (checked) => {
    form.change(`${name}.liberarMedicao`, checked);
  };

  if (readOnly) {
    return (
      <>
        <tr>
          <td className="dre-lote text-center">
            {participante.lote.nome_exibicao || participante.lote.nome}
          </td>
          <td className="unidade-educacional text-left">
            <Tooltip
              title={formatarNomeUnidadeEducacional(
                participante.unidade_educacional.nome,
                participante.cei_ou_emei,
              )}
            >
              {truncarString(
                formatarNomeUnidadeEducacional(
                  participante.unidade_educacional.nome,
                  participante.cei_ou_emei,
                ),
                35,
              )}
            </Tooltip>
          </td>
          <td className="num-inscritos text-center">
            {participante.num_inscritos}
          </td>
          <td className="num-colaboradores text-center">
            {participante.num_colaboradores}
          </td>
          <td
            className={`liberar-medicao text-center ${
              participante.liberar_medicao ? "verde" : ""
            }`}
          >
            {participante.liberar_medicao ? "Sim" : "Não"}
          </td>
          <td className="action-column text-center">
            <ToggleExpandir
              ativo={!!aberto}
              onClick={() => toggleExpandir(participante?.id)}
            />
          </td>
        </tr>
        <tr className="linha-detalhe">
          <td colSpan={6} className="p-0">
            <Collapse isOpened={aberto}>
              <div className="collapse-container-unidades-participantes">
                {(() => {
                  const tipos = participante?.tipos_alimentacao || {};
                  const inscritos = (tipos.inscritos || []).map((t) => t.nome);
                  const infantil = (tipos.infantil || []).map((t) => t.nome);
                  const colaboradores = (tipos.colaboradores || []).map(
                    (t) => t.nome,
                  );

                  return (
                    <>
                      <div>
                        <strong>
                          Tipos de Alimentação Inscritos
                          {infantil.length > 0 && " - CEI"}:{" "}
                        </strong>
                        <span>{inscritos.join(", ")}</span>
                      </div>

                      {infantil.length > 0 && (
                        <div>
                          <strong>
                            Tipos de Alimentação Inscritos - INFANTIL:{" "}
                          </strong>
                          <span>{infantil.join(", ")}</span>
                        </div>
                      )}

                      <div>
                        <strong>Tipos de Alimentação Colaboradores: </strong>
                        <span>{colaboradores.join(", ")}</span>
                      </div>
                    </>
                  );
                })()}
              </div>
            </Collapse>
          </td>
        </tr>
      </>
    );
  }

  return (
    <>
      <tr className="row">
        <td className="col-1">{participante.dreLoteNome}</td>

        <td className="col-3">
          <Tooltip
            title={formatarNomeUnidadeEducacional(
              participante.unidadeEducacional,
              participante.ceiOuEmei,
            )}
          >
            {truncarString(
              formatarNomeUnidadeEducacional(
                participante.unidadeEducacional,
                participante.ceiOuEmei,
              ),
              35,
            )}
          </Tooltip>
        </td>

        <td className="col-2">
          <Field
            component={InputText}
            name={`${name}.num_inscritos`}
            dataTestId="num_inscritos_input"
            type="number"
            required
            validate={required}
            min={1}
          />
        </td>

        <td className="col-2">
          <Field
            component={InputText}
            name={`${name}.num_colaboradores`}
            dataTestId="num_colaboradores_input"
            type="number"
            required={temTiposAlimentacaoColaboradores}
            validate={temTiposAlimentacaoColaboradores ? required : undefined}
            min={1}
            disabled={!temTiposAlimentacaoColaboradores}
          />
        </td>

        <td className="col-2">
          <label
            className={`col-form-label ${
              !participante.liberarMedicao && "preto"
            }`}
          >
            Não
          </label>
          <Switch
            size="small"
            className="mx-2"
            checked={!!participante.liberarMedicao}
            onChange={handleLiberarMedicaoChange}
          />
          <label
            className={`col-form-label ${
              participante.liberarMedicao ? "verde" : ""
            }`}
          >
            Sim
          </label>
        </td>

        <td className="action-column col-1">
          <Tooltip title="Remover Unidade">
            <button
              type="button"
              className="excluir-botao verde"
              data-testid="remover-unidade-botao"
              onClick={() => openRemoverModal(participante.id)}
            >
              <i className="fas fa-trash" />
            </button>
          </Tooltip>
        </td>

        <td className="action-column col-1">
          <ToggleExpandir
            ativo={aberto}
            onClick={() => toggleExpandir(participante.id)}
            dataTestId={`toggle-${participante.id}`}
          />
        </td>
      </tr>

      <Collapse isOpened={aberto}>
        <div className="collapse-container-unidades-participantes">
          <div>
            <strong>
              Tipos de Alimentação Inscritos
              {participante.alimentacaoInscritosInfantil?.length > 0 &&
                " - CEI"}
              :{" "}
            </strong>
            <span>{participante.alimentacaoInscritos?.join(", ")}</span>
          </div>

          {participante.alimentacaoInscritosInfantil?.length > 0 && (
            <div>
              <strong>Tipos de Alimentação Inscritos - INFANTIL: </strong>
              <span>
                {participante.alimentacaoInscritosInfantil?.join(", ")}
              </span>
            </div>
          )}

          <div>
            <strong>Tipos de Alimentação Colaboradores: </strong>
            <span>{participante.alimentacaoColaboradores?.join(", ")}</span>
          </div>
        </div>
      </Collapse>
    </>
  );
};
