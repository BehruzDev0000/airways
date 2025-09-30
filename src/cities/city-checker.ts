import fetch from "node-fetch";
import { Citizenship } from "src/enums/citizenship.enum";       
import { CitizenshipCode } from "src/enums/citizenship-code.enum";  

const NAME_TO_ISO2: Record<string, string> = Object.fromEntries(
  Object.entries(CitizenshipCode).map(([key, iso2]) => {
    const displayName = (Citizenship as any)[key] ?? key;
    return [displayName, iso2 as string];
  })
);

function normalize(s: string) {
  return s.normalize("NFKD").replace(/\p{Diacritic}/gu, "").trim();
}

export async function cityChecker(
  country: Citizenship | string,
  city: string
): Promise<boolean> {
  const iso2 =
    NAME_TO_ISO2[country as string] ??
    NAME_TO_ISO2[
      Object.keys(NAME_TO_ISO2).find(
        n => normalize(n).toLowerCase() === normalize(country as string).toLowerCase()
      ) || ""
    ];

  if (!iso2) return false;

  const url =
    `https://nominatim.openstreetmap.org/search` +
    `?q=${encodeURIComponent(city)}` +
    `&countrycodes=${iso2.toLowerCase()}` +
    `&format=jsonv2&addressdetails=1&limit=1`;

  const res = await fetch(url, { headers: { "User-Agent": "your-app/1.0" } });
  if (!res.ok) return false;

  const jsonData = await res.json();
  if (!Array.isArray(jsonData) || jsonData.length === 0) return false;
  const data: any[] = jsonData;

  const rec = data[0];
  const cc = rec?.address?.country_code?.toUpperCase();

  if (cc && cc !== iso2.toUpperCase()) return false;

  const disp = `${rec.display_name || ""}`;
  return (
    cc === iso2.toUpperCase() ||
    normalize(disp).toLowerCase().includes(
      normalize(
        Object.keys(NAME_TO_ISO2).find(k => NAME_TO_ISO2[k] === iso2) || ""
      ).toLowerCase()
    )
  );
}
