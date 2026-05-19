import AdminServer from '@kenstack/admin/Server';

import admin from '@/modules/admin';

export default function Admin(context) {
  return <AdminServer context={context} admin={admin} />;
}
