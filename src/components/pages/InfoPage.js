import './infoPage.scss'


import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import useMarvelService from '../../services/MarvelService';
import setContent from '../../utils/setContent';

const InfoPage = () => {

    const navigate = useNavigate();
    const {resourceId} = useParams();
    const {process, setProcess, getComic, getCharacterByName} = useMarvelService();
    const [resource, setResource] = useState(null);
    

    useEffect( () => {
    
        try {
            loadingData(resourceId)
        }
        catch {
            setProcess('error')
        }
           
    }, [resourceId])

    const loadingData = async (data) => {
        if(/\d/.test(data)){
            await getComic(data)
            .then(data => setResource(data))
            
        } else {
            await getCharacterByName(data)
            .then(data => setResource(data[0]))
            
        }
        setProcess('confirmed');
    } 

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

    return (
        <>
            {resource ? 
                    <Helmet>
                        <meta
                            name="Info page"
                            content={`${resource.name}`}
                            />
                        <title>{/\d/.test(resourceId) ? 
                                     `${resource.name} comic book` : 
                                    `Information about ${resource.name}`
                                }
                        </title>
                    </Helmet> :
                    null
            }
            <div className="single-comic">
                    {setContent(process, View, resource)}
                <div onClick={() => navigate(-1)} className="single-comic__back">To back</div>
            </div>
        </>
    )
}

export default InfoPage;