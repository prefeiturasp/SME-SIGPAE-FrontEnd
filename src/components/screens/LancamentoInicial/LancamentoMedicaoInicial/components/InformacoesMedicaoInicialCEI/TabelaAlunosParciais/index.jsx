import React, { useMemo, useState } from "react";
import { Input, Skeleton, AutoComplete, Table, Tooltip } from "antd";
import { SearchOutlined } from "@ant-design/icons";
import Botao from "src/components/Shareable/Botao";
import {
  BUTTON_ICON,
  BUTTON_STYLE,
} from "src/components/Shareable/Botao/constants";
import "./styles.scss";
import { ModalAlunoParcial } from "../ModalAlunoParcial";

export default ({
  setIsModalDuplicata,
  alunos,
  loading,
  alunosAdicionados,
  setAlunosAdicionados,
  emEdicao,
  mes,
  ano,
  setAlunosParcialAlterado,
}) => {
  const [valorSelecionado, setValorSelecionado] = useState(null);
  const [registroCodigoEol, setRegistroCodigoEol] = useState(false);
  const [erro, setErro] = useState(null);
  const [showModalAlunoParcial, setShowModalAlunoParcial] = useState(false);
  const [dataAdicionado, setDataAdicionado] = useState("");
  const [adicionarOuExcluir, setAdicionarOuExcluir] = useState("");

  const alunosOptions = useMemo(
    () =>
      alunos
        ?.sort((a, b) => a.nome.localeCompare(b.nome))
        .map((aluno) => ({
          value: `${aluno.codigo_eol} - ${aluno.nome}`,
        })) || [],
    [alunos]
  );
  const filterAlunos = (inputValue, option) =>
    option.value.toUpperCase().indexOf(inputValue.toUpperCase()) !== -1;

  const adicionarAluno = (aluno, dataAlunoParcial) => {
    const alunoExiste =
      alunosAdicionados.filter((a) => a.codigo_eol === aluno.codigo_eol)
        .length > 0;

    if (alunoExiste) {
      setIsModalDuplicata(true);
    } else {
      aluno["data"] = dataAlunoParcial;
      setAlunosAdicionados((prev) => [...prev, aluno]);
    }
    setValorSelecionado("");
  };

  const excluirAluno = (aluno, dataAlunoParcial) => {
    aluno["data_removido"] = dataAlunoParcial;
    setAlunosAdicionados(alunosAdicionados);
  };

  const TabelaAlunos = ({ alunos }) => {
    const colunas = [
      {
        title: "Alunos em Período Parcial",
        dataIndex: "nome",
        key: "nome",
      },
      {
        title: "Adicionado em:",
        dataIndex: "data_adicao",
        key: "data_adicao",
        width: 150,
        align: "center",
      },
      {
        title: "Removido em:",
        dataIndex: "data_removido",
        key: "data_removido",
        width: 150,
        align: "center",
      },
      {
        title: "Excluir",
        key: "acoes",
        width: 100,
        align: "center",
        render: (texto, registro) =>
          !registro.data_removido && (
            <Tooltip title="Excluir aluno">
              <>
                <Botao
                  onClick={() => {
                    setShowModalAlunoParcial(true);
                    setAdicionarOuExcluir("Excluir");
                    setRegistroCodigoEol(registro.key);
                    setDataAdicionado(registro.data_adicao);
                  }}
                  className="botao-excluir-tabela-parcial"
                  icon={BUTTON_ICON.TRASH}
                  disabled={!emEdicao}
                />
              </>
            </Tooltip>
          ),
      },
    ];

    const dataSource = alunos.map((alunoAdicionado) => ({
      key: alunoAdicionado.codigo_eol,
      nome: `${alunoAdicionado.codigo_eol} - ${alunoAdicionado.nome}`,
      data_adicao: `${alunoAdicionado.data}`,
      data_removido:
        alunoAdicionado.data_removido && `${alunoAdicionado.data_removido}`,
    }));

    const contador = `Total: ${dataSource.length.toString().padStart(2, "0")}`;

    return (
      <div
        className={`tabela-alunos-parciais ${
          !emEdicao ? "table-disabled" : ""
        }`}
      >
        <Table
          dataSource={dataSource}
          columns={colunas}
          pagination={false}
          footer={() => contador}
          locale={{ emptyText: () => null }}
        />
      </div>
    );
  };

  const onClickAdicionarAlunoParcial = () => {
    const alunoSelecionado = alunos.find(
      (aluno) => `${aluno.codigo_eol} - ${aluno.nome}` === valorSelecionado
    );
    if (alunoSelecionado) {
      setErro(null);
      setShowModalAlunoParcial(true);
      setAdicionarOuExcluir("Adicionar");
    } else {
      setErro("Selecione uma opção válida");
    }
  };

  const onSubmitModalAlunoParcial = (dataAlunoParcial) => {
    if (adicionarOuExcluir === "Adicionar") {
      const alunoSelecionado = alunos.find(
        (aluno) => `${aluno.codigo_eol} - ${aluno.nome}` === valorSelecionado
      );
      alunoSelecionado && adicionarAluno(alunoSelecionado, dataAlunoParcial);
    } else {
      const alunoAddSelecionado = alunosAdicionados.find(
        (alunoAdicionado) => alunoAdicionado.codigo_eol === registroCodigoEol
      );
      alunoAddSelecionado &&
        excluirAluno(alunoAddSelecionado, dataAlunoParcial);
    }
  };

  return loading ? (
    <Skeleton paragraph={false} active />
  ) : (
    <div className="row">
      <div className="msg-alunos-parciais">
        <div className="icon-exclamation-alunos-parciais">
          <div className="fas fa-exclamation" />
        </div>
        <div>
          Ao adicionar ou remover alunos os lançamentos já realizados no mês
          atual dos períodos INTEGRAL e PARCIAL serão perdidos. Será necessário
          realizar novamente os lançamentos do mês atual, conforme
          adição/remoção dos alunos no período parcial.
        </div>
      </div>
      <div className="col-6 info-label">
        <label className="asterisk-label">*</label>
        <label className="value-label mt-3 mb-2 me-3">
          Pesquise o Código EOL ou o Nome do Aluno
        </label>
        <div
          className="input-icon-right"
          style={{ display: "flex", alignItems: "center" }}
        >
          <AutoComplete
            className={erro ? "input-error" : ""}
            options={alunosOptions.map((option) => ({
              value: option.value,
            }))}
            value={valorSelecionado}
            style={{ width: 400 }}
            filterOption={filterAlunos}
            onChange={(value) => {
              if (valorSelecionado !== value) {
                setValorSelecionado(value);
              }
            }}
            disabled={!emEdicao}
          >
            <Input
              placeholder="Digite o código EOL ou nome"
              suffix={
                <SearchOutlined
                  style={{
                    cursor: "pointer",
                    transform: "rotateX(180deg)",
                  }}
                />
              }
              status={erro ? "error" : ""}
            />
          </AutoComplete>
          <Botao
            texto="Adicionar"
            style={BUTTON_STYLE.GREEN}
            className="ms-2"
            onClick={() => onClickAdicionarAlunoParcial()}
            disabled={!emEdicao}
          />
        </div>
        {erro && <span style={{ color: "red" }}>{erro}</span>}
      </div>
      <TabelaAlunos alunos={alunosAdicionados} />
      <ModalAlunoParcial
        closeModal={() => setShowModalAlunoParcial(false)}
        showModal={showModalAlunoParcial}
        onSubmit={(dataAlunoParcial) =>
          onSubmitModalAlunoParcial(dataAlunoParcial)
        }
        mes={mes}
        ano={ano}
        setAlunosParcialAlterado={setAlunosParcialAlterado}
        adicionarOuExcluir={adicionarOuExcluir}
        dataAdicionado={dataAdicionado}
      />
    </div>
  );
};
