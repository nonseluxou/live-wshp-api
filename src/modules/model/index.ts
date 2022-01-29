import path from 'path';

import { makeSchema } from 'nexus';

import * as user from './User';
import * as me from './MeQuery';
import * as signIn from './SignInMutation';

export const schema = makeSchema({
  types: { ...user, ...me, ...signIn },
  contextType: {
    module: path.join(__dirname, 'context.ts'),
    export: 'MyContextType',
  },
  outputs: {
    typegen: path.join(__dirname, '..', '..', 'generated', 'nexus-typegen.d.ts'),
    schema: path.join(__dirname, '..', '..', 'generated', 'schema.graphql'),
  },
  prettierConfig: path.join(__dirname, '..', '..', '..', '.prettierrc.json'),
});
