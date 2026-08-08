import type { EvaluationFactor } from "@/types/content";

export const evaluationFactors: EvaluationFactor[] = [
  { number: "01", title: "Время изготовления", description: "Эпоха, век, династия.", side: "left", lineAnchorY: 16.67, marker: { kind: "point", x: 50, y: 88.5 } },
  { number: "02", title: "Место производства", description: "Тибет, Непал, Китай, Монголия, Бурятия и др.", side: "left", lineAnchorY: 50, marker: { kind: "point", x: 51, y: 55 } },
  { number: "03", title: "Техника и стиль", description: "Бронза, литье, чеканка, позолота, резьба. Уровень работы: детализация лица, одежды, гравировка.", side: "left", lineAnchorY: 83.33, marker: { kind: "point", x: 57, y: 68 } },
  { number: "04", title: "Школа и мастер", description: "Авторские клейма, известные мастерские.", side: "right", lineAnchorY: 16.67, marker: { kind: "point", x: 50, y: 43 } },
  { number: "05", title: "Размер и вес предмета", description: "Габариты и масса предмета.", side: "right", lineAnchorY: 50, marker: { kind: "dimension", x: 88, topY: 25, bottomY: 93 } },
  { number: "06", title: "Состояние", description: "Сохранность патины, наличие дефектов, реставрации.", side: "right", lineAnchorY: 83.33, marker: { kind: "point", x: 66, y: 58 } },
];
