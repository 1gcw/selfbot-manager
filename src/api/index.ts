import fastify from "fastify";
import autoload from "@fastify/autoload";
import fastifyStatic from "@fastify/static";
import cookie from '@fastify/cookie';
import { errorHandler } from "@/api/functions/utils.js";
import { join } from "path";

const port = Number(process.env.apiPort) || 8080;

const app = fastify();

app.register(cookie);
app.setErrorHandler(errorHandler);
app.register(autoload, {
  dir: join(import.meta.dirname, 'routes'),
  routeParams: true
});
app.register(fastifyStatic, {
  root: join(import.meta.dirname, 'frontend')
});

app.listen({ port: port, host: '0.0.0.0' }).then(() => {
  console.log('\u001b[31m@ ROOT/\u001b[32mAPI\u001b[0m\n> Server is running on http://localhost:8080\n> Server listening on port ' + port + '\n\n');
}).catch((err) => {
  console.log(err);
  process.exit(1);
});