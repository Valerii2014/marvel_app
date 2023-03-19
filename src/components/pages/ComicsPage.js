
import { Helmet } from 'react-helmet';
import AppBanner from "../appBanner/AppBanner";
import ComicsList from "../comicsList/ComicsList";

const ComicsPage = () => {

    return (
        <>   
            <Helmet>
                <meta
                    name="Page with comics"
                    content="Comics list page"
                    />
                <title>Comics page</title>
            </Helmet>                
            <AppBanner/>
            <ComicsList/>
        </>  
    )
}

export default ComicsPage;