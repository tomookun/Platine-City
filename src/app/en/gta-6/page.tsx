import { ChecklistIndexView, checklistMetadata } from "@/views/pages";

export const metadata = checklistMetadata("en");

export default function Page() {
  return <ChecklistIndexView locale="en" />;
}
