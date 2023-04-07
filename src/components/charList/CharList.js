import './charList.scss';

import {useState, useEffect, useRef, useMemo} from 'react';
import { CSSTransition, TransitionGroup } from 'react-transition-group';
import PropTypes from 'prop-types';
import useMarvelService from '../../services/MarvelService';
import Spinner from '../spinner/Spinner';
import ErrorMessage from '../errorMessage/ErrorMessage';


const setContent = (process, Component, data, focusOnItem) => {
    switch (process) {
        case 'waiting':
            return Component(data, focusOnItem, true);
        case 'loading':
            return Component(data, focusOnItem, true);
        case 'confirmed':
            return Component(data, focusOnItem);
        case 'error':
            return Component(data, focusOnItem, false);            
        default:
            throw new Error('Unexpected process state');
    }
}

const CharList = (props) => {
    
    const [chars, setChars] = useState([]);
    const [offset, setOffset] = useState(201);
    

    const {loading, process, setProcess, getAllCharacters} = useMarvelService();

    useEffect(() => {
        onSetCharacters()
    }, [])

    const onCharactersLoaded = (newChars) => {
        setChars(chars => [...chars, ...newChars]);
        setOffset(offset => offset + 9);
        setProcess('confirmed')
    }


    const onSetCharacters = () => {
        setProcess('loading')
        getAllCharacters(offset)
            .then(onCharactersLoaded)
            .catch(() => setProcess('error'))
        
    }
    
    const itemRefs = useRef([]);

    const focusOnItem = (i) => {
        itemRefs.current.forEach(item => item.classList.remove('char__item_selected'))
        itemRefs.current[i].classList.add('char__item_selected');
        itemRefs.current[i].focus();
    }

    
    const View = (charList, focusOnItem, status = null) => {
        const CharCards = CardsWithChar(charList, focusOnItem);
        if(status !== null){
            const StageCards = CardWithStage(status);
            return [...CharCards, ...StageCards];
        }
    
        return [...CharCards];
    }
    
    function CardsWithChar(charsList, focusOnItem) {
        const charItems = charsList.map((el, i) => {
                const {thumbnail, name, id} = el;
                const imgClass = thumbnail.includes('image_not_available') ? {objectFit: 'unset'} : null;
                return (
                    <CSSTransition timeout={500} key={id} classNames='char__item'>
                        <li className='char__item'
                            ref={el => itemRefs.current[i] = el}        
                            tabIndex='0'
                            onKeyDown={(e) => {
                                                if(e.code === 'Enter') {
                                                    focusOnItem(i); 
                                                    props.onSelectedChar(id)
                                               }}}
                            onClick={() => {
                                            props.onSelectedChar(id)
                                            focusOnItem(i)
                                        }}>
                            <img src={thumbnail} alt={`it is ${name}`} style={imgClass} />
                            <div className="char__name">{name}</div>
                        </li>
                    </CSSTransition>
                )
            })
        return charItems;
    }
    
    function CardWithStage(status) {
        const StageCards = [];
        while(StageCards.length < 9) {
            StageCards.push(
                <CSSTransition timeout={500} key={`stage${StageCards.length}`}>
                <li className="char__item">
                    {status ? <Spinner/> : <ErrorMessage/>}
                    <div className="char__name">{status ? 'Please wait ' : 'Something Error :('}</div>
                </li>
                </CSSTransition>
            )
        }
        return StageCards;   
    }

    const elements = useMemo(() => setContent(process, View, chars, focusOnItem), [process]);

    return (
        <div className="char__list">
                <div className="Char__grid">
                    <TransitionGroup className="char__grid">
                    {elements}
                    </TransitionGroup>
                </div>
            <button 
                className="button button__main button__long"
                style={{display: `${chars.length > 63 ? 'none' : 'block'}`}}
                disabled={loading}
                onClick={onSetCharacters}>
                <div className="inner">load more</div>
            </button>
        </div>
    )
}



CharList.propTypes = {
    onSelectedChar: PropTypes.func.isRequired,
}

export default CharList;