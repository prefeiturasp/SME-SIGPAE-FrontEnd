import React from "react";
import { Field } from "react-final-form";
import CollapseFiltros from "src/components/Shareable/CollapseFiltros";
import { InputText } from "src/components/Shareable/Input/InputText";
import SelectSelecione from "src/components/Shareable/SelectSelecione";
import { useOpcoesCadastroDuvida } from "src/components/screens/Faq/DuvidasFrequentes/hooks/useOpcoesCadastroDuvida";
import {
  FiltrosDuvidasFrequentesProps,
  OpcaoFiltro,
  ValoresFiltrosDuvidasFrequentes,
} from "./interfaces";
import "./style.scss";

const OPCAO_TODOS_OS_PERFIS: OpcaoFiltro = {
  nome: "Todos",
  uuid: "todos",
};

const Filtros = ({ aoFiltrar, aoLimpar }: FiltrosDuvidasFrequentesProps) => {
  const {
    categorias,
    carregandoCategorias,
    opcoesPerfisAcesso,
    carregandoPerfis,
  } = useOpcoesCadastroDuvida();

  const opcoesCategorias: OpcaoFiltro[] = categorias;
  const opcoesPerfis: OpcaoFiltro[] = [
    OPCAO_TODOS_OS_PERFIS,
    ...opcoesPerfisAcesso.map((perfil) => ({
      nome: perfil.label,
      uuid: perfil.value,
    })),
  ];

  const filtrar = (valores: ValoresFiltrosDuvidasFrequentes) => {
    aoFiltrar?.(valores);
  };

  const limpar = () => {
    aoLimpar?.();
  };

  return (
    <div className="filtros-duvidas-frequentes">
      <CollapseFiltros
        onSubmit={filtrar}
        onClear={limpar}
        desabilitarBotoes={carregandoCategorias || carregandoPerfis}
      >
        {() => (
          <div className="row campos-filtros-duvidas-frequentes">
            <div className="col-12 col-md-4">
              <Field
                component={InputText}
                label="Filtrar por Título"
                name="titulo"
                placeholder="Digite o Título"
              />
            </div>

            <div className="col-12 col-md-4">
              <Field
                component={SelectSelecione}
                label="Filtrar por Categoria"
                name="categoria"
                options={opcoesCategorias}
                placeholder="Selecione a Categoria"
                disabled={carregandoCategorias}
              />
            </div>

            <div className="col-12 col-md-4">
              <Field
                component={SelectSelecione}
                label="Filtrar por Perfis de Acesso"
                name="perfil"
                options={opcoesPerfis}
                placeholder="Selecione os perfis de acesso"
                disabled={carregandoPerfis}
              />
            </div>
          </div>
        )}
      </CollapseFiltros>
    </div>
  );
};

export default Filtros;
