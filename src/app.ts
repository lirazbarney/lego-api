import express from "express";
import cors from "cors";
import routes from "./routes";

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (_req, res) => {
  res.json({
    name: "LEGO Sets API",
    version: "1.0",
    documentation: "https://github.com/your-repo/lego-api",
    endpoints: {
      sets: "/api/v1/sets",
      setById: "/api/v1/sets/:id",
      collections: "/api/v1/collections",
      topics: "/api/v1/topics",
      topicsByCollection: "/api/v1/collections/:collection/topics",
      collectionsByTopic: "/api/v1/topics/:topic/collections",
    },
    queryParams: {
      sets: "limit, offset, collection, topic, yearReleased, isRetired, minPieces, maxPieces, age, search",
    },
  });
});

app.use("/api/v1", routes);

app.use((_req, res) => {
  res.status(404).json({ detail: "Not found." });
});

app.use(
  (
    err: Error,
    _req: express.Request,
    res: express.Response,
    _next: express.NextFunction,
  ) => {
    console.error(err);
    res.status(500).json({ detail: "Internal server error." });
  },
);

export default app;
