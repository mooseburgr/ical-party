"use client";

import { Box, Button, Grid, Tooltip, Typography } from "@mui/material";

import CodeBlock from "@/components/CodeBlock";

export default function ToggleButtonsPage() {
  const httpsUrl = "https://ical-party.vercel.app/api/tkers";
  const webcalUrl = httpsUrl.replace("https", "webcal");
  return (
    <Box sx={{ p: 4 }}>
      <Grid container spacing={2}>
        <Grid size={{ xs: 12 }}>
          <Tooltip title="iykyk">
            <Typography variant="h4" gutterBottom>
              TKers
            </Typography>
          </Tooltip>
          <Typography>Add URL to your calendar app:</Typography>
        </Grid>

        <Grid size={{ xs: 12, md: 6, lg: 4 }}>
          <CodeBlock code={httpsUrl} />
        </Grid>

        <Grid size={{ xs: 12 }}>
          <Box sx={{ display: "flex", gap: 2, mt: 2 }}>
            <Button
              variant="contained"
              color="primary"
              href={`https://calendar.google.com/calendar/u/0/r?cid=${encodeURIComponent(webcalUrl)}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              Subscribe in Google Calendar
            </Button>
            <Button
              variant="contained"
              color="secondary"
              href={webcalUrl}
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
