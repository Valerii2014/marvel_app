
import { useHttp } from "../hooks/useHttp";

const useMarvelService = () => {

    const {request, process, setProcess} = useHttp();

    const _apiBase = 'https://gateway.marvel.com:443/v1/public/';
    const _apiKey = 'apikey=      ***your_APIkey***    ';

    const getCharacterByName = async (name) => {
        const res = await request(`${_apiBase}characters?name=${name}&${_apiKey}`);
        return res.data.results.map(_transformCharacter)
    }

    const getAllCharacters = async (offset = 200) => {
        const res = await request(`${_apiBase}characters?limit=9&offset=${offset}&${_apiKey}`);
        return res.data.results.map(_transformCharacter);
    }

    const getCharacter = async (id) => {
        const res = await request(`${_apiBase}characters/${id}?${_apiKey}`);
        return _transformCharacter(res.data.results[0]);
    }

    const getAllComics = async (offset) => {
        const res = await request(`${_apiBase}comics?limit=8&offset=${offset}&${_apiKey}`);
        return res.data.results.map(_transformComics);
    }

    const getComic = async (id) => {
        const res = await request(`${_apiBase}comics/${id}?${_apiKey}`);
        return _transformComics(res.data.results[0]);
    }

    const _transformCharacter = (char) => {
        return {
            name: char.name,
            description: char.description || 'There is no description',
            thumbnail: `${char.thumbnail.path}.${char.thumbnail.extension}`,
            homepage: char.urls[0].url,
            wiki: char.urls[1].url,
            id: char.id,
            comics: char.comics.items
        }
    }

    const _transformComics = (comics) => {
        return {
            name: comics.title,
            thumbnail: `${comics.thumbnail.path}.${comics.thumbnail.extension}`,
            description: comics.description || 'There is no description',
            pageCount: comics.PageCount ? `${comics.PageCount} p.` : 'No information about the number  of pages',
            language: comics.textObjects.language || 'en-us',
            price: comics.prices[0].price === 0 ? 'Not avaliable' : `${comics.prices[0].price}$`,
            id: comics.id
        }
    }

    return {
            process,
            setProcess, 
            getCharacter, 
            getAllCharacters, 
            getAllComics, 
            getComic, 
            getCharacterByName
        };
}

export default useMarvelService;
