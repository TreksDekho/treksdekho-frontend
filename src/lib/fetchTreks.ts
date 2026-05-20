import type { Trek } from '@/data/treks';

function parseCSVRow(row: string): string[] {
  const result: string[] = [];
  let current = '';
  let inQuotes = false;
  for (let i = 0; i < row.length; i++) {
    const ch = row[i];
    if (ch === '"') {
      inQuotes = !inQuotes;
    } else if (ch === ',' && !inQuotes) {
      result.push(current.trim());
      current = '';
    } else {
      current += ch;
    }
  }
  result.push(current.trim());
  return result;
}

export async function fetchTreksFromSheet(): Promise<Trek[] | null> {
  const url = process.env.NEXT_PUBLIC_TREKS_SHEET_URL;
  if (!url) return null;

  try {
    const res = await fetch(url, { cache: 'no-store' });
    if (!res.ok) return null;
    const text = await res.text();

    const [, ...rows] = text.split('\n').filter(Boolean); // skip header row
    return rows.map((row) => {
      const [
        id, slug, name, location, region, difficulty, duration, price,
        groupSize, image, about, heritage, whyTrek, photo1, photo2,
        meetingPoint, nextDate, isMonsoonPick, operatorName, operatorInstagram,
        includes, carry,
      ] = parseCSVRow(row);

      return {
        id,
        slug,
        name,
        location,
        region,
        difficulty: difficulty as Trek['difficulty'],
        duration,
        price: Number(price),
        groupSize,
        image,
        about,
        heritage,
        whyTrek,
        photos: [photo1, photo2] as [string, string],
        meetingPoint,
        nextDate,
        isMonsoonPick: isMonsoonPick === 'true',
        operatorName,
        operatorInstagram,
        includes: includes.split('|').map((s) => s.trim()),
        carry: carry.split('|').map((s) => s.trim()),
      };
    });
  } catch {
    return null;
  }
}
