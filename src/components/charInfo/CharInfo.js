import './charInfo.scss';

import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { CSSTransition  } from 'react-transition-group';
import useMarvelService from '../../services/MarvelService';
import Skeleton from '../skeleton/Skeleton';
import Spinner from '../spinner/Spinner';
import ErrorMessage from '../errorMessage/ErrorMessage';



const setContent = (process, Component, data) => {
    switch (process) {
        case 'waiting':
            return <Skeleton/>;
        case 'loading':
            return <Spinner/>;
        case 'confirmed':
            return Component(data);
        case 'error':
            return <ErrorMessage/>;            
        default:
            throw new Error('Unexpected process state');
    }
}

const CharInfo = (props) => {

    const [char, setChar] = useState(null);
    const {getCharacter, process, setProcess} = useMarvelService();

    useEffect(() => onCharLoading(props.idSelectedChar), [props.idSelectedChar])

    const onCharLoading = (id) => {
        if(!id) return;

        setChar(null);
        getCharacter(id)
            .then(charLoaded) 
    } 
    
    const charLoaded = (char) => {
        setChar(char);
        setProcess('confirmed')
    }

    const View = (data) => {
        const {name, thumbnail, description, comics} = data;

        const descrUpdate = description === 'There is no description' ? 
                            "The character description missing" :
                            description;

        const imgClass = thumbnail.includes('image_not_available') ? {objectFit: 'unset'} : null;

        return (
            <>
                <div className="char__basics">
                        <img src={thumbnail} alt="abyss"
                                style={imgClass}/>
                        <div>
                            <div className="char__info-name">{name}</div>
                            <div className="char__btns">
                                <Link to={`/characters/${name}`} className="button button__main">
                                    <div className="inner">homepage</div>
                                </Link>
                                <Link to={`/characters/${name}`} className="button button__secondary">
                                    <div className="inner">Wiki</div>
                                </Link>
                            </div>
                        </div>
                    </div>
                    <div className="char__descr">
                        {descrUpdate}
                    </div>
                    <div className="char__comics">Comics:</div>
                    <ul className="char__comics-list">
                        {Comics(comics)}
                    </ul>
            </>
    )}

    const Comics = (comicsList) => {

        if (comicsList.length === 0) {
            return (
                <li>
                    {`Comics with the character, not found :(`}
                </li>
            )
        }

        return (comicsList.map((item, i) => {
            if (i > 9) return
            return (
                <li className="char__comics-item"
                    key={`comics${i}`}>
                    <Link to={`comics/${(item.resourceURI).slice(-5)}`}>{item.name}</Link>
                </li>
            )
        }))
    }

    // const SkeletonWindow = error || (loading && props.idSelectedChar) || char ? null : Skeleton(),
    //       Loading = loading && props.idSelectedChar ? Spinner() : null,
    //       Error = error ? ErrorMessage() : null,
    //       Content = char && !loading && !error ? View(char) : null;

    return (
        <CSSTransition 
                in={char ? true : false}
                timeout={1500}
                className='char__info'
        >
            <div className="char__info">
                {setContent(process, View, char)}
            </div>
        </CSSTransition>
    )
}


export default CharInfo;