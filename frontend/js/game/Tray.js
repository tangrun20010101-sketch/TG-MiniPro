/**
 * 托盘管理
 * 最多7张牌，3张相同自动消除
 */

const MAX_SLOTS = 7;

export class Tray {
  constructor() {
    this.slots = [];
    this.maxSlots = MAX_SLOTS;
  }

  isFull() {
    return this.slots.length >= this.maxSlots;
  }

  add(card) {
    if (this.slots.length >= this.maxSlots) return null;
    this.slots.push({ ...card });
    return this.checkElimination();
  }

  /**
   * 检测3张相同并消除，返回被消除的牌类型或 null
   */
  checkElimination() {
    const count = {};
    for (const s of this.slots) {
      count[s.type] = (count[s.type] || 0) + 1;
    }
    for (const type of Object.keys(count)) {
      if (count[type] >= 3) {
        return this.removeTriple(type);
      }
    }
    return null;
  }

  removeTriple(type) {
    let n = 3;
    const removed = [];
    for (let i = this.slots.length - 1; i >= 0 && n > 0; i--) {
      if (this.slots[i].type === type) {
        removed.push(this.slots[i]);
        this.slots.splice(i, 1);
        n--;
      }
    }
    return { type, count: 3 };
  }

  getSlots() {
    return this.slots;
  }

  canEliminate() {
    const count = {};
    for (const s of this.slots) {
      count[s.type] = (count[s.type] || 0) + 1;
    }
    return Object.values(count).some((c) => c >= 3);
  }

  isLose() {
    return this.isFull() && !this.canEliminate();
  }

  /**
   * 撤回：移除最后一张牌并返回
   */
  undo() {
    if (this.slots.length === 0) return null;
    return this.slots.pop();
  }

  /**
   * 移除指定槽位的牌
   */
  removeAt(index) {
    if (index < 0 || index >= this.slots.length) return null;
    const [card] = this.slots.splice(index, 1);
    return card;
  }
}
