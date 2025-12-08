import React from 'react';
import NoCharacters from './no-characters';
import Header from '@/components/header';
import { useCharacters } from '@/hooks/characters/useCharacters';
import { Spinner } from '@/components/ui/spinner';
import CharacterCard from './character-card';
import { openModal } from '@/state/modals';
import CharacterCreator from '@/modals/creation/character-creator';
import { Card, CardContent } from '@/components/ui/card';
import PageContent from '@/components/page-content';

const Characters: React.FC = () => {
  const { characters, isLoading } = useCharacters();

  if (isLoading) return (
    <div>
      <Header title='Your Adventuring Party' subtitle='Manage your heroes and their epic journeys' />

      <PageContent className='flex items-center justify-center'>
        <Spinner />
        <p className='ml-2'>Loading...</p>
      </PageContent>
    </div>
  )

  return (
    <div>
      <Header title='Your Adventuring Party' subtitle='Manage your heroes and their epic journeys' />

      <PageContent>
        {/* TODO: Searchbar */}

        {(characters.length === 0) ? <NoCharacters /> : (
          <div className='grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6'>
            {/* Add character card */}
            <Card
              className='w-full max-w-sm border-2 border-dashed cursor-pointer'
              onClick={() => openModal('create-adv', CharacterCreator)}
            >
              <CardContent className='flex flex-col grow items-center justify-center cursor-pointer'>
                <div className='text-5xl text-fantasy-accent/60 mb-4'>⚔️</div>
                <div className='text-fantasy-accent/80 text-base font-medium'>Create New Hero</div>
              </CardContent>
            </Card>
            
            {/* Heros */}
            {characters && (
              characters.map(char => <CharacterCard key={char.local_id} char={char} />)
            )}
          </div>
        )}
      </PageContent>
    </div>
  );
};

export default Characters;