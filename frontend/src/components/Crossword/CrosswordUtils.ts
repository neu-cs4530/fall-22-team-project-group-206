import { CrosswordPuzzleCell } from '../../types/CoveyTownSocket';

export type CellIndex = { row: number; col: number };
export type Direction = 'across' | 'down';

export const BLACK_CELL_STRING = '.';

function getLeadingCells(
  selectedIndex: CellIndex,
  dir: Direction,
  grid: CrosswordPuzzleCell[][],
): CellIndex[] {
  const highlightedIndices: CellIndex[] = [];
  switch (dir) {
    case 'across':
      for (let i = selectedIndex.col; i >= 0; i--) {
        if (
          grid[selectedIndex.row][i] === undefined ||
          grid[selectedIndex.row][i].solution == BLACK_CELL_STRING
        ) {
          break;
        } else {
          highlightedIndices.push({ row: selectedIndex.row, col: i });
        }
      }
      break;
    case 'down':
      for (let i = selectedIndex.row; i >= 0; i--) {
        if (
          grid[i][selectedIndex.col] === undefined ||
          grid[i][selectedIndex.col].solution == BLACK_CELL_STRING
        ) {
          break;
        } else {
          highlightedIndices.push({ row: i, col: selectedIndex.col });
        }
      }
  }
  return highlightedIndices;
}

function getTrailingCells(
  selectedIndex: CellIndex,
  dir: Direction,
  grid: CrosswordPuzzleCell[][],
): CellIndex[] {
  const highlightedIndices: CellIndex[] = [];
  const puzzleWidth = grid[0].length;
  const puzzleHeight = grid.length;
  switch (dir) {
    case 'across':
      for (let i = selectedIndex.col; i < puzzleWidth; i++) {
        if (
          grid[selectedIndex.row][i] === undefined ||
          grid[selectedIndex.row][i].solution == BLACK_CELL_STRING
        ) {
          break;
        } else {
          highlightedIndices.push({ row: selectedIndex.row, col: i });
        }
      }
      break;
    case 'down':
      for (let i = selectedIndex.row; i < puzzleHeight; i++) {
        if (
          grid[i][selectedIndex.col] === undefined ||
          grid[i][selectedIndex.col].solution == BLACK_CELL_STRING
        ) {
          break;
        } else {
          highlightedIndices.push({ row: i, col: selectedIndex.col });
        }
      }
      break;
  }
  return highlightedIndices;
}

export function getHighlightedCells(
  selectedIndex: CellIndex,
  dir: Direction,
  grid: CrosswordPuzzleCell[][] | undefined,
): CellIndex[] {
  if (!grid) {
    return [];
  }
  return [
    ...getLeadingCells(selectedIndex, dir, grid),
    ...getTrailingCells(selectedIndex, dir, grid),
  ];
}
