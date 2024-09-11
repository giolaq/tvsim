import React, { useState, useEffect } from 'react';
import './App.css';

const LivingRoomFPV = () => {
  const [isTvOn, setIsTvOn] = useState(true);
  const [activeCategory, setActiveCategory] = useState('Home');
  const [selectedGridItem, setSelectedGridItem] = useState(0);
  const [isDrawerActive, setIsDrawerActive] = useState(true);
  const [isDrawerOpen, setIsDrawerOpen] = useState(true);
  const [visibleRange, setVisibleRange] = useState({ start: 0, end: 11 });
  const [isZoomed, setIsZoomed] = useState(false);
  const [isZooming, setIsZooming] = useState(false);

  const categories = ['Home', 'Movies', 'Games', 'Settings'];
  const gridItems = Array(50).fill().map((_, i) => `Item ${i + 1}`);

  const itemsPerRow = 4;
  const visibleRows = 3;

  useEffect(() => {
    const rowIndex = Math.floor(selectedGridItem / itemsPerRow);
    let start = Math.max(0, rowIndex - 1) * itemsPerRow;
    let end = Math.min(gridItems.length - 1, start + (visibleRows * itemsPerRow) - 1);

    if (end === gridItems.length - 1) {
      start = Math.max(0, end - (visibleRows * itemsPerRow) + 1);
    }

    setVisibleRange({ start, end });
  }, [selectedGridItem]);

  const handleZoom = () => {
    setIsZooming(true);
    setIsZoomed(prev => !prev);
    setTimeout(() => setIsZooming(false), 500); // Match this to your transition duration
  };

  useEffect(() => {
    const handleKeyPress = (event) => {
      if (event.key === 'z' || event.key === 'Z') {
        setIsZooming(true);
        setIsZoomed(prev => !prev);
        setTimeout(() => setIsZooming(false), 500); // Match this to your transition duration
      }
    };

    window.addEventListener('keydown', handleKeyPress);

    return () => {
      window.removeEventListener('keydown', handleKeyPress);
    };
  }, []);

    const handleRemoteButton = (button) => {
    if (!isTvOn && button !== 'power') return;

    switch (button) {
      case 'up':
        if (isDrawerActive && isDrawerOpen) {
          setActiveCategory(prev => {
            const currentIndex = categories.indexOf(prev);
            return categories[currentIndex > 0 ? currentIndex - 1 : categories.length - 1];
          });
        } else if (!isDrawerActive) {
          setSelectedGridItem(prev => Math.max(0, prev - itemsPerRow));
        }
        break;
      case 'down':
        if (isDrawerActive && isDrawerOpen) {
          setActiveCategory(prev => {
            const currentIndex = categories.indexOf(prev);
            return categories[currentIndex < categories.length - 1 ? currentIndex + 1 : 0];
          });
        } else if (!isDrawerActive) {
          setSelectedGridItem(prev => Math.min(gridItems.length - 1, prev + itemsPerRow));
        }
        break;
      case 'left':
        if (!isDrawerActive) {
          if (selectedGridItem % itemsPerRow === 0) {
            setIsDrawerActive(true);
            setIsDrawerOpen(true);
          } else {
            setSelectedGridItem(prev => prev - 1);
          }
        } else if (!isDrawerOpen) {
          setIsDrawerOpen(true);
        }
        break;
      case 'right':
        if (isDrawerActive) {
          if (isDrawerOpen) {
            setIsDrawerOpen(false);
          } else {
            setIsDrawerActive(false);
          }
        } else {
          setSelectedGridItem(prev => Math.min(gridItems.length - 1, prev + 1));
        }
        break;
      case 'select':
        // Handle select button press
        console.log('Select button pressed');
        // You can add more functionality here, such as opening a selected item
        break;
      case 'power':
        setIsTvOn(prev => !prev);
        break;
      case 'zoom':
        handleZoom();
        break;
      default:
        break;
    }
  };
   
  const toggleDrawer = () => {
    setIsDrawerOpen(prev => !prev);
    if (!isDrawerOpen) {
      setIsDrawerActive(true);
    }
  };

  return (
    <div className={`living-room ${isZoomed ? 'zoomed' : ''}`}>
      <div className="room">
        <div className="floor"></div>
        <div className="wall left-wall"></div>
        <div className="wall right-wall"></div>
        <div className="tv-stand" onClick={handleZoom}></div>
        
        <div className={`tv ${isZooming ? 'zooming' : ''}`}>
          {isTvOn ? (
            <div className={`tv-content ${isDrawerOpen ? 'drawer-open' : 'drawer-closed'}`}>
              <div className={`drawer ${isDrawerOpen ? 'open' : 'closed'}`}>
                <button className="drawer-toggle" onClick={toggleDrawer}>
                  {isDrawerOpen ? '◀' : '▶'}
                </button>
                {categories.map(category => (
                  <div 
                    key={category} 
                    className={`drawer-item ${category === activeCategory && isDrawerActive ? 'active' : ''}`}
                  >
                    {category}
                  </div>
                ))}
              </div>
              <div className="grid-container">
                {gridItems.slice(visibleRange.start, visibleRange.end + 1).map((item, index) => (
                  <div 
                    key={visibleRange.start + index} 
                    className={`grid-item ${visibleRange.start + index === selectedGridItem && !isDrawerActive ? 'active' : ''}`}
                  >
                    {item}
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="tv-off">
              <p>TV is off</p>
            </div>
          )}
        </div>
        
        <div className="remote">
         <div className="button-group">
            <button 
              className="power-button"
              onClick={() => handleRemoteButton('power')}
            >
              ⏻
            </button>
            {isZoomed && (
              <button 
                className="zoom-button"
                onClick={() => handleRemoteButton('zoom')}
              >
                Z
              </button>
            )}
          </div>
          <div className="directional-pad">
            <button className="up" onClick={() => handleRemoteButton('up')}>▲</button>
            <button className="right" onClick={() => handleRemoteButton('right')}>▶</button>
            <button className="down" onClick={() => handleRemoteButton('down')}>▼</button>
            <button className="left" onClick={() => handleRemoteButton('left')}>◀</button>
            <button className="select" onClick={() => handleRemoteButton('select')}>OK</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LivingRoomFPV;
