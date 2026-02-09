import boxen from 'boxen';

type BoxOptions = {
  padding?: number;
  borderColor?: boxen.Options['borderColor'];
};

export function renderBox(message: string, options: BoxOptions = {}) {
  return boxen(message, {
    padding: options.padding ?? 1,
    margin: 1,
    borderStyle: 'round',
    borderColor: options.borderColor ?? 'green'
  });
}
