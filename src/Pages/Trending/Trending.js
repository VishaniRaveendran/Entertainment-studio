import axios from 'axios'
import { useEffect, useState, useCallback } from 'react'
import SingleContent from '../../components/SingleContent/SingleContent';
import "./Trending.css"
import CustomPagination from '../../components/Pagination/CustomPagination';

const Trending = () => {
    
    const [page, setPage] = useState(1)
    const [content, setContent] = useState([]);

    const fetchTrending = useCallback(async () => {
        const { data } = await axios.get(
            `https://api.themoviedb.org/3/trending/all/day?api_key=${process.env.REACT_APP_API_KEY}&page=${page}`
        );
        setContent(data.results);
    }, [page]);

    useEffect(() => {
        fetchTrending();
    }, [fetchTrending])


    return (
        <div>
            <span className="pageTitle">Trending</span>
            <div className="trending">
                {
                    content && content.map((c) =>
                        <SingleContent
                            key={c.id}
                            id={c.id}
                            poster={c.poster_path}
                            title={c.title || c.name}
                            date={c.first_air_date || c.release_date}
                            media_type={c.media_type}
                            vote_average={c.vote_average} />
                    )
                }
            </div>
            <CustomPagination setPage={setPage}/>
        </div>
    )
}

export default Trending
