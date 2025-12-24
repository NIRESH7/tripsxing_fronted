export const environment = {
  production: false,
  api: {
    name: "development",
    protocol: "http",
    // host: "api.tripsxing.com/api/v1",
    host: "192.168.1.14:3000/api/v1",
    port: "3000",
    version: "v1",
    get url() {
      return `${this.protocol}://${this.host}`;
    },
  },
  basePath: "/",
};
