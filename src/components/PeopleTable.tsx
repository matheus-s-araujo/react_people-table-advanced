/* eslint-disable jsx-a11y/control-has-associated-label */

import classNames from 'classnames';
import { Person } from '../types';
import { PersonLink } from './PersonLink';
import { useParams, useSearchParams } from 'react-router-dom';
import { useState } from 'react';

type PeopleTableProps = {
  people: Person[];
};

export const PeopleTable = ({ people }: PeopleTableProps) => {
  const { slug } = useParams();
  const [searchParams, setSearchParams] = useSearchParams();
  const [peopleSortered, setPeopleSortered] = useState<Person[]>(people);

  const sort = searchParams.get('sort') || '';
  const order = searchParams.get('order') || '';

  const sorteredPeople = (newFilter: string) => {
    if (order === 'desc' && sort === newFilter) {
      searchParams.delete('sort');
      searchParams.delete('order');

      setPeopleSortered(people);
      setSearchParams(searchParams);

      return;
    }

    let newPeopleSortered = [...peopleSortered];

    switch (newFilter) {
      case 'name':
        newPeopleSortered = newPeopleSortered.sort((a, b) =>
          a.name.localeCompare(b.name),
        );

        break;
      case 'sex':
        newPeopleSortered = newPeopleSortered.sort((a, b) =>
          a.sex.localeCompare(b.sex),
        );

        break;
      case 'born':
        newPeopleSortered = newPeopleSortered.sort((a, b) => a.born - b.born);
        break;
      case 'died':
        newPeopleSortered = newPeopleSortered.sort((a, b) => a.died - b.died);
        break;
    }

    if (sort === newFilter) {
      searchParams.set('order', 'desc');
      newPeopleSortered = newPeopleSortered.reverse();
    }

    searchParams.set('sort', newFilter);

    setPeopleSortered(newPeopleSortered);
    setSearchParams(searchParams);
  };

  const handleSortIcon = (column: string): string => {
    // console.log({ column, sort, order });
    if (column === sort) {
      if (order === 'desc') {
        return 'fa-sort-down';
      }

      return 'fa-sort-up';
    }

    return 'fa-sort';
  };

  const hasParentOnTheList = (parentName: string) => {
    return people?.find(person => person.name === parentName);
  };

  const findParent = (parentName: string) => {
    return people?.find(person => person.name === parentName) ?? null;
  };

  return (
    <table
      data-cy="peopleTable"
      className="table is-striped is-hoverable is-narrow is-fullwidth"
    >
      <thead>
        <tr>
          <th>
            <span className="is-flex is-flex-wrap-nowrap">
              Name
              <a onClick={() => sorteredPeople('name')}>
                <span className="icon">
                  <i
                    className={classNames('fas', {
                      [handleSortIcon('name')]: true,
                    })}
                  />
                </span>
              </a>
            </span>
          </th>

          <th>
            <span className="is-flex is-flex-wrap-nowrap">
              Sex
              <a onClick={() => sorteredPeople('sex')}>
                <span className="icon">
                  <i
                    className={classNames('fas', {
                      [handleSortIcon('sex')]: true,
                    })}
                  />
                </span>
              </a>
            </span>
          </th>

          <th>
            <span className="is-flex is-flex-wrap-nowrap">
              Born
              <a onClick={() => sorteredPeople('born')}>
                <span className="icon">
                  <i
                    className={classNames('fas', {
                      [handleSortIcon('born')]: true,
                    })}
                  />
                </span>
              </a>
            </span>
          </th>

          <th>
            <span className="is-flex is-flex-wrap-nowrap">
              Died
              <a onClick={() => sorteredPeople('died')}>
                <span className="icon">
                  <i
                    className={classNames('fas', {
                      [handleSortIcon('died')]: true,
                    })}
                  />
                </span>
              </a>
            </span>
          </th>

          <th>Mother</th>
          <th>Father</th>
        </tr>
      </thead>

      <tbody>
        {peopleSortered.map(person => (
          <tr
            data-cy="person"
            key={person.name}
            className={classNames({
              'has-background-warning': person.slug === slug,
            })}
          >
            <td>
              <PersonLink person={person} />
            </td>

            <td>{person.sex}</td>
            <td>{person.born}</td>
            <td>{person.died}</td>
            {!person.motherName ? (
              <td>-</td>
            ) : hasParentOnTheList(person.motherName) ? (
              <td>
                <PersonLink person={findParent(person.motherName)} />
              </td>
            ) : (
              <td>{person.motherName}</td>
            )}

            {!person.fatherName ? (
              <td>-</td>
            ) : hasParentOnTheList(person.fatherName) ? (
              <td>
                <PersonLink person={findParent(person.fatherName)} />
              </td>
            ) : (
              <td>{person.fatherName}</td>
            )}
          </tr>
        ))}
      </tbody>
    </table>
  );
};
