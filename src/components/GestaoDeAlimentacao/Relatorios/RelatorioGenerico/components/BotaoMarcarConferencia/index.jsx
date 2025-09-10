import Botao from "src/components/Shareable/Botao";
import {
  BUTTON_STYLE,
  BUTTON_TYPE,
} from "src/components/Shareable/Botao/constants";

export const BotaoMarcarConferencia = ({ ...props }) => {
  const { setShowModalMarcarConferencia, loading } = props;

  return (
    <Botao
      texto="Marcar Conferência"
      type={BUTTON_TYPE.BUTTON}
      style={BUTTON_STYLE.GREEN}
      className="ms-3"
      onClick={() => {
        setShowModalMarcarConferencia(true);
      }}
      disabled={loading}
    />
  );
};
