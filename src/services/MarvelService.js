import axios from 'axios'

class MarvelService {
	_apiBase = 'https://gateway.marvel.com:443/v1/public/'
	_apiKey = 'apikey=893a9b7dba2d7b81bf6c25ef2a7f0761'

	getData = async (url) => {
		let res = await axios.get(url)

		if (!res.status === 200 && res.statusText === 'OK') {
			throw new Error(`could not get request to ${url} status is ${res.status}`)
		}
		return res.data
	}

	getAllCharacters = async () => {
		const characters = await this.getData(`${this._apiBase}characters?limit=9&offset=132&${this._apiKey}`)
		return characters.data.results.map((char) => this._tranformData(char))
	}

	getCharacter = async (id) => {
		const result = await this.getData(`${this._apiBase}characters/${id}?&${this._apiKey}`)
		return this._tranformData(result.data.results[0])
	}

	_tranformData = (char) => {
		if (char.description === '') {
			char.description = 'This character does not have description'
		} else if (char.description.length > 150) {
			char.description = char.description.slice(0, 150) + '...'
		}

		return {
			name: char.name,
			thumbnail: char.thumbnail.path + '.' + char.thumbnail.extension,
			description: char.description,
			homepage: char.urls[0].url,
			wiki: char.urls[1].url,
		}
	}
}

export default MarvelService