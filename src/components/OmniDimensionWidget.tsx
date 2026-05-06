"use client";

import { useEffect } from "react";

const WIDGET_SCRIPT_ID = "omnidimension-widget-script";

function readEmbedScript() {
  const embedScript = process.env.NEXT_PUBLIC_OMNIDIM_WIDGET_EMBED_SCRIPT?.trim();

  if (!embedScript) return null;

  const template = document.createElement("template");
  template.innerHTML = embedScript;

  const script = template.content.querySelector("script");
  if (!script) {
    console.error("OmniDimension widget env must contain a script tag.");
    return null;
  }

  return {
    src: script.getAttribute("src"),
    inlineCode: script.textContent,
    attributes: Array.from(script.attributes).filter((attr) => attr.name !== "src"),
  };
}

export default function OmniDimensionWidget() {
  useEffect(() => {
    if (document.getElementById(WIDGET_SCRIPT_ID)) return;

    const embedConfig = readEmbedScript();
    const configuredSrc =
      embedConfig?.src || process.env.NEXT_PUBLIC_OMNIDIM_WIDGET_SCRIPT_URL;

    if (!configuredSrc && !embedConfig?.inlineCode) {
      console.error("OmniDimension widget script is not configured.");
      return;
    }

    const script = document.createElement("script");
    script.id = WIDGET_SCRIPT_ID;
    script.async = true;

    if (configuredSrc) {
      script.src = configuredSrc;
      script.onerror = () => {
        console.error("Failed to load OmniDimension widget script.");
      };
    }

    for (const attr of embedConfig?.attributes ?? []) {
      script.setAttribute(attr.name, attr.value);
    }

    const agentId = process.env.NEXT_PUBLIC_OMNIDIM_WIDGET_AGENT_ID;
    const secretKey = process.env.NEXT_PUBLIC_OMNIDIM_WIDGET_SECRET_KEY;

    if (agentId && !script.hasAttribute("data-agent-id")) {
      script.setAttribute("data-agent-id", agentId);
    }

    if (secretKey && !script.hasAttribute("data-secret-key")) {
      script.setAttribute("data-secret-key", secretKey);
    }

    if (embedConfig?.inlineCode) {
      script.text = embedConfig.inlineCode;
    }

    document.body.appendChild(script);

    return () => {
      script.remove();
    };
  }, []);

  return null;
}
