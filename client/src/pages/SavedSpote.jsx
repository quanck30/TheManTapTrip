import React from 'react';
import CardDisplay from '../components/CardDisplay';
import '../styles/saved.css';

function SavedSpots({ savedSpots = [], onRemove, onCardClick }) {
  return (
    <div className="saved-container">
      <h2 className="page-title">保存済みスポット</h2>
      
      {savedSpots.length === 0 ? (
        <div className="empty-state">保存されたスポットはありません。</div>
      ) : (
        <div className="spots-grid">
          {savedSpots.map((spot) => {
            const id = spot.spotId || spot.id;
            return (
              <div key={id} className="saved-card-wrapper">
                <CardDisplay 
                  spot={spot} 
                  onCardClick={() => onCardClick(spot)} 
                />
                <button 
                  className="remove-btn" 
                  onClick={() => onRemove(id)}
                >
                  削除する
                </button>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default SavedSpots;