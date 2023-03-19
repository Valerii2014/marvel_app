import './comicsList.scss';

import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import useMarvelService from '../../services/MarvelService';
import Spinner from '../spinner/Spinner';
import ErrorMessage from '../errorMessage/ErrorMessage';

const ComicsList = () => {

    const {loading, error, getAllComics} = useMarvelService();
    const [comicsesList, setComicsesList] = useState([]),
          [offset, setOffset] = useState(20);

    
    const onComicsesList = async (offset) => {
        await getAllComics(offset)
        .then(res => setComicsesList(comicsesList => [...comicsesList, ...res]))
        setOffset(offset => offset + 8)
    }
    
    useEffect(async () => await onComicsesList(offset), [])

    
    function View(comics) {
        const res = comics.map((comics, i) => {
            const {name, thumbnail, price, id} = comics;
            return (
                <li className="comics__item" key={i}>
                    <Link to={`${id}`}>
                        <img src={thumbnail} alt={`There has be a ${name}`} className="comics__item-img"/>
                        <div className="comics__item-name">{name}</div>
                        <div className="comics__item-price">{`${price}`}</div>
                    </Link>
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
                onClick={() => onComicsesList(offset)}>
                <div className="inner">load more</div>
            </button>
        </div>
    )
}


export default ComicsList;