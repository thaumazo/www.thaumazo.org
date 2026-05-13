import AdminServer from '@kenstack/admin/Server';

import adminConfig from '@/modules/admin';

export default function Admin(context) {
  return <AdminServer context={context} adminConfig={adminConfig} />;
}
