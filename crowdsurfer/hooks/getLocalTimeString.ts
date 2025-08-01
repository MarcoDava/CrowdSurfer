// Returns current time in America/New_York as YYYY-MM-DDTHH:mm:ss (EST/EDT)
export default function getLocalTimeString() {
  const now = new Date();
  // Get parts in New York time zone
  const options: Intl.DateTimeFormatOptions = {
    timeZone: 'America/New_York',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false,
  };
  const parts = new Intl.DateTimeFormat('en-CA', options).formatToParts(now);
  const get = (type: string) => parts.find(p => p.type === type)?.value.padStart(2, '0');
  // Compose ISO string
  return `${get('year')}-${get('month')}-${get('day')}T${get('hour')}:${get('minute')}:${get('second')}`;
}