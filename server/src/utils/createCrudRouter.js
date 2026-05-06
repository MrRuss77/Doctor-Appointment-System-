import express from "express";
import asyncHandler from "./asyncHandler.js";

const createCrudRouter = (Model, populate = []) => {
  const router = express.Router();

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
    return res.status(201).json(item);
  }));

  router.put("/:id", asyncHandler(async (req, res) => {
    const item = await Model.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });

    if (!item) {
      return res.status(404).json({ message: "Record not found." });
    }

    return res.json(item);
  }));

  router.delete("/:id", asyncHandler(async (req, res) => {
    const item = await Model.findByIdAndDelete(req.params.id);

    if (!item) {
      return res.status(404).json({ message: "Record not found." });
    }

    return res.json({ message: "Record deleted successfully." });
  }));

  return router;
};

export default createCrudRouter;
