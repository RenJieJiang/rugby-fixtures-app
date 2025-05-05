import { describe, it, expect, vi, beforeEach, Mock } from "vitest";
import { render, screen } from "@testing-library/react";
import FixtureDetailPage from "../page";
import { getFixture } from "@/app/lib/actions/fixtures";
import { notFound } from "next/navigation";
import { Fixture } from "@/app/lib/models/fixture";

// Mock dependencies
vi.mock("@/app/lib/actions/fixtures", () => ({
  getFixture: vi.fn(),
}));

vi.mock("next/link", () => ({
  default: ({
    children,
    href,
  }: {
    children: React.ReactNode;
    href: string;
  }) => {
    return <a href={href}>{children}</a>;
  },
}));

// Mock next/navigation with a custom implementation that stops execution
vi.mock("next/navigation", () => ({
  notFound: vi.fn().mockImplementation(() => {
    // Throw an error to stop component execution
    throw new Error("NEXT_NOT_FOUND");
  }),
}));

describe("FixtureDetailPage", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders the fixture details correctly", async () => {
    // Mock a successful fixture response
    const mockFixture: Fixture = {
      fixture_mid: "123",
      fixture_datetime: "2025-06-15T14:30:00Z",
      competition_name: "Six Nations",
      fixture_round: 3,
      home_team: "England",
      away_team: "France",
      season: 2025,
    };

    // Use Vitest's Mock type instead of Jest's
    (getFixture as unknown as Mock).mockResolvedValue({
      success: true,
      fixture: mockFixture,
    });

    // Create props with a mock ID
    const props = {
      params: Promise.resolve({ id: "123" }),
    };

    const page = await FixtureDetailPage(props);
    render(page);

    // Check if fixture details are rendered
    expect(screen.getByText("England")).toBeInTheDocument();
    expect(screen.getByText("France")).toBeInTheDocument();
    expect(screen.getByText("vs")).toBeInTheDocument();
    expect(screen.getByText("Six Nations")).toBeInTheDocument();
    expect(screen.getByText("Round 3")).toBeInTheDocument();
    expect(screen.getByText("2025")).toBeInTheDocument();
    expect(screen.getByText("123")).toBeInTheDocument();

    // Check breadcrumb navigation
    expect(screen.getByText("← Back to all fixtures")).toBeInTheDocument();

    // Check formatting of dates (the exact format will depend on locale, so we test if elements exist)
    // For example, we know there's "Date:" and "Time:" labels
    expect(screen.getByText("Date:")).toBeInTheDocument();
    expect(screen.getByText("Time:")).toBeInTheDocument();
  });

  it("calls notFound when fixture is not found", async () => {
    // Mock an unsuccessful fixture response
    (getFixture as unknown as Mock).mockResolvedValue({
      success: false,
      fixture: undefined,
    });

    // Create props with a mock ID
    const props = {
      params: Promise.resolve({ id: "invalid-id" }),
    };

    // We expect this to throw an error because of our custom notFound mock
    await expect(FixtureDetailPage(props)).rejects.toThrow("NEXT_NOT_FOUND");

    // Check if notFound was called
    expect(notFound).toHaveBeenCalled();
  });

  it("calls getFixture with the correct ID", async () => {
    // Mock a successful fixture response
    (getFixture as unknown as Mock).mockResolvedValue({
      success: true,
      fixture: {
        // Minimal fixture data
        fixture_mid: "456",
        fixture_datetime: "2025-06-15T14:30:00Z",
        competition_name: "Six Nations",
        fixture_round: 3,
        home_team: "England",
        away_team: "France",
        season: 2025,
      },
    });

    // Create props with a specific ID
    const props = {
      params: Promise.resolve({ id: "456" }),
    };

    await FixtureDetailPage(props);

    // Check if getFixture was called with the correct ID
    expect(getFixture).toHaveBeenCalledWith("456");
  });
});
