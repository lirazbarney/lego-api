# LEGO Sets API

REST API for LEGO sets data, following [Pokémon API](https://pokeapi.co/)-style conventions: versioned base path, paginated list with `count`/`next`/`previous`/`results`, and consistent JSON responses.

## Run

```bash
npm install
npm run build
npm start
```

Dev mode with auto-reload:

```bash
npm run dev
```

Server runs at `http://localhost:3000` (override with `PORT`).

## Endpoints

| Method | Path                                     | Description                        |
| ------ | ---------------------------------------- | ---------------------------------- |
| GET    | `/`                                      | API info and endpoint list         |
| GET    | `/api/v1/sets`                           | List sets (paginated, filterable)  |
| GET    | `/api/v1/sets/:id`                       | Get set by `legoSetId`             |
| GET    | `/api/v1/collections`                    | List all collections               |
| GET    | `/api/v1/topics`                         | List all topics                    |
| GET    | `/api/v1/collections/:collection/topics` | List topics in a collection        |
| GET    | `/api/v1/topics/:topic/collections`      | List collections that have a topic |

### Query params for `GET /api/v1/sets`

| Param          | Type    | Description                                        |
| -------------- | ------- | -------------------------------------------------- |
| `limit`        | number  | Page size (default 20, max 100)                    |
| `offset`       | number  | Skip N results (default 0)                         |
| `collection`   | string  | Filter by collection (exact)                       |
| `topic`        | string  | Filter by topic (exact)                            |
| `yearReleased` | number  | Filter by year                                     |
| `isRetired`    | boolean | `true` or `false`                                  |
| `minPieces`    | number  | Minimum piece count                                |
| `maxPieces`    | number  | Maximum piece count                                |
| `age`          | number  | Only sets suitable for this age (minimunAge ≤ age) |
| `search`       | string  | Search in name, description, minifigures           |

### Example responses

**List (paginated):**

```json
{
  "totalCount": 299,
  "totalPages": 15,
  "next": "http://localhost:3000/api/v1/sets?limit=20&offset=20",
  "previous": null,
  "currentCount": 20
  "results": [
    {
    "legoSetId": 77058,
    "legoSetName": "Goldie's Cozy House", ...
    }
  ]
}
```

**Single set:** full `LegoSet` object.

**Not found (404):**

```json
{
  "detail": "Not found.",
  "message": "No LEGO set with id '99999' found."
}
```
