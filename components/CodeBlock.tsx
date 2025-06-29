"use client";

import CheckIcon from "@mui/icons-material/Check";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import { Grid, IconButton, InputAdornment, OutlinedInput } from "@mui/material";
import { useState } from "react";

interface CodeBlockProps {
  code: string;
}

export default function CodeBlock({ code }: CodeBlockProps) {
  const [isCopied, setIsCopied] = useState(false);

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000); // Reset after 2 seconds
    } catch (err) {
      console.error("Failed to copy text: ", err);
    }
  };

  return (
    <Grid>
      <OutlinedInput
        type="text"
        fullWidth
        disabled
        value={code}
        endAdornment={
          <InputAdornment position="end">
            <IconButton
              aria-label="copy code block to your clipboard"
              edge="end"
              onClick={copyToClipboard}
            >
              {isCopied ? <CheckIcon /> : <ContentCopyIcon />}
            </IconButton>
          </InputAdornment>
        }
      />
    </Grid>
  );
}
