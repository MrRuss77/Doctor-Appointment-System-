import express from "express";
import asyncHandler from "./asyncHandler.js";

const humanizeModelName = (name = "Record") =>
  name
    .replace(/([a-z0-9])([A-Z])/g, "$1 $2")
    .replace(/^./, (character) => character.toUpperCase());

const createCrudRouter = (Model, populate = []) => {
  const router = express.Router();
  const entityLabel = humanizeModelName(Model.modelName);

  router.get("/", asyncHandler(async (_req, res) => {
    const query = Model.find().sort({ createdAt: -1 });
    populate.forEach((field) => query.populate(field));
    const items = await query;
    res.json(items);
  }));

  router.get("/:id", asyncHandler(async (req, res) => {
    const query = Model.findById(req.params.id);
    populate.forEach((field) => query.populate(field));
    const item = await query;

    if (!item) {
      return res.status(404).json({ message: "Record not found." });
    }

    return res.json(item);
  }));

  router.post("/", asyncHandler(async (req, res) => {
    const item = await Model.create(req.body);
    const payload = item.toObject ? item.toObject() : item;
    return res.status(201).json({
      ...payload,
      message: `${entityLabel} created successfully.`
    });
  }));

  router.put("/:id", asyncHandler(async (req, res) => {
    const item = await Model.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });

    if (!item) {
      return res.status(404).json({ message: "Record not found." });
    }

    const payload = item.toObject ? item.toObject() : item;
    return res.json({
      ...payload,
      message: `${entityLabel} updated successfully.`
    });
  }));

  router.delete("/:id", asyncHandler(async (req, res) => {
    const item = await Model.findByIdAndDelete(req.params.id);

    if (!item) {
      return res.status(404).json({ message: "Record not found." });
    }

    return res.json({ message: `${entityLabel} deleted successfully.` });
  }));

  return router;
};

export default createCrudRouter;
