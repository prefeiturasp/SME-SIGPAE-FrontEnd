import { Spin, Switch, Tooltip } from "antd";
import moment from "moment";
import React, { useState } from "react";
import { Collapse } from "react-collapse";
import { Field, Form } from "react-final-form";
import Botao from "src/components/Shareable/Botao";
import {
  BUTTON_STYLE,
  BUTTON_TYPE,
} from "src/components/Shareable/Botao/constants";
import { InputComData } from "src/components/Shareable/DatePicker";
import InputText from "src/components/Shareable/Input/InputText";
import { Paginacao } from "src/components/Shareable/Paginacao";
import { ToggleExpandir } from "src/components/Shareable/ToggleExpandir";
import { required } from "src/helpers/fieldValidators";
import { ModalAdicionarUnidadeEducacional } from "./components/ModalAdicionarUnidadeEducacional";
import "./style.scss";

export const RecreioFerias = () => {
  const [showModal, setShowModal] = useState<boolean>(false);
  const [expandidos, setExpandidos] = useState<Record<string, boolean>>({});
  const [unidadesParticipantes, setUnidadesParticipantes] = useState([
    {
      id: "1",
      dreLote: "LOTE 01 - BUTANTA",
      unidadeEducacional: "CEI DIRET ALOYSIO DE MENEZES",
      numeroInscritos: 0,
      numeroColaboradores: 0,
      liberarMedicao: true,
      alimentacaoInscritos: ["Almoço", "Desjejum"],
      alimentacaoColaboradores: ["Lanche", "Refeição"],
    },
    {
      id: "2",
      dreLote: "LOTE 01 - BUTANTA",
      unidadeEducacional: "CEI DIRET ANTONIO JOAO",
      numeroInscritos: 0,
      numeroColaboradores: 0,
      liberarMedicao: false,
      alimentacaoInscritos: ["Janta", "Almoço"],
      alimentacaoColaboradores: ["Sobremesa"],
    },
  ]);

  const handleRemoverUnidade = (id: string) => {
    setUnidadesParticipantes((prev) => prev.filter((u) => u.id !== id));
  };

  const toggleExpandir = (id: string) => {
    setExpandidos((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <div className="card recreio-nas-ferias-container">
      <div className="card-body">
        <div className="row mt-3 mb-3">
          <div className="col-6">
            <div className="title">Informe o Período do Recreio nas Férias</div>
          </div>
        </div>

        <Form
          keepDirtyOnReinitialize
          onSubmit={() => {}}
          render={({ handleSubmit, values }) => (
            <form onSubmit={handleSubmit}>
              <div className="row">
                <div className="">
                  <Field
                    component={InputText}
                    label="Título"
                    name="titulo_cadastro"
                    placeholder="Título para o cadastro (ex. Recreio nas Férias - JAN 2026)"
                    required
                    validate={required}
                    max={50}
                  />
                </div>
              </div>

              <div className="row mt-2">
                <div className="col-2">
                  <Field
                    component={InputComData}
                    label="Período de Realização"
                    name="periodo_realizacao_de"
                    placeholder="De"
                    writable={false}
                    minDate={null}
                    maxDate={moment(
                      values.periodo_realizacao_ate,
                      "DD/MM/YYYY"
                    )}
                    required
                    validate={required}
                  />
                </div>
                <div className="col-2">
                  <Field
                    component={InputComData}
                    label="&nbsp;"
                    name="periodo_realizacao_ate"
                    placeholder="Até"
                    writable={false}
                    minDate={moment(values.periodo_realizacao_de, "DD/MM/YYYY")}
                    maxDate={null}
                  />
                </div>

                <div className="space-between mb-2 mt-4">
                  <span className="title">
                    Unidades Participantes: {unidadesParticipantes.length}
                  </span>
                  <Botao
                    className="text-end"
                    texto="+ Adicionar Unidades"
                    // disabled={submitting}
                    type={BUTTON_TYPE.BUTTON}
                    style={BUTTON_STYLE.GREEN_OUTLINE}
                    onClick={() => setShowModal(true)}
                  />
                </div>
              </div>

              <Spin tip="Carregando..." spinning={false}>
                <>
                  <table className="tabela-unidades-participantes">
                    <thead>
                      <tr className="row">
                        <th className="col-2 text-center">DRE/LOTE</th>

                        <th className="col-2 text-center">
                          Unidade Educacional
                        </th>
                        <th className="col-2 text-center">Nº de Inscritos</th>
                        <th className="col-2 text-center">
                          Nº de Colaboradores
                        </th>
                        <th className="col-2 text-center">Liberar Medição?</th>
                        <th className="action-column col-1 text-center"></th>
                        <th className="action-column col-1 text-center"></th>
                      </tr>
                    </thead>
                    <tbody>
                      {unidadesParticipantes.map((participante) => {
                        const aberto = !!expandidos[participante.id];

                        return (
                          <React.Fragment
                            key={`${participante.unidadeEducacional}-${participante.id}`}
                          >
                            <tr className="row">
                              <td className="col-2">{participante.dreLote}</td>
                              <td className="col-2">
                                {participante.unidadeEducacional}
                              </td>
                              <td className="col-2">
                                <Field
                                  component={InputText}
                                  name={`numero_inscritos_${participante.id}`}
                                  required
                                  validate={required}
                                  initialValue={participante.numeroInscritos}
                                />
                              </td>
                              <td className="col-2">
                                <Field
                                  component={InputText}
                                  name={`numero_colaboradores_${participante.id}`}
                                  required
                                  validate={required}
                                  initialValue={
                                    participante.numeroColaboradores
                                  }
                                />
                              </td>
                              <td className="col-2">
                                {participante.liberarMedicao}
                                <label
                                  className={`col-form-label ${
                                    !participante.liberarMedicao && "green"
                                  }`}
                                >
                                  Não
                                </label>
                                <Switch
                                  size="small"
                                  className="mx-2"
                                  // onChange={onChangeSwitchImr}
                                  // checked={switchAtivoImr}
                                />
                                <label
                                  className={`col-form-label ${
                                    participante.liberarMedicao && "green"
                                  }`}
                                >
                                  Sim
                                </label>
                              </td>
                              <td className="action-column col-1">
                                <Tooltip title="Remover Unidade">
                                  <button
                                    type="button"
                                    className="excluir-botao verde"
                                    onClick={() =>
                                      handleRemoverUnidade(participante.id)
                                    }
                                  >
                                    <i className="fas fa-trash" />
                                  </button>
                                </Tooltip>
                              </td>
                              <td className="action-column col-1">
                                <ToggleExpandir
                                  ativo={aberto}
                                  onClick={() =>
                                    toggleExpandir(participante.id)
                                  }
                                  dataTestId={`toggle-${participante.id}`}
                                />
                              </td>
                            </tr>
                            <Collapse isOpened={aberto}>
                              <div className="collapse-container">
                                <div>
                                  <strong>
                                    Tipos de Alimentação Inscritos:{" "}
                                  </strong>
                                  <span>
                                    {participante.alimentacaoInscritos?.join(
                                      ", "
                                    )}
                                  </span>
                                </div>

                                <div>
                                  <strong>
                                    Tipos de Alimentação Colaboradores:{" "}
                                  </strong>
                                  <span>
                                    {participante.alimentacaoColaboradores?.join(
                                      ", "
                                    )}
                                  </span>
                                </div>
                              </div>
                            </Collapse>
                          </React.Fragment>
                        );
                      })}
                    </tbody>
                  </table>
                  {unidadesParticipantes.length > 10 && (
                    <Paginacao
                      onChange={() =>
                        // onPageChanged(page, {
                        //   status: statusSelecionado,
                        //   ...values,
                        // })
                        {}
                      }
                      total={0}
                      pageSize={1}
                      current={1}
                    />
                  )}
                </>
              </Spin>

              <div className="row mt-4">
                <div className="col-12 text-end">
                  <Botao
                    texto="Salvar Recreio nas Férias"
                    // disabled={submitting}
                    type={BUTTON_TYPE.SUBMIT}
                    style={BUTTON_STYLE.GREEN}
                  />
                </div>
              </div>

              <ModalAdicionarUnidadeEducacional
                showModal={showModal}
                closeModal={() => setShowModal(false)}
                submitting={false}
                setUnidadesParticipantes={setUnidadesParticipantes}
              />
            </form>
          )}
        />
      </div>
    </div>
  );
};
