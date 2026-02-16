import { ListQuery } from "./types";
import { Request } from "express";

/** Return unique strings from array, sorted. */
export function uniqueSorted(values: string[]): string[] {
  const seen: string[] = [];
  for (const v of values) {
    if (v && seen.indexOf(v) === -1) {
      seen.push(v);
    }
  }
  return seen.sort();
}

/** Count the number of times a value appears in an array. */
export function timesCount(values: string[]) {
  const counts = values.reduce((acc: any, val: string) => {
    acc[val] = (acc[val] || 0) + 1;
    return acc;
  }, {});

  const result = Object.entries(counts).map(([value, count]) => ({
    value,
    count,
  }));

  return result;
}

/** Build list query from request. */
export function buildListQuery(
  req: Request,
  maxLimit: number,
  defaultLimit: number,
): ListQuery {
  // Calculate limit and offset
  const limit = Math.min(
    maxLimit,
    Math.max(1, parseInt(req.query.limit as string, 10) || defaultLimit),
  );
  const offset = Math.max(0, parseInt(req.query.offset as string, 10) || 0);

  // Get query parameters
  const collection = req.query.collection as string | undefined;
  const topic = req.query.topic as string | undefined;
  const yearReleased = req.query.yearReleased as string | undefined;
  const isRetired = req.query.isRetired as string | undefined;
  const minPieces = req.query.minPieces as string | undefined;
  const maxPieces = req.query.maxPieces as string | undefined;
  const search = req.query.search as string | undefined;
  const age = req.query.age as string | undefined;

  // Build query object
  const query: ListQuery = { limit, offset };
  if (collection) {
    query.collection = collection;
  }
  if (topic) {
    query.topic = topic;
  }
  if (yearReleased !== undefined) {
    query.yearReleased = parseInt(yearReleased, 10);
  }
  if (isRetired !== undefined) {
    query.isRetired = isRetired === "true";
  }
  if (minPieces !== undefined) {
    query.minPieces = parseInt(minPieces, 10);
  }
  if (maxPieces !== undefined) {
    query.maxPieces = parseInt(maxPieces, 10);
  }
  if (search) {
    query.search = search;
  }
  if (age !== undefined) {
    const ageNum = parseInt(age, 10);
    if (!Number.isNaN(ageNum)) {
      query.age = ageNum;
    }
  }

  // Return query object
  return query;
}

/** Build page url from request. */
export function buildPageUrl(
  req: Request,
  offset: number,
  limit: number,
): string | null {
  const base = `${req.protocol}://${req.get("host")}${req.baseUrl}${req.path}`;
  const params = new URLSearchParams(req.query as Record<string, string>);
  params.set("offset", String(offset));
  params.set("limit", String(limit));
  return `${base}?${params.toString()}`;
}
