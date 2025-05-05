'use client';

import { generatePagination } from '@/app/lib/utils/pagination';
import { ArrowLeftIcon, ArrowRightIcon } from '@heroicons/react/24/outline';
import clsx from 'clsx';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useTransition } from 'react';

export default function Pagination({ totalPages }: { totalPages: number }) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const router = useRouter();
  const currentPage = Number(searchParams.get('page')) || 1;
  const [isPending, startTransition] = useTransition();

  const createPageURL = (pageNumber: number | string) => {
    const params = new URLSearchParams(searchParams);
    params.set('page', pageNumber.toString());
    return `${pathname}?${params.toString()}`;
  };

  const handlePageNavigation = (pageNumber: number | string) => {
    if (pageNumber === '...') return;
    
    // Don't navigate if clicking on current page
    if (pageNumber === currentPage) return;
    
    // Start a transition and update the URL
    startTransition(() => {
      const url = createPageURL(pageNumber);
      router.push(url);
    });
  };

  const allPages = generatePagination(currentPage, totalPages);

  return (
    <div className="mt-5 flex w-full justify-center">
      <div className={clsx('inline-flex', { 'opacity-70': isPending })}>
        <PaginationArrow
          direction="left"
          href={createPageURL(currentPage - 1)}
          isDisabled={currentPage <= 1 || isPending}
          onClick={() => handlePageNavigation(currentPage - 1)}
          isPending={isPending}
        />

        <div className="flex -space-x-px">
          {allPages.map((page, index) => {
            let position: 'first' | 'last' | 'single' | 'middle' | undefined;

            if (index === 0) position = 'first';
            if (index === allPages.length - 1) position = 'last';
            if (allPages.length === 1) position = 'single';
            if (page === '...') position = 'middle';

            return (
              <PaginationNumber
                key={`${page}-${index}`}
                href={createPageURL(page)}
                page={page}
                position={position}
                isActive={currentPage === page}
                onClick={() => handlePageNavigation(page)}
                isPending={isPending}
              />
            );
          })}
        </div>

        <PaginationArrow
          direction="right"
          href={createPageURL(currentPage + 1)}
          isDisabled={currentPage >= totalPages || isPending}
          onClick={() => handlePageNavigation(currentPage + 1)}
          isPending={isPending}
        />
      </div>
      
      {/* Loading indicator that appears during page transitions */}
      {isPending && (
        <div className="animate-loading-progress z-50" />
      )}
    </div>
  );
}

function PaginationNumber({
  page,
  isActive,
  position,
  onClick,
  isPending,
}: {
  page: number | string;
  href: string;
  position?: 'first' | 'last' | 'middle' | 'single';
  isActive: boolean;
  onClick: () => void;
  isPending: boolean;
}) {
  const className = clsx(
    'flex h-10 w-10 items-center justify-center text-sm border border-gray-200 cursor-pointer',
    {
      'rounded-l-md': position === 'first' || position === 'single',
      'rounded-r-md': position === 'last' || position === 'single',
      'z-10 bg-blue-600 border-blue-600 text-white': isActive,
      'hover:bg-gray-100 text-gray-700': !isActive && position !== 'middle',
      'text-gray-600': position === 'middle',
      'cursor-not-allowed': isPending,
    },
  );

  return isActive || position === 'middle' ? (
    <div className={className}>{page}</div>
  ) : (
    <button 
      onClick={onClick} 
      className={className}
      disabled={isPending}
      aria-label={`Go to page ${page}`}
    >
      {page}
    </button>
  );
}

function PaginationArrow({
  direction,
  isDisabled,
  onClick,
  isPending,
}: {
  href: string;
  direction: 'left' | 'right';
  isDisabled?: boolean;
  onClick: () => void;
  isPending: boolean;
}) {
  const className = clsx(
    'flex h-10 w-10 items-center justify-center rounded-md border border-gray-200 cursor-pointer',
    {
      'pointer-events-none text-gray-600': isDisabled,
      'hover:bg-gray-100 text-gray-700': !isDisabled,
      'mr-2 md:mr-4': direction === 'left',
      'ml-2 md:ml-4': direction === 'right',
      'cursor-not-allowed': isPending,
    },
  );

  const icon =
    direction === 'left' ? (
      <ArrowLeftIcon className="w-4" />
    ) : (
      <ArrowRightIcon className="w-4" />
    );

  const ariaLabel = direction === 'left' ? 'Go to previous page' : 'Go to next page';

  return isDisabled ? (
    <div className={className}>{icon}</div>
  ) : (
    <button 
      className={className} 
      onClick={onClick}
      disabled={isPending}
      aria-label={ariaLabel}
    >
      {icon}
    </button>
  );
}