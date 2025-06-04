import Botao from "src/components/Shareable/Botao";
import {
  BUTTON_STYLE,
  BUTTON_TYPE,
} from "src/components/Shareable/Botao/constants";
import { Select } from "src/components/Shareable/Select";
import { formataMesNome } from "src/helpers/utilities";
import React from "react";
import { Field, Form } from "react-final-form";
import {
  LANCAMENTO_INICIAL,
  LANCAMENTO_MEDICAO_INICIAL,
  REGISTRAR_NOVA_OCORRENCIA,
  REGISTRAR_OCORRENCIAS,
} from "src/configs/constants";
import {
  NavigateFunction,
  useNavigate,
  useSearchParams,
} from "react-router-dom";
import "./style.scss";

export const ListaOcorrencias = () => {
  const [searchParams] = useSearchParams();
  const navigate: NavigateFunction = useNavigate();

  const onSubmit = () => {};

  return (
    <div className="card lista-ocorrencias mt-3">
      <div className="card-body">
        <Form onSubmit={onSubmit}>
          {({ handleSubmit }) => (
            <form onSubmit={handleSubmit}>
              <div className="row">
                <div className="col-3">
                  <Field
                    component={Select}
                    name="mes_ano"
                    label="Período de Lançamento da Medição"
                    options={[
                      {
                        nome: `${formataMesNome(
                          searchParams.get("mes")
                        )} / ${searchParams.get("ano")}`,
                        uuid: "",
                      },
                    ]}
                    disabled
                  />
                </div>
                <div className="col-9 mt-auto text-end">
                  <Botao
                    texto="Registrar Nova Ocorrência"
                    type={BUTTON_TYPE.BUTTON}
                    style={BUTTON_STYLE.GREEN_OUTLINE}
                    onClick={() =>
                      navigate(
                        `/${LANCAMENTO_INICIAL}/${LANCAMENTO_MEDICAO_INICIAL}/${REGISTRAR_OCORRENCIAS}/${REGISTRAR_NOVA_OCORRENCIA}`,
                        {
                          state: {
                            editalUuid: searchParams.get("editalUuid"),
                            solicitacaoMedicaoInicialUuid: searchParams.get(
                              "solicitacaoMedicaoInicialUuid"
                            ),
                          },
                        }
                      )
                    }
                  />
                </div>
              </div>
            </form>
          )}
        </Form>
      </div>
    </div>
  );
};
