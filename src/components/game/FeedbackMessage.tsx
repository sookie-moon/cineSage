import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { CheckCircle2, XCircle, Info } from "lucide-react";

interface FeedbackMessageProps {
  type: "success" | "error" | "info" | null;
  message: string | null;
}

export default function FeedbackMessage({ type, message }: FeedbackMessageProps) {
  if (!type || !message) return null;

  const Icon = type === "success" ? CheckCircle2 : type === "error" ? XCircle : Info;
  const variant = type === "success" ? "default" : type === "error" ? "destructive" : "default";
  // For 'info', Shadcn Alert doesn't have a specific 'info' variant, using 'default'.
  // If specific styling is needed for 'info', Alert component would need extension or custom styling.

  return (
    <Alert variant={variant} className={`my-4 ${type === 'success' ? 'border-green-500 text-green-700 dark:border-green-400 dark:text-green-300 [&>svg]:text-green-500 dark:[&>svg]:text-green-400' : ''} ${type === 'info' ? 'border-blue-500 text-blue-700 dark:border-blue-400 dark:text-blue-300 [&>svg]:text-blue-500 dark:[&>svg]:text-blue-400' : ''}`}>
      <Icon className="h-5 w-5" />
      <AlertTitle className={type === 'success' ? 'text-green-700 dark:text-green-300' : type === 'info' ? 'text-blue-700 dark:text-blue-300' : ''}>
        {type === "success" ? "Correct!" : type === "error" ? "Incorrect!" : "Information"}
      </AlertTitle>
      <AlertDescription className={type === 'success' ? 'text-green-600 dark:text-green-200' : type === 'info' ? 'text-blue-600 dark:text-blue-200' : ''}>
        {message}
      </AlertDescription>
    </Alert>
  );
}
