const safe = (v) => v ?? "";

const dayMap = {
  Sun: "SU",
  Mon: "MO",
  Tue: "TU",
  Wed: "WE",
  Thu: "TH",
  Fri: "FR",
  Sat: "SA",
};

const buildRRule = (recurring, endDate) => {
  if (!recurring?.length) return "";

  const days = recurring
    .map(d => dayMap[d])
    .filter(Boolean)
    .join(",");

  const until = endDate
    ? `;UNTIL=${endDate.replaceAll("-", "")}T235900Z`
    : "";

  return `RRULE:FREQ=WEEKLY;BYDAY=${days}${until}`;
};

export function toICSDate(date, time) {
    const d = safe(date).replaceAll("-", "");
    const t = safe(time).split("+")[0].replaceAll(":", "");

    if (!d || !t) return null;

    return `${d}T${t}`;
}

export function generateICS(events) {
  const header =
`BEGIN:VCALENDAR
VERSION:2.0
CALSCALE:GREGORIAN
PRODID:-//SkeduleIt//Schedule Export//EN`;

  const footer = "END:VCALENDAR";

  const body = events.map(event => {
    const start = toICSDate(event.start_date, event.start_time);
    const end = toICSDate(event.start_date, event.end_time); 

    if (!start || !end) return "";

    const rrule = buildRRule(event.recurring, event.end_date);

    return `BEGIN:VEVENT
SUMMARY:${(event.title || "No Title").replace(/\n/g, " ")}
DTSTART:${start}
DTEND:${end}
${rrule}
END:VEVENT`;
  }).filter(Boolean).join("\n");

  return `${header}\n${body}\n${footer}`;
}