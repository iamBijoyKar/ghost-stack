"use server";

import { parseTextFile } from "~/lib/parser";

export async function readTextFile(text: string) {
  if (!text) return [];
  return parseTextFile(text);
}