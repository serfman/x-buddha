import type { EvaluationFactor } from "@/types/content";

export const evaluationFactors: EvaluationFactor[] = [
  { number: "01", title: "Время изготовления", description: "Эпоха, век, династия.", side: "left", point: { x: 45, y: 81 } },
  { number: "02", title: "Место производства", description: "Тибет, Непал, Китай, Монголия, Бурятия и др.", side: "left", point: { x: 49, y: 48 } },
  { number: "03", title: "Техника и стиль", description: "Бронза, литьё, чеканка, позолота, резьба; детализация и гравировка.", side: "left", point: { x: 38, y: 61 } },
  { number: "04", title: "Школа и мастер", description: "Авторские клейма, известные мастерские.", side: "right", point: { x: 50, y: 29 } },
  { number: "05", title: "Размер и вес", description: "Габариты и масса предмета.", side: "right", point: { x: 73, y: 50 } },
  { number: "06", title: "Состояние", description: "Сохранность патины, дефекты и следы реставрации.", side: "right", point: { x: 61, y: 57 } },
];
