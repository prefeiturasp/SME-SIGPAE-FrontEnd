import { Link } from "react-router-dom";
import Botao from "src/components/Shareable/Botao";
import {
  BUTTON_STYLE,
  BUTTON_TYPE,
} from "src/components/Shareable/Botao/constants";
import { CalendarioEdicaoExterna } from "src/components/Shareable/CalendarioEdicaoExterna";
import {
  CADASTROS,
  CONFIGURACOES,
  DIAS_LETIVOS,
  EDITAR,
} from "src/configs/constants";
import { usuarioEhCODAEGestaoAlimentacao } from "src/helpers/utilities";
import { listDiasLetivos } from "src/services/diasLetivos";

export const DiasLetivosSIGPAE = () => {
  return (
    <div className="dias-letivos-sigpae">
      <div className="card mt-3">
        <div className="card-body">
          <p>
            Para cadastrar dias letivos, clique no botão Cadastrar e,
            posteriormente, visualize-os no calendário.
          </p>
          <Link
            to={`/${CONFIGURACOES}/${CADASTROS}/${DIAS_LETIVOS}/${EDITAR}`}
            style={{ display: "contents" }}
          >
            <Botao
              texto="Cadastrar"
              type={BUTTON_TYPE.BUTTON}
              style={BUTTON_STYLE.GREEN}
              className="btn-cadastrar"
            />
          </Link>
          <CalendarioEdicaoExterna
            getObjetos={listDiasLetivos}
            nomeObjeto="letivos"
            nomeObjetoMinusculo="letivo"
            setObjeto={() => {}}
            deleteObjeto={() => {}}
            podeEditar={usuarioEhCODAEGestaoAlimentacao()}
          />
        </div>
      </div>
    </div>
  );
};
