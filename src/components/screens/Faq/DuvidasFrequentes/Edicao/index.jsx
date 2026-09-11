import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { SigpaeLogoLoader } from "src/components/Shareable/SigpaeLogoLoader";
import {
  toastError,
  toastSuccess,
} from "src/components/Shareable/Toast/dialogs";
import { getError } from "src/helpers/utilities";
import {
  atualizarPerguntaFrequente,
  buscarPerguntaFrequente,
} from "src/services/faq.service";
import FormularioDuvidaFrequente from "../components/FormularioDuvidaFrequente";
import { useOpcoesCadastroDuvida } from "../hooks/useOpcoesCadastroDuvida";

const clonarValores = (valores) => ({
  ...valores,
  categoria: valores.categoria ? { ...valores.categoria } : null,
  perfisAcesso: [...valores.perfisAcesso],
});

const valoresSaoIguais = (valores, valoresOriginais) =>
  valores.categoria?.uuid === valoresOriginais.categoria?.uuid &&
  valores.buscaCategoria === valoresOriginais.buscaCategoria &&
  valores.titulo === valoresOriginais.titulo &&
  valores.descricaoDetalhada === valoresOriginais.descricaoDetalhada &&
  [...valores.perfisAcesso].sort((a, b) => a.localeCompare(b)).join("|") ===
    [...valoresOriginais.perfisAcesso]
      .sort((a, b) => a.localeCompare(b))
      .join("|");

const EdicaoDuvidasFrequentes = () => {
  const { uuid } = useParams();
  const [valores, setValores] = useState(null);
  const [valoresOriginais, setValoresOriginais] = useState(null);
  const [dadosDuvida, setDadosDuvida] = useState(null);
  const [carregandoDuvida, setCarregandoDuvida] = useState(true);
  const [falhaCarregamento, setFalhaCarregamento] = useState(false);
  const [salvando, setSalvando] = useState(false);

  const {
    categorias,
    carregandoCategorias,
    opcoesPerfisAcesso,
    carregandoPerfis,
  } = useOpcoesCadastroDuvida();

  const formularioValido =
    valores?.categoria &&
    valores.perfisAcesso.length > 0 &&
    valores.titulo.trim() &&
    valores.descricaoDetalhada.trim();

  const formularioAlterado =
    valores && valoresOriginais && !valoresSaoIguais(valores, valoresOriginais);

  const alterarValor = (campo, valor) => {
    setValores((valoresAtuais) => ({
      ...valoresAtuais,
      [campo]: valor,
    }));
  };

  const alterarBuscaCategoria = (buscaCategoria) => {
    setValores((valoresAtuais) => ({
      ...valoresAtuais,
      categoria: null,
      buscaCategoria,
      perfisAcesso: [],
    }));
  };

  const selecionarCategoria = (_, opcao) => {
    setValores((valoresAtuais) => ({
      ...valoresAtuais,
      categoria: { uuid: opcao.uuid, nome: opcao.label },
      buscaCategoria: opcao.label,
    }));
  };

  const cancelarEdicao = () => {
    setValores(clonarValores(valoresOriginais));
  };

  const salvarAlteracoes = async (evento) => {
    evento.preventDefault();

    if (!formularioValido || !formularioAlterado || salvando) return;

    const todosOsPerfis =
      valores.perfisAcesso.length === opcoesPerfisAcesso.length;
    const dados = {
      categoria: valores.categoria.uuid,
      perfis: todosOsPerfis ? [] : valores.perfisAcesso,
      todos_os_perfis: todosOsPerfis,
      pergunta: valores.titulo.trim(),
      resposta: valores.descricaoDetalhada.trim(),
    };

    setSalvando(true);

    try {
      await atualizarPerguntaFrequente(uuid, dados);

      const valoresAtualizados = {
        ...valores,
        titulo: dados.pergunta,
        descricaoDetalhada: dados.resposta,
      };

      setValores(clonarValores(valoresAtualizados));
      setValoresOriginais(clonarValores(valoresAtualizados));
      toastSuccess("Dúvida Frequente Atualizada com Sucesso!");
    } catch (erro) {
      const dadosErro = erro.response?.data;

      toastError(
        dadosErro
          ? getError(dadosErro)
          : "Não foi possível atualizar a dúvida frequente.",
      );
    } finally {
      setSalvando(false);
    }
  };

  useEffect(() => {
    const carregarDuvida = async () => {
      try {
        const resposta = await buscarPerguntaFrequente(uuid);
        setDadosDuvida(resposta.data);
      } catch {
        setFalhaCarregamento(true);
        toastError("Não foi possível carregar a dúvida frequente.");
      } finally {
        setCarregandoDuvida(false);
      }
    };

    carregarDuvida();
  }, [uuid]);

  useEffect(() => {
    if (
      !dadosDuvida ||
      valoresOriginais ||
      carregandoCategorias ||
      carregandoPerfis
    )
      return;

    const categoriaOriginal =
      typeof dadosDuvida.categoria === "string"
        ? categorias.find(
            (categoria) =>
              categoria.uuid === dadosDuvida.categoria ||
              categoria.nome === dadosDuvida.categoria,
          )
        : dadosDuvida.categoria;

    const perfisOriginais = dadosDuvida.todos_os_perfis
      ? opcoesPerfisAcesso.map((perfil) => perfil.value)
      : (dadosDuvida.perfis || [])
          .map((perfil) => {
            const identificador =
              typeof perfil === "string" ? perfil : perfil.uuid || perfil.nome;
            const opcao = opcoesPerfisAcesso.find(
              (item) =>
                item.value === identificador || item.label === identificador,
            );

            return opcao?.value;
          })
          .filter(Boolean);

    const valoresCarregados = {
      categoria: categoriaOriginal,
      buscaCategoria: categoriaOriginal?.nome || "",
      perfisAcesso: perfisOriginais,
      titulo: dadosDuvida.pergunta || "",
      descricaoDetalhada: dadosDuvida.resposta || "",
    };

    setValores(clonarValores(valoresCarregados));
    setValoresOriginais(clonarValores(valoresCarregados));
  }, [
    categorias,
    carregandoCategorias,
    carregandoPerfis,
    dadosDuvida,
    opcoesPerfisAcesso,
    valoresOriginais,
  ]);

  const carregandoFormulario =
    carregandoDuvida ||
    carregandoCategorias ||
    carregandoPerfis ||
    (!valores && !falhaCarregamento);

  if (carregandoFormulario) {
    return (
      <div className="carregamento-formulario-duvidas">
        <SigpaeLogoLoader />
      </div>
    );
  }

  if (falhaCarregamento) {
    return (
      <p className="erro-carregamento-duvida">
        Não foi possível carregar os dados da dúvida frequente.
      </p>
    );
  }

  return (
    <FormularioDuvidaFrequente
      categorias={categorias}
      carregandoCategorias={carregandoCategorias}
      carregandoPerfis={carregandoPerfis}
      desabilitarSalvar={!formularioValido || !formularioAlterado || salvando}
      onAlterarBuscaCategoria={alterarBuscaCategoria}
      onAlterarDescricao={(valor) => alterarValor("descricaoDetalhada", valor)}
      onAlterarPerfis={(perfis) => alterarValor("perfisAcesso", perfis)}
      onAlterarTitulo={(titulo) => alterarValor("titulo", titulo)}
      onCancelar={cancelarEdicao}
      onSalvar={salvarAlteracoes}
      onSelecionarCategoria={selecionarCategoria}
      opcoesPerfisAcesso={opcoesPerfisAcesso}
      textoBotaoSalvar="Salvar Alterações"
      valores={valores}
    />
  );
};

export default EdicaoDuvidasFrequentes;
