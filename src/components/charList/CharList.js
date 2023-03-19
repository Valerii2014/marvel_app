import './charList.scss';

import {useState, useEffect, useRef, useMemo} from 'react';
import { CSSTransition, TransitionGroup } from 'react-transition-group';
import PropTypes from 'prop-types';
import useMarvelService from '../../services/MarvelService';
import Spinner from '../spinner/Spinner';
import ErrorMessage from '../errorMessage/ErrorMessage';


const CharList = (props) => {
    
    const [chars, setChars] = useState([]);
    const [loadedChars, setLoadedChars] = useState(0);
    const [loadingNewChars, setLoadingNewChars] = useState(false);
    const [offset, setOffset] = useState(200);
    

    const {clearError, error, loading, getAllCharacters} = useMarvelService();

    useEffect(() => {
        onSetCharacters()
    }, [])

    const onCharactersLoaded = (newChars) => {
        setChars(chars => [...chars, ...newChars]);
        setLoadingNewChars(false);
        setOffset(offset => offset + 9);
        setLoadedChars(loadedChars => loadedChars + 9)
    }


    const onSetCharacters = () => {
        getAllCharacters(offset)
        .then(onCharactersLoaded)
        
    }
    
    const itemRefs = useRef([]);

    const focusOnItem = (i) => {
        itemRefs.current.forEach(item => item.classList.remove('char__item_selected'))
        itemRefs.current[i].classList.add('char__item_selected');
        itemRefs.current[i].focus();
    }

    const onSetNewCharacters = () => {
        clearError();
        setLoadingNewChars(true);
        getAllCharacters(offset)
            .then(onCharactersLoaded)
    }

    function ViewContent(charsList) {
        const charItems = charsList.map((el, i) => {
            if(loadedChars >= i){
                const {thumbnail, name, id} = el;
                const imgClass = thumbnail.includes('image_not_available') ? {objectFit: 'unset'} : null;
                return (
                    <CSSTransition timeout={500} key={id} classNames='char__item'>
                        <li className='char__item'
                            ref={el => itemRefs.current[i] = el}        
                            tabIndex='0'
                            onKeyDown={(e) => {if(e.code === 'Enter') {focusOnItem(i); props.onSelectedChar(id)}}}
                            onClick={() => {
                                            props.onSelectedChar(id)
                                            focusOnItem(i)
                                        }}>
                            <img src={thumbnail} alt={`it is ${name}`} style={imgClass} />
                            <div className="char__name">{name}</div>
                        </li>
                    </CSSTransition>
                )
            }
        })
        return (
            <ul className='char__grid'>
            <TransitionGroup component={null}>
                {charItems}
            </TransitionGroup>
            </ul>
        )
    }
    
    function ViewLoadOrError(status) {
        let image, description;
        const stage = status,
              arr = [];

        if(stage === 'spinner'){
            image = Spinner()
            description='Please wait '        
        } else if(stage === 'error'){
            image = ErrorMessage()
            description='Something Error :('
        }
    
        while (arr.length < 9) {
            arr.push(
                    <li className="char__item" key={arr.length}>
                        {image}
                        <div className="char__name">{description}</div>
                    </li>
            )
        }
        
        return (
            <ul className='char__grid'>
                {arr}
            </ul>
        )
    }
    
    const items = ViewContent(chars);
    const Loading = loading && chars.length === 0 ? ViewLoadOrError('spinner') : null;
    const LoadingNew = loadingNewChars && !error ? ViewLoadOrError('spinner') : null;
    const Error = error && !loadingNewChars ? ViewLoadOrError('error') : null;
    const ErrorNew = error && loadingNewChars ? ViewLoadOrError('error') : null;
    return (
        <div className="char__list">
            
                {Loading}
                {Error}
                {items}
                {LoadingNew}
                {ErrorNew}
            
            <button 
                className="button button__main button__long"
                style={{display: `${chars.length > 63 ? 'none' : 'block'}`}}
                disabled={loadingNewChars && !error}
                onClick={onSetNewCharacters}>
                <div className="inner">load more</div>
            </button>
        </div>
    )
}



CharList.propTypes = {
    onSelectedChar: PropTypes.func.isRequired,
}

export default CharList;