import { Main, Container } from '@/components';
import Form from '@kenstack/auth/components/ForgotPassword';

import { loadMeta } from '@kenstack/pageEditor';
const slug = 'forgot-password';
const defaultValues = {
  title: 'Forgot Your Password?',
};
export const generateMetadata = () => loadMeta(slug, { defaultValues });

export default function page() {
  return (
    <Container>
      <Main slug={slug} defaultValues={defaultValues} />
      <Form />
    </Container>
  );
}
