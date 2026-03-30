import React, { useState } from "react";
import { Box, Text, useInput } from "ink";
import { readFileSync } from "node:fs";
import { Projects } from "./projects";

const Pfp = readFileSync("./src/pfp.txt", "utf-8");
export const Portfolio = () => {
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
  const pfpLines = Pfp.split("\n");
  const pfpWidth = Math.max(...pfpLines.map((l) => l.length));

  const spotifyUrl =
    "https://open.spotify.com/user/g7da8ica1rxvv4xxk6n47c2eu?si=49673440fda8475f";
  const spotifyClick = `\x1b]8;;${spotifyUrl}\x07  • Music (ctrl+click me!)\x1b]8;;\x07`;
  const bioLines = [
    "",
    "Nathan Nguyen",
    "Georgia Tech — CS, Info Internetworks & Media",
    "",
    "Hello! My name is Nathan Nguyen and I am a Georgia Tech",
    "student studying Computer Science with a focus in",
    "Information Internetworks and Media. I am extremely",
    "interested in the depths of CS and how I can use it to",
    "make real world impact. Besides that, I want to figure",
    "out why things work rather than making it work while",
    "also diving into designing systems, seeing how people",
    "interact with technology, or really anything new as I",
    "am always looking to learn more.",
    "",
    "Apart from that, I am a Software Development Program",
    "Coordinator for Whiz Learning Kids where I teach",
    "several curricula while also maintaining and modifying",
    "it to keep it enticing and modern. I am also currently",
    "teaching Python 1-on-1 with high schoolers.",
    "",
    "Hobbies:",
    "  • Climbing",
    "  • Sewing",
    "  • Gaming  (Fallout, Counter-Strike, Minecraft)",
    spotifyClick,
    "  • Fashion",
  ];
  const rowCount = Math.max(pfpLines.length, bioLines.length);

  return (
    <Box flexDirection="column" padding={3}>
      {Array.from({ length: rowCount }).map((_, i) => {
        const pfpLine = pfpLines[i] ?? "";
        const bioLine = bioLines[i] ?? "";
        const isTitle = i === 1;
        const isSubtitle = i === 2;

        return (
          <Box key={i} flexDirection="row">
            <Text color="#FF8DA1">{pfpLine.padEnd(pfpWidth)}</Text>
            <Text
              color={isTitle ? "#47D69D" : isSubtitle ? "#47D69D" : "#38AB7D"}
              bold={isTitle}
            >
              {"  " + bioLine}
            </Text>
          </Box>
        );
      })}

      <Box
        marginTop={2}
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
