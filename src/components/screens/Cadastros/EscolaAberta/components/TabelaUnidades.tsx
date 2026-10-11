import { Spin } from "antd";
import { Paginacao } from "src/components/Shareable/Paginacao";
import "../styles.scss";
import { LinhaUnidade } from "./LinhaUnidade";
import { ModalRemoverUnidadeEducacional } from "./ModalRemoverUnidadeEducacional";

const defaultPageSize = 10;

export const TabelaUnidades = ({
  editable = true,
  fields,
  form,
  participantes = [],
  loading = false,
  page = 1,
  setPage = () => {},
  pageSize = defaultPageSize,
  toggleExpandir = () => {},
  openRemoverModal = () => {},
  showModalRemover = false,
  closeRemoverModal = () => {},
  confirmRemover = () => {},
}) => {
  const list = editable ? fields?.value || [] : participantes || [];
  const total = list.length;
  const currentPage = Math.min(
    Math.max(1, page),
    Math.ceil(total / pageSize) || 1,
  );
  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = startIndex + pageSize;

  return (
    <Spin spinning={loading} tip="Carregando...">
      <table className="tabela-unidades-participantes">
        <thead>
          <tr className={editable ? "row" : ""}>
            <th className={`${editable ? "col-1" : "dre-lote"} text-center`}>
              DRE/LOTE
            </th>
            <th
              className={`${
                editable ? "col-4" : "unidade-educacional"
              } text-center`}
            >
              Unidade Educacional
            </th>
            <th
              className={`${editable ? "col-2" : "num-inscritos"} text-center`}
            >
              <span className="required-asterisk">*</span> Nº de Participantes
            </th>
            <th
              className={`${
                editable ? "col-4" : "num-colaboradores"
              } text-center`}
            >
              Tipos de Alimentações
            </th>
            <th
              className={`${editable ? "col-1" : ""} action-column text-center`}
            ></th>
            {/* {editable && <th className="action-column col-1 text-center"></th>} */}
          </tr>
        </thead>

        <tbody>
          {list.map((item, index) => {
            if (index < startIndex || index >= endIndex) return null;

            if (editable) {
              const name = fields?.name
                ? `${fields.name}[${index}]`
                : `unidades_participantes[${index}]`;
              const participante = fields.value[index];

              return (
                <LinhaUnidade
                  key={participante?.id}
                  name={name}
                  index={index}
                  participante={participante}
                  toggleExpandir={toggleExpandir}
                  openRemoverModal={openRemoverModal}
                  fields={fields}
                  readOnly={false}
                  form={form}
                />
              );
            } else {
              const participante = item;
              return (
                <LinhaUnidade
                  key={participante?.id || index}
                  participante={participante}
                  index={index}
                  readOnly={true}
                />
              );
            }
          })}
        </tbody>
      </table>

      <Paginacao
        className="mt-3 mb-3"
        current={page}
        total={total}
        showSizeChanger={false}
        onChange={setPage}
        pageSize={pageSize}
      />

      {/* Modal de remoção só faz sentido no modo editável */}
      {editable && (
        <ModalRemoverUnidadeEducacional
          showModal={showModalRemover}
          closeModal={closeRemoverModal}
          handleRemoverUnidade={confirmRemover}
        />
      )}
    </Spin>
  );
};
