import type { ButtonHTMLAttributes, HTMLAttributes } from 'react';
import { ChevronLeftIcon, ChevronRightIcon, MoreHorizontalIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
import { buttonVariants } from './button';

function Pagination({ className, ...props }: HTMLAttributes<HTMLElement>) {
  return (
    <nav
      aria-label="pagination"
      className={cn('mx-auto flex w-full justify-center', className)}
      {...props}
    />
  );
}

function PaginationContent({ className, ...props }: HTMLAttributes<HTMLUListElement>) {
  return <ul className={cn('flex flex-row items-center gap-1', className)} {...props} />;
}

function PaginationItem({ ...props }: HTMLAttributes<HTMLLIElement>) {
  return <li {...props} />;
}

interface PaginationLinkProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  isActive?: boolean;
}

function PaginationLink({ className, isActive, ...props }: PaginationLinkProps) {
  return (
    <button
      aria-current={isActive ? 'page' : undefined}
      className={cn(buttonVariants({ variant: isActive ? 'outline' : 'ghost', size: 'icon' }), className)}
      {...props}
    />
  );
}

function PaginationPrevious({ className, ...props }: ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      aria-label="Go to previous page"
      className={cn(buttonVariants({ variant: 'ghost', size: 'icon' }), className)}
      {...props}
    >
      <ChevronLeftIcon className="h-4 w-4" />
    </button>
  );
}

function PaginationNext({ className, ...props }: ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      aria-label="Go to next page"
      className={cn(buttonVariants({ variant: 'ghost', size: 'icon' }), className)}
      {...props}
    >
      <ChevronRightIcon className="h-4 w-4" />
    </button>
  );
}

function PaginationEllipsis({ className, ...props }: HTMLAttributes<HTMLSpanElement>) {
  return (
    <span className={cn('flex h-9 w-9 items-center justify-center', className)} {...props}>
      <MoreHorizontalIcon className="h-4 w-4" />
      <span className="sr-only">More pages</span>
    </span>
  );
}

export {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationPrevious,
  PaginationNext,
  PaginationEllipsis,
};
