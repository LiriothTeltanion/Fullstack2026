import * as Items from "../models/itemsModel.js";
import { createAddItemHandler } from "./createItemHandler.js";

export async function getItems(req, res, next) {
  try {
    res.json(await Items.findAll());
  } catch (error) {
    next(error);
  }
}

export const addItem = createAddItemHandler(Items.create);

export async function toggleItem(req, res, next) {
  try {
    const item = await Items.toggle(Number(req.params.id));
    if (!item) return res.status(404).json({ error: "Item not found." });
    res.json(item);
  } catch (error) {
    next(error);
  }
}

export async function deleteItem(req, res, next) {
  try {
    const deleted = await Items.remove(Number(req.params.id));
    if (!deleted) return res.status(404).json({ error: "Item not found." });
    res.status(204).end();
  } catch (error) {
    next(error);
  }
}
