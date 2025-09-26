import clsx from 'clsx';
import { twMerge } from 'tailwind-merge';

const Code: React.FC<React.HTMLAttributes<HTMLModElement>> = ({ className, ...rest }) => {
  return (
    <code
      className={twMerge(
        clsx(
          'rounded border border-gray-6 bg-gray-3 px-1 py-0.5 font-mono text-[0.875em] font-normal leading-[1.15] text-gray-12 before:content-none after:content-none group-[.mdx--link]:text-blue-11',
          className,
        ),
      )}
      {...rest}
    />
  );
};

export default Code;
