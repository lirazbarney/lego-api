import path from "path";
import { LegoSet, ListQuery } from "./types";
import { timesCount, uniqueSorted } from "./utilities";

const DATA_PATH = path.join(__dirname, "..", "data.json");

let setsCache: LegoSet[] | null = null;

function loadSets(): LegoSet[] {
  if (setsCache) {
    return setsCache;
  }
  const data = require(DATA_PATH) as LegoSet[];
  setsCache = data;
  return data;
}

const DEFAULT_LIMIT = 20;
const MAX_LIMIT = 100;

/** Return sets matching the query. */
export function getSets(query: ListQuery): {
  results: LegoSet[];
  totalCount: number;
  currentCount: number;
  totalPages: number;
} {
  // Load sets from data file
  let data = [...loadSets()];

  // Filter sets by query parameters
  if (query.collection) {
    data = data.filter(
      (s) => s.collection.toLowerCase() === query.collection!.toLowerCase(),
    );
  }

  if (query.topic) {
    data = data.filter(
      (s) => s.topic.toLowerCase() === query.topic!.toLowerCase(),
    );
  }

  if (query.yearReleased != null) {
    data = data.filter((s) => s.yearReleased === Number(query.yearReleased));
  }

  if (query.isRetired !== undefined) {
    data = data.filter((s) => s.isRetired === query.isRetired);
  }

  if (query.minPieces != null) {
    data = data.filter((s) => s.numberOfPieces >= Number(query.minPieces));
  }

  if (query.maxPieces != null) {
    data = data.filter((s) => s.numberOfPieces <= Number(query.maxPieces));
  }

  if (query.age != null) {
    const maxAge = Number(query.age);
    data = data.filter((s) => s.minimunAge <= maxAge);
  }

  if (query.search) {
    const term = query.search.toLowerCase();
    data = data.filter(
      (s) =>
        s.legoSetName.toLowerCase().includes(term) ||
        s.description.toLowerCase().includes(term) ||
        s.minifigures.some((m) => m.toLowerCase().includes(term)) ||
        s.legoSetId.toString().includes(term),
    );
  }

  const totalCount = data.length;
  const limit = Math.min(
    Math.max(1, Number(query.limit) || DEFAULT_LIMIT),
    MAX_LIMIT,
  );

  const offset = Math.max(0, Number(query.offset) || 0);

  const results = data
    .sort((a, b) => b.yearReleased - a.yearReleased)
    .slice(offset, offset + limit);

  const currentCount = results.length;
  const totalPages = Math.ceil(totalCount / limit);

  console.log(totalPages);

  return {
    results,
    totalCount,
    currentCount,
    totalPages,
  };
}

/** Return set by id. */
export function getOneSetById(identifier: string): LegoSet | undefined {
  const set = loadSets().find(
    (s) =>
      s.legoSetId === Number(identifier) ||
      s.legoSetName.toLowerCase() === identifier.toLowerCase(),
  );
  return set;
}

/** Return all collections. */
export function getCollections() {
  const data = loadSets();
  const names = data.map((s) => s.collection);
  return timesCount(names);
}

/** Return all topics. */
export function getTopics() {
  const data = loadSets();
  const names = data.map((s) => s.topic);
  return timesCount(names);
}

/** Return all topics for a collection. */
export function getTopicsByCollection(collection: string) {
  const data = loadSets().filter(
    (s) => s.collection.toLowerCase() === collection.toLowerCase(),
  );
  return timesCount(data.map((s) => s.topic));
}

/** Return all collections for a topic. */
export function getCollectionsByTopic(topic: string) {
  const data = loadSets().filter(
    (s) => s.topic.toLowerCase() === topic.toLowerCase(),
  );
  return timesCount(data.map((s) => s.collection));
}
