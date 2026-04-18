import { Main, Container } from '@/components';
import Form from '@kenstack/auth/components/ResetPassword';

import { loadMeta } from '@kenstack/pageEditor';
const slug = 'reset-password';
const defaultValues = {
  title: 'Reset Your Password',
};
export const generateMetadata = () => loadMeta(slug, { defaultValues });

export default async function page({
  searchParams,
}: {
  searchParams: Promise<Record<string, string>>;
}) {
  return (
    <Container>
      <Main slug={slug} defaultValues={defaultValues} />
      <Form searchParams={searchParams} />{' '}
    </Container>
  );
}
