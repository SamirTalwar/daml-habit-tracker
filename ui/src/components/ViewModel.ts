import {SemanticCOLORS} from "semantic-ui-react";
import {Model} from "@daml.js/create-daml-app";

export type Color = SemanticCOLORS;

export type Habit = Model.Habit & {
  color: Color;
};

export type Habits = {[id: string]: Habit};

const _colors: readonly Color[] = [
  "red",
  "orange",
  "yellow",
  "olive",
  "green",
  "teal",
  "blue",
  "violet",
  "purple",
  "pink",
  "brown",
  "grey",
  "black",
];

export const colors = (): (() => Color) => {
  let colorIndex = 0;
  return () => {
    return _colors[colorIndex++];
  };
};
