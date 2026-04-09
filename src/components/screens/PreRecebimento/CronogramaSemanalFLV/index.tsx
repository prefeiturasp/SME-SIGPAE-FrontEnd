import React from "react";
import { Spin } from "antd";
import { useNavigate } from "react-router-dom";
import Botao from "src/components/Shareable/Botao";
import {
  BUTTON_STYLE,
  BUTTON_TYPE,
} from "src/components/Shareable/Botao/constants";
import {
  PRE_RECEBIMENTO,
  CADASTRO_CRONOGRAMA_SEMANAL,
} from "src/configs/constants";
import "./styles.scss";

const CronogramaSemanalFLV: React.FC = () => {
  const navigate = useNavigate();

  return (
    <Spin spinning={false}>
      <div className="card mt-3 card-cronograma-semanal-flv">
        <div className="card-body cronograma-semanal-flv">
          <div className="row mt-4">
            <div className="col-12 text-end">
              <Botao
                texto="Cadastrar Cronograma"
                type={BUTTON_TYPE.BUTTON}
                style={BUTTON_STYLE.GREEN}
                onClick={() =>
                  navigate(`/${PRE_RECEBIMENTO}/${CADASTRO_CRONOGRAMA_SEMANAL}`)
                }
              />
            </div>
          </div>
        </div>
      </div>
    </Spin>
  );
};

export default CronogramaSemanalFLV;
