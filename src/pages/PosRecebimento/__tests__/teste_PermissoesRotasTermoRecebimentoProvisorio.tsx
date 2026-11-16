import { PERFIL } from "src/constants/shared";
import {
  TERMO_RECEBIMENTO_PROVISORIO,
  CADASTRO_TERMO_RECEBIMENTO_PROVISORIO,
  DETALHAR_TERMO_RECEBIMENTO_PROVISORIO,
} from "src/configs/constants";

describe("Permissões das rotas do Termo de Recebimento Provisório", () => {
  const getRotas = () => {
    let rotas;
    jest.isolateModules(() => {
      rotas = require("src/configs/rotas/posRecebimento").rotasPosRecebimento;
    });
    return rotas;
  };

  const rotaPorPath = (sufixo: string) =>
    getRotas().find((r: { path: string }) => r.path.endsWith(sufixo));

  const rotaTermo = () => rotaPorPath(`/${TERMO_RECEBIMENTO_PROVISORIO}`);
  const rotaDetalhar = () =>
    rotaPorPath(`/${DETALHAR_TERMO_RECEBIMENTO_PROVISORIO}`);
  const rotaCadastro = () =>
    rotaPorPath(`/${CADASTRO_TERMO_RECEBIMENTO_PROVISORIO}`);

  const perfisFornecedor = [
    { nome: "ADMINISTRADOR_EMPRESA", perfil: PERFIL.ADMINISTRADOR_EMPRESA },
    { nome: "USUARIO_EMPRESA", perfil: PERFIL.USUARIO_EMPRESA },
  ];

  const perfisDilog = [
    { nome: "DILOG_CRONOGRAMA", perfil: PERFIL.DILOG_CRONOGRAMA },
    {
      nome: "COORDENADOR_CODAE_DILOG_LOGISTICA",
      perfil: PERFIL.COORDENADOR_CODAE_DILOG_LOGISTICA,
    },
    { nome: "DILOG_DIRETORIA", perfil: PERFIL.DILOG_DIRETORIA },
    { nome: "DILOG_QUALIDADE", perfil: PERFIL.DILOG_QUALIDADE },
  ];

  const perfisQueCadastram = [
    { nome: "DILOG_CRONOGRAMA", perfil: PERFIL.DILOG_CRONOGRAMA },
    {
      nome: "COORDENADOR_CODAE_DILOG_LOGISTICA",
      perfil: PERFIL.COORDENADOR_CODAE_DILOG_LOGISTICA,
    },
  ];

  const perfisQueNaoCadastram = [
    { nome: "DILOG_DIRETORIA", perfil: PERFIL.DILOG_DIRETORIA },
    { nome: "DILOG_QUALIDADE", perfil: PERFIL.DILOG_QUALIDADE },
  ];

  afterEach(() => {
    localStorage.clear();
  });

  it.each(perfisFornecedor)(
    "bloqueia Termo, Detalhar e Cadastro para $nome",
    ({ perfil }) => {
      localStorage.setItem("perfil", perfil);
      expect(rotaTermo().tipoUsuario).toBe(false);
      expect(rotaDetalhar().tipoUsuario).toBe(false);
      expect(rotaCadastro().tipoUsuario).toBe(false);
    },
  );

  it.each(perfisDilog)("libera Termo e Detalhar para $nome", ({ perfil }) => {
    localStorage.setItem("perfil", perfil);
    expect(rotaTermo().tipoUsuario).toBe(true);
    expect(rotaDetalhar().tipoUsuario).toBe(true);
  });

  it.each(perfisQueCadastram)("libera Cadastro para $nome", ({ perfil }) => {
    localStorage.setItem("perfil", perfil);
    expect(rotaCadastro().tipoUsuario).toBe(true);
  });

  it.each(perfisQueNaoCadastram)(
    "bloqueia apenas o Cadastro para $nome",
    ({ perfil }) => {
      localStorage.setItem("perfil", perfil);
      expect(rotaTermo().tipoUsuario).toBe(true);
      expect(rotaDetalhar().tipoUsuario).toBe(true);
      expect(rotaCadastro().tipoUsuario).toBe(false);
    },
  );
});
