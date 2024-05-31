import { useSearchStore } from '../components/NavBar/NavBar';
import { useLocation } from 'react-router-dom';
import { normalizeString } from './utils';
import { useEffect } from 'react';
import { create } from 'zustand';

const initialState = {
    initialSearchQuery: ''
};

export const useInitialSearchStore = create((set) => ({
    ...initialState,
    setInitialSearchQuery: (query) =>
        set(() => ({ initialSearchQuery: query, hasSearchedMinChars: query.length >= 2 }))
}));

const useUrl = () => {
    const searchQuery = useSearchStore((state) => state.searchQuery);
    const setInitialSearchQuery = useInitialSearchStore((state) => state.setInitialSearchQuery);
    const location = useLocation();
    const url = searchQuery
        ? `${location.pathname}/${normalizeString(searchQuery.split(' ').join('-'))}`
        : location.pathname;

    window.history.replaceState(null, null, url);
    useEffect(() => {
        const urlSearchQuery = location.pathname.split('/teams')[1].split('/')[1];
        if (urlSearchQuery) {
            setInitialSearchQuery(urlSearchQuery);
        }
    }, []);
};

export default useUrl;
