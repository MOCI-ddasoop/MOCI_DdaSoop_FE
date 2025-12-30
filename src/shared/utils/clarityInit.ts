"use client";
import { useEffect } from "react";
import Clarity from "@microsoft/clarity";

export default function ClarityInit() {
  useEffect(() => {
    const projectId = "u8t3nll15o";
    Clarity.init(projectId);
    Clarity.identify("custom-id", "friendly-name");
  }, []);

  return null;
}
