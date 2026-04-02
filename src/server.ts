import ssh2 from "ssh2";
const { Server } = ssh2;
import { readFileSync, writeFile, existsSync, writeFileSync } from "fs";
import { render } from "ink";
import React from "react";
import dotenv from "dotenv";
import { Portfolio } from "./main.tsx";
import { Writable } from "node:stream";
process.on("uncaughtException", (err) => console.error("Uncaught:", err));
process.on("unhandledRejection", (err) =>
  console.error("Unhandled rejection:", err),
);
dotenv.config();

const hostKey = process.env.SSH_HOST_KEY
  ? Buffer.from(process.env.SSH_HOST_KEY.replace(/\r\n/g, "\n"))
  : readFileSync(process.env.HOST_KEY_PATH || "./host.key");
console.log("Key length:", hostKey.length);

const statsFile = process.env.DATA_PATH
  ? `${process.env.DATA_PATH}/visits.txt`
  : "./visits.txt";
let lifetimeConCount = 0;

if (existsSync(statsFile)) {
  lifetimeConCount = parseInt(readFileSync(statsFile, "utf-8")) || 0;
} else {
  writeFileSync(statsFile, "0");
}

let activeConnections = 0;
const MAX_CONNECTIONS = 20;

const server = new Server(
  {
    hostKeys: [hostKey],
    debug: (msg) => console.log("ssh2:", msg),
  },
  (client) => {
    console.log("Client connected!");
    client.on("error", (err) => console.error("Client error:", err));

    if (activeConnections >= MAX_CONNECTIONS) {
      console.log("Server is at max capacity (max 20 connections). Rejecting.");
      client.end();
      return;
    }
    activeConnections++;
    writeFile(statsFile, lifetimeConCount.toString(), (err) => {
      if (err) console.error("Failed to save visit count:", err);
    });

    console.log(`Client connected! Active connections: ${activeConnections}`);
    client.on("end", () => activeConnections--);
    client.on("error", () => activeConnections--);

    client.on("authentication", (ctx) => ctx.accept()); // no password needed
    client.on("ready", () => {
      client.on("session", (accept, reject) => {
        const session = accept();
        let terminalCols = 80;
        let terminalRows = 24;

        // handle terminal window req
        session.on("pty", (accept, reject, info) => {
          terminalCols = info.cols;
          terminalRows = info.rows;
          accept();
          lifetimeConCount++;
        });

        session.on("shell", (accept, reject) => {
          // process.env.FORCE_COLOR = "3";
          // process.env.COLORTERM = "truecolor";
          const stream = accept();
          (stream as any).isTTY = true;
          (stream as any).setRawMode = () => stream;
          (stream as any).ref = () => stream;
          (stream as any).unref = () => stream;
          const safeStdout = new Writable({
            write(chunk, encoding, callback) {
              const fixedText = chunk.toString().replace(/\n/g, "\r\n");
              stream.write(fixedText);
              callback();
            },
          });
          (safeStdout as any).columns = terminalCols;
          (safeStdout as any).rows = terminalRows;
          (safeStdout as any).isTTY = true;

          // (safeStdout as any).getColorDepth = () => 24;
          // (safeStdout as any).hasColors = () => true;
          // render in terminal
          const { unmount } = render(
            React.createElement(Portfolio, { visitCount: lifetimeConCount }),
            {
              stdout: safeStdout as unknown as NodeJS.WriteStream,
              stdin: stream as unknown as NodeJS.ReadStream,
              patchConsole: false,
            },
          );

          stream.on("close", () => {
            unmount();
            client.end();
          });
        });
      });
    });
  },
);
server.on("error", (err: Error) => console.error("Server error:", err));
server.listen(2222, "::", () => {
  console.log("SSH running on port 2222");
});
