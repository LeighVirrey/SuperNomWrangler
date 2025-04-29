import React, { useState } from 'react';
import './UserReview.css'

const UserReview = () => {
    const [selectedPriceRange, setSelectedPriceRange] = useState('')
    const [selectedImage, setSelectedImage] = useState(null)
    const [imagePreview, setImagePreview] = useState(null)
    const [ratingValue, setRatingValue] = useState(0)
    const [description, setDescription] = useState('')
    const [reviewText, setReviewText] = useState('')
    const [extraText, setExtraText] = useState('')
    const [restaurantName, setRestaurantName] = useState('')

    const maxCharacters = 1000

    const handleImageChange = (event) => {
        const file = event.target.files[0]
        if (file) {
            setSelectedImage(file)
            setImagePreview(URL.createObjectURL(file))
        }
    }

    const handleRatingClick = (value) => {
        setRatingValue(value)
    }

    const handlePriceRangeChange = (event) => {
        setSelectedPriceRange(event.target.value)
    }

    const pointsCounter = () => {
        let points = 0;
        if (restaurantName.trim()) points += 200
        if (ratingValue > 0) points += 200
        if (description.trim()) points += 200
        if (selectedPriceRange) points += 200
        if (reviewText.trim()) points += 100
        if (extraText.trim()) points += 100
        return points
    }

    return (
        <div>
            <h1 className='reviewTitle'>Review</h1>
            <form className='reviewContainerForm'>
                <div>
                    <p>points: {pointsCounter()}</p>
                </div>
                <div className='restaurantName'>
                    <h3>Restaurant Name:</h3>
                    <input
                        type='text'
                        placeholder='Name'
                        value={restaurantName}
                        onChange={(e) => setRestaurantName(e.target.value)}
                    />
                </div>

                <div className='yourRating'>
                    <h3>Your Rating</h3>
                    <p>Rate 1 to 5 dogs</p>
                    <div style={{ display: 'flex', gap: '5px' }}>
                        {[1, 2, 3, 4, 5].map((dog) => (
                            <span
                                key={dog}
                                style={{
                                    cursor: 'pointer',
                                    fontSize: '2rem',
                                    color: dog <= ratingValue ? '#FFA500' : '#ccc'
                                }}
                                onClick={() => handleRatingClick(dog)}
                            >
                                🌭
                            </span>
                        ))}
                    </div>
                </div>

                <div className='description'>
                    <h3>Description:</h3>
                    <textarea
                        placeholder='Description'
                        value={description}
                        onChange={(e) =>
                            e.target.value.length <= maxCharacters &&
                            setDescription(e.target.value)
                        }
                    />
                    <p>Textbox limit: {description.length}/{maxCharacters}</p>
                </div>

                <div className='cuisineType'>
                    <h3>Cuisine Type:</h3>
                    {['Japanese', 'Chinese', 'German', 'Italian', 'Mexican'].map((type) => (
                        <label key={type}>
                            <input type='checkbox' />
                            {type}
                        </label>
                    ))}
                </div>

                <div className='hours'>
                    <h3>Operating Hours:</h3>
                    <input type='text' placeholder='0800-1900' />
                </div>

                <div className='priceRange'>
                    <h3>Price Range:</h3>
                    <select value={selectedPriceRange} onChange={handlePriceRangeChange}>
                        <option value="">--Choose an option--</option>
                        <option value="option1">$5.00-$19.99</option>
                        <option value="option2">$20.00-$49.99</option>
                        <option value="option3">$50.00 +</option>
                    </select>
                </div>

                <div className='review'>
                    <h3>Personal Review:</h3>
                    <textarea
                        placeholder='Review: This will be public'
                        value={reviewText}
                        onChange={(e) =>
                            e.target.value.length <= maxCharacters &&
                            setReviewText(e.target.value)
                        }
                    />
                    <p>Textbox limit: {reviewText.length}/{maxCharacters}</p>
                </div>

                <div className='anythingElse'>
                    <h3>Anything you'd like to add:</h3>
                    <textarea
                        placeholder='Anything Else?'
                        value={extraText}
                        onChange={(e) =>
                            e.target.value.length <= maxCharacters &&
                            setExtraText(e.target.value)
                        }
                    />
                    <p>Textbox limit: {extraText.length}/{maxCharacters}</p>
                </div>

                <div className='restaurantImages'>
                    <h3>Images (Optional):</h3>
                    <input type="file" accept="image/*" onChange={handleImageChange} />
                    {imagePreview && <img src={imagePreview} alt="Preview" width="200" />}
                </div>

                <button className='submitReview'>Submit</button>
            </form>
        </div>
    )
}

export default UserReview