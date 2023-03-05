import './charList.scss';

import {useState, useEffect, useRef, useMemo} from 'react';
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
        // setLoading(loading => false);
        setLoadingNewChars(loadingNewChars => false);
        setOffset(offset => offset + 9);
        setLoadedChars(loadedChars => loadedChars + 9)
    }

    // const onCharactersLoading = (offset) => {
    //     return marvelService.getAllCharacters(offset)
    // }


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
        setLoadingNewChars(true);
        getAllCharacters(offset)
            .then(onCharactersLoaded)
    }

    function ViewContent(charsList) {
        return charsList.map((el, i) => {
            if(loadedChars >= i){
                const {thumbnail, name, id} = el;
                const imgClass = thumbnail.includes('image_not_available') ? {objectFit: 'unset'} : null;
                return (
                    <li className='char__item'
                        key={id}
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
                )
            }
        })
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
                </li>)
        }
        
        return arr;
    }
    
    const items = ViewContent(chars);
    const Loading = loading ? ViewLoadOrError('spinner') : null;
    const LoadingNew = loadingNewChars && !error ? ViewLoadOrError('spinner') : null;
    const Error = error && !loadingNewChars ? ViewLoadOrError('error') : null;
    const ErrorNew = error && loadingNewChars ? ViewLoadOrError('error') : null;
    return (
        <div className="char__list">
            <ul className="char__grid">
                {Loading}
                {Error}
                {items}
                {LoadingNew}
                {ErrorNew}
            </ul>
            <button 
                className="button button__main button__long"
                style={{display: `${chars.length > 63 ? 'none' : 'block'}`}}
                disabled={loadingNewChars}
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