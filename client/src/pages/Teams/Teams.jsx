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

const Teams = () => {
    axios.defaults.headers.common['Authorization'] = getTokenFromLocalStorage();
    const { data: teams, isLoading } = useTeams();
    useAvatars();
    const searchQuery = useSearchStore((state) => state.searchQuery);
    const setSuggestions = useSuggestionsStore((state) => state.setSuggestions);
    const teamKeysSorted = useMemo(() => {
        if (isLoading) return [];
        return Object.keys(teams).sort();
    }, [teams, isLoading]);

    const suggestions = useMemo(() => {
        if (searchQuery === '') return [];
        return [
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
                .reduce((curr, next) => {
                    if (!(curr.indexOf(next) >= 0)) curr.push(next);
                    return curr;
                }, [])
        ].sort();
    }, [searchQuery, teamKeysSorted, teams]);

    useEffect(() => {
        setSuggestions(suggestions);
    }, [suggestions, setSuggestions]);

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
                const show =
                    searchQuery === '' ||
                    teamKey.toLowerCase().includes(searchQuery.toLowerCase()) ||
                    teamEmployees.find((employee) =>
                        employee.fullName.toLowerCase().includes(searchQuery.toLowerCase())
                    );
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
