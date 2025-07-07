import data from "~/data/data.json";

type ParseEntry = {
  name: string;
  sourceId: string;
  version: string;
  icon?: string;
};

export function parseTextFile(content: string) {
  const lines = content.trim().split("\n");
  const parsedData: ParseEntry[] = [];

  for (const line of lines) {
    const lineData = line.split(/\s{2,}/);
    if (lineData.length < 3) continue;
    if (lineData[lineData.length - 1] !== "winget\r") continue;
    if (!lineData[2]?.trim().match(/^\d+\.\d+\.\d+$/)) continue; // Skip if version is empty

    const item = Object.values(data).filter((item) => {
      return item.source === lineData[1];
    });

    parsedData.push({
      name: lineData[0]!,
      sourceId: lineData[1]!,
      version: lineData[2]!,
      icon: item[0]?.icon,
    });
  }

  return parsedData;
}
