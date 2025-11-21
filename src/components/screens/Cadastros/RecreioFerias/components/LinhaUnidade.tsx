import { Switch, Tooltip } from "antd";
import { Collapse } from "react-collapse";
import { Field } from "react-final-form";
import InputText from "src/components/Shareable/Input/InputText";
import { ToggleExpandir } from "src/components/Shareable/ToggleExpandir";
import { required } from "src/helpers/fieldValidators";
import { truncarString } from "src/helpers/utilities";

export const LinhaUnidade = ({
  name,
  participante,
  aberto,
  toggleExpandir,
  openRemoverModal,
  readOnly = false,
  form,
}) => {
  const getNomeUnidade = () => {
    let nome = participante.unidadeEducacional;

    if (participante.ceiOuEmei === "EMEI") {
      return `${nome} - INFANTIL`;
    }

    if (participante.ceiOuEmei === "CEI") {
      return `${nome} - CEI`;
    }

    return nome;
  };

  const handleLiberarMedicaoChange = (checked) => {
    form.change(`${name}.liberarMedicao`, checked);
  };

  if (readOnly) {
    return (
      <>
        <tr className="row">
          <td className="col-1 text-center">
            {participante.lote.nome_exibicao ?? participante.lote.nome}
          </td>
          <td className="col-3 text-left">
            {participante.unidade_educacional.nome}
          </td>
          <td className="col-2 text-center">{participante.num_inscritos}</td>
          <td className="col-2 text-center">
            {participante.num_colaboradores}
          </td>
          <td className="col-2 text-center">
            {participante.liberar_medicao ? "Sim" : "Não"}
          </td>
          <td className="action-column col-1 text-center">
            <ToggleExpandir
              ativo={!!aberto}
              onClick={() => toggleExpandir(participante?.id)}
            />
          </td>
        </tr>
        <Collapse isOpened={aberto}>
          <div className="collapse-container-unidades-participantes">
            {(() => {
              const tipos = participante?.tipos_alimentacao || {};
              const inscritos = (tipos.inscritos || []).map((t) => t.nome);
              const infantil = (tipos.infantil || []).map((t) => t.nome);
              const colaboradores = (tipos.colaboradores || []).map(
                (t) => t.nome
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
      </>
    );
  }

  return (
    <>
      <tr className="row">
        <td className="col-1">{participante.dreLoteNome}</td>

        <td className="col-3">
          <Tooltip title={getNomeUnidade()}>
            {truncarString(getNomeUnidade(), 35)}
          </Tooltip>
        </td>

        <td className="col-2">
          <Field
            component={InputText}
            name={`${name}.num_inscritos`}
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
            type="number"
            required
            validate={required}
            min={1}
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
