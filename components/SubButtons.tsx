"use client";

import CheckIcon from "@mui/icons-material/Check";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import { Box, Button, Link } from "@mui/material";
import { useState } from "react";

interface Props {
  icalUrl: string;
  submissionsUrl?: string;
}

export default function SubButtons({
  icalUrl,
  submissionsUrl,
}: Readonly<Props>) {
  const httpsUrl = icalUrl.startsWith("https://")
    ? icalUrl
    : icalUrl.replace("http://", "https://").replace("webcal://", "https://");
  const webcalUrl = httpsUrl.replace("https", "webcal");

  const [isCopied, setIsCopied] = useState(false);

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(httpsUrl);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000); // Reset after 2 seconds
    } catch (err) {
      console.error("Failed to copy text: ", err);
    }
  };

  return (
    <Box
      sx={{
        display: "flex",
        gap: 2,
        mt: 2,
        alignItems: "center",
        flexDirection: { xs: "column", sm: "row" },
      }}
    >
      <Button
        variant="outlined"
        onClick={copyToClipboard}
        endIcon={isCopied ? <CheckIcon /> : <ContentCopyIcon />}
      >
        Copy URL
      </Button>

      <Button
        variant="contained"
        href={`https://calendar.google.com/calendar/u/0/r?cid=${encodeURIComponent(webcalUrl)}`}
        target="_blank"
        rel="noopener noreferrer"
        disabled={!httpsUrl}
      >
        Subscribe in Google Cal
      </Button>

      <Button
        variant="contained"
        color="secondary"
        href={webcalUrl}
        target="_blank"
        rel="noopener noreferrer"
        disabled={!httpsUrl}
      >
        Subscribe in Other Cal
      </Button>

      {submissionsUrl && (
        <Link href={submissionsUrl} target={"_blank"} rel={"noopener"}>
          Submit a new event here!
        </Link>
      )}
    </Box>
  );
}
