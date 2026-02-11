import { Router } from "express";
import {
  listCollections,
  listTopicsByCollection,
  listTopics,
  listCollectionsByTopic,
  listSets,
  getSetById,
} from "./controllers";

const router = Router();

router.get("/collections", listCollections);
router.get("/collections/:collection/topics", listTopicsByCollection);
router.get("/topics", listTopics);
router.get("/topics/:topic/collections", listCollectionsByTopic);
router.get("/sets", listSets);
router.get("/sets/:id", getSetById);

export default router;
