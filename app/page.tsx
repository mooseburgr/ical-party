"use client";

import {
  Box,
  Button,
  Grid,
  ToggleButton,
  ToggleButtonGroup,
  Tooltip,
  Typography,
} from "@mui/material";

import Image from "next/image";
import type React from "react";
import { useState } from "react";
import CodeBlock from "@/components/CodeBlock";
import boston from "../public/boston.webp";
import minnesota from "../public/minnesota.webp";
import montreal from "../public/montreal.webp";
import newyork from "../public/newyork.webp";
import ottawa from "../public/ottawa.webp";
import seattle from "../public/seattle.webp";
import toronto from "../public/toronto.webp";
import vancouver from "../public/vancouver.webp";

export default function ToggleButtonsPage() {
  const iconWidth = 140;
  const [selectedPwhlTeams, setSelectedPwhlTeams] = useState<string[]>([
    "Minnesota",
  ]);
  const pwhlUrl = `https://ical-party.vercel.app/api/pwhl?teams=${selectedPwhlTeams.sort().join(",")}`;

  const handlePwhlToggle = (
    _event: React.MouseEvent<HTMLElement>,
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

              <Tooltip title="PWHL Seattle">
                <ToggleButton value="Seattle" aria-label="Seattle">
                  <Image src={seattle} alt="Seattle" width={iconWidth} />
                </ToggleButton>
              </Tooltip>

              <Tooltip title="Toronto Sceptres">
                <ToggleButton value="Toronto" aria-label="Toronto">
                  <Image src={toronto} alt="Toronto" width={iconWidth} />
                </ToggleButton>
              </Tooltip>

              <Tooltip title="PWHL Vancouver">
                <ToggleButton value="Vancouver" aria-label="Vancouver">
                  <Image src={vancouver} alt="Vancouver" width={iconWidth} />
                </ToggleButton>
              </Tooltip>
            </Grid>
          </ToggleButtonGroup>
        </Grid>

        <Grid size={{ xs: 12, md: 8 }}>
          <Typography>Add URL to your calendar app:</Typography>
          <CodeBlock code={pwhlUrl} />

          <Box sx={{ display: "flex", gap: 2, mt: 2 }}>
            <Button
              variant="contained"
              color="primary"
              href={`https://calendar.google.com/calendar/u/0/r?cid=${encodeURIComponent(
                pwhlUrl.replace("https://", "webcal://"),
              )}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              Subscribe in Google Calendar
            </Button>
            <Button
              variant="contained"
              color="secondary"
              href={`${pwhlUrl.replace("https://", "webcal://")}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              Subscribe in Other Calendar
            </Button>
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
}
