import { PeopleFilters } from './PeopleFilters';
import { Loader } from './Loader';
import { PeopleTable } from './PeopleTable';
import { Person } from '../types';
import { useEffect, useState } from 'react';
import { getPeople } from '../api';

export const PeoplePage = () => {
  const [people, setPeople] = useState<Person[] | null>(null);
  const [isLoadingPeople, setIsLoadingPeople] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>('');

  useEffect(() => {
    setErrorMessage('');
    setIsLoadingPeople(true);

    getPeople()
      .then(setPeople)
      .catch(() => setErrorMessage('Something went wrong'))
      .finally(() => setIsLoadingPeople(false));
  }, []);

  return (
    <>
      <h1 className="title">People Page</h1>

      <div className="block">
        <div className="columns is-desktop is-flex-direction-row-reverse">
          <div className="column is-7-tablet is-narrow-desktop">
            {!isLoadingPeople && <PeopleFilters />}
          </div>

          <div className="column">
            <div className="box table-container">
              {isLoadingPeople && <Loader />}

              {errorMessage && (
                <p data-cy="peopleLoadingError" className="has-text-danger">
                  {errorMessage}
                </p>
              )}

              {!isLoadingPeople && people && people?.length <= 0 ? (
                <p data-cy="noPeopleMessage">
                  There are no people on the server
                </p>
              ) : (
                !isLoadingPeople &&
                people &&
                people?.length >= 0 && <PeopleTable people={people} />
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
