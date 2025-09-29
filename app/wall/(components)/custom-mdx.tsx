'use client';

import type { MDXRemoteSerializeResult } from 'next-mdx-remote';

import { default as CustomMDXTemplate } from '@/components/templates/custom-mdx';

// -----------------------------------------------------------------------------
// Types
// -----------------------------------------------------------------------------

type CustomMDXProps = {
  mdxSource: MDXRemoteSerializeResult;
};

// -----------------------------------------------------------------------------
// Component
// -----------------------------------------------------------------------------

const CustomMDX: React.FC<CustomMDXProps> = ({ mdxSource }) => {
  return <CustomMDXTemplate {...mdxSource} />;
};

export default CustomMDX;
