type ParseEntry = {
  name: string;
  sourceId: string;
  version: string;
};

export function parseTextFile(content: string) {
  const lines = content.trim().split("\n");
  const parsedData: ParseEntry[] = [];

  for (const line of lines) {
    const lineData = line.split(/\s{2,}/); // Split by whitespace
    console.log("lineData", lineData);
  }

  return parsedData;
}
