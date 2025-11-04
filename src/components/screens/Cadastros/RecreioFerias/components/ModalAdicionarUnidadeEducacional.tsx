import { useEffect, useMemo, useState } from "react";
import { Modal } from "react-bootstrap";
import { Field, Form } from "react-final-form";
import Botao from "src/components/Shareable/Botao";
import {
  BUTTON_STYLE,
  BUTTON_TYPE,
} from "src/components/Shareable/Botao/constants";
import { MultiselectRaw } from "src/components/Shareable/MultiselectRaw";
import Select from "src/components/Shareable/Select";
import { required } from "src/helpers/fieldValidators";
import { getTiposUnidadeEscolar } from "src/services/cadastroTipoAlimentacao.service";
import { getLotesAsync } from "src/services/lote.service";
import "../../style.scss";

type ModalAdicionarUnidadeEducacionalInterface = {
  showModal: boolean;
  closeModal: () => void;
  submitting: boolean;
};

type Option = { uuid: string; nome: string };

export const ModalAdicionarUnidadeEducacional = ({
  showModal,
  closeModal,
  submitting,
}: ModalAdicionarUnidadeEducacionalInterface) => {
  const [lotes, setLotes] = useState<Option[]>([]);
  const [unidadesEscolares, setUnidadesEscolares] = useState([]);

  useEffect(() => {
    const handleCarregaSeletor = async () => {
      const unidadesEscolares = await getTiposUnidadeEscolar();
      const formatOpcoesUnidadesEscolares = unidadesEscolares.data.results.map(
        (unidadeEscolar) => ({
          nome: unidadeEscolar.iniciais,
          uuid: unidadeEscolar.iniciais,
        })
      );
      setUnidadesEscolares(formatOpcoesUnidadesEscolares);
      getLotesAsync(setLotes, "uuid", "nome");
    };

    handleCarregaSeletor();
  }, []);

  const lotesOpts = useMemo<Option[]>(
    () => [{ uuid: "", nome: "Selecione a DRE/Lote" }].concat(lotes || []),
    [lotes]
  );

  const tiposUnidadesOpts = useMemo<Option[]>(
    () =>
      [{ uuid: "", nome: "Selecione o Tipo de Unidade" }].concat(
        unidadesEscolares || []
      ),
    [unidadesEscolares]
  );

  const unidadesEducacionaisOpts = useMemo(
    () => [
      { value: "u1", label: "Unidade 1" },
      { value: "u2", label: "Unidade 2" },
    ],
    []
  );

  const tiposAlimentacaoInscritosOpts = useMemo<Option[]>(
    () => [
      { uuid: "", nome: "Selecione os Tipos de Alimentações" },
      { uuid: "almoco", nome: "Almoço" },
      { uuid: "lanche", nome: "Lanche" },
    ],
    []
  );

  return (
    <Modal
      dialogClassName="modal-adicionar-unidades-educacionais"
      show={showModal}
      onHide={closeModal}
    >
      <Modal.Header closeButton>
        <Modal.Title className="modal-cadastro-edital">
          Adicionar Unidades Educacionais
        </Modal.Title>
      </Modal.Header>

      <Modal.Body>
        <Form
          keepDirtyOnReinitialize
          onSubmit={() => {}}
          render={({ handleSubmit, values, submitting: formSubmitting }) => {
            const hasDreLote = Boolean(values?.dres_lote);
            const hasTipoUnidade = Boolean(values?.tipos_unidades);

            const enableSeletores = hasDreLote && hasTipoUnidade;

            const addDisabled = submitting || formSubmitting;

            return (
              <form onSubmit={handleSubmit}>
                <div className="row">
                  <div className="w-50">
                    <Field
                      component={Select}
                      label="DREs/LOTE"
                      name="dres_lote"
                      options={lotesOpts}
                      required
                      validate={required}
                    />
                  </div>
                  <div className="w-50">
                    <Field
                      component={Select}
                      label="Tipos de Unidades"
                      name="tipos_unidades"
                      options={tiposUnidadesOpts}
                      required
                      validate={required}
                    />
                  </div>
                </div>

                <div className="row">
                  <Field
                    component={MultiselectRaw}
                    label="Unidades Educacionais"
                    name="unidades_educacionais"
                    placeholder="Selecione as Unidades Educacionais"
                    selected={values?.unidades_educacionais || []}
                    options={unidadesEducacionaisOpts}
                    required
                    validate={required}
                    disabled={!enableSeletores}
                  />
                </div>

                <div className="row">
                  <div className="w-50">
                    <Field
                      component={Select}
                      label="Tipos de Alimentações para Inscritos"
                      name="tipos_alimentacao_inscritos"
                      options={tiposAlimentacaoInscritosOpts}
                      required
                      validate={required}
                      disabled={!enableSeletores}
                    />
                  </div>
                  <div className="w-50">
                    <Field
                      component={Select}
                      label="Tipos de Alimentações para Colaboradores"
                      name="tipos_alimentacao_colaboradores"
                      options={tiposAlimentacaoInscritosOpts}
                      disabled={!enableSeletores}
                    />
                  </div>
                </div>

                <div className="d-flex justify-content-end mt-3">
                  <Botao
                    texto="Cancelar"
                    type={BUTTON_TYPE.BUTTON}
                    onClick={closeModal}
                    style={BUTTON_STYLE.GREEN_OUTLINE}
                    className="ms-3"
                  />
                  <Botao
                    texto="Adicionar"
                    type={BUTTON_TYPE.SUBMIT}
                    disabled={addDisabled}
                    onClick={() => {
                      // onSubmit(values);
                    }}
                    style={BUTTON_STYLE.GREEN}
                    className="ms-2"
                  />
                </div>
              </form>
            );
          }}
        />
      </Modal.Body>
    </Modal>
  );
};
