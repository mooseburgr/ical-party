"use client";

import CodeBlock from "@/components/CodeBlock";

import Image from "next/image";
import boston from "../public/boston.webp";
import minnesota from "../public/minnesota.webp";
import montreal from "../public/montreal.webp";
import newyork from "../public/newyork.webp";
import ottawa from "../public/ottawa.webp";
import toronto from "../public/toronto.webp";

import {
  Box,
  Grid2 as Grid,
  ToggleButton,
  ToggleButtonGroup,
  Tooltip,
  Typography,
} from "@mui/material";
import type React from "react";
import { useState } from "react";

export default function ToggleButtonsPage() {
  const iconWidth = 140;
  const [selectedPwhlTeams, setSelectedPwhlTeams] = useState<string[]>([
    "Minnesota",
  ]);
  const pwhlUrl = `https://ical-party.vercel.app/api/pwhl?teams=${selectedPwhlTeams.sort().join(",")}`;

  const handlePwhlToggle = (
    event: React.MouseEvent<HTMLElement>,
    newSelectedButtons: string[],
  ) => {
    setSelectedPwhlTeams(newSelectedButtons);
  };

  return (
    <Box sx={{ p: 4 }}>
      <Grid container spacing={2}>
        <Tooltip title="If no teams are selected, all games will be included">
          <Typography variant="h4" gutterBottom>
            PWHL teams to include
          </Typography>
        </Tooltip>
        <Grid size={12}>
          <ToggleButtonGroup
            value={selectedPwhlTeams}
            onChange={handlePwhlToggle}
            aria-label="PWHL teams button group"
          >
            <Grid container spacing={2}>
              <Tooltip title="Boston Fleet">
                <ToggleButton value="Boston" aria-label="Boston">
                  <Image src={boston} alt="Boston" width={iconWidth} />
                </ToggleButton>
              </Tooltip>

              <Tooltip title="Minnesota Frost">
                <ToggleButton value="Minnesota" aria-label="Minnesota">
                  <Image src={minnesota} alt="Minnesota" width={iconWidth} />
                </ToggleButton>
              </Tooltip>

              <Tooltip title="Montréal Victoire">
                <ToggleButton value="Montr" aria-label="Montreal">
                  <Image src={montreal} alt="Montreal" width={iconWidth} />
                </ToggleButton>
              </Tooltip>

              <Tooltip title="New York Sirens">
                <ToggleButton value="New%20York" aria-label="New York">
                  <Image src={newyork} alt="New York" width={iconWidth} />
                </ToggleButton>
              </Tooltip>

              <Tooltip title="Ottawa Charge">
                <ToggleButton value="Ottawa" aria-label="Ottawa">
                  <Image src={ottawa} alt="Ottawa" width={iconWidth} />
                </ToggleButton>
              </Tooltip>

              <Tooltip title="Toronto Sceptres">
                <ToggleButton value="Toronto" aria-label="Toronto">
                  <Image src={toronto} alt="Toronto" width={iconWidth} />
                </ToggleButton>
              </Tooltip>
            </Grid>
          </ToggleButtonGroup>
        </Grid>

        <Grid size={{ xs: 12, md: 8 }}>
          <Typography>Add URL to your calendar app:</Typography>
          <CodeBlock code={pwhlUrl} />
        </Grid>
      </Grid>
    </Box>
  );
}
