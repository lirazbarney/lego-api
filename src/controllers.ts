import { Request, Response } from "express";
import {
  getSets,
  getOneSetById,
  getCollections,
  getTopics,
  getTopicsByCollection,
  getCollectionsByTopic,
} from "./dataService";
import { buildListQuery, buildPageUrl } from "./utilities";

const DEFAULT_LIMIT = 20;
const MAX_LIMIT = 100;

/**
 * GET /api/v1/sets
 * List sets with pagination and filters (Pokemon API style).
 */
export function listSets(req: Request, res: Response): void {
  console.log("baba");
  const query = buildListQuery(req, MAX_LIMIT, DEFAULT_LIMIT);
  const limit = query.limit ?? DEFAULT_LIMIT;
  const offset = query.offset ?? 0;

  const { results, totalCount, currentCount, totalPages } = getSets(query);

  console.log("totalCount", totalCount);
  console.log("currentCount", currentCount);
  console.log("results", results);
  const nextOffset = offset + limit;
  const prevOffset = Math.max(0, offset - limit);

  const next =
    nextOffset < totalCount ? buildPageUrl(req, nextOffset, limit) : null;
  const previous = offset > 0 ? buildPageUrl(req, prevOffset, limit) : null;

  res.json({
    totalCount,
    totalPages,
    next,
    previous,
    currentCount,
    results,
  });
}

/**
 * GET /api/v1/sets/:id
 * Get a single set by legoSetId.
 */
export function getSetById(req: Request, res: Response): void {
  const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
  const set = getOneSetById(id);
  if (!set) {
    res.status(404).json({
      detail: "Not found.",
      message: `No LEGO set with id '${id}' found.`,
    });
    return;
  }
  res.json(set);
}

/**
 * GET /api/v1/collections
 * List all collections.
 */
export function listCollections(req: Request, res: Response): void {
  const collections = getCollections();
  res.json({
    count: collections.length,
    results: collections,
  });
}

/**
 * GET /api/v1/topics
 * List all topics.
 */
export function listTopics(req: Request, res: Response): void {
  const topics = getTopics();
  res.json({
    count: topics.length,
    results: topics,
  });
}

/**
 * GET /api/v1/collections/:collection/topics
 * List all topics in a given collection.
 */
export function listTopicsByCollection(req: Request, res: Response): void {
  const collection = Array.isArray(req.params.collection)
    ? req.params.collection[0]
    : req.params.collection;
  const topics = getTopicsByCollection(collection);
  res.json({
    count: topics.length,
    results: topics,
  });
}

/**
 * GET /api/v1/topics/:topic/collections
 * List all collections that have a given topic.
 */
export function listCollectionsByTopic(req: Request, res: Response): void {
  const topic = Array.isArray(req.params.topic)
    ? req.params.topic[0]
    : req.params.topic;
  const collections = getCollectionsByTopic(topic);
  res.json({
    count: collections.length,
    results: collections,
  });
}
