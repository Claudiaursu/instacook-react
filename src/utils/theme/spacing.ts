export type SpacerIndex = keyof typeof spaces;

const spaces = {
  0: 0,
  1: 4,
  2: 8,
  3: 12,
  4: 16,
  5: 30,
  6: 100,
};

export const spacing = (index: SpacerIndex) => {
  return spaces[index];
};