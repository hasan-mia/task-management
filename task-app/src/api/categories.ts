import { apiClient } from "./client";

const unwrap = <T>(res: { data: { data: T } }): T => res.data.data;

export async function fetchCategories(params: { search?: string }): Promise<any[]> {
  const res = await apiClient.get("/categories", { params });
  return unwrap(res);
}

export async function createCategory(payload: { name: string }): Promise<any> {
  const res = await apiClient.post("/categories", payload);
  return unwrap(res);
}
