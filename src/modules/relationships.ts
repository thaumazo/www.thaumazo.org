import {
  relationshipName,
  type RelationshipTable,
} from "@kenstack/fields/relationships";
import type { AnyPgTable } from "drizzle-orm/pg-core";

type WithRelationshipName<
  TTable extends AnyPgTable,
  TName extends string,
> = TTable & RelationshipTable<string, TName>;

export function withRelationshipName<
  const TTable extends AnyPgTable,
  const TName extends string,
>(table: TTable, name: TName) {
  return Object.assign(table, {
    [relationshipName]: name,
  }) as WithRelationshipName<TTable, TName>;
}
