import api from "./api";

/**
 * Create a new post.
 * - elements: array from PostEditor (text/code/image objects)
 * - title: optional string
 */
export async function createPostMultipart(elements, title = "") {
  const form = new FormData();

  // Build Body string from elements
  const parts = elements.map((el) => {
    if (el.type === "text") {
      return `${el.content ?? ""}\n\n`;
    } else if (el.type === "code") {
      return "```" + "\n" + (el.content ?? "") + "\n" + "```\n\n";
    } else if (el.type === "image" && el.imagePreview) {
      // Placeholder in body text (real file is attached separately)
      return `![${el.imageName || "image"}]()` + "\n\n";
    }
    return "";
  });

  const bodyText = parts.join("").trim();

  form.append("Title", title ?? "");
  form.append("Body", bodyText ?? "");

  // Append files as Attachments[]
  let fileIndex = 0;
  elements.forEach((el) => {
    if (el.type === "image" && el.imageFile) {
      form.append(
        "Attachments",
        el.imageFile,
        el.imageName || `image-${fileIndex}.png`
      );
      fileIndex++;
    }
  });

  // Backend endpoint: POST /api/Posts
  const body = await api.request("/api/Posts", {
    method: "POST",
    body: form,
  });

  return body;
}
