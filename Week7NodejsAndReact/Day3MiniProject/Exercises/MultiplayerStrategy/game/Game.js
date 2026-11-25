// Territory: two players walk on a 6x6 grid and claim every cell they step on.
// Pure game logic, no sockets, so it can run on its own (see demo.js).
export const SIZE = 6;
export const MAX_TURNS = 30;

const DIRECTIONS = {
  up: { dx: 0, dy: -1 },
  down: { dx: 0, dy: 1 },
  left: { dx: -1, dy: 0 },
  right: { dx: 1, dy: 0 },
};

export class Game {
  constructor() {
    this.owner = Array(SIZE * SIZE).fill(null); // null, 0 or 1
    this.positions = [
      { x: 0, y: 0 },
      { x: SIZE - 1, y: SIZE - 1 },
    ];
    this.current = 0; // whose turn it is
    this.turnsPlayed = 0;
    this.over = false;
    this.positions.forEach((pos, player) => this.claim(pos, player));
  }

  claim({ x, y }, player) {
    this.owner[y * SIZE + x] = player;
  }

  // A move is legal when it stays on the board, does not land on the other
  // player and does not step onto a cell the other player owns.
  canMove(player, direction) {
    const step = DIRECTIONS[direction];
    if (!step) return false;
    const x = this.positions[player].x + step.dx;
    const y = this.positions[player].y + step.dy;
    if (x < 0 || y < 0 || x >= SIZE || y >= SIZE) return false;
    const other = this.positions[1 - player];
    if (other.x === x && other.y === y) return false;
    const cellOwner = this.owner[y * SIZE + x];
    return cellOwner === null || cellOwner === player;
  }

  legalMoves(player) {
    return Object.keys(DIRECTIONS).filter(dir => this.canMove(player, dir));
  }

  move(player, direction) {
    if (this.over) return { ok: false, error: "The game is over" };
    if (player !== this.current) return { ok: false, error: "Not your turn" };
    if (!this.canMove(player, direction)) return { ok: false, error: "You cannot move there" };

    const step = DIRECTIONS[direction];
    const pos = this.positions[player];
    pos.x += step.dx;
    pos.y += step.dy;
    this.claim(pos, player);

    this.turnsPlayed += 1;
    this.current = 1 - player;
    // The game ends after MAX_TURNS or when the next player is stuck.
    if (this.turnsPlayed >= MAX_TURNS || this.legalMoves(this.current).length === 0) {
      this.over = true;
    }
    return { ok: true };
  }

  scores() {
    return [0, 1].map(p => this.owner.filter(o => o === p).length);
  }

  winner() {
    if (!this.over) return null;
    const [a, b] = this.scores();
    if (a === b) return "draw";
    return a > b ? 0 : 1;
  }

  state() {
    return {
      size: SIZE,
      owner: this.owner,
      positions: this.positions,
      current: this.current,
      turnsLeft: MAX_TURNS - this.turnsPlayed,
      scores: this.scores(),
      over: this.over,
      winner: this.winner(),
    };
  }
}
