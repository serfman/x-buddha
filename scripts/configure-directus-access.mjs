const baseUrl = process.env.DIRECTUS_URL;
const email = process.env.DIRECTUS_ADMIN_EMAIL;
const password = process.env.DIRECTUS_ADMIN_PASSWORD;

if (!baseUrl || !email || !password) {
  throw new Error("Set DIRECTUS_URL, DIRECTUS_ADMIN_EMAIL and DIRECTUS_ADMIN_PASSWORD.");
}

const apiUrl = (path) => new URL(path.replace(/^\//, ""), baseUrl.endsWith("/") ? baseUrl : `${baseUrl}/`);

const loginResponse = await fetch(apiUrl("auth/login"), {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ email, password }),
});

if (!loginResponse.ok) throw new Error(`Directus login failed (${loginResponse.status}).`);
const { data: login } = await loginResponse.json();

async function request(path, init = {}) {
  const response = await fetch(apiUrl(path), {
    ...init,
    headers: { Authorization: `Bearer ${login.access_token}`, "Content-Type": "application/json", ...init.headers },
  });
  if (!response.ok) throw new Error(`Directus request ${path} failed (${response.status}).`);
  return response.json();
}

const { data: policies } = await request("policies?fields=id,admin_access,app_access");
const publicPolicy = policies.find((policy) => !policy.admin_access && !policy.app_access);
if (!publicPolicy) throw new Error("Directus public policy was not found.");

const rules = [
  {
    collection: "articles",
    action: "read",
    permissions: { status: { _eq: "published" } },
    fields: ["id", "status", "title", "slug", "excerpt", "content", "cover", "published_at", "updated_at", "seo_title", "seo_description", "og_image"],
  },
  {
    collection: "directus_files",
    action: "read",
    permissions: { type: { _starts_with: "image/" } },
    fields: ["id", "width", "height", "title", "description", "type"],
  },
];

for (const rule of rules) {
  const query = new URLSearchParams({ "filter[policy][_eq]": publicPolicy.id, "filter[collection][_eq]": rule.collection, "filter[action][_eq]": rule.action, fields: "id" });
  const { data: existing } = await request(`permissions?${query}`);
  const body = JSON.stringify({ policy: publicPolicy.id, ...rule });

  if (existing[0]?.id) {
    await request(`permissions/${existing[0].id}`, { method: "PATCH", body });
  } else {
    await request("permissions", { method: "POST", body });
  }
}

console.log("Directus public access is limited to published articles and image assets.");
