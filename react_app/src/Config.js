export let staticPath;
export const apiUrlServices = "http://127.0.0.1:53433/api/services";
export const apiUrlCreate = "http://127.0.0.1:53433/api/create_bill";

if (process.env.NODE_ENV === "production") {
  staticPath = "/static";
} else {
  staticPath = "http://127.0.0.1:53433/static";
}
