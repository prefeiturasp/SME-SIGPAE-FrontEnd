import { Tooltip } from "antd";
import { Field } from "react-final-form";
import InputText from "src/components/Shareable/Input/InputText";
import { truncarString } from "src/helpers/utilities";

export const LinhaUnidade = ({
  name,
  participante,
  openRemoverModal,
  readOnly = false,
}) => {
  if (readOnly) {
    const alimentacoes = (participante.tipos_alimentacao ?? [])
      .map((t: any) => t.nome)
      .join(", ");

    return (
      <tr>
        <td className="dre-lote text-center">{participante.lote_nome}</td>
        <td className="unidade-educacional text-left">
          <Tooltip title={participante.unidade_educacional_nome}>
            {truncarString(participante.unidade_educacional_nome, 35)}
          </Tooltip>
        </td>
        <td className="num-participantes text-center">
          {participante.num_participantes ?? "-"}
        </td>
        <td className="num-colaboradores text-left">
          <Tooltip title={alimentacoes}>
            {truncarString(alimentacoes, 35)}
          </Tooltip>
        </td>
        <td className="action-column" />
      </tr>
    );
  }

  return (
    <>
      <tr className="row">
        <td className="col-1">{participante.dreLoteNome}</td>

        <td className="col-4">
          <Tooltip title={participante.unidadeEducacional}>
            {truncarString(participante.unidadeEducacional, 35)}
          </Tooltip>
        </td>

        <td className="col-2 td-num-participante">
          <Field
            component={InputText}
            name={`${name}.num_participantes`}
            dataTestId="num_participantes_input"
            type="number"
            required
            min={1}
          />
        </td>

        <td className="col-4">
          <Tooltip title={participante.alimentacaoParticipantes}>
            {truncarString(participante.alimentacaoParticipantes, 35)}
          </Tooltip>
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
      </tr>
    </>
  );
};
