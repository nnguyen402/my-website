import ssh2 from "ssh2";
const { Server } = ssh2;
import { readFileSync } from "fs";
import { render } from "ink";
import React from "react";
import dotenv from "dotenv";
import { Portfolio } from "./main.tsx";
import { Writable } from "node:stream";

dotenv.config();

const hostKey = readFileSync(process.env.HOST_KEY_PATH || "./host.key");

const server = new Server({ hostKeys: [hostKey] }, (client) => {
  console.log("Client connected!");

  client.on("authentication", (ctx) => ctx.accept()); // auth change later

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
      });

      session.on("shell", (accept, reject) => {
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
        // render in terminal
        const { unmount } = render(React.createElement(Portfolio), {
          stdout: safeStdout as unknown as NodeJS.WriteStream,
          stdin: stream as unknown as NodeJS.ReadStream,
          patchConsole: false,
        });

        stream.on("close", () => {
          unmount();
          client.end();
        });
      });
    });
  });
});

server.listen(2222, "127.0.0.1", () => {
  console.log("SSH running on port 2222");
  console.log("run by: ssh -p 2222 test@localhost");
});
