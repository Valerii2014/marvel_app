
import './randomChar.scss';

import { useState, useEffect } from 'react';
import mjolnir from '../../resources/img/mjolnir.png';
import useMarvelService from '../../services/MarvelService';
import Spinner from '../spinner/Spinner';
import ErrorMessage from '../errorMessage/ErrorMessage';


const RandomChar = () => {

    const [char, setChar] = useState(null);
    const {clearError, error, loading, getCharacter} = useMarvelService();


    useEffect(async () => await updateChar(), []);

    const updateChar = async () => {
        clearError();
        const id = Math.floor(Math.random() * (1011400-1011000) + 1011000);
        await getCharacter(id)
            .then(newChar => setChar(newChar))
    }

    function View(char) {
        const {name, description, thumbnail, homepage, wiki} = char;
        const imgClass = thumbnail.includes('image_not_available') ? {objectFit: 'unset'} : null;
        let descrUpdate;
        if(description.length >= 211){
            descrUpdate = description.slice(0, 210) + '...';
        } else if(description.length < 5) {
            descrUpdate = "The character description missing";
        } else {
            descrUpdate = description;
        }
    
        return (
            <div className="randomchar__block">
            <img src={thumbnail} alt="Random character" 
                 className="randomchar__img"
                 style={imgClass}/>
            <div className="randomchar__info">
                <p className="randomchar__name">{name}</p>
                <p className="randomchar__descr">
                    {descrUpdate}
                </p>
                <div className="randomchar__btns">
                    <a href={homepage} className="button button__main">
                        <div className="inner">homepage</div>
                    </a>
                    <a href={wiki} className="button button__secondary">
                        <div className="inner">Wiki</div>
                    </a>
                </div>
            </div>
        </div>
        )
    }

    const errorMessge = error ? ErrorMessage() : null;
    const spinner = loading ? Spinner() : null;
    const content = !(loading || error) && char ? View(char) : null;

    return (
        <div className="randomchar">
            {errorMessge}
            {spinner}
            {content}
            <div className="randomchar__static">
                <p className="randomchar__title">
                    Random character for today!<br/>
                    Do you want to get to know him better?
                </p>
                <p className="randomchar__title">
                    Or choose another one
                </p>
                <button className="button button__main"
                    onClick={updateChar}>
                    <div className="inner">try it</div>
                </button>
                <img src={mjolnir} alt="mjolnir" className="randomchar__decoration"/>
            </div>
        </div>
    )
}


export default RandomChar;
