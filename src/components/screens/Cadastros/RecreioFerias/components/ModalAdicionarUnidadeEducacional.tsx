import React, { useEffect, useMemo, useState } from "react";
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
import { ResponseGetEscolasTercTotalInterface } from "src/interfaces/responses.interface";
import {
  getTiposUnidadeEscolar,
  getVinculosTipoAlimentacaoPorTipoUnidadeEscolar,
} from "src/services/cadastroTipoAlimentacao.service";
import { getEscolasTercTotal } from "src/services/escola.service";
import { getLotesAsync } from "src/services/lote.service";
import "../../style.scss";

type ModalAdicionarUnidadeEducacionalInterface = {
  showModal: boolean;
  closeModal: () => void;
  submitting: boolean;
  setUnidadesParticipantes: React.Dispatch<React.SetStateAction<any[]>>;
  unidadesParticipantes: any[];
};

type Option = { uuid: string; nome: string };

export const ModalAdicionarUnidadeEducacional = ({
  showModal,
  closeModal,
  submitting,
  setUnidadesParticipantes,
  unidadesParticipantes,
}: ModalAdicionarUnidadeEducacionalInterface) => {
  const [lotes, setLotes] = useState<Option[]>([]);
  const [tiposUnidadesEscolares, setTiposUnidadesEscolares] = useState([]);
  const [tiposAlimentacaoInscritos, setTiposAlimentacaoInscritos] = useState(
    []
  );
  const [
    tiposAlimentacaoInscritosInfantil,
    setTiposAlimentacaoInscritosInfantil,
  ] = useState([]);
  const [tiposAlimentacaoColaboradores, setTiposAlimentacaoColaboradores] =
    useState([]);
  const [unidadesEducacionaisOpts, setUnidadesEducacionaisOpts] = useState([]);
  const [emefTipo, setEmefTipo] = useState<{
    nome: string;
    uuid: string;
  } | null>(null);
  const [emeiTipo, setEmeiTipo] = useState<{
    nome: string;
    uuid: string;
  } | null>(null);
  const [ceiDiretTipo, setCeiDiretTipo] = useState<{
    nome: string;
    uuid: string;
  } | null>(null);

  useEffect(() => {
    const handleCarregaSeletor = async () => {
      const tiposUnidadesEscolares = await getTiposUnidadeEscolar();
      const formatTiposOpcoesUnidadesEscolares =
        tiposUnidadesEscolares.data.results.map((unidadeEscolar) => ({
          nome: unidadeEscolar.iniciais,
          uuid: unidadeEscolar.uuid,
        }));

      setTiposUnidadesEscolares(formatTiposOpcoesUnidadesEscolares);
      setEmefTipo(
        formatTiposOpcoesUnidadesEscolares.find((t) => t.nome === "EMEF") ||
          null
      );
      setEmeiTipo(
        formatTiposOpcoesUnidadesEscolares.find((t) => t.nome === "EMEI") ||
          null
      );
      setCeiDiretTipo(
        formatTiposOpcoesUnidadesEscolares.find(
          (t) => t.nome === "CEI DIRET"
        ) || null
      );
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
        tiposUnidadesEscolares || []
      ),
    [tiposUnidadesEscolares]
  );

  // Filtra as unidades já adicionadas
  const unidadesEducacionaisFiltradas = useMemo(() => {
    const uuidsJaAdicionados = unidadesParticipantes.map(
      (unidade) => unidade.unidadeEducacionalUuid
    );

    return unidadesEducacionaisOpts.filter(
      (unidade: any) => !uuidsJaAdicionados.includes(unidade.value)
    );
  }, [unidadesEducacionaisOpts, unidadesParticipantes]);

  const handleBuscarUnidadesEducacionais = async (
    dreUuid: string,
    tipoUnidadeUuid: string
  ) => {
    if (!dreUuid || !tipoUnidadeUuid) return;

    const response: ResponseGetEscolasTercTotalInterface =
      await getEscolasTercTotal({
        dre: dreUuid,
        tipo_unidade: tipoUnidadeUuid,
      });

    if (response.status === 200) {
      const formatOpcoesUnidades = response.data.map((escola) => ({
        value: escola.uuid,
        label: escola.nome,
      }));
      setUnidadesEducacionaisOpts(formatOpcoesUnidades);
    }
  };

  const handleBuscarTipoAlimentacaoInscritos = async (
    tipoUnidadeUuid: string,
    mostrarSeletorInfantil: boolean
  ) => {
    if (!tipoUnidadeUuid) return;

    // Se mostrar seletor infantil, busca EMEI para inscritos normais
    if (mostrarSeletorInfantil && emeiTipo?.uuid) {
      const responseEmei =
        await getVinculosTipoAlimentacaoPorTipoUnidadeEscolar(emeiTipo.uuid);

      if (responseEmei.results[0]?.tipos_alimentacao) {
        const opcoesEmei = responseEmei.results[0].tipos_alimentacao.map(
          (tipo: any) => ({
            value: tipo.uuid,
            label: tipo.nome,
          })
        );
        setTiposAlimentacaoInscritos(opcoesEmei);
      } else {
        setTiposAlimentacaoInscritos([]);
      }

      // Busca CEI DIRET para inscritos infantil
      if (ceiDiretTipo?.uuid) {
        const responseCeiDiret =
          await getVinculosTipoAlimentacaoPorTipoUnidadeEscolar(
            ceiDiretTipo.uuid
          );

        if (responseCeiDiret.results[0]?.tipos_alimentacao) {
          const opcoesCeiDiret =
            responseCeiDiret.results[0].tipos_alimentacao.map((tipo: any) => ({
              value: tipo.uuid,
              label: tipo.nome,
            }));
          setTiposAlimentacaoInscritosInfantil(opcoesCeiDiret);
        } else {
          setTiposAlimentacaoInscritosInfantil([]);
        }
      }
    } else {
      // Caso contrário, busca normalmente com o tipo de unidade selecionado
      const response = await getVinculosTipoAlimentacaoPorTipoUnidadeEscolar(
        tipoUnidadeUuid
      );

      if (response.results[0]?.tipos_alimentacao) {
        const opcoes = response.results[0].tipos_alimentacao.map(
          (tipo: any) => ({
            value: tipo.uuid,
            label: tipo.nome,
          })
        );
        setTiposAlimentacaoInscritos(opcoes);
      } else {
        setTiposAlimentacaoInscritos([]);
      }
      setTiposAlimentacaoInscritosInfantil([]);
    }
  };

  const handleBuscarTipoAlimentacaoColaboradores = async () => {
    if (!emefTipo?.uuid) return;

    const responseEmef = await getVinculosTipoAlimentacaoPorTipoUnidadeEscolar(
      emefTipo.uuid
    );

    const integralItem = responseEmef.results.find(
      (item: any) => item?.periodo_escolar?.nome?.toUpperCase() === "INTEGRAL"
    );

    if (!integralItem || !Array.isArray(integralItem.tipos_alimentacao)) {
      setTiposAlimentacaoColaboradores([]);
      return;
    }

    const opcoes = integralItem.tipos_alimentacao.map((tipo: any) => ({
      value: tipo.uuid,
      label: tipo.nome,
    }));

    setTiposAlimentacaoColaboradores(opcoes);
  };

  const handleAdicionarUnidade = (values: any) => {
    // Busca o lote selecionado
    const loteSelecionado = lotes.find(
      (lote) => lote.uuid === values.dres_lote
    );

    // Busca os nomes das alimentações selecionadas
    const alimentacoesInscritosNomes = tiposAlimentacaoInscritos
      .filter((tipo: any) =>
        values.tipos_alimentacao_inscritos?.includes(tipo.value)
      )
      .map((tipo: any) => tipo.label);

    const alimentacoesColaboradoresNomes = tiposAlimentacaoColaboradores
      .filter((tipo: any) =>
        values.tipos_alimentacao_colaboradores?.includes(tipo.value)
      )
      .map((tipo: any) => tipo.label);

    const alimentacoesInscritosInfantilNomes = tiposAlimentacaoInscritosInfantil
      .filter((tipo: any) =>
        values.tipos_alimentacao_inscritos_infantil?.includes(tipo.value)
      )
      .map((tipo: any) => tipo.label);

    // Para cada unidade educacional selecionada, cria um objeto
    const novasUnidades = values.unidades_educacionais.map(
      (unidadeUuid: string) => {
        const unidadeEducacional = unidadesEducacionaisOpts.find(
          (u: any) => u.value === unidadeUuid
        );

        return {
          id: `${Date.now()}-${Math.random()}`,
          dreLote: loteSelecionado?.nome || "",
          unidadeEducacional: unidadeEducacional?.label || "",
          unidadeEducacionalUuid: unidadeUuid,
          numeroInscritos: 0,
          numeroColaboradores: 0,
          liberarMedicao: true,
          alimentacaoInscritos: alimentacoesInscritosNomes,
          alimentacaoColaboradores: alimentacoesColaboradoresNomes,
          alimentacaoInscritosInfantil: alimentacoesInscritosInfantilNomes,
        };
      }
    );

    setUnidadesParticipantes((prev) => [...prev, ...novasUnidades]);
    closeModal();
  };

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
          render={({
            handleSubmit,
            values,
            form,
            submitting: formSubmitting,
          }) => {
            const hasDreLote = Boolean(values?.dres_lote);
            const hasTipoUnidade = Boolean(values?.tipos_unidades);

            const enableSeletores = hasDreLote && hasTipoUnidade;

            const addDisabled = submitting || formSubmitting;

            // Verifica se o tipo de unidade selecionado é CEMEI ou CEU CEMEI
            const tipoUnidadeSelecionado = tiposUnidadesEscolares.find(
              (tipo: any) => tipo.uuid === values?.tipos_unidades
            );
            const mostrarSeletorInfantil =
              tipoUnidadeSelecionado?.nome === "CEMEI" ||
              tipoUnidadeSelecionado?.nome === "CEU CEMEI";

            useEffect(() => {
              if (hasDreLote && hasTipoUnidade) {
                const loteSelecionado = lotes.find(
                  (lote) => lote.uuid === values.dres_lote
                );
                const dreUuid = loteSelecionado?.dreUuid;

                if (dreUuid) {
                  handleBuscarUnidadesEducacionais(
                    dreUuid,
                    values.tipos_unidades
                  );
                  handleBuscarTipoAlimentacaoInscritos(
                    values.tipos_unidades,
                    mostrarSeletorInfantil
                  );
                  handleBuscarTipoAlimentacaoColaboradores();
                }
              } else {
                setUnidadesEducacionaisOpts([]);
              }
            }, [values?.dres_lote, values?.tipos_unidades]);

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
                    options={unidadesEducacionaisFiltradas}
                    selected={values?.unidades_educacionais || []}
                    required
                    validate={required}
                    disabled={!enableSeletores}
                    onSelectedChanged={(values_) => {
                      form.change(
                        "unidades_educacionais",
                        values_.map((v) => v.value)
                      );
                    }}
                  />
                </div>

                <div className="row">
                  <div className="w-50">
                    <Field
                      component={MultiselectRaw}
                      label="Tipos de Alimentações para Inscritos"
                      name="tipos_alimentacao_inscritos"
                      options={tiposAlimentacaoInscritos}
                      selected={values?.tipos_alimentacao_inscritos || []}
                      required
                      validate={required}
                      disabled={!enableSeletores}
                      onSelectedChanged={(values_) => {
                        form.change(
                          "tipos_alimentacao_inscritos",
                          values_.map((v) => v.value)
                        );
                      }}
                    />
                  </div>

                  <div className="w-50">
                    <Field
                      component={MultiselectRaw}
                      label="Tipos de Alimentações para Colaboradores"
                      name="tipos_alimentacao_colaboradores"
                      options={tiposAlimentacaoColaboradores}
                      selected={values?.tipos_alimentacao_colaboradores || []}
                      disabled={!enableSeletores}
                      onSelectedChanged={(values_) => {
                        form.change(
                          "tipos_alimentacao_colaboradores",
                          values_.map((v) => v.value)
                        );
                      }}
                    />
                  </div>

                  {mostrarSeletorInfantil && (
                    <div className="w-50">
                      <Field
                        component={MultiselectRaw}
                        label="Tipos de Alimentações para Inscritos - INFANTIL"
                        name="tipos_alimentacao_inscritos_infantil"
                        options={tiposAlimentacaoInscritosInfantil}
                        selected={
                          values?.tipos_alimentacao_inscritos_infantil || []
                        }
                        required
                        validate={required}
                        disabled={!enableSeletores}
                        onSelectedChanged={(values_) => {
                          form.change(
                            "tipos_alimentacao_inscritos_infantil",
                            values_.map((v) => v.value)
                          );
                        }}
                      />
                    </div>
                  )}
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
                    type={BUTTON_TYPE.BUTTON}
                    disabled={addDisabled}
                    onClick={() => handleAdicionarUnidade(values)}
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
