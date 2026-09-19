"use client";

import {
  Box,
  Button,
  Grid,
  ToggleButton,
  ToggleButtonGroup,
  Typography,
} from "@mui/material";

import Image from "next/image";
import type React from "react";
import { useState } from "react";
import CodeBlock from "@/components/CodeBlock";
import boston from "../public/boston.webp";
import detroit from "../public/detroit.webp";
import hamilton from "../public/hamilton.webp";
import lasvegas from "../public/las-vegas.webp";
import minnesota from "../public/minnesota.webp";
import montreal from "../public/montreal.webp";
import newyork from "../public/new-york.webp";
import ottawa from "../public/ottawa.webp";
import sanjose from "../public/san-jose.webp";
import seattle from "../public/seattle.webp";
import toronto from "../public/toronto.webp";
import vancouver from "../public/vancouver.webp";

const pwhlTeams = [
  { name: "Boston Fleet", value: "Boston", image: boston },
  { name: "PWHL Detroit", value: "Detroit", image: detroit },
  { name: "PWHL Hamilton", value: "Hamilton", image: hamilton },
  { name: "PWHL Las Vegas", value: "Las%20Vegas", image: lasvegas },
  { name: "Minnesota Frost", value: "Minnesota", image: minnesota },
  { name: "Montréal Victoire", value: "Montr", image: montreal },
  { name: "New York Sirens", value: "New%20York", image: newyork },
  { name: "Ottawa Charge", value: "Ottawa", image: ottawa },
  { name: "PWHL San Jose", value: "San%20Jose", image: sanjose },
  { name: "Seattle Torrent", value: "Seattle", image: seattle },
  { name: "Toronto Sceptres", value: "Toronto", image: toronto },
  { name: "Vancouver Goldeneyes", value: "Vancouver", image: vancouver },
];

export default function ToggleButtonsPage() {
  const iconWidth = 120;
  const [selectedPwhlTeams, setSelectedPwhlTeams] = useState<string[]>([
    "Minnesota",
  ]);
  const pwhlUrl = `https://ical-party.vercel.app/api/pwhl?teams=${selectedPwhlTeams.toSorted().join(",")}`;

  const handlePwhlToggle = (
    _event: React.MouseEvent<HTMLElement>,
    newSelectedButtons: string[],
  ) => {
    setSelectedPwhlTeams(newSelectedButtons);
  };

  return (
    <Box sx={{ p: 4 }}>
      <Grid container spacing={2}>
        <Grid size={12}>
          <Box component="fieldset" >
            <Typography component="legend" id="pwhl-teams-label" variant="h4">
              PWHL teams to include
            </Typography>
            <Typography id="pwhl-teams-help" sx={{ mb: 2 }}>
              Choose one or more teams. If none are selected, all games will be
              included.
            </Typography>

            <ToggleButtonGroup
              value={selectedPwhlTeams}
              onChange={handlePwhlToggle}
              aria-labelledby="pwhl-teams-label"
              aria-describedby="pwhl-teams-help"
              sx={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))",
                gap: 1.5,
                width: "100%",
                "& .MuiToggleButtonGroup-grouped": {
                  border: 1,
                  borderColor: "divider",
                  borderRadius: 2,
                  flexDirection: "column",
                  gap: 1,
                  minHeight: 156,
                  p: 1.5,
                  textTransform: "none",
                  color: "text.primary",
                  transition: "all 0.2s ease-in-out",
                  "&:hover": {
                    borderColor: "primary.main",
                    backgroundColor: "action.hover",
                  },
                  "&.Mui-selected": {
                    borderColor: "primary.main",
                    backgroundColor: "primary.main",
                    color: "primary.contrastText",
                    "&:hover": {
                      backgroundColor: "primary.dark",
                    },
                  },
                },
              }}
            >
              {pwhlTeams.map((team) => (
                <ToggleButton
                  key={team.value}
                  value={team.value}
                  aria-label={team.name}
                >
                  <Image
                    src={team.image}
                    alt={`team logo for ${team.name}`}
                    width={iconWidth}
                    height={iconWidth}
                    style={{ objectFit: "contain" }}
                  />
                  <Box
                    component="span"
                    sx={{ typography: "body2", fontWeight: 600 }}
                  >
                    {team.name}
                  </Box>
                </ToggleButton>
              ))}
            </ToggleButtonGroup>
          </Box>
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
