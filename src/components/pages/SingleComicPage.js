import './singleComicPage.scss';

import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import Spinner from '../spinner/Spinner';
import ErrorMessage from '../errorMessage/ErrorMessage';
import useMarvelService from '../../services/MarvelService';

const SingleComicPage = () => {

    const {comicId} = useParams();
    const {loading, error, clearError, getComic} = useMarvelService();
    const [comic, setComic] = useState(comicId);

    useEffect(async () => {
        clearError();
        await getComic(comicId)
            .then(comic => setComic(comic))
    }, [comicId])

    function View(comic) {
        const {name, thumbnail, description, 
               pageCount, language, price} = comic;
        return(
            <>
                <img src={thumbnail} alt="name" className="single-comic__img"/>
                <div className="single-comic__info">
                    <h2 className="single-comic__name">{name}</h2>
                    <p className="single-comic__descr">{description}</p>
                    <p className="single-comic__descr">{pageCount}</p>
                    <p className="single-comic__descr">Language: {language}</p>
                    <div className="single-comic__price">Price: {price}</div>
                </div>
            </>
        )
    }

    const Loading = loading ? <Spinner/> : null;
    const Error = error ? <ErrorMessage/> : null;
    const Content = loading || error ? null : View(comic);

    return (
        <div className="single-comic">
            {Loading}
            {Error}
            {Content}
            <Link to='/comics' className="single-comic__back">Back to all</Link>
        </div>
    )
}

export default SingleComicPage;