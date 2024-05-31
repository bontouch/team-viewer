import { useCallback, useEffect, useRef, useState } from 'react';
import { create } from 'zustand';

import { useAuth } from '../../helpers/useAuth';
import useClickOutside from '../../helpers/useClickOutside';
import useKeyPressed from '../../helpers/useKeyPressed';
import useSuggestions from '../../helpers/useSuggestions';

import { ReactComponent as SearchIcon } from '../../images/search.svg';
import { ReactComponent as CloseIcon } from '../../images/close.svg';
import { ReactComponent as BTLogo } from '../../images/BTLogo.svg';

import styles from './NavBar.module.scss';
import { useInitialSearchStore } from 'helpers/useUrl';

const initialState = {
    searchQuery: '',
    hasSearchedMinChars: false,
    selected: null
};

export const useSearchStore = create((set) => ({
    ...initialState,
    setSearchQuery: (query) =>
        set(() => ({ searchQuery: query, hasSearchedMinChars: query.length >= 2 })),
    setSelected: (selected) => set(() => ({ selected }))
}));

const NavBar = () => {
    const { token, onLogout } = useAuth();
    const setSearchQuery = useSearchStore((state) => state.setSearchQuery);
    const setSelected = useSearchStore((state) => state.setSelected);
    const selected = useSearchStore((state) => state.selected);
    const initialSearchQuery = useInitialSearchStore((state) => state.initialSearchQuery);
    const { suggestions, allSearchable } = useSuggestions();
    const [inputValue, setInputValue] = useState(selected ?? '');
    const inputRef = useRef(null);
    const clearButtonRef = useRef(null);
    const [inputClientRect, setInputClientRect] = useState(null);
    const [open, setOpen] = useState(false);
    const [selectedName, setSelectedName] = useState(null);
    const [hasSetInitial, setHasSetInitial] = useState(false);

    const listClickOutsideCallback = useCallback(
        (e) => {
            if (e.target.id !== 'search-field') {
                setOpen(false);
                if (inputValue === '' || inputValue !== selectedName || suggestions.length === 0) {
                    setSelectedName(null);
                    setInputValue('');
                    setSelected(null);
                    setSearchQuery('');
                }
            }
        },
        [inputValue, selectedName, suggestions.length]
    );
    const listRef = useClickOutside(listClickOutsideCallback);

    const enterKeyPressed = useCallback(() => {
        if (open && suggestions.length && selectedName) {
            setInputValue(selectedName);
            setSearchQuery(selectedName);
            setOpen(false);
            setSelected(selectedName);
        }
        inputRef.current.blur();
    }, [open, suggestions.length, selectedName]);
    const downKeyPressed = useCallback(() => {
        if (open && suggestions.length) {
            let index = 1;

            if (selectedName !== null) {
                index = suggestions.indexOf(selectedName);
                index++;
            }

            if (index < suggestions.length && index >= 0) {
                setSelectedName(suggestions[index]);
                listRef.current.children[index].scrollIntoView({ block: 'end' });
            }
        }
    }, [open, suggestions, selectedName]);
    const upKeyPressed = useCallback(() => {
        if (open && suggestions.length) {
            let index = 0;

            if (selectedName !== null) {
                index = suggestions.indexOf(selectedName);
                index--;
            }

            if (index < suggestions.length && index >= 0) {
                setSelectedName(suggestions[index]);
                listRef.current.children[index].scrollIntoView({ block: 'end' });
            }
        }
    }, [open, suggestions.length, selectedName]);
    const escapeKeyPressed = useCallback(() => {
        setOpen(false);
        if (inputValue === '' || inputValue !== selectedName || suggestions.length === 0) {
            setSelectedName(null);
            setInputValue('');
            setSelected(null);
            setSearchQuery('');
        }
        setTimeout(() => inputRef.current.blur(), 100);
    }, [inputValue, selectedName, suggestions.length]);

    useKeyPressed('Enter', enterKeyPressed);
    useKeyPressed('ArrowDown', downKeyPressed);
    useKeyPressed('ArrowUp', upKeyPressed);
    useKeyPressed('Tab', enterKeyPressed);
    useKeyPressed('Escape', escapeKeyPressed);

    const handleListClick = (e) => {
        setInputValue(e.target.innerText);
        setSearchQuery(e.target.innerText);
        setSelectedName(e.target.innerText);
        setSelected(e.target.innerText);
        setOpen(false);
    };
    useEffect(() => {
        if (initialSearchQuery && Object.keys(allSearchable).length && !hasSetInitial) {
            const name = allSearchable[initialSearchQuery];
            if (name) {
                setInputValue(name);
                setSearchQuery(name);
                setSelectedName(name);
                setSelected(name);
                setHasSetInitial(true);
                inputRef.current.value = name;
                setOpen(false);
                setTimeout(() => inputRef.current.blur(), 100);
            }
        }
    }, [initialSearchQuery, allSearchable]);

    useEffect(() => {
        if (
            (suggestions.length && selectedName === null) ||
            !suggestions.length ||
            suggestions[0] !== selectedName
        ) {
            setSelectedName(suggestions[0]);
        }

        const element = inputRef.current;

        if (element) {
            setInputClientRect(element.getBoundingClientRect());
        }
    }, [suggestions]);

    const onButtonAndLogoClick = useCallback((setInputCaret = true) => {
        window.scrollTo({
            behavior: 'auto',
            top: 0
        });
        setSelected(null);
        setInputValue('');
        setSearchQuery('');
        setSelectedName(null);
        setInputCaret && inputRef.current.focus();
    }, []);

    return (
        <div className={styles.container}>
            {!token ? <h1 className={styles.title}>Bontouch Team Viewer</h1> : null}
            <div className={styles.wrapper}>
                <div className={styles['content-wrapper']}>
                    {token ? (
                        <>
                            <button
                                tabIndex="-1"
                                className={styles.logo}
                                onClick={() => onButtonAndLogoClick(false)}>
                                <BTLogo />
                            </button>
                            <div className={styles['input-wrapper']}>
                                <span style={{ position: 'relative' }}>
                                    <SearchIcon className={styles['search-icon']} />

                                    <button
                                        tabIndex={1}
                                        ref={clearButtonRef}
                                        style={{ display: inputValue ? 'block' : 'none' }}
                                        className={styles['clear-button']}
                                        onClick={onButtonAndLogoClick}>
                                        <CloseIcon />
                                    </button>
                                    <input
                                        id="search-field"
                                        autoComplete="off"
                                        ref={inputRef}
                                        className={styles.input}
                                        value={inputValue}
                                        placeholder="Search for teams or people..."
                                        onChange={(event) => {
                                            setInputValue(event.target.value);
                                            if (event.target.value.length < 2) {
                                                setSearchQuery('');
                                                setSelectedName(null);
                                            } else {
                                                setSearchQuery(event.target.value);
                                                if (suggestions.length > 0)
                                                    setSelectedName(suggestions[0]);
                                            }

                                            setSelected(null);
                                            document.body.scrollIntoView({ block: 'start' });
                                        }}
                                        onFocus={() => {
                                            setOpen(true);
                                            if (inputRef.current)
                                                inputRef.current.setSelectionRange(
                                                    inputRef.current.value.length,
                                                    inputRef.current.value.length
                                                );
                                        }}
                                        autoFocus={true}
                                        onBlur={() => {
                                            if (suggestions.length === 0) {
                                                setSelected(null);
                                                setInputValue('');
                                                setSearchQuery('');
                                            } else {
                                                setTimeout(() => {
                                                    clearButtonRef.current.focus();
                                                }, 50);
                                            }
                                        }}
                                    />
                                </span>
                                {inputClientRect &&
                                suggestions.length &&
                                inputClientRect &&
                                open ? (
                                    <ul
                                        tabIndex="-1"
                                        style={{
                                            width: inputClientRect.width,
                                            maxHeight: '35vh',
                                            overflowY: 'auto'
                                        }}
                                        ref={listRef}>
                                        {suggestions.map((suggestion, index) => (
                                            <li
                                                key={suggestion}
                                                onClick={handleListClick}
                                                className={
                                                    selectedName === suggestion ||
                                                    (index === 0 && selectedName === null)
                                                        ? styles.selected
                                                        : null
                                                }>
                                                {suggestion}
                                            </li>
                                        ))}
                                    </ul>
                                ) : null}
                            </div>
                            <div>
                                <button
                                    tabIndex={2}
                                    type="submit"
                                    className={styles.button}
                                    onClick={onLogout}
                                />
                            </div>
                        </>
                    ) : null}
                </div>
            </div>
        </div>
    );
};

export default NavBar;
