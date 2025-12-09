import React, { useContext, useState } from "react";
import { ENVIRONMENT } from "src/constants/config";
import { Header } from "../Header";
import { Sidebar } from "../Sidebar";
import BotaoVoltar from "./BotaoVoltar";
import { getMeusDados } from "../../../services/perfil.service";
import "./style.scss";
import {
  usuarioEhLogistica,
  usuarioEhEmpresaDistribuidora,
  usuarioEhEscola,
} from "src/helpers/utilities";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { MeusDadosContext } from "src/context/MeusDadosContext";
import ModalVoltar from "./ModalVoltar";
import ModalCestasBasicas from "../ModalCestasBasicas";
import ModalTermosDeUso from "../ModalTermosDeUso";

export const Page = ({ ...props }) => {
  const navigate = useNavigate();

  const {
    children,
    titulo,
    botaoVoltar,
    voltarPara,
    temModalVoltar,
    textoModalVoltar,
    pegaAtualmente = false,
  } = props;

  const [nome, setNome] = useState(null);
  const [nomeEscolaOuTerceirizada, setNomeEscolaOuTerceirizada] =
    useState(null);
  const [toggled, setToggled] = useState(false);
  const [modalVoltar, setModalVoltar] = useState(false);
  const [modalTermosDeUso, setModalTermosDeUso] = useState(false);

  const { meusDados, setMeusDados } = useContext(MeusDadosContext);

  useEffect(() => {
    if (!localStorage.getItem("meusDados")) {
      const params = pegaAtualmente ? { pega_atualmente: true } : {};
      getMeusDados(params).then((response) => {
        const meusDados = response.data;
        setMeusDados(meusDados);
        localStorage.setItem("nome", JSON.stringify(meusDados.nome));
        if (meusDados.tipo_usuario === "dieta_especial") {
          localStorage.setItem(
            "crn_numero",
            JSON.stringify(meusDados.crn_numero),
          );
          localStorage.setItem(
            "registro_funcional",
            JSON.stringify(meusDados.registro_funcional),
          );
        }
        if (
          ["escola", "terceirizada"].includes(meusDados.tipo_usuario) &&
          meusDados.vinculo_atual &&
          meusDados.vinculo_atual.instituicao
        ) {
          setNomeEscolaOuTerceirizada(meusDados.vinculo_atual.instituicao.nome);
        }
        setNome(meusDados.nome);

        setModalTermosDeUso(!meusDados.aceitou_termos);
      });
    } else {
      setNome(localStorage.getItem("nome"));
    }
  }, [pegaAtualmente]);

  const handleBack = () => {
    if (temModalVoltar) {
      setModalVoltar(true);
    } else {
      voltarPara ? navigate(voltarPara) : navigate(-1);
    }
  };

  const mostrarModalCestaBasica = () => {
    let dataInicial = new Date("2025-11-03T00:00:00");
    let dataFinal = new Date("2025-12-06T00:00:00");
    let now = new Date();

    if (!ENVIRONMENT.includes("production")) {
      return false;
    } else if (!usuarioEhEscola()) {
      return false;
    } else if (dataInicial.getTime() > now.getTime()) {
      return false;
    } else if (dataFinal.getTime() < now.getTime()) {
      return false;
    } else return true;
  };

  return (
    <div id="wrapper">
      <Header toggled={toggled} />

      <Sidebar
        nome={nome}
        nomeEscolaOuTerceirizada={nomeEscolaOuTerceirizada}
        toggle={() => setToggled(!toggled)}
        toggled={toggled}
      />

      {mostrarModalCestaBasica() && <ModalCestasBasicas />}
      {modalTermosDeUso && (
        <ModalTermosDeUso
          nomeUsuario={meusDados.nome}
          uuidUsuario={meusDados.uuid}
        />
      )}

      <div id="content-wrapper" className="pt-5">
        <div
          className={`content-wrapper-div ${
            toggled && "toggled"
          } d-flex flex-column p-4 mt-2`}
        >
          {children.length ? children[0] : children}
          <h1 className="page-title">
            <span className="texto-titulo">{titulo}</span>
            {botaoVoltar && <BotaoVoltar onClick={handleBack} />}
          </h1>
          {(usuarioEhEmpresaDistribuidora() || usuarioEhLogistica()) &&
            window.location.pathname === "/" && (
              <img
                className="marca-dagua"
                src="/assets/image/marca-dagua-sigpae.svg"
                alt=""
              />
            )}
          {children.map((child, key) => {
            return <div key={key}>{key > 0 && child}</div>;
          })}
        </div>
      </div>

      <ModalVoltar
        modalVoltar={modalVoltar}
        voltarPara={voltarPara}
        setModalVoltar={setModalVoltar}
        textoModalVoltar={textoModalVoltar}
      />
    </div>
  );
};

export default Page;
