import './charInfo.scss';

import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Spinner from '../spinner/Spinner';
import ErrorMessage from '../errorMessage/ErrorMessage';
import useMarvelService from '../../services/MarvelService';
import Skeleton from '../skeleton/Skeleton';


const CharInfo = (props) => {

    const [char, setChar] = useState(null);
    const {error, loading, getCharacter, clearError} = useMarvelService();

    useEffect(() => {clearError(); onCharLoad(props.idSelectedChar)}, [props.idSelectedChar])

    const onCharLoad = (id) => {
        if(id){
        getCharacter(id)
        .then(char => setChar(char))
        }
    } 
    
    const View = (char) => {
    if(char){
        const {name, thumbnail, description, homepage, wiki, comics} = char;

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
                                <a href={homepage} className="button button__main">
                                    <div className="inner">homepage</div>
                                </a>
                                <a href={wiki} className="button button__secondary">
                                    <div className="inner">Wiki</div>
                                </a>
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
    )}}

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

    const SkeletonWindow = error || (loading && props.idSelectedChar) || char ? null : Skeleton(),
          Loading = loading && props.idSelectedChar ? Spinner() : null,
          Error = error ? ErrorMessage() : null,
          Content = char && !loading && !error ? View(char) : null;

    return (
        <div className="char__info">
            {SkeletonWindow}
            {Loading}
            {Error}
            {Content}
        </div>
    )
}


export default CharInfo;