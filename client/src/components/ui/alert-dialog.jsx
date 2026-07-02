export {
  Dialog as AlertDialog,
  DialogContent as AlertDialogContent,
  DialogHeader as AlertDialogHeader,
  DialogTitle as AlertDialogTitle,
  DialogFooter as AlertDialogFooter,
} from "./dialog";

export function AlertDialogDescription({ children }) {
  return <p className="mt-2 text-sm text-muted-foreground">{children}</p>;
}

export function AlertDialogCancel(props) {
  return <button {...props} />;
}

export function AlertDialogAction(props) {
  return <button {...props} />;
}
