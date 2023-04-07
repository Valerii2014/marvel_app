import './comicsList.scss';

import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import useMarvelService from '../../services/MarvelService';
import Spinner from '../spinner/Spinner';
import ErrorMessage from '../errorMessage/ErrorMessage';


const setContent = (process, Component, data) => {
    switch (process) {
        case 'waiting':
            return Component(data);
        case 'loading':
            return data.length > 0 ? Component(data) : <Spinner/>;
        case 'confirmed':
            return Component(data);
        case 'error':
            return <ErrorMessage/>;            
        default:
            throw new Error('Unexpected process state');
    }
}

const ComicsList = () => {

    const {process, setProcess, getAllComics} = useMarvelService(),
          [comicsesList, setComicsesList] = useState([]),
          [offset, setOffset] = useState(21);

    const onComicsLoaded = (newComics) => {
        setComicsesList(comicsesList => [...comicsesList, ...newComics]);
        setOffset(offset => offset + 8);
        setProcess('confirmed');
    }

    const onLoadingComicses = async (offset) => {
        setProcess('loading')
        await getAllComics(offset)
        .then(onComicsLoaded)
        .catch(() => setProcess('error'))
    }
    
    useEffect(async () => await onLoadingComicses(offset), [])

    
    const View = (data) => {
        const res = data.map((comics, i) => {
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
        return (
            <ul className="comics__grid">
                {res}
            </ul>
        )
    }
    
    

    return (
        <div className="comics__list">
              {setContent(process, View, comicsesList)}
            <button 
                className="button button__main button__long"
                style={{display: `${comicsesList.length >= 22 ? 'none' : 'block'}`}}
                disabled={process === 'loading' ? true : false}
                onClick={() => onLoadingComicses(offset)}>
                <div className="inner">load more</div>
            </button>
        </div>
    )
}


export default ComicsList;