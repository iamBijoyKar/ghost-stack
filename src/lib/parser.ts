type ParseEntry = {
  name: string;
  sourceId: string;
  version: string;
};

export function parseTextFile(content: string) {
  const lines = content.trim().split("\n");
  const parsedData: ParseEntry[] = [];

  for (const line of lines) {
    const lineData = line.split(/\s{2,}/);
    if (lineData.length < 3) continue;
    if (lineData[lineData.length - 1] !== "winget\r") continue;

    parsedData.push({
      name: lineData[0]!,
      sourceId: lineData[1]!,
      version: lineData[2]!,
    });
  }

  return parsedData;
}
