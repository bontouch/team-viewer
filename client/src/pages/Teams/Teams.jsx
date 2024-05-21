/* eslint-disable */
import { useEffect, useMemo } from 'react';
import { create } from 'zustand';
import axios from 'axios';

import { normalizeString } from '../../helpers/utils';

import useTeams from '../../helpers/useTeams';
import useAvatarsQuery from '../../helpers/queries/useAvatarsQuery';
import useSuggestions from '../../helpers/useSuggestions';

import Loader from '../../components/Loader/Loader';
import Team from '../../components/Team/Team.jsx';
import { useSearchStore } from '../../components/NavBar/NavBar';
import { getTokenFromLocalStorage } from '../../auth/AuthProvider';

import styles from './Teams.module.scss';

export const useEmployeeToScrollToStore = create((set) => ({
    employeeToScrollTo: {},
    shouldScroll: true,
    setEmployeeToScrollTo: (employeeToScrollTo) =>
        set(() => ({ employeeToScrollTo, shouldScroll: true })),
    setShouldScroll: (shouldScroll) => set(() => ({ shouldScroll }))
}));

const Teams = () => {
    axios.defaults.headers.common['Authorization'] = getTokenFromLocalStorage();
    const [selected, searchQuery, hasSearchedMinChars] = useSearchStore((state) => [
        state.selected,
        state.searchQuery,
        state.hasSearchedMinChars
    ]);
    const [setEmployeeToScrollTo, setShouldScroll] = useEmployeeToScrollToStore((state) => [
        state.setEmployeeToScrollTo,
        state.setShouldScroll
    ]);

    useAvatarsQuery();
    const { isLoading, teams, teamKeysSorted, departments, selectedTeam } = useTeams();
    const { suggestions, hasSuggestions } = useSuggestions();

    useEffect(() => {
        setShouldScroll(false);
    }, [searchQuery]);

    useEffect(() => {
        if (selected && !selectedTeam) {
            let employeeToScrollTo = null;
            const firstAppearsInTeam = teamKeysSorted.find((teamKey) => {
                const team = teams[teamKey];
                return team.find((teamMember) => {
                    if (
                        normalizeString(teamMember.fullName) === normalizeString(selected) ||
                        normalizeString(teamMember.department).includes(normalizeString(selected))
                    ) {
                        employeeToScrollTo = teamMember.fullName;
                        return true;
                    }
                });
            });
            setEmployeeToScrollTo({ employeeToScrollTo, teamKey: firstAppearsInTeam });
        } else {
            setEmployeeToScrollTo({});
        }
    }, [selected]);

    if (isLoading) {
        return <Loader />;
    }

    return (
        <ul className={styles.teams}>
            {hasSearchedMinChars && !hasSuggestions ? (
                <h3 className={styles['no-result']}>
                    No Search Results for <span style={{ color: '#8f8f8f' }}>{searchQuery}</span>
                </h3>
            ) : null}
            {teamKeysSorted.map((teamKey, index) => {
                const teamEmployees = teams[teamKey];
                const selectedTeamEmployees = teamEmployees.filter(
                    (employee) =>
                        normalizeString(employee.fullName).includes(normalizeString(searchQuery)) ||
                        normalizeString(employee.department).includes(normalizeString(searchQuery))
                );
                const show =
                    searchQuery === '' ||
                    normalizeString(teamKey).includes(normalizeString(searchQuery)) ||
                    selectedTeamEmployees.length !== 0;

                return (
                    <li
                        key={teamKey}
                        style={{
                            display: `${show ? 'block' : 'none'}`,
                            order:
                                selectedTeam === teamKey ? 1 : selectedTeam ? index + 2 : index + 1
                        }}>
                        <Team key={teamKey} teamName={teamKey} employees={teams[teamKey]} />
                    </li>
                );
            })}
        </ul>
    );
};

export default Teams;
