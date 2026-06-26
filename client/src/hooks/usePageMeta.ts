import { useEffect } from "react";

type PageMetaOptions = {
  title: string;
  description?: string;
  imageUrl?: string;
  canonicalUrl?: string;
  allowIndex?: boolean;
  schemaJson?: object;
};

function setMetaTag(property: string, content: string, isName = false): void {
  const attr = isName ? "name" : "property";
  let el = document.querySelector<HTMLMetaElement>(`meta[${attr}="${property}"]`);
  if (!el) {
    el = document.createElement("meta");
    el.setAttribute(attr, property);
    document.head.appendChild(el);
  }
  el.setAttribute("content", content);
}

function setCanonical(url: string): void {
  let el = document.querySelector<HTMLLinkElement>('link[rel="canonical"]');
  if (!el) {
    el = document.createElement("link");
    el.setAttribute("rel", "canonical");
    document.head.appendChild(el);
  }
  el.setAttribute("href", url);
}

function setSchemaScript(json: object): void {
  const existingId = "schema-json-ld";
  let el = document.getElementById(existingId) as HTMLScriptElement | null;
  if (!el) {
    el = document.createElement("script");
    el.id = existingId;
    el.setAttribute("type", "application/ld+json");
    document.head.appendChild(el);
  }
  el.textContent = JSON.stringify(json);
}

function removeSchemaScript(): void {
  document.getElementById("schema-json-ld")?.remove();
}

function removeCanonical(): void {
  document.querySelector('link[rel="canonical"]')?.remove();
}

export function usePageMeta({
  title,
  description,
  imageUrl,
  canonicalUrl,
  allowIndex = false,
  schemaJson,
}: PageMetaOptions): void {
  useEffect(() => {
    const previousTitle = document.title;
    document.title = title;

    if (description) {
      setMetaTag("description", description, true);
      setMetaTag("og:description", description);
      setMetaTag("twitter:description", description);
    }

    setMetaTag("og:title", title);
    setMetaTag("twitter:title", title);

    if (imageUrl) {
      setMetaTag("og:image", imageUrl);
      setMetaTag("twitter:image", imageUrl);
      setMetaTag("twitter:card", "summary_large_image", true);
    }

    const robotsContent = allowIndex ? "index, follow" : "noindex, nofollow";
    setMetaTag("robots", robotsContent, true);

    if (canonicalUrl) {
      setCanonical(canonicalUrl);
    }

    if (schemaJson) {
      setSchemaScript(schemaJson);
    }

    return () => {
      document.title = previousTitle;
      if (!allowIndex) return;
      setMetaTag("robots", "noindex, nofollow", true);
      removeCanonical();
      removeSchemaScript();
    };
  }, [title, description, imageUrl, canonicalUrl, allowIndex, schemaJson]);
}
