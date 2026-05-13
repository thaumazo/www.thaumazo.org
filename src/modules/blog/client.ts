'use client';

import { adminClient } from '@kenstack/admin';
import ListItem from './components/ListItem';
import EditForm from './components/Form';
// import { schema } from './shared/schema';
import { fields } from './fields';

export default adminClient({ fields, ListItem, EditForm });
