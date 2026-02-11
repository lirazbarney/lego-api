import path from "path";
import { LegoSet, ListQuery } from "./types";
import { uniqueSorted } from "./utilities";

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
  count: number;
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
        s.minifigures.some((m) => m.toLowerCase().includes(term)),
    );
  }

  const count = data.length;
  const limit = Math.min(
    Math.max(1, Number(query.limit) || DEFAULT_LIMIT),
    MAX_LIMIT,
  );
  const offset = Math.max(0, Number(query.offset) || 0);
  const results = data.slice(offset, offset + limit);

  return { results, count };
}

/** Return set by id. */
export function getOneSetById(id: string): LegoSet | undefined {
  const numId = Number(id);
  if (Number.isNaN(numId)) {
    return undefined;
  }
  return loadSets().find((s) => s.legoSetId === numId);
}

/** Return all collections. */
export function getCollections(): string[] {
  const data = loadSets();
  const names = data.map((s) => s.collection);
  return uniqueSorted(names);
}

/** Return all topics. */
export function getTopics(): string[] {
  const data = loadSets();
  const names = data.map((s) => s.topic);
  return uniqueSorted(names);
}

/** Return all topics for a collection. */
export function getTopicsByCollection(collection: string): string[] {
  const data = loadSets().filter(
    (s) => s.collection.toLowerCase() === collection.toLowerCase(),
  );
  return uniqueSorted(data.map((s) => s.topic));
}

/** Return all collections for a topic. */
export function getCollectionsByTopic(topic: string): string[] {
  const data = loadSets().filter(
    (s) => s.topic.toLowerCase() === topic.toLowerCase(),
  );
  return uniqueSorted(data.map((s) => s.collection));
}
