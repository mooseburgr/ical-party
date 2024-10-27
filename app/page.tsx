"use client";

import CodeBlock from "@/components/CodeBlock";

import Image from "next/image";
import boston from "../public/boston.svg";
import minnesota from "../public/minnesota.svg";
import montreal from "../public/montreal.svg";
import newyork from "../public/newyork.svg";
import ottawa from "../public/ottawa.svg";
import toronto from "../public/toronto.svg";

import React, { useState } from "react";
import {
  ToggleButton,
  ToggleButtonGroup,
  Box,
  Typography,
  Grid2 as Grid,
} from "@mui/material";

export default function ToggleButtonsPage() {
  const iconWidth = 150;
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
                <Image src={boston} alt="Boston" width={iconWidth} />
              </ToggleButton>
              <ToggleButton value="Minnesota" aria-label="Minnesota">
                <Image src={minnesota} alt="Minnesota" width={iconWidth} />
              </ToggleButton>
              <ToggleButton value="Montreal" aria-label="Montreal">
                <Image src={montreal} alt="Montreal" width={iconWidth} />
              </ToggleButton>
              <ToggleButton value="New%20York" aria-label="New York">
                <Image src={newyork} alt="New York" width={iconWidth} />
              </ToggleButton>
              <ToggleButton value="Ottawa" aria-label="Ottawa">
                <Image src={ottawa} alt="Ottawa" width={iconWidth} />
              </ToggleButton>
              <ToggleButton value="Toronto" aria-label="Toronto">
                <Image src={toronto} alt="Toronto" width={iconWidth} />
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
