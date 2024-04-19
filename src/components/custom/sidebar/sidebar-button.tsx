import { LucideIcon } from 'lucide-react';

import { cn } from '@/lib/utils';

import { Button, ButtonProps } from '../../ui/button';
import { SheetClose } from '../../ui/sheet';

interface SidebarButtonProps extends ButtonProps {
  icon?: LucideIcon;
  isExpanded?: boolean;
}

export function SidebarButton({ icon: Icon, className, children, isExpanded, ...props }: SidebarButtonProps) {
  return (
    <Button variant="outline" className={cn('flex justify-start', className, isExpanded && 'gap-2')} {...props}>
      <span>{Icon && <Icon size={20} className="" />}</span>

      {isExpanded && <span className="truncate">{children}</span>}
    </Button>
  );
}

export function SidebarButtonSheet(props: SidebarButtonProps) {
  return (
    <SheetClose asChild>
      <SidebarButton {...props} />
    </SheetClose>
  );
}
