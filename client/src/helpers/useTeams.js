import useTeamsQuery from './queries/useTeamsQuery';
import { useMemo } from 'react';
import { normalizeString } from './utils';
import { useSearchStore } from '../components/NavBar/NavBar';

const useTeams = (teamName = null) => {
    const { data: teams, isLoading } = useTeamsQuery();
    const selected = useSearchStore((state) => state.selected);
    const searchQuery = useSearchStore((state) => state.searchQuery);
    const teamKeysSorted = useMemo(() => {
        if (isLoading) return [];
        return Object.keys(teams).sort();
    }, [teams, isLoading]);

    const selectedTeam = useMemo(() => {
        if (isLoading) return;
        if (teamKeysSorted.length === 0) return;
        if (!selected) return;
        return teamKeysSorted.find((teamKey) =>
            normalizeString(teamKey).includes(normalizeString(searchQuery))
        );
    }, [selected, teamKeysSorted]);

    const departments = useMemo(() => {
        if (isLoading) return [];
        if (teamKeysSorted.length === 0) return [];

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

    const employees =
        (() => {
            if (!teamName) return [];
            if (!teams) return [];
            return teams[teamName];
        },
        [teamName, teams]);

    return {
        isLoading,
        teams,
        selectedTeam,
        teamKeysSorted,
        departments,
        employees
    };
};

export default useTeams;
