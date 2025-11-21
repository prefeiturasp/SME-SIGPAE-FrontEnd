import { Spin } from "antd";
import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import Botao from "src/components/Shareable/Botao";
import {
  BUTTON_STYLE,
  BUTTON_TYPE,
} from "src/components/Shareable/Botao/constants";
import { toastError } from "src/components/Shareable/Toast/dialogs";
import {
  atualizarRecreioNasFerias,
  buscarRecreioNasFeriasPorUuid,
} from "../../../../services/recreioFerias.service";
import { RecreioFeriasForm } from "./components/RecreioFeriasForm";
import { mapParticipanteApiToForm } from "./helper";
import "./style.scss";

export const EdicaoRecreioFerias = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const uuid = searchParams.get("uuid");

  const [loading, setLoading] = useState(true);
  const [initialValues, setInitialValues] = useState<any | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      if (!uuid) {
        toastError("UUID não informado para edição.");
        navigate("/configuracoes/cadastros/recreio-nas-ferias-cadastrados");
        return;
      }

      try {
        setLoading(true);
        const response = await buscarRecreioNasFeriasPorUuid(uuid);
        const data = response.data;

        const valoresIniciais = {
          uuid: data.uuid,
          id: data.id,
          titulo_cadastro: data.titulo,
          periodo_realizacao_de: data.data_inicio,
          periodo_realizacao_ate: data.data_fim,
          unidades_participantes: (data.unidades_participantes || []).map(
            mapParticipanteApiToForm
          ),
        };

        setInitialValues(valoresIniciais);
      } catch (error) {
        toastError("Erro ao carregar Recreio nas Férias para edição:", error);
        navigate("/configuracoes/cadastros/recreio-nas-ferias-cadastrados");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [uuid, navigate]);

  const onSubmitApi = async (payload: any) => {
    await atualizarRecreioNasFerias(uuid, payload);
  };

  const onAfterSuccess = () => {
    navigate("/configuracoes/cadastros/recreio-nas-ferias-cadastrados");
  };

  if (loading || !initialValues) {
    return (
      <div className="card recreio-nas-ferias-container">
        <div className="card-body">
          <Spin tip="Carregando..." spinning />
        </div>
      </div>
    );
  }

  return (
    <div className="card recreio-nas-ferias-container">
      <div className="card-body">
        <div className="row mt-3 mb-3 header-container">
          <div className="col-4">
            <div className="title">Editar Recreio nas Férias</div>
          </div>
          <Botao
            className="text-end recreio-cadastrados-botao"
            texto="Voltar para Recreios Cadastrados"
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
          mode="edit"
          initialValues={initialValues}
          onSubmitApi={onSubmitApi}
          onAfterSuccess={onAfterSuccess}
        />
      </div>
    </div>
  );
};
