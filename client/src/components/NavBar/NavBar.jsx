import { useCallback, useEffect, useRef, useState } from 'react';
import create from 'zustand';

import { useAuth } from '../../helpers/useAuth';

import styles from './NavBar.module.scss';
import { useSuggestionsStore } from '../../pages/Teams/Teams';
import useClickOutside from '../../helpers/useClickOutside';
import useKeyPressed from '../../helpers/useKeyPressed';
import { ReactComponent as SearchLogo } from '../../images/search.svg';
import { ReactComponent as BTLogo } from '../../images/BTLogo.svg';

export const useSearchStore = create((set) => ({
    searchQuery: '',
    selected: null,
    setSearchQuery: (query) => set(() => ({ searchQuery: query })),
    setSelected: (selected) => set(() => ({ selected }))
}));

const NavBar = () => {
    const { token, onLogout } = useAuth();
    const setSearchQuery = useSearchStore((state) => state.setSearchQuery);
    const setSelected = useSearchStore((state) => state.setSelected);
    const suggestions = useSuggestionsStore((state) => state.suggestions);
    const setSuggestions = useSuggestionsStore((state) => state.setSuggestions);
    const [inputValue, setInputValue] = useState('');
    const inputRef = useRef(null);
    const [inputClientRect, setInputClientRect] = useState(null);
    const [open, setOpen] = useState(false);
    const [selectedName, setSelectedName] = useState(null);

    const listClickOutsideCallback = useCallback(
        (e) => {
            if (e.target.id !== 'search-field') {
                setOpen(false);
                if (inputValue === '' || inputValue !== selectedName || suggestions.length === 0) {
                    console.log('in here from listClickOutsideCallback');
                    setSelectedName(null);
                    setInputValue('');
                    setSelected(null);
                    setSuggestions([]);
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

            if (index < suggestions.length && index >= 0) setSelectedName(suggestions[index]);
        }
    }, [open, suggestions, selectedName]);
    const upKeyPressed = useCallback(() => {
        if (open && suggestions.length) {
            let index = 0;

            if (selectedName !== null) {
                index = suggestions.indexOf(selectedName);
                index--;
            }

            if (index < suggestions.length && index >= 0) setSelectedName(suggestions[index]);
        }
    }, [open, suggestions.length, selectedName]);
    const escapeKeyPressed = useCallback(() => {
        setOpen(false);
        if (inputValue === '' || inputValue !== selectedName || suggestions.length === 0) {
            setSelectedName(null);
            setInputValue('');
            setSelected(null);
            setSuggestions([]);
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
        if (
            (suggestions.length && selectedName === null) ||
            !suggestions.length ||
            suggestions[0] !== selectedName
        )
            setSelectedName(suggestions[0]);
        //if (!suggestions.length) setSelectedName(null);
        const element = inputRef.current;
        if (element) {
            const boundingClientRect = element.getBoundingClientRect();
            const widthWithoutBorder =
                boundingClientRect.width -
                parseInt(window.getComputedStyle(element).getPropertyValue('border-width')) * 2;

            boundingClientRect.width = widthWithoutBorder;
            setInputClientRect(boundingClientRect);
        }
    }, [suggestions]);
    console.log(inputClientRect);
    return (
        <div className={styles.container}>
            {/*<div className={styles['logo-wrapper']}>*/}
            {/*<BTLogo />*/}
            {/*<img src={logo} className={styles.logo} alt="logo" />*/}
            {/*</div>*/}
            {!token ? <h1 className={styles.title}>Bontouch Team Viewer</h1> : null}
            <div className={styles['content-wrapper']}>
                {token ? (
                    <>
                        <BTLogo className={styles.logo} />
                        <div className={styles['input-wrapper']}>
                            <SearchLogo />
                            <input
                                id="search-field"
                                autoComplete="off"
                                ref={inputRef}
                                className={styles.input}
                                value={inputValue}
                                placeholder="Search for teams or people..."
                                onChange={(event) => {
                                    setInputValue(event.target.value);
                                    if (event.target.value.length < 3) {
                                        setSearchQuery('');
                                        setSelectedName(null);
                                    } else {
                                        setSearchQuery(event.target.value);
                                        if (suggestions.length > 0) setSelectedName(suggestions[0]);
                                    }
                                    setSelected(null);
                                }}
                                onFocus={() => {
                                    setOpen(true);
                                }}
                                onBlur={() => {
                                    console.log('outside onblur');
                                    if (suggestions.length === 0) {
                                        console.log('inside onblur');
                                        setSelected(null);
                                        setInputValue('');
                                        setSearchQuery('');
                                    }
                                }}
                            />
                        </div>

                        {suggestions.length && inputClientRect && open ? (
                            <ul
                                style={{
                                    top: inputClientRect.bottom,
                                    width: inputClientRect.width
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
                        <button className={styles.button} onClick={onLogout}>
                            Log out
                        </button>
                    </>
                ) : null}
            </div>
        </div>
    );
};

export default NavBar;
