export interface LegoSet {
  legoSetId: number;
  legoSetName: string;
  collection: string;
  topic: string;
  yearReleased: number;
  isRetired: boolean;
  minimunAge: number;
  numberOfPieces: number;
  images: string[];
  description: string;
  minifigures: string[];
}

export interface ListQuery {
  limit?: number;
  offset?: number;
  collection?: string;
  topic?: string;
  yearReleased?: number;
  isRetired?: boolean;
  minPieces?: number;
  maxPieces?: number;
  search?: string;
  age?: number;
}
