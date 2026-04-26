import { Box, Button, Link } from "@mui/material";

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

  return (
    <Box sx={{ display: "flex", gap: 2, mt: 2, alignItems: "center" }}>
      <Button
        variant="contained"
        color="primary"
        href={`https://calendar.google.com/calendar/u/0/r?cid=${encodeURIComponent(webcalUrl)}`}
        target="_blank"
        rel="noopener noreferrer"
        disabled={!httpsUrl}
      >
        Subscribe in Google Calendar
      </Button>
      <Button
        variant="contained"
        color="secondary"
        href={webcalUrl}
        target="_blank"
        rel="noopener noreferrer"
        disabled={!httpsUrl}
      >
        Subscribe in Other Calendar
      </Button>

      {submissionsUrl && (
        <Link href={submissionsUrl} target={"_blank"} rel={"noopener"}>
          Submit a new event here!
        </Link>
      )}
    </Box>
  );
}
