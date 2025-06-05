import CharacterCreatorModal from '@modals/CharacterCreator';

import React, { useState } from 'react';
import Header from '@components/Header';
import { NavLink, useNavigate } from 'react-router';
import FloatingActionButton from '@components/FloatingActionButton';
import { useCharacters } from '@hooks/useCharacters';
import { openModal } from '@state/modals';
import { authState } from '@state/auth';

import {
  renameCharacter,
  deleteCharacter,
  importCharacter,
} from '@storage/methods/characters';
import JSONToFile from '@utils/JSONToFile';
import { useSystems } from '@hooks/useSystems';
import { useVersions } from '@hooks/useVersions';
import getVisualTextFromVersionID from '@utils/getVisualTextFromVersionID';

import { Menu, MenuItem } from '@components/DropdownMenu';
import isPremium from '@utils/isPremium';
import DropdownButton from '@components/DropdownButton';
import { Character } from '@storage/schemas/character';
import {setSyncedCharacters} from "@api/setSyncedCharacters";
import EditStringModal from '@modals/EditString';
import ConfirmModal from '@modals/ConfirmModal';
import ImportFile from '@modals/ImportFile';

const Characters: React.FC = () => {
  const { characters, isLoading } = useCharacters();
  const { systems } = useSystems();
  const { versions } = useVersions();

  const { isLoggedIn, user, synced_characters } = authState.useValue();

  const [isOpen, setIsOpen] = useState(false);
  const [isCreating, setIsCreating] = useState(false);

  const navigate = useNavigate();

  if (isLoading) return <></>;

  const getOptions = (char: Character) => {
    const options = [
      {
        label: 'export',
        onClick: () => JSONToFile(char, `${char.name}-export`),
      },
      {
        label: 'rename',
        onClick: () =>
          openModal('edit-string', ({ id }) => <EditStringModal id={id} title='Rename Character' data={char.name} onSave={(newName) => renameCharacter(char.local_id, newName)} />)
      },
      {
        label: 'delete',
        onClick: () =>
          openModal('confirm', ({ id }) => <ConfirmModal id={id} title='Delete Character' type='danger' message='Are you sure you want to delete this character?' onConfirm={() => deleteCharacter(char.local_id)} />)
      },
    ];

    if (isPremium(user?.role ?? 0)) return options

    const isSynced = synced_characters.includes(char.local_id)

    options.unshift({
      label: isSynced ? 'UnSync' : 'Sync',
      onClick: () => {
        let newSynced: string[] = [];
        if (synced_characters.includes(char.local_id)) {
          newSynced = synced_characters.filter(
            (c: string) => c !== char.local_id
          );
        } else if (length < 3) {
          newSynced = [...synced_characters, char.local_id];
        }

        setSyncedCharacters(newSynced);
      }
    })

    return options
  };

  return (
    <div>
      <Header title="Characters" />

      <CharacterCreatorModal isOpen={isCreating} setIsOpen={setIsCreating} />

      <div className="p-4">
        {/* TODO: Searchbar */}

        {characters.length ? (
          characters.map((char) => (
            <div
              key={char.local_id}
              className="relative flex flex-col max-w-96 p-4 transition-all duration-200 bg-white border rounded-xl hover:shadow-lg dark:bg-neutral-800 dark:border-neutral-700 hover:transform hover:scale-[1.02]"
            >
              <NavLink
                to={char.local_id}
                className="flex items-start space-x-4"
              >
                <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-blue-500 to-brand-600 rounded-lg flex items-center justify-center">
                  <span className="text-xl font-bold text-white">
                    {char.name[0]}
                  </span>
                </div>

                <div className="flex-1 min-w-0">
                  <h5 className="text-xl font-semibold text-neutral-900 truncate dark:text-white">
                    {char.name}
                  </h5>
                  <p className="text-sm text-neutral-500 dark:text-neutral-400">
                    {
                      systems.find((s) => s.local_id === char.system.local_id)
                        ?.name
                    }{' '}
                    • Version{' '}
                    {getVisualTextFromVersionID(
                      versions.find(
                        (v) => v.local_id === char.system.version_id
                      )?.local_id ?? ''
                    )}
                  </p>
                </div>
              </NavLink>

              <div className="flex justify-end gap-2 mt-4 border-t pt-3 dark:border-neutral-700">
                <DropdownButton
                  label="Edit"
                  onClick={() => navigate(char.local_id)}
                  options={getOptions(char)}
                />
              </div>
            </div>
          ))
        ) : (
          <h5>
            Doesn't look like you have any characters yet? Try creating one!
          </h5>
        )}

        <FloatingActionButton
          isOpen={isOpen}
          onClick={() => setIsOpen(!isOpen)}
          buttons={[
            {
              name: 'Create Character',
              icon: '',
              onClick: () => setIsCreating(true),
            },
            {
              name: 'Import Character',
              icon: '',
              onClick: () =>
                openModal('import-file', ({ id }) => <ImportFile id={id} title='Import Character' onSave={async (fileContent: string) => {
                  try {
                    const parsed = JSON.parse(fileContent);
                    if (parsed) {
                      await importCharacter(parsed);
                    }
                  } catch (e) {
                    console.error(e);
                  }
                }} />
              )
            },
          ]}
        />
      </div>
    </div>
  );
};

export default Characters;
