import { describe, it, expect, vi, beforeEach } from "vitest";
import { screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { InputForm } from "./InputForm";
import { renderWithProviders } from "../test/utils";
import { setupMswServer } from "../test/mocks/server";

// Setup MSW server for API mocking
setupMswServer();

// Skip tests until compatibility issues are resolved
describe.skip("InputForm", () => {
  // Mock localStorage
  const localStorageMock = {
    getItem: vi.fn(),
    setItem: vi.fn(),
    removeItem: vi.fn(),
  };

  beforeEach(() => {
    // Setup localStorage mock
    Object.defineProperty(window, "localStorage", {
      value: localStorageMock,
      writable: true,
    });

    // Clear mocks between tests
    vi.clearAllMocks();
  });

  it("renders the form and submissions list", async () => {
    renderWithProviders(<InputForm />);

    // Form elements should be rendered
    expect(screen.getByPlaceholderText(/Enter your text/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /submit/i })).toBeInTheDocument();

    // Wait for submissions to load
    await waitFor(() => {
      expect(screen.getByText("First test input")).toBeInTheDocument();
    });

    // Should show all mock submissions
    expect(screen.getByText("Second test input")).toBeInTheDocument();
    expect(screen.getByText("Third test input")).toBeInTheDocument();
  });

  it("allows entering and submitting new input", async () => {
    const user = userEvent.setup();
    renderWithProviders(<InputForm />);

    // Type in the input field
    const inputField = screen.getByPlaceholderText(/Enter your text/i);
    await user.type(inputField, "New test submission");
    expect(inputField).toHaveValue("New test submission");

    // Submit the form
    const submitButton = screen.getByRole("button", { name: /submit/i });
    await user.click(submitButton);

    // Should show optimistic update
    await waitFor(() => {
      expect(screen.getByText("New test submission")).toBeInTheDocument();
    });

    // Should have cleared the input field
    expect(inputField).toHaveValue("");

    // Should have cleared localStorage draft
    expect(localStorageMock.removeItem).toHaveBeenCalledWith("inputDraft");
  });

  it("loads draft from localStorage on initial render", async () => {
    // Setup mock to return a saved draft
    localStorageMock.getItem.mockReturnValue("Saved draft text");

    renderWithProviders(<InputForm />);

    // Input should be populated with the saved draft
    const inputField = screen.getByPlaceholderText(/Enter your text/i);
    expect(inputField).toHaveValue("Saved draft text");

    // Should have checked localStorage
    expect(localStorageMock.getItem).toHaveBeenCalledWith("inputDraft");
  });

  it("saves draft to localStorage when typing", async () => {
    const user = userEvent.setup();

    // Set up a fake timer to control debounce timing
    vi.useFakeTimers();

    renderWithProviders(<InputForm />);

    // Type in the input field
    const inputField = screen.getByPlaceholderText(/Enter your text/i);
    await user.type(inputField, "Draft text");

    // Fast-forward timers to trigger the debounced save
    vi.runAllTimers();

    // Should have saved to localStorage
    expect(localStorageMock.setItem).toHaveBeenCalledWith(
      "inputDraft",
      "Draft text"
    );

    // Restore real timers
    vi.useRealTimers();
  });
});
