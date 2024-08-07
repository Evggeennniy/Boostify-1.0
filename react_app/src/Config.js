export let staticPath;
export let apiUrlServices;
export let apiUrlCreate;

if (process.env.NODE_ENV === "production") {
  staticPath = "/static";
  apiUrlServices = "/api/services";
  apiUrlCreate = "/api/create_bill";
} else {
  staticPath = "http://127.0.0.1:53433/static";
  apiUrlServices = "http://127.0.0.1:53433/api/services";
  apiUrlCreate = "http://127.0.0.1:53433/api/create_bill";
}
