import { escolaEhCEMEI } from "src/helpers/utilities";
import { extrairTiposALimentacao } from "../components/InclusaoDeAlimentacao/helper";

const LOAD_FOOD_SUSPENSION = "LOAD_FOOD_SUSPENSION";

export default function reducer(state = {}, action) {
  switch (action.type) {
    case LOAD_FOOD_SUSPENSION:
      if (action.data !== null) {
        action.data.suspensoes_alimentacao.forEach(function (dia_motivo) {
          const idx = action.data.suspensoes_alimentacao.findIndex(
            (suspensao) => suspensao.data === dia_motivo.data
          );
          let diaMotivo = {};
          diaMotivo["data"] = dia_motivo.data;
          diaMotivo["motivo"] = dia_motivo.motivo.uuid;
          diaMotivo["outro_motivo"] = dia_motivo.outro_motivo;
          diaMotivo[`outro_motivo${idx}`] = dia_motivo.outro_motivo;
          diaMotivo[`data${idx}`] = dia_motivo.data;
          diaMotivo[`motivo${idx}`] = dia_motivo.motivo.uuid;
          action.data[`dias_razoes_${dia_motivo.data}`] = diaMotivo;
        });

        action.data.quantidades_por_periodo.forEach(function (
          quantidade_por_periodo
        ) {
          let quantidade_por_periodo_ = {};
          quantidade_por_periodo_["check"] = true;
          quantidade_por_periodo_["tipo_de_refeicao"] = extrairTiposALimentacao(
            quantidade_por_periodo.tipos_alimentacao
          );
          quantidade_por_periodo_["numero_de_alunos"] =
            quantidade_por_periodo.numero_alunos;
          escolaEhCEMEI() &&
            (quantidade_por_periodo_["alunos_cei_ou_emei"] =
              quantidade_por_periodo.alunos_cei_ou_emei === "Todos"
                ? ["CEI", "EMEI"]
                : [quantidade_por_periodo.alunos_cei_ou_emei]);
          action.data[
            `suspensoes_${quantidade_por_periodo.periodo_escolar.nome}`
          ] = quantidade_por_periodo_;
        });
      }
      return {
        data: {
          ...action.data,
        },
      };
    default:
      return state;
  }
}

export const loadFoodSuspension = (data) => (dispatch) =>
  dispatch({ type: LOAD_FOOD_SUSPENSION, data });
