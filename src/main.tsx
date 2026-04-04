import React, { useState } from "react";
import { Box, Text, useInput } from "ink";
import { readFileSync } from "node:fs";
import { Projects } from "./projects";
import { Contact } from "./contact";
import { Skills } from "./skills";

const Pfp = readFileSync("./src/pfp.txt", "utf-8");
export const Portfolio = ({ visitCount = 1 }: { visitCount?: number }) => {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [currentView, setCurrentView] = useState<
    "home" | "projects" | "skills" | "contact"
  >("home");
  const links = ["Projects", "Skills", "Contact"];

  useInput((input, key) => {
    if (currentView !== "home") {
      if (key.escape) setCurrentView("home"); // press Esc to go back
      return;
    }
    if (key.leftArrow && selectedIndex > 0) {
      setSelectedIndex(selectedIndex - 1);
    }
    if (key.rightArrow && selectedIndex < links.length - 1) {
      setSelectedIndex(selectedIndex + 1);
    }
    if (key.return) {
      if (selectedIndex === 0) setCurrentView("projects");
      if (selectedIndex === 1) setCurrentView("skills");
      if (selectedIndex === 2) setCurrentView("contact");
    }
  });

  if (currentView === "projects")
    return <Projects onBack={() => setCurrentView("home")} />;
  if (currentView === "skills")
    return <Skills onBack={() => setCurrentView("home")} />;
  if (currentView === "contact")
    return <Contact onBack={() => setCurrentView("home")} />;
  const pfpLines = Pfp.split("\n");
  const pfpWidth = Math.max(...pfpLines.map((l) => l.length));

  const spotifyUrl =
    "https://open.spotify.com/user/g7da8ica1rxvv4xxk6n47c2eu?si=49673440fda8475f";
  const spotifyClick = `\x1b]8;;${spotifyUrl}\x07Music\x1b]8;;\x07`;
  const bioLines = [
    "Nathan Nguyen",
    "Georgia Tech — CS, Info Internetworks & Media",
    "",
    "Hello, my name is Nathan Nguyen and welcome to my TUI",
    "portfolio! A little about me, I am extremely interested",
    "in the limits of software and how I can use it to make",
    "real world impact. Besides that, I like to figure out why",
    "things work rather than making it work while also diving",
    "into designing systems, seeing how people interact with",
    "technology, or really anything new as I am always looking",
    "to learn more.",
    // "",
    // "Apart from that, I am currently Software Development",
    // "Program Coordinator for Whiz Learning Kids where I teach",
    // "several curricula while also maintaining and modifying",
    // "it to keep it enticing and modern. I am also currently",
    // "teaching Python 1-on-1 with high schoolers.",
    "",
    "Hobbies:",
    "  • Climbing",
    "  • Photography",
    "  • Sewing",
    "  • Gaming (Fallout, Counter-Strike, Minecraft, and more)",
    "  • " + spotifyClick + " (ctrl+click me!)",
    "  • Fashion",
    "",
    "Portfolio Architecture:",
    "  • UI: React, Ink, TypeScript",
    "  • Server: Node.js & ssh2",
    "  • Infra: Docker & Fly.io",
  ];
  const rowCount = Math.max(pfpLines.length, bioLines.length);

  return (
    <Box flexDirection="column" padding={3}>
      {Array.from({ length: rowCount }).map((_, i) => {
        const pfpLine = pfpLines[i] ?? "";
        const bioLine = bioLines[i] ?? "";
        // const isTitle = i === 0 || i == 18 || i == 25;
        // const isSubtitle = i === 1;
        // const isHobby = i >= 18 && i < 25;
        // const isArc = i >= 25;
        const isTitle = i === 0 || i === 18 || i === 25;
        const isTitle1 = i === 0; // bio
        const isTitle2 = i === 18; // hobby
        const isTitle3 = i === 25; // architecture
        const isContent1 = i > 0 && i < 18;
        const isContent2 = i > 18 && i < 25;
        const isContent3 = i > 25;

        return (
          <Box key={i} flexDirection="row">
            <Text color="#FF8DA1">{pfpLine.padEnd(pfpWidth)}</Text>
            <Text
              color={
                isTitle1
                  ? "#47D69D"
                  : isTitle2
                    ? "#CF8DA1"
                    : isTitle3
                      ? "#808080"
                      : isContent1
                        ? "#38AB7D"
                        : isContent2
                          ? "#CF8DA1"
                          : isContent3
                            ? "#7D7F7C"
                            : "#47D69D"
              }
              bold={isTitle}
              dimColor={isContent3}
            >
              {"  " + bioLine}
            </Text>
          </Box>
        );
      })}

      <Box
        alignItems="center"
        justifyContent="space-between"
        marginRight={25}
        marginTop={1}
      >
        <Text color="gray" dimColor>
          Lifetime Visitor Count: {visitCount}
        </Text>
        <Text color="#38AB7D" dimColor>
          Use [Arrow keys] and [Enter] to select
        </Text>
      </Box>
      <Box
        marginTop={1}
        gap={3}
        justifyContent="space-evenly"
        paddingRight={50}
      >
        {links.map((link, i) => (
          <Box key={i}>
            <Text
              color={i === selectedIndex ? "#FF8DA1" : "#38AB7D"}
              bold={i === selectedIndex}
            >
              {i === selectedIndex ? `[ ${link} ]` : link}
            </Text>
          </Box>
        ))}
      </Box>
    </Box>
  );
};
