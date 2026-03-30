import React from "react";
import { Box, Text, useInput } from "ink";

const projects = [
  {
    name: "Animal Training App",
    url: "https://github.com/BoG-Dev-Bootcamp-F25/project2-f25-RJNA",
  },
  {
    name: "MARTA Interface",
    url: "https://github.com/BoG-Dev-Bootcamp-F25/project1-f25-NathanN",
  },
  {
    name: "Video Game in C using GBA (demo only)",
    url: "https://youtu.be/XQ0P_xhTYpM",
  },
];

const link = (text: string, url: string) =>
  `\x1b]8;;${url}\x07${text}\x1b]8;;\x07`;

interface ProjectsProps {
  onBack: () => void;
}

export const Projects = ({ onBack }: ProjectsProps) => {
  useInput((input, key) => {
    if (key.escape) onBack();
  });
  return (
    <Box flexDirection="column" padding={3}>
      <Text color="#47D69D" bold>
        Projects (ctrl+click)
      </Text>
      <Box flexDirection="column" marginTop={1}>
        {projects.map((project, i) => (
          <Box key={i}>
            <Text color="#38AB7D">• </Text>
            <Text color="#FF8DA1">{link(project.name, project.url)}</Text>
          </Box>
        ))}
      </Box>
      <Box marginTop={2}>
        <Text color="#38AB7D" dimColor>
          esc to go back
        </Text>
      </Box>
    </Box>
  );
};
