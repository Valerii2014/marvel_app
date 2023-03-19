import { useState } from "react";
import { Helmet } from 'react-helmet';
import RandomChar from "../randomChar/RandomChar";
import CharList from "../charList/CharList";
import CharInfo from "../charInfo/CharInfo";
import SearchCharForm from "../searchCharForm/SearchCharForm";
import ErrorBoundary from "../errorBoundary/ErrorBoundary";

import decoration from '../../resources/img/vision.png';
    
const MainPage = () => {

    const [selectedChar, setChar] = useState(null);

    const onSelectedChar = (id) => {
        setChar(id)
    }

    return (
        <>
            <Helmet>
                <meta
                    name="Main page"
                    content="Marvel information portal"
                    />
                <title>Marvel information portal</title>
            </Helmet>
            <ErrorBoundary>
                <RandomChar/>
            </ErrorBoundary>
            <div className="char__content">
                <ErrorBoundary>
                    <CharList onSelectedChar={onSelectedChar}/>
                </ErrorBoundary>
                <div className="wrapper">
                <ErrorBoundary>
                    <CharInfo idSelectedChar={selectedChar}/>
                </ErrorBoundary>
                <ErrorBoundary>
                    <SearchCharForm/>
                </ErrorBoundary>
                </div>
            </div>
            <img className="bg-decoration" src={decoration} alt="vision"/>
        </>
    )
}

export default MainPage;