import './comicsList.scss';

import { useState, useEffect } from 'react';
import useMarvelService from '../../services/MarvelService';
import Spinner from '../spinner/Spinner';
import ErrorMessage from '../errorMessage/ErrorMessage';

const ComicsList = () => {

    const {loading, error, getAllComics} = useMarvelService();
    const [comicsesList, setComicsesList] = useState([]),
          [offset, setOffset] = useState(6);

    
    const onComicsesList = async () => {
        await getAllComics(offset)
        .then(setComicsesList)
    }

    const onNewComicsesList = async (offset) => {
        await getAllComics(offset)
                .then(setNewComicsesList)
    }
    
    useEffect(async () => await onComicsesList(), [])

    const setNewComicsesList = (newComicses) => {
        setComicsesList(comicsesList => [...comicsesList, ...newComicses]);
        setOffset(offset => offset + 8);
    }
    
    function View(comics) {
        const res = comics.map(comics => {
            const {name, thumbnail, price, id} = comics;
            const addId = Math.floor(Math.random() * (100 - 1));
            return (
                <li className="comics__item" key={`${id + addId}`}>
                    <a href="422">
                        <img src={thumbnail} alt={`There has be a ${name}`} className="comics__item-img"/>
                        <div className="comics__item-name">{name}</div>
                        <div className="comics__item-price">{`${price}$`}</div>
                    </a>
                </li>
            )
        })
        return res;
    }
    
    const Content = View(comicsesList),
          Loading = loading ? Spinner() : null,
          Error = error ? ErrorMessage() : null;

    return (
        <div className="comics__list">
                {Loading}
                {Error}
            <ul className="comics__grid">
                {Content}
            </ul>
            <button 
                className="button button__main button__long"
                style={{display: `${comicsesList.length >= 22 ? 'none' : 'block'}`}}
                disabled={loading}
                onClick={onNewComicsesList}>
                <div className="inner">load more</div>
            </button>
        </div>
    )
}


export default ComicsList;