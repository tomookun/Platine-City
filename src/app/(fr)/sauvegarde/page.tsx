import { BackupView, backupMetadata } from "@/views/pages";

export const metadata = backupMetadata("fr");

export default function Page() {
  return <BackupView locale="fr" />;
}
