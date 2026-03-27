import { Field } from "react-final-form";
import { Form } from "react-final-form";
import { Radio } from "antd";
import moment from "moment";
import Botao from "src/components/Shareable/Botao";
import {
  BUTTON_STYLE,
  BUTTON_TYPE,
} from "src/components/Shareable/Botao/constants";
import { InputComData } from "src/components/Shareable/DatePicker";
import { toastError } from "src/components/Shareable/Toast/dialogs";
import HTTP_STATUS from "http-status-codes";
import { useEffect, useState } from "react";
import { Modal } from "react-bootstrap";
import { getGrupoUnidadeEscolar } from "src/services/escola.service";
import "./styles.scss";

const ModalRelatorio = ({
  show,
  onClose,
  onSubmit,
  nomeRelatorio,
  gruposHabilitadosPorDre,
  mesAnoSelecionado,
}) => {
  const [gruposUnidadeEscolar, setGruposUnidadeEscolar] = useState([]);
  const [grupoSelecionado, setGrupoSelecionado] = useState(null);
  const exibePeriodoLancamento = nomeRelatorio === "Relatório Consolidado";
  const [mesSelecionado, anoSelecionado] = mesAnoSelecionado
    ? mesAnoSelecionado.split("_")
    : [];
  const inicioMesReferencia =
    mesSelecionado && anoSelecionado
      ? moment(
          `${anoSelecionado}-${String(mesSelecionado).padStart(2, "0")}-01`,
          "YYYY-MM-DD",
        ).startOf("month")
      : null;
  const fimMesReferencia = inicioMesReferencia?.clone().endOf("month");

  function handleCloseModal() {
    setGrupoSelecionado(null);
    onClose();
  }

  const validate = (values) => {
    const errors = {};

    if (values.data_inicial && !values.data_final) {
      errors.data_final = "Informe a data final.";
    }

    if (
      values.data_inicial &&
      inicioMesReferencia &&
      !moment(values.data_inicial, "DD/MM/YYYY", true).isBetween(
        inicioMesReferencia,
        fimMesReferencia,
        "day",
        "[]",
      )
    ) {
      errors.data_inicial = "Informe uma data dentro do mês de referência.";
    }

    if (
      values.data_final &&
      inicioMesReferencia &&
      !moment(values.data_final, "DD/MM/YYYY", true).isBetween(
        inicioMesReferencia,
        fimMesReferencia,
        "day",
        "[]",
      )
    ) {
      errors.data_final = "Informe uma data dentro do mês de referência.";
    }

    return errors;
  };

  function desabilitaRadioButton(grupo) {
    if (nomeRelatorio === "Relatório Consolidado") {
      return false;
    }
    const desabilitadoPorDre =
      gruposHabilitadosPorDre && gruposHabilitadosPorDre[grupo] === false;
    return desabilitadoPorDre;
  }

  const getGruposUnidades = async () => {
    const response = await getGrupoUnidadeEscolar();
    if (response.status === HTTP_STATUS.OK) {
      setGruposUnidadeEscolar(response.data.results);
    } else {
      handleCloseModal();
      toastError(
        "Erro ao buscar grupos de unidade escolar. Tente novamente mais tarde.",
      );
    }
  };

  useEffect(() => {
    getGruposUnidades();
  }, []);

  return (
    <Modal
      show={show}
      onHide={handleCloseModal}
      dialogClassName="modal-relatorio-unificado"
    >
      <Modal.Header closeButton>
        <Modal.Title>Impressão de {nomeRelatorio}</Modal.Title>
      </Modal.Header>

      <Form
        onSubmit={(values) => {
          handleCloseModal();
          onSubmit({
            grupoSelecionado,
            ...values,
          });
        }}
        validate={validate}
        render={({ handleSubmit, submitting, values, invalid }) => (
          <>
            <Modal.Body>
              {exibePeriodoLancamento && (
                <>
                  <p className="modal-relatorio-texto">
                    Selecione o período de lançamento:
                  </p>
                  <div className="row periodo-lancamento">
                    <div className="col-4 periodo-lancamento-col">
                      <Field
                        component={InputComData}
                        name="data_inicial"
                        placeholder="Data inicial"
                        minDate={inicioMesReferencia?.toDate() || null}
                        maxDate={
                          values.data_final
                            ? moment(values.data_final, "DD/MM/YYYY").toDate()
                            : fimMesReferencia?.toDate() || null
                        }
                      />
                    </div>
                    <div className="col-4 periodo-lancamento-col">
                      <Field
                        component={InputComData}
                        name="data_final"
                        placeholder="Data final"
                        popperPlacement="bottom-end"
                        minDate={
                          values.data_inicial
                            ? moment(values.data_inicial, "DD/MM/YYYY").toDate()
                            : inicioMesReferencia?.toDate() || null
                        }
                        maxDate={fimMesReferencia?.toDate() || null}
                      />
                    </div>
                  </div>
                </>
              )}

              <p className="modal-relatorio-texto pt-3">
                <span className="red">*</span> Selecione o grupo de Unidade para
                impressão do {nomeRelatorio}:
              </p>

              <Radio.Group
                value={grupoSelecionado}
                onChange={(event) => setGrupoSelecionado(event.target.value)}
                className="d-flex flex-column"
              >
                {gruposUnidadeEscolar.map((grupo, key) => {
                  const label = `${grupo.nome} (${grupo.tipos_unidades
                    ?.map((unidade) => unidade.iniciais)
                    .join(", ")})`;

                  return (
                    <Radio
                      value={grupo.uuid}
                      key={key}
                      disabled={desabilitaRadioButton(grupo.nome)}
                    >
                      {label}
                    </Radio>
                  );
                })}
              </Radio.Group>
            </Modal.Body>

            <Modal.Footer>
              <Botao
                texto="Cancelar"
                type={BUTTON_TYPE.BUTTON}
                onClick={handleCloseModal}
                style={BUTTON_STYLE.GREEN_OUTLINE}
              />

              <Botao
                texto="Gerar Relatório"
                type={BUTTON_TYPE.BUTTON}
                onClick={handleSubmit}
                style={BUTTON_STYLE.GREEN}
                disabled={!grupoSelecionado || submitting || invalid}
              />
            </Modal.Footer>
          </>
        )}
      />
    </Modal>
  );
};

export default ModalRelatorio;
