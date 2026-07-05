"use client";

import { useReportWebVitals } from "next/web-vitals";

type WebVitalsMetric = {
  id: string;
  name: string;
  value: number;
  delta: number;
  rating?: "good" | "needs-improvement" | "poor";
};

const coreWebVitals = new Set(["LCP", "INP", "CLS"]);

function reportWebVitals(metric: WebVitalsMetric) {
  if (!coreWebVitals.has(metric.name)) return;

  if (process.env.NODE_ENV === "development") {
    console.log("[CoreWebVitals]", {
      name: metric.name,
      value: metric.value,
      delta: metric.delta,
      rating: metric.rating,
      id: metric.id,
    });
  }
}

export default function WebVitals() {
  useReportWebVitals(reportWebVitals);

  return null;
}