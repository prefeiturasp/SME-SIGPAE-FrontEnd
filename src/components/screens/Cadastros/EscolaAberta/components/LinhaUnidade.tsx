import { Tooltip } from "antd";
import { Field } from "react-final-form";
import InputText from "src/components/Shareable/Input/InputText";
import { required } from "src/helpers/fieldValidators";
import { truncarString } from "src/helpers/utilities";

export const LinhaUnidade = ({
  name,
  participante,
  openRemoverModal,
  readOnly = false,
}) => {
  if (readOnly) {
    return (
      <>
        <tr>
          <td className="dre-lote text-center">
            {participante.lote.nome_exibicao || participante.lote.nome}
          </td>
          <td className="unidade-educacional text-left">
            <Tooltip title={participante.unidade_educacional.nome}>
              {truncarString(participante.unidade_educacional.nome, 35)}
            </Tooltip>
          </td>
          <td className="num-participantes text-center">
            {participante.num_participantes}
          </td>
        </tr>
      </>
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

        <td className="col-2">
          <Field
            component={InputText}
            name={`${name}.num_participantes`}
            dataTestId="num_participantes_input"
            type="number"
            required
            validate={required}
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
