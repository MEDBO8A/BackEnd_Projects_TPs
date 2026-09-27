import http from "node:http";

const port = 3000;

const server = http.createServer((req, res) => {
  res.writeHead(200, {
    "Content-Type": "text/plain; charset=utf-8"
  });

  res.end("Bienvenue dans SangConnect");
});

server.listen(port, () => {
  console.log(`Serveur démarré sur http://localhost:${port}`);
});