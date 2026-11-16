import { PERFIL } from "src/constants/shared";
import {
  PAINEL_ASSINATURA_TERMOS_RECEBIMENTO,
  PENDENTES_ASSINATURA_TERMOS,
  ASSINADOS_TERMOS,
} from "src/configs/constants";

describe("Permissões das rotas do Painel de Assinaturas", () => {
  const getRotas = () => {
    let rotas;
    jest.isolateModules(() => {
      rotas = require("src/configs/rotas/posRecebimento").rotasPosRecebimento;
    });
    return rotas;
  };

  const rotaPorPath = (sufixo: string) =>
    getRotas().find((r: { path: string }) => r.path.endsWith(sufixo));

  const rotaPainel = () =>
    rotaPorPath(`/${PAINEL_ASSINATURA_TERMOS_RECEBIMENTO}`);
  const rotaPendentes = () => rotaPorPath(`/${PENDENTES_ASSINATURA_TERMOS}/`);
  const rotaAssinados = () => rotaPorPath(`/${ASSINADOS_TERMOS}/`);

  const rotasDoPainel = () => [rotaPainel(), rotaPendentes(), rotaAssinados()];

  const perfisComAcesso = [
    { nome: "DILOG_QUALIDADE", perfil: PERFIL.DILOG_QUALIDADE },
  ];

  const perfisDilogSemAcesso = [
    { nome: "DILOG_DIRETORIA", perfil: PERFIL.DILOG_DIRETORIA },
    { nome: "DILOG_CRONOGRAMA", perfil: PERFIL.DILOG_CRONOGRAMA },
    {
      nome: "COORDENADOR_CODAE_DILOG_LOGISTICA",
      perfil: PERFIL.COORDENADOR_CODAE_DILOG_LOGISTICA,
    },
  ];

  const perfisFornecedor = [
    { nome: "ADMINISTRADOR_EMPRESA", perfil: PERFIL.ADMINISTRADOR_EMPRESA },
    { nome: "USUARIO_EMPRESA", perfil: PERFIL.USUARIO_EMPRESA },
  ];

  afterEach(() => {
    localStorage.clear();
  });

  it.each(perfisComAcesso)(
    "libera Painel, Pendentes e Assinados para $nome",
    ({ perfil }) => {
      localStorage.setItem("perfil", perfil);
      rotasDoPainel().forEach((rota) => expect(rota.tipoUsuario).toBe(true));
    },
  );

  it.each(perfisDilogSemAcesso)(
    "bloqueia Painel, Pendentes e Assinados para $nome",
    ({ perfil }) => {
      localStorage.setItem("perfil", perfil);
      rotasDoPainel().forEach((rota) => expect(rota.tipoUsuario).toBe(false));
    },
  );

  it.each(perfisFornecedor)(
    "bloqueia Painel, Pendentes e Assinados para $nome",
    ({ perfil }) => {
      localStorage.setItem("perfil", perfil);
      rotasDoPainel().forEach((rota) => expect(rota.tipoUsuario).toBe(false));
    },
  );
});
