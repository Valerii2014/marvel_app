import './charInfo.scss';

import { useState, useEffect } from 'react';
import Spinner from '../spinner/Spinner';
import ErrorMessage from '../errorMessage/ErrorMessage';
import useMarvelService from '../../services/MarvelService';
import Skeleton from '../skeleton/Skeleton'

const CharInfo = (props) => {

    const [char, setChar] = useState(null);
    const {error, loading, getCharacter} = useMarvelService();

    useEffect(() => {onCharLoad(props.idSelectedChar)}, [props.idSelectedChar])

    const onCharLoad = (id) => {
        if(id){
        getCharacter(id)
        .then(char => setChar(char))
        }
    } 
    
    const View = (char) => {
    if(char){
        let {name, thumbnail, description, homepage, wiki, comics} = char;

        let descr = description;
        const imgClass = thumbnail.includes('image_not_available') ? {objectFit: 'unset'} : null;

        if(description.length < 5) {
            descr = "The character description missing";
        } 

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
                        {descr}
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
                    <a href={item.resourceURI}>{item.name}</a>
                </li>
            )
        }))
    }

    const SkeletonWindow = error || (loading && props.idSelectedChar) || char ? null : Skeleton(),
          Loading = loading && props.idSelectedChar ? Spinner() : null,
          Error = error ? ErrorMessage() : null,
          Content = char && !loading ? View(char) : null;

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