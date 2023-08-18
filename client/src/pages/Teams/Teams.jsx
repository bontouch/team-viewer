/* eslint-disable */
import { useEffect, useMemo } from 'react';
import { create } from 'zustand';
import axios from 'axios';

import { normalizeString } from '../../helpers/utils';

import useTeams from '../../helpers/useTeams';
import useAvatarsQuery from '../../helpers/queries/useAvatarsQuery';
import useTeamsQuery from '../../helpers/queries/useTeamsQuery';
import useSuggestions from '../../helpers/useSuggestions';

import Loader from '../../components/Loader/Loader';
//import Team from '../../components/Team/Team';
import Team2 from '../../components/Team/Team.old.jsx';
import { useSearchStore } from '../../components/NavBar/NavBar';
import { getTokenFromLocalStorage } from '../../auth/AuthProvider';

import styles from './Teams.module.scss';

export const useEmployeeToScrollToStore = create((set) => ({
    employeeToScrollTo: {},
    setEmployeeToScrollTo: (employeeToScrollTo) => set(() => ({ employeeToScrollTo }))
}));

const Teams = () => {
    axios.defaults.headers.common['Authorization'] = getTokenFromLocalStorage();
    const [selected, searchQuery, hasSearchedMinChars] = useSearchStore((state) => [
        state.selected,
        state.searchQuery,
        state.hasSearchedMinChars
    ]);
    const setEmployeeToScrollTo = useEmployeeToScrollToStore(
        (state) => state.setEmployeeToScrollTo
    );

    useAvatarsQuery();
    const { isLoading, teams, teamKeysSorted, departments, selectedTeam } = useTeams();
    const { suggestions, hasSuggestions } = useSuggestions();

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
        <div className={styles.teams}>
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
                // return <Team key={teamKey} teamName={teamKey} index={index} />;
                return (
                    <span
                        key={teamKey}
                        style={{
                            display: `${show ? 'block' : 'none'}`,
                            order: selectedTeam === teamKey ? 0 : selectedTeam ? index + 1 : index
                        }}>
                        <Team2 key={teamKey} teamName={teamKey} employees={teams[teamKey]} />
                    </span>
                );
            })}
        </div>
    );
};

export default Teams;
