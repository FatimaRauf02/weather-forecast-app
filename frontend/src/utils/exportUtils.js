function triggerDownload(filename, content, mimeType) {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

function flattenTrip(trip) {
  return trip.forecast.map((day) => ({
    location: trip.locationName,
    country: trip.country,
    startDate: trip.startDate,
    endDate: trip.endDate,
    date: day.date,
    tempMax: day.tempMax,
    tempMin: day.tempMin,
    precipitationChance: day.precipitationChance,
    isHistoricalAverage: day.isHistoricalAverage,
    unit: trip.unit,
    notes: trip.notes,
    submittedBy: trip.submittedBy,
  }));
}

export function exportToJSON(trips) {
  const data = Array.isArray(trips) ? trips : [trips];
  triggerDownload(
    `weather-trips-${Date.now()}.json`,
    JSON.stringify(data, null, 2),
    'application/json'
  );
}

export function exportToCSV(trips) {
  const data = Array.isArray(trips) ? trips : [trips];
  const rows = data.flatMap(flattenTrip);
  if (rows.length === 0) return;

  const headers = Object.keys(rows[0]);
  const csvLines = [
    headers.join(','),
    ...rows.map((row) =>
      headers
        .map((h) => {
          const val = row[h] ?? '';
          const escaped = String(val).replace(/"/g, '""');
          return /[,"\n]/.test(escaped) ? `"${escaped}"` : escaped;
        })
        .join(',')
    ),
  ];

  triggerDownload(`weather-trips-${Date.now()}.csv`, csvLines.join('\n'), 'text/csv');
}

export function exportToMarkdown(trips) {
  const data = Array.isArray(trips) ? trips : [trips];
  let md = `# Weather Trip Report\n\nGenerated ${new Date().toLocaleString()}\n\n`;

  for (const trip of data) {
    const unitLabel = trip.unit === 'fahrenheit' ? '°F' : '°C';
    md += `## ${trip.locationName}${trip.country ? `, ${trip.country}` : ''}\n\n`;
    md += `**Dates:** ${trip.startDate} to ${trip.endDate}\n\n`;
    if (trip.notes) md += `**Notes:** ${trip.notes}\n\n`;

    md += `| Date | High | Low | Rain Chance | Source |\n`;
    md += `|------|------|-----|-------------|--------|\n`;
    for (const day of trip.forecast) {
      md += `| ${day.date} | ${day.tempMax}${unitLabel} | ${day.tempMin}${unitLabel} | ${day.precipitationChance}% | ${day.isHistoricalAverage ? 'Historical avg' : 'Forecast'} |\n`;
    }
    md += '\n';

    if (trip.packingSuggestions?.length) {
      md += `**Packing suggestions:**\n`;
      for (const s of trip.packingSuggestions) md += `- ${s}\n`;
      md += '\n';
    }
    md += '---\n\n';
  }

  triggerDownload(`weather-trips-${Date.now()}.md`, md, 'text/markdown');
}
