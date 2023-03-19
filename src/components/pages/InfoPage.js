import './infoPage.scss'


import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import Spinner from '../spinner/Spinner';
import ErrorMessage from '../errorMessage/ErrorMessage';
import useMarvelService from '../../services/MarvelService';

const InfoPage = () => {

    const navigate = useNavigate();
    const {resourceId} = useParams();
    const {loading, error, clearError, getComic, getCharacterByName} = useMarvelService();
    const [resource, setResource] = useState(resourceId);
    

    useEffect(async () => {
        clearError();
        if(/\d/.test(resourceId)){
            await getComic(resourceId)
            .then(data => setResource(data))
        } else {
            await getCharacterByName(resourceId)
            .then(data => setResource(data[0]))
        }
        
    }, [resourceId])

    function View(content) {
      
        return(
            <>
                <div><img src={content.thumbnail} alt="name" className="single-comic__img"/></div>
                <div className="single-comic__info">
                    <h2 className="single-comic__name">{content.name}</h2>
                    <p className="single-comic__descr">{content.description}</p>
                    {/\d/.test(resourceId) ? 
                        <>
                            <p className="single-comic__descr">{content.pageCount}</p>
                            <p className="single-comic__descr">Language: {content.language}</p>
                            <div className="single-comic__price">{content.price}</div> 
                        </> : null 
                    }
                </div>
            </>
        )
    }

    const Loading = loading ? <Spinner/> : null;
    const Error = error ? <ErrorMessage/> : null;
    const Content = loading || error ? null : View(resource);

    return (
        <>
            <Helmet>
                <meta
                    name="Info page"
                    content={`${resource.name}`}
                    />
                <title>{/\d/.test(resourceId) ? `${resource.name} comic book` : 
                                                `Information about ${resource.name}`}
                </title>
            </Helmet>
            <div className="single-comic">
                {Loading}
                {Error}
                {Content}
                <div onClick={() => navigate(-1)} className="single-comic__back">To back</div>
            </div>
        </>
    )
}

export default InfoPage;