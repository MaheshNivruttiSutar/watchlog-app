import * as Dialog from '@radix-ui/react-dialog';
import { useState, type ReactElement } from 'react';
import { btnDanger, btnSecondary } from '../styles/ui';

interface ConfirmDeleteDialogProps {
  title: string;
  description: string;
  confirmLabel?: string;
  /** Must be a single element — Radix merges props onto it via asChild */
  trigger: ReactElement;
  onConfirm: () => void;
}

/**
 * Accessible confirm dialog (Radix Dialog):
 * - focus trapped while open
 * - Escape closes
 * - focus returns to the trigger on close
 */
function ConfirmDeleteDialog({
  title,
  description,
  confirmLabel = 'Remove',
  trigger,
  onConfirm,
}: ConfirmDeleteDialogProps) {
  const [open, setOpen] = useState(false);

  return (
    <Dialog.Root open={open} onOpenChange={setOpen}>
      <Dialog.Trigger asChild>{trigger}</Dialog.Trigger>

      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-50 bg-foreground/45" />
        <Dialog.Content className="fixed left-1/2 top-1/2 z-50 w-[min(100%-2rem,24rem)] -translate-x-1/2 -translate-y-1/2 rounded-card border border-border bg-surface-raised p-6 shadow-poster focus:outline-none">
          <Dialog.Title className="m-0 text-lg font-bold text-foreground">
            {title}
          </Dialog.Title>
          <Dialog.Description className="m-0 mt-2 text-sm leading-normal text-muted">
            {description}
          </Dialog.Description>

          <div className="mt-6 flex flex-wrap justify-end gap-3">
            <Dialog.Close asChild>
              <button type="button" className={btnSecondary}>
                Cancel
              </button>
            </Dialog.Close>
            <button
              type="button"
              className={btnDanger}
              onClick={() => {
                onConfirm();
                setOpen(false);
              }}
            >
              {confirmLabel}
            </button>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}

export default ConfirmDeleteDialog;
