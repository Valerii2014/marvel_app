
import { useHttp } from "../hooks/useHttp";

const useMarvelService = () => {

    const {request, clearError, error, loading} = useHttp();

    const _apiBase = 'https://gateway.marvel.com:443/v1/public/';
    const _apiKey = 'apikey=7e84861ae7b14b8d93f0e54bda0ab247';

    const getAllCharacters = async (offset = 200) => {
        const res = await request(`${_apiBase}characters?limit=9&offset=${offset}&${_apiKey}`);
        return res.data.results.map(_transformCharacter);
    }

    const getCharacter = async (id) => {
        const res = await request(`${_apiBase}characters/${id}?${_apiKey}`);
        return _transformCharacter(res.data.results[0]);
    }

    const getAllComics = async () => {
        const res = await request(`${_apiBase}comics?limit=8&${_apiKey}`);
        console.log(res)
    }

    const _transformCharacter = (char) => {
        return {
            name: char.name,
            description: char.description,
            thumbnail: `${char.thumbnail.path}.${char.thumbnail.extension}`,
            homepage: char.urls[0].url,
            wiki: char.urls[1].url,
            id: char.id,
            comics: char.comics.items
        }
    }

    return {clearError, error, loading, getCharacter, getAllCharacters, getAllComics};
}

export default useMarvelService;