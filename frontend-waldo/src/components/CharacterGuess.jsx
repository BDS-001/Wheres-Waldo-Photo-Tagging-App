/* eslint-disable react/prop-types */
import { useState, useEffect } from 'react';
import { submitGuess } from '../services/gameService';

const CharacterGuess = ({ 
    levelId, 
    selectedPosition, 
    onGuessSubmit,
    foundCharacters = [], 
    characters = [],
    onGuessComplete 
  }) => {
    const [selectedCharacter, setSelectedCharacter] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState(null);
  
    const isSelectionActive = selectedPosition.display === 'block';
  
    // Reset selected character when position changes
    useEffect(() => {
      setSelectedCharacter('');
      setError(null);
    }, [selectedPosition]);
  
    const handleSubmitGuess = async () => {
        if (!selectedCharacter || !selectedPosition) return;
    
        setIsSubmitting(true);
        setError(null);
    
        const width = Number(selectedPosition.width || 50);
        const height = Number(selectedPosition.height || 50);
        
        // Calculate top-left coordinates by subtracting half width/height
        const selection = {
          x: Number(selectedPosition.x) - (width / 2),
          y: Number(selectedPosition.y) - (height / 2),
          width: width,
          height: height
        };
    
        console.log('Submitting guess with:', {
          levelId,
          characterId: selectedCharacter,
          selection
        });
    
        try {
          const result = await submitGuess(
            Number(levelId), 
            Number(selectedCharacter),
            selection
          );

          console.log(result)
          
          if (result.isCorrect) {
            onGuessComplete(selectedCharacter);
          }
          
          // Clear selection after guess
          setSelectedCharacter('');
          onGuessSubmit(null);
        } catch (err) {
          setError('Failed to submit guess. Please try again.');
          console.error('Guess submission error:', err);
        } finally {
          setIsSubmitting(false);
        }
    };
  
    const isCharacterFound = (characterId) => {
      return foundCharacters.includes(characterId);
    };
  
    return (
      <div className="guess-container">
        <div className="guess-content">
        <select
            value={selectedCharacter}
            onChange={(e) => setSelectedCharacter(e.target.value)}
            className="character-select"
            disabled={!isSelectionActive || isSubmitting}
        >
            <option key="default" value="">Select a character...</option>
            {characters.map((character) => (
                <option
                    key={`character-${character.id}`}
                    value={character.id}
                    disabled={isCharacterFound(character.id)}
                    className={isCharacterFound(character.id) ? 'character-found' : ''}
                >
                    {character.name} {isCharacterFound(character.id) ? '(Found!)' : ''}
                </option>
            ))}
        </select>
  
          {error && (
            <div className="error-message">
              {error}
            </div>
          )}
  
          <div className="guess-buttons">
            <button
              onClick={() => onGuessSubmit(null)}
              className="cancel-button"
              disabled={!isSelectionActive || isSubmitting}
            >
              Cancel
            </button>
            <button
              onClick={handleSubmitGuess}
              disabled={!isSelectionActive || !selectedCharacter || isSubmitting}
              className={`confirm-button ${(!isSelectionActive || !selectedCharacter) ? 'disabled' : ''}`}
            >
              {!isSelectionActive ? 'Select an area' : 
               isSubmitting ? 'Checking...' : 'Confirm Guess'}
            </button>
          </div>
        </div>
      </div>
    );
  };
  
  export default CharacterGuess;