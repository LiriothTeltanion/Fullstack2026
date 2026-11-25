// Exercise 3: a small order system built on EventEmitter
import { EventEmitter } from "node:events";

class OrderSystem extends EventEmitter {
  #nextId = 1;

  placeOrder(item, quantity) {
    if (quantity <= 0) {
      this.emit("rejected", { item, reason: "quantity must be positive" });
      return;
    }
    const order = { id: this.#nextId++, item, quantity };
    this.emit("placed", order);
    if (quantity >= 10) this.emit("bigOrder", order);
  }
}

const shop = new OrderSystem();

shop.on("placed", order => console.log(`Order #${order.id}: ${order.quantity} x ${order.item}`));
shop.on("bigOrder", order => console.log(`  -> big order, tell the warehouse about #${order.id}`));
shop.on("rejected", ({ item, reason }) => console.log(`Rejected ${item}: ${reason}`));
shop.once("placed", () => console.log("  (first order of the day, this message shows once)"));

shop.placeOrder("coffee beans", 2);
shop.placeOrder("paper cups", 50);
shop.placeOrder("milk", 0);

console.log("Listeners on 'placed' now:", shop.listenerCount("placed"));
