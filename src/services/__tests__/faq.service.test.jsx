import axios from "../_base";
import {
  atualizarCategoriaFaq,
  atualizarPerguntaFrequente,
  buscarCategoriaFaq,
  buscarCategoriasFaq,
  buscarOpcoesCategoriasFaq,
  buscarPerguntaFrequente,
  criarCategoriaFaq,
  criarPerguntaFrequente,
  excluirCategoriaFaq,
  excluirPerguntaFrequente,
  getFaq,
  listarPerguntasFrequentes,
} from "../faq.service";

jest.mock("../_base", () => ({
  __esModule: true,
  default: {
    delete: jest.fn(),
    get: jest.fn(),
    patch: jest.fn(),
    post: jest.fn(),
  },
}));

const UUID_CATEGORIA = "0d0f3d69-13db-458b-aa6f-7ed6830fb654";
const UUID_PERGUNTA = "ed78969e-4e60-4d47-89c8-97752ad97656";

describe("faq.service", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("consulta as perguntas frequentes", async () => {
    axios.get.mockResolvedValue({ status: 200 });
    const parametros = { categoria: UUID_CATEGORIA, pergunta: "dieta" };

    await getFaq();
    await listarPerguntasFrequentes(parametros);
    await buscarPerguntaFrequente(UUID_PERGUNTA);

    expect(axios.get).toHaveBeenNthCalledWith(
      1,
      "/categorias-pergunta-frequente/perguntas-por-categoria/",
    );
    expect(axios.get).toHaveBeenNthCalledWith(2, "/perguntas-frequentes/", {
      params: parametros,
    });
    expect(axios.get).toHaveBeenNthCalledWith(
      3,
      `/perguntas-frequentes/${UUID_PERGUNTA}/`,
    );
  });

  it("consulta categorias e opções de categorias", async () => {
    axios.get.mockResolvedValue({ status: 200 });
    const parametros = { nome: "Gestão de Alimentação", page: 2 };

    await buscarCategoriasFaq(parametros);
    await buscarOpcoesCategoriasFaq();
    await buscarCategoriaFaq(UUID_CATEGORIA);

    expect(axios.get).toHaveBeenNthCalledWith(
      1,
      "/categorias-pergunta-frequente/",
      { params: parametros },
    );
    expect(axios.get).toHaveBeenNthCalledWith(
      2,
      "/categorias-pergunta-frequente/opcoes/",
    );
    expect(axios.get).toHaveBeenNthCalledWith(
      3,
      `/categorias-pergunta-frequente/${UUID_CATEGORIA}/`,
    );
  });

  it("cria categorias e perguntas frequentes", async () => {
    axios.post.mockResolvedValue({ status: 201 });
    const categoria = { nome: "Gestão de Alimentação" };
    const pergunta = {
      categoria: UUID_CATEGORIA,
      pergunta: "Como solicitar uma dieta?",
      resposta: "Consulte as orientações.",
    };

    await criarCategoriaFaq(categoria);
    await criarPerguntaFrequente(pergunta);

    expect(axios.post).toHaveBeenNthCalledWith(
      1,
      "/categorias-pergunta-frequente/",
      categoria,
    );
    expect(axios.post).toHaveBeenNthCalledWith(
      2,
      "/perguntas-frequentes/",
      pergunta,
    );
  });

  it("atualiza categorias e perguntas frequentes", async () => {
    axios.patch.mockResolvedValue({ status: 200 });
    const categoria = { nome: "Dieta Especial" };
    const pergunta = { pergunta: "Título atualizado" };

    await atualizarCategoriaFaq(UUID_CATEGORIA, categoria);
    await atualizarPerguntaFrequente(UUID_PERGUNTA, pergunta);

    expect(axios.patch).toHaveBeenNthCalledWith(
      1,
      `/categorias-pergunta-frequente/${UUID_CATEGORIA}/`,
      categoria,
    );
    expect(axios.patch).toHaveBeenNthCalledWith(
      2,
      `/perguntas-frequentes/${UUID_PERGUNTA}/`,
      pergunta,
    );
  });

  it("exclui categorias e perguntas frequentes", async () => {
    axios.delete.mockResolvedValue({ status: 204 });

    await excluirCategoriaFaq(UUID_CATEGORIA);
    await excluirPerguntaFrequente(UUID_PERGUNTA);

    expect(axios.delete).toHaveBeenNthCalledWith(
      1,
      `/categorias-pergunta-frequente/${UUID_CATEGORIA}/`,
    );
    expect(axios.delete).toHaveBeenNthCalledWith(
      2,
      `/perguntas-frequentes/${UUID_PERGUNTA}/`,
    );
  });
});
