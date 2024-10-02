import { afterAll, beforeAll } from "vitest";
import app from "@/app"; // Adjust the import to your app's entry point

let server: any;

beforeAll(() => {
  server = app.listen(4000); // Start the server on a test port
});

afterAll(() => {
  server.close(); // Close the server after tests
});
