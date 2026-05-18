import { unwrapPayload } from "./src/api/client.js";

const payload1 = [{ id: 1, name: "Doctor" }];
console.log("Unwrapped array:", unwrapPayload(payload1));

const payload2 = { success: true, data: [{ id: 1, name: "Doctor" }] };
console.log("Unwrapped object with array:", unwrapPayload(payload2));

const payload3 = { success: true, data: { name: "Doctor" } };
console.log("Unwrapped object with object:", unwrapPayload(payload3));
