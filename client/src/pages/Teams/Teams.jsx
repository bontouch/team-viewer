/* eslint-disable */
import { useEffect, useMemo } from 'react';
import useTeams from '../../helpers/useTeams';
import styles from './Teams.module.scss';
import Loader from '../../components/Loader/Loader';
import Team from '../../components/Team/Team';
import { useSearchStore } from '../../components/NavBar/NavBar';
import useAvatars from '../../helpers/useAvatars';
import create from 'zustand';
import axios from 'axios';
import { getTokenFromLocalStorage } from '../../auth/AuthProvider';

export const useSuggestionsStore = create((set) => ({
    suggestions: [],
    setSuggestions: (suggestions) => set(() => ({ suggestions }))
}));

export const useEmployeeToScrollToStore = create((set) => ({
    employeeToScrollTo: {},
    setEmployeeToScrollTo: (employeeToScrollTo) => set(() => ({ employeeToScrollTo }))
}));

const Teams = () => {
    axios.defaults.headers.common['Authorization'] = getTokenFromLocalStorage();
    const { data: teams, isLoading } = useTeams();
    useAvatars();
    const selected = useSearchStore((state) => state.selected);
    const searchQuery = useSearchStore((state) => state.searchQuery);
    const setSuggestions = useSuggestionsStore((state) => state.setSuggestions);
    const setEmployeeToScrollTo = useEmployeeToScrollToStore(
        (state) => state.setEmployeeToScrollTo
    );
    const teamKeysSorted = useMemo(() => {
        if (isLoading) return [];
        return Object.keys(teams).sort();
    }, [teams, isLoading]);

    const departments = useMemo(() => {
        if (isLoading) return [];
        if (teamKeysSorted.length === 0) return;

        return teamKeysSorted
            .map((key) => {
                return teams[key].reduce((curr, next) => {
                    if (!(curr.department?.indexOf(next.department) >= 0))
                        curr.push(next.department);
                    return curr;
                }, []);
            })
            .flat()
            .reduce((curr, next) => {
                if (!(curr.indexOf(next) >= 0)) curr.push(next);
                return curr;
            }, []);
    }, [teams, isLoading, teamKeysSorted]);

    const suggestions = useMemo(() => {
        if (searchQuery === '') return [];
        return [
            ...departments.filter((department) =>
                department.toLowerCase().includes(searchQuery.toLowerCase())
            ),
            ...teamKeysSorted.filter((teamKey) =>
                teamKey.toLowerCase().includes(searchQuery.toLowerCase())
            ),
            ...teamKeysSorted
                .map((teamKey) =>
                    teams[teamKey]
                        .filter((employee) =>
                            employee.fullName.toLowerCase().includes(searchQuery.toLowerCase())
                        )
                        .filter((element) => element !== undefined)
                        .map((employee) => employee.fullName)
                )
                .flat()
        ]
            .reduce((curr, next) => {
                if (!(curr.indexOf(next) >= 0)) curr.push(next);
                return curr;
            }, [])
            .sort();
    }, [searchQuery, teamKeysSorted, teams]);

    useEffect(() => {
        setSuggestions(suggestions);
    }, [suggestions, setSuggestions]);

    useEffect(() => {
        if (selected) {
            let employeeToScrollTo = null;
            const firstAppearsInTeam = teamKeysSorted.find((teamKey) => {
                const team = teams[teamKey];
                return team.find((teamMember) => {
                    if (
                        teamMember.fullName.toLowerCase() === selected.toLowerCase() ||
                        teamMember.department.toLowerCase().includes(selected.toLowerCase())
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
        return (
            <div className={styles.load}>
                <span>
                    <Loader />
                </span>
            </div>
        );
    }

    return (
        <div className={styles.teams}>
            {searchQuery.length >= 3 && suggestions.length === 0 ? (
                <h3
                    style={{
                        fontSize: 'xx-large',
                        margin: '0 auto',
                        width: 'auto',
                        position: 'absolute',
                        left: '50%',
                        top: '20rem',
                        transform: 'translateX(-50%)'
                    }}>
                    No Search Results for <span style={{ color: '#8f8f8f' }}>{searchQuery}</span>
                </h3>
            ) : null}
            {teamKeysSorted.map((teamKey) => {
                const teamEmployees = teams[teamKey];
                const selectedTeamEmployees = teamEmployees.filter(
                    (employee) =>
                        employee.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                        employee.department.toLowerCase().includes(searchQuery.toLowerCase())
                );
                const show =
                    searchQuery === '' ||
                    teamKey.toLowerCase().includes(searchQuery.toLowerCase()) ||
                    selectedTeamEmployees.length !== 0;
                return (
                    <span
                        key={teamKey}
                        style={{
                            display: `${show ? 'block' : 'none'}`
                        }}>
                        <Team key={teamKey} teamName={teamKey} employees={teams[teamKey]} />
                    </span>
                );
            })}
        </div>
    );
};

export default Teams;
