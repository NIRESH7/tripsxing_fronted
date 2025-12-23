export const environment = {
  production: false,
  api: {
    name: "testing",
    protocol: "https",
    host: "tripsxing.com/api/v1",
    port: "80",
    version: "v1",
    get url() {
      return `${this.protocol}://${this.host}`;
    },
  },
  basePath: "/",
};
