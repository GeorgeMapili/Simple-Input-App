# Shared Package Usage Guide

This guide explains how to use the shared package in both client and server code.

## What's Available

The shared package exports:

- **Types**: `InputItem`, `CreateInputRequest`
- **Validation**: `inputTextSchema` (Zod schema for input validation)
- **Constants**: `INPUT_CONSTRAINTS`, `API_ENDPOINTS`, `TIME`
- **Utilities**: `formatDate()`, `truncateText()`

## Usage Examples

### In Client Code (React)

```tsx
// Import what you need from the shared package
import {
  type InputItem,
  formatDate,
  truncateText,
  INPUT_CONSTRAINTS,
} from "shared";

// Use the constants in your form
function MyInputForm() {
  return (
    <input
      maxLength={INPUT_CONSTRAINTS.MAX_LENGTH}
      placeholder={`Max ${INPUT_CONSTRAINTS.MAX_LENGTH} characters`}
    />
  );
}

// Use the utility functions
function DisplayItem({ item }: { item: InputItem }) {
  return (
    <div>
      <p>{truncateText(item.text, 100)}</p>
      <small>{formatDate(item.createdAt)}</small>
    </div>
  );
}
```

### In Server Code (Node.js)

```ts
// Import the validation schema
import { inputTextSchema } from "shared";

// Use it in your API endpoints
app.post("/api/inputs", (req, res) => {
  // Validate the input
  const result = inputTextSchema.safeParse(req.body);

  if (!result.success) {
    return res.status(400).json({ errors: result.error.format() });
  }

  // Process the validated data
  const validatedData = result.data;
  // ...
});
```

## Importing

Just import directly from "shared" - the TypeScript paths are configured correctly in both client and server.
