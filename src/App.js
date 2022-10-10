import { withAuthenticator } from '@aws-amplify/ui-react';
import { DataStore, Hub } from 'aws-amplify';

import React from 'react';

import {
  CreateNote,
  NavBar,
  NoteUICollection,
  UpdateNote,
} from './ui-components';

function App({ signOut }) {
  const [showCreateModal, setShowCreateModal] = React.useState(false);
  const [showUpdateModal, setShowUpdateModal] = React.useState(false);
  const [noteToUpdate, setNoteToUpdate] = React.useState();

  React.useEffect(() => {
    Hub.listen('ui', (capsule) => {
      if (capsule.payload.event === 'actions:datastore:create:finished') {
        setShowCreateModal(false);
      }
      if (capsule.payload.event === 'actions:datastore:update:finished') {
        setShowUpdateModal(false);
      }
    });
  }, []);

  return (
    <div>
      <NavBar
        width="100%"
        marginBottom="20px"
        overrides={{
          Button31632483: {
            onClick: () => {
              setShowCreateModal(true);
            },
          },
          Button31632487: {
            onClick: () => {
              signOut();
              DataStore.clear();
            },
          },
        }}
      />
      <div>
        <NoteUICollection
          overrideItems={({ item }) => ({
            overrides: {
              EditButton: {
                onClick: () => {
                  setShowUpdateModal(true);
                  setNoteToUpdate(item);
                },
              },
            },
          })}
        />
      </div>
      <div className="modal" style={{ display: !showCreateModal && 'none' }}>
        <CreateNote
          overrides={{
            MyIcon: {
              onClick: () => {
                setShowCreateModal(false);
              },
            },
          }}
        />
      </div>
      <div className="modal" style={{ display: !showUpdateModal && 'none' }}>
        <UpdateNote
          note={noteToUpdate}
          overrides={{
            MyIcon: {
              onClick: () => {
                setShowUpdateModal(false);
              },
            },
          }}
        />
      </div>
    </div>
  );
}

export default withAuthenticator(App);
