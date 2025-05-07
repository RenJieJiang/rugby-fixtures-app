import { Fixture } from "../models/fixture";

export type BaseActionResponse = {
  success: boolean;
  message?: string;
};

export type PaginatedResponse<T> = BaseActionResponse & {
  data?: T[];
  totalPages?: number;
  totalItems?: number;
};

export type SingleItemResponse<T> = BaseActionResponse & {
  data?: T;
};

// Specific fixtures
export type FixtureActionResponse = SingleItemResponse<Fixture>;
export type FixturesActionResponse = PaginatedResponse<Fixture>;
export type DeleteActionResponse = BaseActionResponse;