import { normalizeString } from './utils';
import useTeams from './useTeams';
import { useSearchStore } from '../components/NavBar/NavBar';
import { useMemo } from 'react';

const useSuggestions = () => {
    const { teams, teamKeysSorted, departments } = useTeams();
    const searchQuery = useSearchStore((state) => state.searchQuery);
    const suggestions = useMemo(() => {
        if (searchQuery === '') return [];
        return [
            ...departments.filter((department) =>
                normalizeString(department).includes(normalizeString(searchQuery))
            ),
            ...teamKeysSorted.filter((teamKey) =>
                normalizeString(teamKey).includes(normalizeString(searchQuery))
            ),
            ...teamKeysSorted
                .map((teamKey) =>
                    teams[teamKey]
                        .filter((employee) =>
                            normalizeString(employee.fullName).includes(
                                normalizeString(searchQuery)
                            )
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

    return {
        suggestions,
        hasSuggestions: suggestions.length > 0,
        numberOfSuggestions: suggestions.length
    };
};

export default useSuggestions;
