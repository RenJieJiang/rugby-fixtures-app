"use server";

import { connectToDatabase } from "../utils/db";
import {
  FixtureModel,
  Fixture,
  FixtureSchema,
  FixtureArraySchema,
} from "../models/fixture";
import { revalidatePath } from "next/cache";

export async function searchFixtures(
  query: string,
  page: number = 1,
  pageSize: number = 10
): Promise<{
  success: boolean;
  fixtures?: Fixture[];
  message?: string;
  totalPages?: number;
  totalItems?: number;
}> {
  try {
    await connectToDatabase();

    // Calculate skip value for pagination
    const skip = (page - 1) * pageSize;

    // Base query
    const baseQuery =
      !query || query.trim() === ""
        ? {}
        : {
            $or: [
              { home_team: { $regex: query, $options: "i" } },
              { away_team: { $regex: query, $options: "i" } },
            ],
          };

    // Get total count for pagination
    const totalItems = await FixtureModel.countDocuments(baseQuery);
    const totalPages = Math.ceil(totalItems / pageSize);

    // Execute query with pagination
    const fixturesData = await FixtureModel.find(baseQuery)
      .sort({ fixture_datetime: 1 })
      .skip(skip)
      .limit(pageSize)
      .lean();

    // Validate the results against our schema
    const validation = FixtureArraySchema.safeParse(fixturesData);

    if (!validation.success) {
      console.error("Fixture validation error:", validation.error);
      return {
        success: false,
        message: "Data from database does not match expected structure",
      };
    }

    // Return the validated data with pagination info
    return {
      success: true,
      fixtures: validation.data,
      totalPages,
      totalItems,
    };
  } catch (error) {
    console.error("Search error:", error);
    return {
      success: false,
      message: `Error searching fixtures: ${
        error instanceof Error ? error.message : "Unknown error"
      }`,
    };
  }
}

export async function getFixture(id: string): Promise<{
  success: boolean;
  fixture?: Fixture;
  message?: string;
}> {
  try {
    await connectToDatabase();

    const fixtureData = await FixtureModel.findOne({ fixture_mid: id }).lean();

    if (!fixtureData) {
      return { success: false, message: "Fixture not found" };
    }

    // Validate the fixture against our schema
    // Since we're using .strip(), MongoDB fields will be automatically removed
    const validation = FixtureSchema.safeParse(fixtureData);

    if (!validation.success) {
      console.error("Fixture validation error:", validation.error);
      return {
        success: false,
        message: "Fixture data from database does not match expected structure",
      };
    }

    // Return the validated data - MongoDB fields are already stripped
    return { success: true, fixture: validation.data };
  } catch (error) {
    console.error("Get fixture error:", error);
    return {
      success: false,
      message: `Error retrieving fixture: ${
        error instanceof Error ? error.message : "Unknown error"
      }`,
    };
  }
}

export async function deleteFixture(id: string): Promise<{
  success: boolean;
  message?: string;
}> {
  try {
    if (!id) {
      return { success: false, message: "Fixture ID is required" };
    }

    await connectToDatabase();

    // First check if the fixture exists
    const fixture = await FixtureModel.findOne({ fixture_mid: id });
    if (!fixture) {
      return { success: false, message: "Fixture not found" };
    }

    // Proceed with deletion
    const result = await FixtureModel.deleteOne({ fixture_mid: id });

    if (result.deletedCount === 0) {
      return { success: false, message: "Failed to delete fixture" };
    }

    // Revalidate both the fixtures list page and the specific fixture page
    revalidatePath("/fixtures");
    revalidatePath(`/fixtures/${id}`);

    return { 
      success: true, 
      message: "Fixture successfully deleted" 
    };
  } catch (error) {
    console.error("Delete fixture error:", error);
    return {
      success: false,
      message: `Error deleting fixture: ${
        error instanceof Error ? error.message : "Unknown error"
      }`,
    };
  }
}
