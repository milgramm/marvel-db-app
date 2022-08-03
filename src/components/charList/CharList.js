import { useState, useEffect, useRef } from 'react'
import PropTypes from 'prop-types'

import MarvelService from '../../services/MarvelService'
import Spinner from '../spinner/Spinner'
import Error from '../errorMessage/Error'

import './charList.scss'

const CharList = (props) => {
	const [charList, setCharList] = useState([])
	const [newCharsLoading, setNewCharsLoading] = useState(false)
	const [loading, setLoading] = useState(true)
	const [errorMessage, setErrorMessage] = useState(false)
	const [loadingList, setLoadingList] = useState(false)
	const [offset, setOffset] = useState(400)
	const [charEnded, setCharEnded] = useState(false)

	const marvelRequest = new MarvelService()
	const refsArray = useRef([])

	useEffect(() => {
		getCharacters()

		window.addEventListener('scroll', loadMoreCharactersOnScroll)

		return function cleanup() {
			window.removeEventListener('scroll', loadMoreCharactersOnScroll)
		}
	}, [])

	useEffect(() => {
		if (newCharsLoading) {
			loadMoreCharacters(offset)
		}
	}, [newCharsLoading])

	const getCharacters = () => {
		loadMoreCharacters()
	}

	const loadMoreCharactersOnScroll = () => {
		if (loadingList) {
			return
		}
		if (charEnded) {
			window.removeEventListener('scroll', loadMoreCharactersOnScroll)
		}
		if (window.innerHeight + (window.scrollY - 37) >= document.documentElement.scrollHeight - 300) {
			setNewCharsLoading(true)
		}
	}

	const loadMoreCharacters = (offsetLocal = offset) => {
		setLoadingList(true)

		marvelRequest
			.getAllCharacters(offsetLocal)
			.then((newCharList) => {
				setCharList((charList) => [...charList, ...newCharList])
				setLoading(false)
				setErrorMessage(false)
				setLoadingList(false)
				setOffset((offset) => offset + 9)
				setCharEnded(newCharList.length < 9 ? true : false)
			})
			.catch(getError)
			.finally(() => setNewCharsLoading(false))
	}

	const getError = () => {
		setLoading(false)
		setErrorMessage(true)
	}

	const setFocusOnCharacter = (id) => {
		refsArray.current.forEach((ref) => {
			ref.classList.remove('char__item_selected')
		})

		refsArray.current[id].classList.add('char__item_selected')
		refsArray.current[id].focus()
	}

	const renderListItems = (charList) => {
		const elements = charList.map((char, i) => {
			let style = { objectFit: 'cover' }
			if (char.thumbnail === 'http://i.annihil.us/u/prod/marvel/i/mg/b/40/image_not_available.jpg') {
				style = { objectFit: 'unset' }
			}

			return (
				<li
					ref={(el) => (refsArray.current[i] = el)}
					className='char__item'
					key={char.name}
					onClick={() => {
						props.getCharId(char.id)
						setFocusOnCharacter(i)
					}}
					tabIndex={0}
					onKeyDown={(e) => {
						if (e.key === ' ' || e.key === 'Enter') {
							props.getCharId(char.id)
							setFocusOnCharacter(i)
						}
					}}
				>
					<img src={char.thumbnail} alt={char.name} style={style} />
					<div className='char__name'>{char.name}</div>
				</li>
			)
		})

		return <ul className='char__grid'>{elements}</ul>
	}

	const items = renderListItems(charList)
	const error = errorMessage ? <Error /> : null
	const spinner = loading ? <Spinner /> : items

	console.log(charList)

	return (
		<div className='char__list'>
			{error || spinner}
			{charEnded ? null : (
				<button
					className='button button__main button__long'
					onClick={() => loadMoreCharacters(offset)}
					disabled={loadingList}
				>
					<div className='inner'>load more</div>
				</button>
			)}
		</div>
	)
}

CharList.propTypes = {
	getCharId: PropTypes.func.isRequired,
}

export default CharList

//done сделал рефы для кажой карточки и класс активности да и в целом уже все готово по проекту
