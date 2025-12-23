export const environment = {
  production: true,
  api: {
    name: "production",
    protocol: "https",
    host: "tripsxing.com/api/v1",
    port: "80",
    version: "v1",
    get url() {
      return `${this.protocol}://${this.host}`;
    },
  },
};
