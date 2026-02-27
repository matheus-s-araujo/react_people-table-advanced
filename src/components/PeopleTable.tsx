/* eslint-disable jsx-a11y/control-has-associated-label */

import classNames from 'classnames';
import { Person } from '../types';
import { PersonLink } from './PersonLink';
import { useParams } from 'react-router-dom';

type PeopleTableProps = {
  people: Person[] | null;
};

export const PeopleTable = ({ people }: PeopleTableProps) => {
  const { slug } = useParams();

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
          <th>Name</th>
          <th>Sex</th>
          <th>Born</th>
          <th>Died</th>
          <th>Mother</th>
          <th>Father</th>
        </tr>
      </thead>

      <tbody>
        {people?.map(person => (
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
