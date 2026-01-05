import { client } from "./api/client.gen";

const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
console.log(process.env.NEXT_PUBLIC_API_URL)
client.setConfig({
  baseUrl: apiUrl,
});

export const config = {
  apiUrl
};

