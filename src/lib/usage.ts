const USAGE_KEY = "decode_daily_usage";
const FREE_DAILY_LIMIT = 5;

interface UsageData {
  date: string;
  count: number;
}

function today(): string {
  return new Date().toISOString().slice(0, 10);
}

export function getUsage(): { count: number; limit: number; remaining: number; isPro: boolean } {
  if (typeof window === "undefined") {
    return { count: 0, limit: FREE_DAILY_LIMIT, remaining: FREE_DAILY_LIMIT, isPro: false };
  }

  const isPro = localStorage.getItem("decode_pro") === "true";
  if (isPro) {
    return { count: 0, limit: Infinity, remaining: Infinity, isPro: true };
  }

  const raw = localStorage.getItem(USAGE_KEY);
  const data: UsageData = raw ? JSON.parse(raw) : { date: today(), count: 0 };

  if (data.date !== today()) {
    data.date = today();
    data.count = 0;
    localStorage.setItem(USAGE_KEY, JSON.stringify(data));
  }

  return {
    count: data.count,
    limit: FREE_DAILY_LIMIT,
    remaining: Math.max(0, FREE_DAILY_LIMIT - data.count),
    isPro: false,
  };
}

export function recordUsage(): boolean {
  const usage = getUsage();
  if (usage.isPro) return true;
  if (usage.remaining <= 0) return false;

  const data: UsageData = {
    date: today(),
    count: usage.count + 1,
  };
  localStorage.setItem(USAGE_KEY, JSON.stringify(data));
  return true;
}

export function setProStatus(isPro: boolean): void {
  if (typeof window !== "undefined") {
    localStorage.setItem("decode_pro", isPro ? "true" : "false");
  }
}
