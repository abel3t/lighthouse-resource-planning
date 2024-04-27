import { cn } from '@/lib/utils';

const Timeline = ({ className, ...props }: React.HTMLAttributes<HTMLUListElement>) => (
  <ol className={cn('dark:border-primary-400 border-l-2 border-gray-500', className)} {...props} />
);
Timeline.displayName = 'Timeline';

const TimelineItem = ({
  header,
  className,
  dotClassName,
  children,
  ...props
}: React.HTMLAttributes<HTMLLIElement> & { header: React.ReactNode; dotClassName?: string }) => (
  <li className={cn('', className)} {...props}>
    <div className="flex-start flex items-center">
      <div
        className={cn(
          '-ml-[9px] -mt-2 mr-3 flex h-4 w-4 items-center justify-center rounded-full bg-gray-500 ',
          dotClassName
        )}
      ></div>

      <h4 className="-mt-2 text-xl font-semibold">{header}</h4>
    </div>

    <div className="mb-6 ml-6 pb-6">{children}</div>
  </li>
);
TimelineItem.displayName = 'TimelineItem';

export { Timeline, TimelineItem };
