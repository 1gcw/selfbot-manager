import type { FastifyError, FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
import { ZodError } from "zod";

type DefineRouteHandler = (app: FastifyInstance) => any;

export function defineRoutes(handler: DefineRouteHandler) {
  return function (app: FastifyInstance, _: {}, done: Function) {
    handler(app);
    done();
  }
}

export function errorHandler(error: FastifyError, _: FastifyRequest, reply: FastifyReply) {
  if (error instanceof ZodError) {
    const errors = error.issues.map(issue => ({
      path: issue.path.join('.'),
      message: issue.message
    }));

    return reply.status(400).send({ success: false, status: 'Validation Error', errors });
  }
}