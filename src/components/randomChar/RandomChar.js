
import './randomChar.scss';

import { useState, useEffect} from 'react';
import { Link } from 'react-router-dom';
import { CSSTransition, SwitchTransition } from 'react-transition-group';
import mjolnir from '../../resources/img/mjolnir.png';
import useMarvelService from '../../services/MarvelService';
import setContent from '../../utils/setContent'


const RandomChar = () => {

    const [char, setChar] = useState(null);
    const [stateAnimation, setStateAnimation] = useState(true);
    const {process, setProcess, getCharacter} = useMarvelService();

    useEffect (() => { updateChar()}, []);

    const updateChar = () => {
        const id = Math.floor(Math.random() * (1011400-1011000) + 1011000);

        setProcess('loading');
        setStateAnimation(!stateAnimation);
        getCharacter(id)
            .then(updatedChar)
            .catch(() => setProcess('error'));
    }

    const updatedChar = (char) => {
        setChar(char);
        setProcess('confirmed');
    }

    function View(char) {
        const {name, description, thumbnail} = char;
        const imgClass = thumbnail.includes('image_not_available') ? {objectFit: 'unset'} : null;
        let descrUpdate;
        
        if(description.length >= 211){
            descrUpdate = description.slice(0, 210) + '...';
        }  else {
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
                        <Link to={`/characters/${name}`} className="button button__main">
                            <div className="inner">homepage</div>
                        </Link>
                        <Link to={`/characters/${name}`} className="button button__secondary">
                            <div className="inner">Wiki</div>
                        </Link>
                    </div>
                </div>
            </div>
        )
    }

    
    // const charOrLoading = char && !loading ? View(char) : Spinner();
    // const content = error ? ErrorMessage() : charOrLoading;

    return (
        <div className="randomchar">
            <SwitchTransition mode='out-in'>
                <CSSTransition 
                    timeout={800}
                    key={stateAnimation}
                    classNames='randomchar__block'>
                        {setContent(process, () => View(char), char)}
                </CSSTransition>
            </SwitchTransition>
            <div className="randomchar__static">
                <p className="randomchar__title">
                    Random character for today!<br/>
                    Do you want to get to know him better?
                </p>
                <p className="randomchar__title">
                    Or choose another one
                </p>
                <button className="button button__main"
                    onClick={updateChar}
                    disabled={process === 'loading' ? true : false}
                >
                    <div className="inner">try it</div>
                </button>
                <img src={mjolnir} alt="mjolnir" className="randomchar__decoration"/>
            </div>
        </div>
    )
}


export default RandomChar;
