import { defineRoutes } from "@/api/functions/utils.js";

export default defineRoutes(app => {
  app.get('/', (_req, reply) => {
    reply.status(200).send({
      message: 'Hello, World!'
    });
  });
});