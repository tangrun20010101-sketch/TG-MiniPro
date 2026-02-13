/**
 * 游戏主逻辑
 */

import { generateDeck, getClickableCards, unblockCard } from './CardGenerator.js';
import { Tray } from './Tray.js';

const TIME_LIMIT = 150;

export class Game {
  constructor(options = {}) {
    this.mode = options.mode || 'free';
    this.timeLimit = TIME_LIMIT;
    this.remainingTime = TIME_LIMIT;
    this.score = 0;
    this.cards = [];
    this.tray = new Tray();
    this.status = 'idle'; // idle | playing | win | lose | timeout
    this.history = [];
    this.props = { undo: 1, shuffle: 1, remove: 1 };
    this.eliminatedCount = 0;
    /** 本局代币增加量（结算用） */
    this.roundDaibiGain = 0;
  }

  start() {
    this.cards = generateDeck(1);
    this.tray = new Tray();
    this.remainingTime = this.timeLimit;
    this.score = 0;
    this.status = 'playing';
    this.history = [];
    this.props = { undo: 1, shuffle: 1, remove: 1 };
    this.eliminatedCount = 0;
    this.roundDaibiGain = 0;
    return this.cards;
  }

  getClickableCards() {
    return getClickableCards(this.cards);
  }

  pickCard(cardId) {
    if (this.status !== 'playing') return { ok: false };

    const card = this.cards.find((c) => c.id === cardId);
    if (!card || card.removed) return { ok: false };

    const clickable = this.getClickableCards();
    if (!clickable.find((c) => c.id === cardId)) return { ok: false };

    if (this.tray.isFull() && !this.tray.canEliminate()) {
      return { ok: false, lose: true };
    }

    this.history.push({
      card: { ...card },
      trayBefore: this.tray.getSlots().map((s) => ({ ...s }))
    });

    card.removed = true;
    unblockCard(this.cards, cardId);

    const elim = this.tray.add(card);
    if (elim) {
      this.score += 10;
      this.eliminatedCount += 3;
    }

    if (this.allCleared()) {
      this.status = 'win';
      this.score += Math.floor(this.remainingTime * 2);
      this.roundDaibiGain = this.mode === 'bet' ? Math.floor(this.score / 50) : 0;
      return { ok: true, win: true };
    }

    if (this.tray.isLose()) {
      this.status = 'lose';
      this.roundDaibiGain = this.mode === 'bet' ? Math.floor(this.score / 50) : 0;
      return { ok: true, lose: true };
    }

    return { ok: true, elimination: elim };
  }

  allCleared() {
    return this.cards.every((c) => c.removed);
  }

  tick() {
    if (this.status !== 'playing') return;
    this.remainingTime = Math.max(0, this.remainingTime - 1);
    if (this.remainingTime <= 0) {
      this.status = 'timeout';
      this.score += Math.floor(this.eliminatedCount * 2);
      this.roundDaibiGain = this.mode === 'bet' ? Math.floor(this.score / 50) : 0;
    }
  }

  useUndo() {
    if (this.props.undo <= 0 || this.history.length === 0) return null;
    this.props.undo--;
    const last = this.history.pop();
    const card = last.card;
    const c = this.cards.find((x) => x.id === card.id);
    if (c) {
      c.removed = false;
      for (const other of this.cards) {
        if (other.removed) continue;
        if (other.layer > c.layer && overlaps(c, other)) {
          c.blockedBy.add(other.id);
        }
        if (other.layer < c.layer && overlaps(c, other)) {
          other.blockedBy.add(c.id);
        }
      }
    }
    this.tray.slots = last.trayBefore.map((s) => ({ ...s }));
    return card;
  }

  useShuffle() {
    if (this.props.shuffle <= 0) return null;
    this.props.shuffle--;
    const visible = this.cards.filter((c) => !c.removed && c.blockedBy.size === 0);
    const positions = visible.map((c) => ({ x: c.x, y: c.y }));
    for (let i = positions.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [positions[i], positions[j]] = [positions[j], positions[i]];
    }
    visible.forEach((c, i) => {
      c.x = positions[i].x;
      c.y = positions[i].y;
    });
    return true;
  }

  useRemove() {
    if (this.props.remove <= 0 || this.tray.slots.length === 0) return null;
    this.props.remove--;
    const card = this.tray.undo();
    if (card) {
      const c = this.cards.find((x) => x.id === card.id);
      if (c) c.removed = false;
    }
    return card;
  }
}

function overlaps(a, b) {
  const CARD_WIDTH = 90;
  const CARD_HEIGHT = 90;
  const margin = 8;
  return (
    a.x + CARD_WIDTH - margin > b.x &&
    b.x + CARD_WIDTH - margin > a.x &&
    a.y + CARD_HEIGHT - margin > b.y &&
    b.y + CARD_HEIGHT - margin > a.y
  );
}
