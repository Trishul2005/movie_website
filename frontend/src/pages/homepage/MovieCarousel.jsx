import MovieCard from './MovieCard'
import { useState, useEffect, useRef } from 'react'

import '../../cssFiles/MovieCarousel.css'
import arrowLeft from '../../assets/arrow-left-s-line.svg'
import arrowRight from '../../assets/arrow-right-s-line.svg'

function MovieCarousel( {title, fetchURL, genre, user} ) {


    const [movies, setMovies] = useState([]) // useState for updating movies

    // So we need useEffect to say:
    // “Hey React, after you finish rendering this component to the screen, 
    // now you can go ahead and fetch the movies from the API.”

    useEffect( () => {

        // defining async function
        const fetchData = async () => {

            // manual genre filtering API call
            if (genre) {

                let page = 1
                const filtered = []

                while (filtered.length != 20) {

                    const response = await fetch(fetchURL + `&page=${page}`)
                    const data = await response.json();

                    for (const show of data.results) {

                        if (show.genre_ids.includes(parseInt(genre))) {
                            filtered.push(show)

                            if (filtered.length == 20) {
                                break
                            }
                        }

                    }
                    
                    page++;

                }

                setMovies(filtered);

            }

            // normal API call
            else {
                const response = await fetch(fetchURL) // API call
                const data = await response.json(); // converting data to json format
                console.log("Movie Carousel data:", data);
                setMovies(data.results) // setting movies to hold the API call results
            }

            

        }

        fetchData(); // calling fetchData function

    }, [fetchURL] ); // useEffect will run when the component is loaded, or fetchURL changes

    
    const scrollRef = useRef(null); // reference for scrollbar

    // function for adjusting scrollbar when button is pressed
    const scroll = (direction) => {
        const container = scrollRef.current;
        const scrollAmt = 600;
        
        if (direction === 'left') {
            container.scrollLeft -= scrollAmt;
        }
        else {
            container.scrollLeft += scrollAmt;
        }
    }

    return(

        <div className="mc-movie-carousel">
            <h2 className="mc-movie-carousel-title">{title}</h2>

            <div className="mc-carousel-wrapper">

                <button className="mc-scroll-button left" onClick={() => scroll('left')}>
                    <img src={arrowLeft} alt="left" />
                </button>

                <div className="mc-movie-row" ref={scrollRef}>
                {movies.map( 
                    (movie) => (
                        <MovieCard key={`${movie.media_type}-${movie.id}`} movie={movie} user={user}/>
                    ) 
                )}
                </div>

                <button className="mc-scroll-button right" onClick={() => scroll('right')}>
                    <img src={arrowRight} alt='right' />
                </button>


            </div>


        </div>

    )


}

export default MovieCarousel