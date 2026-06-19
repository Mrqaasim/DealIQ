import {
  CompanyLookupResult,
  DealCalculationResult,
  DealOutputs,
  DealRequest,
  MemoResponse,
  SensitivityResponse,
} from "@/types/deal";

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000";
const REQUEST_TIMEOUT_MS = 20_000;

type ApiErrorPayload = {
  error?: {
    message?: string;
    details?: Array<{ message: string }>;
  };
  detail?: string | { message?: string };
};

async function post<T>(path: string, body: unknown): Promise<T> {
  const controller = new AbortController();
  const timeout = window.setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);
  let response: Response;
  try {
    response = await fetch(`${API_URL}${path}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
      signal: controller.signal,
    });
  } catch (error) {
    if (error instanceof DOMException && error.name === "AbortError") {
      throw new Error("The request timed out. Confirm the backend is running and try again.");
    }
    throw new Error("The DealIQ API is unavailable. Start the backend and try again.");
  } finally {
    window.clearTimeout(timeout);
  }

  if (!response.ok) {
    const payload = (await response.json().catch(() => ({}))) as ApiErrorPayload;
    const detail =
      payload.error?.details?.map((item) => item.message).join(" ") ||
      payload.error?.message ||
      (typeof payload.detail === "string"
        ? payload.detail
        : payload.detail?.message) ||
      "Unable to process the deal.";
    throw new Error(detail);
  }
  return response.json() as Promise<T>;
}

export async function lookupCompany(ticker: string): Promise<CompanyLookupResult> {
  const controller = new AbortController();
  const timeout = window.setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);
  try {
    const response = await fetch(
      `${API_URL}/company-lookup/${encodeURIComponent(ticker.trim())}`,
      { signal: controller.signal },
    );
    if (!response.ok) {
      const payload = (await response.json().catch(() => ({}))) as ApiErrorPayload;
      const message =
        (typeof payload.detail === "object" && payload.detail?.message) ||
        payload.error?.message ||
        "Company data could not be loaded.";
      throw new Error(message);
    }
    return response.json() as Promise<CompanyLookupResult>;
  } catch (error) {
    if (error instanceof DOMException && error.name === "AbortError") {
      throw new Error("Company lookup timed out. Try again or enter the figures manually.");
    }
    if (error instanceof Error) throw error;
    throw new Error("Company data could not be loaded.");
  } finally {
    window.clearTimeout(timeout);
  }
}

export async function runDeal(deal: DealRequest): Promise<DealOutputs> {
  const calculation = await post<DealCalculationResult>("/calculate-deal", deal);
  const [sensitivity, memo] = await Promise.all([
    post<SensitivityResponse>("/sensitivity", deal),
    post<MemoResponse>("/generate-memo", { ...deal, calculation }),
  ]);
  return { calculation, sensitivity, memo };
}
