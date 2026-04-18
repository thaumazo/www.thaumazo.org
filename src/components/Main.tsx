import Image from 'next/image';
import Markdown from '@kenstack/components/Markdown';
import { type ImageResult } from '@/utils/getImageMeta';

export default function MainOG({
  title,
  content,
  image,
}: {
  title: string;
  content: string;
  image: null | ImageResult;
}) {
  return (
    <main className="mx-auto mt-14 flex max-w-3xl flex-col gap-4 px-4">
      <h1 className="text-center text-4xl">{title}</h1>
      <Markdown className="markdown text-justify" content={content} />

      {image && (
        <div className="col-12">
          <Image
            src={image}
            className="mx-auto"
            width="800"
            height="420"
            alt="banner image"
            priority
          />
        </div>
      )}
    </main>
  );
}

import { cn } from '@kenstack/lib/utils';

import {
  PageEditor,
  PageEditorSettings,
  type DefaultValues,
  TextEdit,
  MarkdownEdit,
} from '@kenstack/pageEditor';

type MainProps = {
  slug: string;
  defaultValues: DefaultValues;
  className?: string;
  children?: React.ReactElement;
};

export function Main({ slug, defaultValues, className, children }: MainProps) {
  return (
    <main className={cn('flex flex-col gap-4', className)}>
      <PageEditor slug={slug} defaultValues={defaultValues}>
        <PageEditorSettings />
        <TextEdit tag="h1" name="title" className="text-4xl" />
        <MarkdownEdit name="content" className="markdown" />
      </PageEditor>
      {children}
    </main>
  );
}
