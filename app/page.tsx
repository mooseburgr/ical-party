"use client";

import CodeBlock from "@/components/CodeBlock";

import Image from "next/image";
import boston from "../public/boston.png";
import minnesota from "../public/minnesota.png";
import montreal from "../public/montreal.png";
import newyork from "../public/newyork.png";
import ottawa from "../public/ottawa.png";
import toronto from "../public/toronto.png";

import React, { useState } from "react";
import {
  ToggleButton,
  ToggleButtonGroup,
  Box,
  Typography,
  Grid2 as Grid,
  Stack,
} from "@mui/material";

export default function ToggleButtonsPage() {
  const iconWidth = 100;
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
        <Grid size={12}>
          <Typography variant="h4" gutterBottom>
            PWHL teams to include
          </Typography>
        </Grid>
        <Grid size={12}>
          <ToggleButtonGroup
            value={selectedPwhlTeams}
            onChange={handlePwhlToggle}
            aria-label="PWHL teams button group"
          >
            <Grid container spacing={2}>
              <ToggleButton value="Boston" aria-label="Boston">
                <Stack alignItems="center">
                  <Image src={boston} alt="Boston" width={iconWidth} />
                  Boston
                  <br />
                  Fleet
                </Stack>
              </ToggleButton>
              <ToggleButton value="Minnesota" aria-label="Minnesota">
                <Stack alignItems="center">
                  <Image src={minnesota} alt="Minnesota" width={iconWidth} />
                  Minnesota
                  <br />
                  Frost
                </Stack>
              </ToggleButton>
              <ToggleButton value="Montreal" aria-label="Montreal">
                <Stack alignItems="center">
                  <Image src={montreal} alt="Montreal" width={iconWidth} />
                  Montréal
                  <br />
                  Victoire
                </Stack>
              </ToggleButton>
              <ToggleButton value="New York" aria-label="New York">
                <Stack alignItems="center">
                  <Image src={newyork} alt="New York" width={iconWidth} />
                  New York
                  <br />
                  Sirens
                </Stack>
              </ToggleButton>
              <ToggleButton value="Ottawa" aria-label="Ottawa">
                <Stack alignItems="center">
                  <Image src={ottawa} alt="Ottawa" width={iconWidth} />
                  Ottawa
                  <br />
                  Charge
                </Stack>
              </ToggleButton>
              <ToggleButton value="Toronto" aria-label="Toronto">
                <Stack alignItems="center">
                  <Image src={toronto} alt="Toronto" width={iconWidth} />
                  Toronto
                  <br />
                  Sceptres
                </Stack>
              </ToggleButton>
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
