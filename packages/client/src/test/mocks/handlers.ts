import { http, HttpResponse } from "msw";

// Mock input data
const mockInputs = [
  {
    id: 1,
    text: "First test input",
    createdAt: "2023-01-15T12:30:45.000Z",
  },
  {
    id: 2,
    text: "Second test input",
    createdAt: "2023-01-16T10:15:30.000Z",
  },
  {
    id: 3,
    text: "Third test input",
    createdAt: "2023-01-17T08:45:20.000Z",
  },
];

export const handlers = [
  // Mock the getInputs procedure
  http.get("http://localhost:3000/trpc/getInputs", () => {
    return HttpResponse.json({
      result: {
        data: {
          items: mockInputs,
          nextCursor: null,
        },
      },
    });
  }),

  // Mock the createInput procedure
  http.post("http://localhost:3000/trpc/createInput", async ({ request }) => {
    const body = (await request.json()) as any;

    // Create a new input with the received text
    const newInput = {
      id: mockInputs.length + 1,
      text: body?.input?.text || "Default text",
      createdAt: new Date().toISOString(),
    };

    // Add to our mock data
    mockInputs.unshift(newInput);

    return HttpResponse.json({
      result: {
        data: newInput,
      },
    });
  }),
];
