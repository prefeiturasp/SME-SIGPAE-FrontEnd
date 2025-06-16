import {
  ordenaFaixas,
  mesEstaDentroDeAlgumaFaixa,
  mesesFinaisValidos,
  mesesForaDasFaixas,
  mesesToMesEAnoString,
  range,
  faixaToString,
} from "../faixasEtarias";

test("test mesesToMesEAnoString", () => {
  expect(mesesToMesEAnoString(0)).toEqual("00 meses");
  expect(mesesToMesEAnoString(1)).toEqual("01 mês");
  expect(mesesToMesEAnoString(2)).toEqual("02 meses");
  expect(mesesToMesEAnoString(3)).toEqual("03 meses");
  expect(mesesToMesEAnoString(11)).toEqual("11 meses");
  expect(mesesToMesEAnoString(12)).toEqual("01 ano");
  expect(mesesToMesEAnoString(13)).toEqual("01 ano e 01 mês");
  expect(mesesToMesEAnoString(14)).toEqual("01 ano e 02 meses");
  expect(mesesToMesEAnoString(15)).toEqual("01 ano e 03 meses");
  expect(mesesToMesEAnoString(23)).toEqual("01 ano e 11 meses");
  expect(mesesToMesEAnoString(24)).toEqual("02 anos");
  expect(mesesToMesEAnoString(25)).toEqual("02 anos e 01 mês");
  expect(mesesToMesEAnoString(26)).toEqual("02 anos e 02 meses");
  expect(mesesToMesEAnoString(27)).toEqual("02 anos e 03 meses");
  expect(mesesToMesEAnoString(35)).toEqual("02 anos e 11 meses");
  expect(mesesToMesEAnoString(36)).toEqual("03 anos");
});

test("test range", () => {
  expect(range(0)).toEqual([]);
  expect(range(1)).toEqual([0]);
  expect(range(2)).toEqual([0, 1]);
  expect(range(5)).toEqual([0, 1, 2, 3, 4]);
  expect(range(5, 2)).toEqual([2, 3, 4]);
  expect(range(12, 5)).toEqual([5, 6, 7, 8, 9, 10, 11]);
});

test("test ordenaFaixas", () => {
  const faixas1 = [
    { inicio: 12, fim: 17 },
    { inicio: 2, fim: 5 },
    { inicio: 7, fim: 10 },
  ];
  const ordenadas1 = [
    { inicio: 2, fim: 5 },
    { inicio: 7, fim: 10 },
    { inicio: 12, fim: 17 },
  ];
  expect(ordenaFaixas(faixas1)).toEqual(ordenadas1);
  const faixas2 = [
    { inicio: 42, fim: 66 },
    { inicio: 35, fim: 40 },
    { inicio: 12, fim: 30 },
    { inicio: 73, fim: 88 },
  ];
  const ordenadas2 = [
    { inicio: 12, fim: 30 },
    { inicio: 35, fim: 40 },
    { inicio: 42, fim: 66 },
    { inicio: 73, fim: 88 },
  ];
  expect(ordenaFaixas(faixas2)).toEqual(ordenadas2);
});

test("test mesesForaDasFaixas", () => {
  const faixas1 = [
    { inicio: 2, fim: 5 },
    { inicio: 8, fim: 11 },
  ];
  const mesesForaDasFaixas1 = [0, 1, 5, 6, 7];
  expect(mesesForaDasFaixas(faixas1, 12)).toEqual(mesesForaDasFaixas1);
  const faixas2 = [
    { inicio: 1, fim: 4 },
    { inicio: 7, fim: 10 },
    { inicio: 12, fim: 17 },
  ];
  const mesesForaDasFaixas2 = [0, 4, 5, 6, 10, 11, 17, 18, 19, 20, 21, 22];
  expect(mesesForaDasFaixas(faixas2, 24)).toEqual(mesesForaDasFaixas2);
  const faixas3 = [{ inicio: 0, fim: 59 }];
  expect(mesesForaDasFaixas(faixas3)).toEqual([]);
});

test("test mesEstaDentroDeAlgumaFaixa", () => {
  const faixas1 = [
    { inicio: 2, fim: 5 },
    { inicio: 8, fim: 11 },
  ];
  expect(mesEstaDentroDeAlgumaFaixa(7, faixas1)).toEqual(false);
  expect(mesEstaDentroDeAlgumaFaixa(13, faixas1)).toEqual(false);
  expect(mesEstaDentroDeAlgumaFaixa(4, faixas1)).toEqual(true);
  expect(mesEstaDentroDeAlgumaFaixa(8, faixas1)).toEqual(true);
  expect(mesEstaDentroDeAlgumaFaixa(11, faixas1)).toEqual(false);
});

test("test mesesFinaisValidos", () => {
  const faixas1 = [
    { inicio: 2, fim: 5 },
    { inicio: 8, fim: 11 },
  ];
  expect(mesesFinaisValidos(0, faixas1)).toEqual([0, 1]);
  expect(mesesFinaisValidos(6, faixas1)).toEqual([6, 7]);
  expect(mesesFinaisValidos(15, faixas1, 20)).toEqual([15, 16, 17, 18, 19]);
});

test("test faixaToString", () => {
  expect(faixaToString({ inicio: 0, fim: 1 })).toEqual(
    "0 meses a 1 mês (antes de)"
  );
  expect(faixaToString({ inicio: 1, fim: 3 })).toEqual("01 a 02 meses");
  expect(faixaToString({ inicio: 1, fim: 4 })).toEqual("01 a 03 meses");
  expect(faixaToString({ inicio: 4, fim: 6 })).toEqual("04 a 05 meses");
  expect(faixaToString({ inicio: 6, fim: 7 })).toEqual("06 meses");
  expect(faixaToString({ inicio: 7, fim: 8 })).toEqual("07 meses");
  expect(faixaToString({ inicio: 8, fim: 12 })).toEqual("08 a 11 meses");
  expect(faixaToString({ inicio: 12, fim: 24 })).toEqual(
    "01 ano a 01 ano e 11 meses"
  );
  expect(faixaToString({ inicio: 24, fim: 48 })).toEqual(
    "02 anos a 03 anos e 11 meses"
  );
  expect(faixaToString({ inicio: 48, fim: 72 })).toEqual("04 anos a 06 anos");
});
