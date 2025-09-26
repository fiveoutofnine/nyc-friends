import type { MDXComponents } from 'mdx/types';

import { A, Article, Code, P } from '@/components/templates/mdx';

// This file is required to use MDX in `app` directory.
export function useMDXComponents(components: MDXComponents): MDXComponents {
  return {
    a: (props: React.AnchorHTMLAttributes<HTMLAnchorElement>) => <A {...props} />,
    article: (props: React.HTMLAttributes<HTMLElement>) => <Article {...props} />,
    code: (props: React.HTMLAttributes<HTMLModElement>) => <Code {...props} />,
    p: (props: React.HtmlHTMLAttributes<HTMLParagraphElement>) => <P {...props} />,
    ...components,
  };
}
