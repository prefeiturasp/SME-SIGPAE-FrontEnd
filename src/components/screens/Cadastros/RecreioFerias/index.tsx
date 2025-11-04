import { Spin } from "antd";
import moment from "moment";
import { useState } from "react";
import { Field, Form } from "react-final-form";
import Botao from "src/components/Shareable/Botao";
import {
  BUTTON_STYLE,
  BUTTON_TYPE,
} from "src/components/Shareable/Botao/constants";
import { InputComData } from "src/components/Shareable/DatePicker";
import InputText from "src/components/Shareable/Input/InputText";
import { Paginacao } from "src/components/Shareable/Paginacao";
import { required } from "src/helpers/fieldValidators";
import { ModalAdicionarUnidadeEducacional } from "./components/ModalAdicionarUnidadeEducacional";
import "./style.scss";

export const RecreioFerias = () => {
  const [showModal, setShowModal] = useState<boolean>(false);

  return (
    <div className="card recreio-nas-ferias-container">
      <div className="card-body">
        <div className="row mt-3 mb-3">
          <div className="col-6">
            <div className="title">Informe o Período do Recreio nas Férias</div>
          </div>
          <div className="col-6 text-end">
            <Botao
              texto="Recreios Cadastrados"
              onClick={() => {}}
              type={BUTTON_TYPE.BUTTON}
              style={BUTTON_STYLE.GREEN_OUTLINE}
            />
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
                  <span className="title">Unidades Participantes: 0</span>
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
                        <th className="col-1 text-center"></th>
                        <th className="col-1 text-center"></th>
                      </tr>
                    </thead>
                    <tbody></tbody>
                  </table>
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
                </>
              </Spin>

              <div className="row">
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
              />
            </form>
          )}
        />
      </div>
    </div>
  );
};
