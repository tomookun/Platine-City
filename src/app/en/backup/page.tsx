import { BackupView, backupMetadata } from "@/views/pages";

export const metadata = backupMetadata("en");

export default function Page() {
  return <BackupView locale="en" />;
}
