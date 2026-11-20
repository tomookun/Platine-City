import { ChecklistIndexView, checklistMetadata } from "@/views/pages";

export const metadata = checklistMetadata("fr");

export default function Page() {
  return <ChecklistIndexView locale="fr" />;
}
