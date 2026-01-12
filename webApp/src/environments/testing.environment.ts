export const environment = {
  production: false,
  api: {
    name: "testing",
    protocol: "http",
    host: "192.168.29.144:3001/api/v1",
    port: "3001",
    version: "v1",
    get url() {
      return `${this.protocol}://${this.host}`;
    },
  },
  basePath: "/",
};
