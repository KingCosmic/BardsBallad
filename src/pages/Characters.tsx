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

import isPremium from '@utils/isPremium';
import DropdownButton from '@components/DropdownButton';
import { Character } from '@storage/schemas/character';
import {setSyncedCharacters} from "@api/setSyncedCharacters";
import EditStringModal from '@modals/EditString';
import ConfirmModal from '@modals/ConfirmModal';
import ImportFile from '@modals/ImportFile';
import ImportOrCreateModal from '@modals/ImportOrCreate';
import { addToast } from '@state/toasts';

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

    if (isPremium(user?.role ?? 0) || !isLoggedIn) return options

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
      <Header title='Your Adventuring Party' subtitle='Manage your heroes and their epic journeys' />

      <div className="p-4">
        {/* TODO: Searchbar */}

        {/* Character Grid */}
        <div className='grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6'>
          {/* Add character card */}
          <div
            className="fantasy-add-gradient border-2 border-dashed border-fantasy-accent/30 rounded-2xl p-10 text-center cursor-pointer transition-all duration-300 min-h-[200px] flex flex-col justify-center items-center hover:border-fantasy-accent/60 hover:fantasy-add-gradient hover:-translate-y-1"
            onClick={() => openModal('import-or-create', ({ id }) => (
              <ImportOrCreateModal id={id} type='character'
                ImportModal={({ id }) => (
                  <ImportFile id={id} title='Import Character'
                    onSave={async (fileContent: string) => {
                      try {
                        const parsed = JSON.parse(fileContent);
                        if (parsed) {
                          await importCharacter(parsed);
                        }
                        addToast('Unable to parse character.', 'error')
                      } catch (e) {
                        addToast('Error parsing / importing character.', 'error')
                        console.error(e);
                      }
                    }}
                  />
                )}
                CreateModal={({ id }) => <CharacterCreatorModal id={id} />}
              />
            )
            )}
          >
            <div className="text-5xl text-fantasy-accent/60 mb-4">⚔️</div>
            <div className="text-fantasy-accent/80 text-base font-medium">Create New Hero</div>
          </div>
          
          {/* Heros */}
          {characters.length ? (
            characters.map((char, i) => (
              // Character Card
              <div
                key={char.local_id}
                style={{ zIndex: `${characters.length - i}`}}
                className="fantasy-card-gradient card-top-border border border-fantasy-border rounded-2xl p-6 cursor-pointer transition-all duration-500 backdrop-blur-lg shadow-2xl hover:-translate-y-2 hover:shadow-fantasy-accent/20 hover:shadow-xl hover:border-fantasy-accent/40 relative"
              >
                {/* Status Indicator */}
                <div className="absolute top-4 right-4 w-2 h-2 bg-green-400 rounded-full shadow-lg shadow-green-400/60"></div>

                {/* Character Header */}
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 fantasy-accent-gradient rounded-xl flex items-center justify-center text-xl font-bold text-fantasy-dark mr-4 shadow-lg shadow-fantasy-accent/30">
                    {char.name[0]}
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-fantasy-text mb-1">{char.name}</h3>
                    <div className="flex items-center gap-2 text-xs text-fantasy-accent/70">
                      <span>🏹 Ranger</span>
                      <span className="bg-fantasy-accent/20 px-1.5 py-0.5 rounded text-[10px]">{getVisualTextFromVersionID(char.system.local_id)}</span>
                    </div>
                  </div>
                </div>
                
                {/* Character Stats */}
                <div className="flex gap-4 my-4">
                  <div className="text-center flex-1">
                    <div className="text-lg font-bold text-fantasy-accent">12</div>
                    <div className="text-[10px] text-white/60 uppercase tracking-wider">Level</div>
                  </div>
                  <div className="text-center flex-1">
                    <div className="text-lg font-bold text-fantasy-accent">347</div>
                    <div className="text-[10px] text-white/60 uppercase tracking-wider">XP</div>
                  </div>
                  <div className="text-center flex-1">
                    <div className="text-lg font-bold text-fantasy-accent">5</div>
                    <div className="text-[10px] text-white/60 uppercase tracking-wider">Quests</div>
                  </div>
                </div>

                {/* Character actions */}
                <div className="flex gap-2 mt-4">
                  <button
                    className="flex-1 fantasy-accent-gradient text-fantasy-dark px-4 py-2 rounded-lg text-xs font-medium transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-fantasy-accent/40"
                    onClick={() => navigate(char.local_id)}
                  >
                    Continue Adventure
                  </button>
                  <DropdownButton
                    label='⚙️'
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
        </div>

        {/* <FloatingActionButton
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
        /> */}
      </div>
    </div>
  );
};

export default Characters;
