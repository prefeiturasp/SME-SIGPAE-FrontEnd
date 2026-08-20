import { useEffect, useState } from "react";
import { toastError } from "src/components/Shareable/Toast/dialogs";
import { formatarParaMultiselect } from "src/helpers/utilities";
import { buscarOpcoesCategoriasFaq } from "src/services/faq.service";
import { getPerfilListagem } from "src/services/perfil.service";

export const useOpcoesCadastroDuvida = () => {
  const [categorias, setCategorias] = useState([]);
  const [carregandoCategorias, setCarregandoCategorias] = useState(true);
  const [opcoesPerfisAcesso, setOpcoesPerfisAcesso] = useState([]);
  const [carregandoPerfis, setCarregandoPerfis] = useState(true);

  useEffect(() => {
    let requisicaoAtiva = true;

    const carregarCategorias = async () => {
      try {
        const resposta = await buscarOpcoesCategoriasFaq();

        if (requisicaoAtiva) {
          setCategorias(resposta.data);
        }
      } catch {
        if (requisicaoAtiva) {
          toastError("Não foi possível carregar as categorias.");
        }
      } finally {
        if (requisicaoAtiva) {
          setCarregandoCategorias(false);
        }
      }
    };

    const carregarPerfis = async () => {
      try {
        const resposta = await getPerfilListagem();

        if (requisicaoAtiva) {
          let perfilAtivo = resposta.data.results.filter(
            (perfil) => perfil.ativo === true,
          );
          setOpcoesPerfisAcesso(formatarParaMultiselect(perfilAtivo));
        }
      } catch {
        if (requisicaoAtiva) {
          toastError("Não foi possível carregar os perfis de acesso.");
        }
      } finally {
        if (requisicaoAtiva) {
          setCarregandoPerfis(false);
        }
      }
    };

    carregarCategorias();
    carregarPerfis();

    return () => {
      requisicaoAtiva = false;
    };
  }, []);

  return {
    categorias,
    carregandoCategorias,
    opcoesPerfisAcesso,
    carregandoPerfis,
  };
};
