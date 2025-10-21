import { onChangeEtapas } from "../helper";

describe("Testes de funções helpers de FormEtapa", () => {
  let setRestanteMock;
  let setDuplicadosMock;

  beforeEach(() => {
    setRestanteMock = jest.fn();
    setDuplicadosMock = jest.fn();
  });

  it("deve calcular corretamente o restante com números simples", () => {
    const etapas = [{}, {}];
    const changes = {
      values: {
        quantidade_total: "100",
        quantidade_0: "30",
        quantidade_1: "20",
      },
    };

    onChangeEtapas(changes, etapas, setRestanteMock, setDuplicadosMock);

    expect(setRestanteMock).toHaveBeenCalledWith(50);
  });

  it("deve calcular corretamente o restante com vírgula e pontos no valor", () => {
    const etapas = [{}, {}];
    const changes = {
      values: {
        quantidade_total: "1.000,50",
        quantidade_0: "200,25",
        quantidade_1: "300,25",
      },
    };

    onChangeEtapas(changes, etapas, setRestanteMock, setDuplicadosMock);

    expect(setRestanteMock).toHaveBeenCalledWith(500);
  });

  it("deve retornar sem calcular duplicados se tiver apenas uma etapa", () => {
    const etapas = [{}];
    const changes = {
      values: {
        quantidade_total: "100",
        quantidade_0: "50",
        parte_0: "A",
        etapa_0: "1",
      },
    };

    onChangeEtapas(changes, etapas, setRestanteMock, setDuplicadosMock);

    expect(setRestanteMock).toHaveBeenCalledWith(50);
    expect(setDuplicadosMock).not.toHaveBeenCalled();
  });

  it("deve identificar etapas duplicadas corretamente", () => {
    const etapas = [{}, {}, {}];
    const changes = {
      values: {
        quantidade_total: "300",
        quantidade_0: "100",
        quantidade_1: "100",
        quantidade_2: "50",
        parte_0: "A",
        etapa_0: "1",
        parte_1: "A",
        etapa_1: "1",
        parte_2: "B",
        etapa_2: "2",
      },
    };

    onChangeEtapas(changes, etapas, setRestanteMock, setDuplicadosMock);

    expect(setRestanteMock).toHaveBeenCalledWith(50);
    expect(setDuplicadosMock).toHaveBeenCalledWith([0, 1]);
  });

  it("não deve marcar duplicados quando não houver etapas repetidas", () => {
    const etapas = [{}, {}, {}];
    const changes = {
      values: {
        quantidade_total: "300",
        quantidade_0: "100",
        quantidade_1: "100",
        quantidade_2: "100",
        parte_0: "A",
        etapa_0: "1",
        parte_1: "B",
        etapa_1: "1",
        parte_2: "A",
        etapa_2: "2",
      },
    };

    onChangeEtapas(changes, etapas, setRestanteMock, setDuplicadosMock);

    expect(setRestanteMock).toHaveBeenCalledWith(0);
    expect(setDuplicadosMock).toHaveBeenCalledWith([]);
  });

  it("deve lidar com valores faltantes sem quebrar", () => {
    const etapas = [{}, {}, {}];
    const changes = {
      values: {
        quantidade_total: "100",
      },
    };

    expect(() =>
      onChangeEtapas(changes, etapas, setRestanteMock, setDuplicadosMock),
    ).not.toThrow();

    expect(setRestanteMock).toHaveBeenCalledWith(100);
  });
});
