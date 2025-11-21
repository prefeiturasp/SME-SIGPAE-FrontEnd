import { useNavigate } from "react-router-dom";
import Botao from "src/components/Shareable/Botao";
import {
  BUTTON_STYLE,
  BUTTON_TYPE,
} from "src/components/Shareable/Botao/constants";
import { cadastrarRecreioNasFerias } from "../../../../services/recreioFerias.service";
import { RecreioFeriasForm } from "./components/RecreioFeriasForm";
import "./style.scss";

export const CadastroRecreioFerias = () => {
  const navigate = useNavigate();

  const initialValues = {
    titulo_cadastro: "",
    periodo_realizacao_de: null,
    periodo_realizacao_ate: null,
    unidades_participantes: [],
  };

  const onSubmitApi = async (payload: any) => {
    await cadastrarRecreioNasFerias(payload);
  };

  return (
    <div className="card recreio-nas-ferias-container">
      <div className="card-body">
        <div className="row mt-3 mb-3 header-container">
          <div className="col-4">
            <div className="title">Informe o Período do Recreio nas Férias</div>
          </div>
          <Botao
            className="text-end recreio-cadastrados-botao"
            texto="Recreios Cadastrados"
            type={BUTTON_TYPE.BUTTON}
            style={BUTTON_STYLE.GREEN_OUTLINE}
            onClick={() =>
              navigate(
                "/configuracoes/cadastros/recreio-nas-ferias-cadastrados"
              )
            }
          />
        </div>

        <RecreioFeriasForm
          mode="create"
          initialValues={initialValues}
          onSubmitApi={onSubmitApi}
        />
      </div>
    </div>
  );
};
