import React from 'react';
import { formatPrice } from '../hooks/useMenu';

const PrintableMenu = React.forwardRef((props, ref) => {
  const { 
    menu, 
    settings = {}, 
    selectedSections = [], 
    sectionPerPage = false, 
    isEvent = false 
  } = props;

  const { grouped } = menu;

  // Retrieve typography settings
  const fontTitle = settings.font_title || 'Playfair Display';
  const fontBody = settings.font_body || 'Montserrat';

  // Margins & Font sizes
  const marginMm = parseInt(settings.print_margin_mm, 10) || 15;
  const baseFontSizePt = parseInt(settings.print_font_size_pt, 10) || 11;

  // Frame details
  const frameEnabled = settings.print_frame_enabled === 'true';
  const frameStyle = settings.print_frame_style || 'classic';
  const frameColor = settings.print_frame_color || '#D4AF37';
  const frameThickness = parseInt(settings.print_frame_thickness, 10) || 2;

  // Auto distribute
  const autoDistribute = settings.print_auto_distribute === 'true';
  const itemSpacing = settings.print_item_spacing_em || '0.3';
  const sectionSpacing = settings.print_section_spacing_em || '1';

  // SVG Watermark pattern generator helper
  const getWatermarkSvgPattern = () => {
    const patternType = settings.watermark_pattern || 'none';
    if (patternType === 'none') return null;

    const size = parseInt(settings.watermark_pattern_size, 10) || 40;
    const color = settings.watermark_pattern_color || '#D4AF37';
    const opacity = parseFloat(settings.watermark_pattern_opacity) || 0.08;
    const thickness = parseInt(settings.watermark_pattern_thickness, 10) || 1;

    let pathD = '';
    switch (patternType) {
      case 'lines':
        pathD = `M 0,${size/2} L ${size},${size/2}`;
        break;
      case 'diagonal':
        pathD = `M 0,${size} L ${size},0`;
        break;
      case 'grid':
        pathD = `M 0,0 L ${size},0 M 0,0 L 0,${size}`;
        break;
      case 'dots':
        return (
          <pattern id="wm-pattern" width={size} height={size} patternUnits="userSpaceOnUse">
            <circle cx={size/2} cy={size/2} r={thickness * 1.5} fill={color} fillOpacity={opacity} />
          </pattern>
        );
      case 'waves':
        pathD = `M 0,${size/2} Q ${size/4},${size/2 - size/6} ${size/2},${size/2} T ${size},${size/2}`;
        break;
      case 'cross':
        pathD = `M ${size/2},0 L ${size/2},${size} M 0,${size/2} L ${size},${size/2}`;
        break;
      default:
        return null;
    }

    return (
      <pattern id="wm-pattern" width={size} height={size} patternUnits="userSpaceOnUse">
        <path d={pathD} fill="none" stroke={color} strokeWidth={thickness} strokeOpacity={opacity} />
      </pattern>
    );
  };

  const watermarkSvgPattern = getWatermarkSvgPattern();

  // Decorative frame renderer helper
  const renderFrame = () => {
    if (!frameEnabled) return null;

    const frameStyles = {
      classic: {
        border: `${frameThickness}px solid ${frameColor}`,
      },
      double: {
        border: `${frameThickness}px double ${frameColor}`,
      },
      ornate: {
        border: `${frameThickness}px solid ${frameColor}`,
        outline: `1px solid ${frameColor}`,
        outlineOffset: '4px',
      },
      minimal_gold: {
        borderTop: `${frameThickness}px solid ${frameColor}`,
        borderBottom: `${frameThickness}px solid ${frameColor}`,
        borderLeft: '1px solid transparent',
        borderRight: '1px solid transparent',
      },
      vintage_menu: {
        border: `1px solid ${frameColor}`,
        boxShadow: `0 0 0 ${frameThickness}px ${frameColor}`,
      }
    };

    return (
      <div 
        className="print-frame absolute pointer-events-none inset-0 z-20"
        style={{
          ...frameStyles[frameStyle],
          margin: `${marginMm - 6}mm` // Sit slightly inside margins
        }}
      >
        {/* Fleurons for ornate style */}
        {frameStyle === 'ornate' && (
          <>
            <div className="absolute top-1 left-2 text-xs font-serif" style={{ color: frameColor }}>❦</div>
            <div className="absolute top-1 right-2 text-xs font-serif" style={{ color: frameColor }}>❦</div>
            <div className="absolute bottom-1 left-2 text-xs font-serif" style={{ color: frameColor }}>❦</div>
            <div className="absolute bottom-1 right-2 text-xs font-serif" style={{ color: frameColor }}>❦</div>
          </>
        )}
      </div>
    );
  };

  return (
    <div 
      ref={ref} 
      className="print-area w-full min-h-full flex flex-col justify-between relative bg-[var(--print-paper-bg)] text-black select-none print:bg-transparent"
      style={{
        fontFamily: fontBody,
        fontSize: `${baseFontSizePt}pt`,
        lineHeight: '1.4',
        boxSizing: 'border-box'
      }}
    >
      
      {/* 1. WATERMARKS AND PATTERNS */}
      <div className="print-watermark absolute inset-0 z-0 overflow-hidden pointer-events-none">
        {/* SVG Pattern Watermark */}
        {watermarkSvgPattern && (
          <svg className="w-full h-full">
            <defs>{watermarkSvgPattern}</defs>
            <rect width="100%" height="100%" fill="url(#wm-pattern)" />
          </svg>
        )}

        {/* Uploaded Watermark Image */}
        {settings.watermark_path && (
          <div className="absolute inset-0 flex items-center justify-center opacity-[0.06]">
            <img 
              src={settings.watermark_path} 
              alt="Watermark logo" 
              className="max-w-[50%] max-h-[50%] object-contain"
            />
          </div>
        )}
      </div>

      {/* 2. DECORATIVE BORDER */}
      {renderFrame()}

      {/* 3. PRINT CONTENT */}
      <div 
        className={`print-content z-10 w-full h-full flex flex-col flex-grow relative ${
          autoDistribute ? 'print-content--distribute' : ''
        }`}
        style={{
          padding: `${marginMm}px` // Local internal offset
        }}
      >
        
        {/* Header Block */}
        <header className="text-center space-y-4 mb-8">
          {settings.logo_path && (
            <div className="flex justify-center mb-2">
              <img 
                src={settings.logo_path} 
                alt="Logo" 
                className="max-h-16 object-contain"
              />
            </div>
          )}
          
          <h1 
            className="text-3xl font-bold tracking-wide"
            style={{ 
              fontFamily: fontTitle,
              color: frameColor // Use accent color for branding header in print
            }}
          >
            {isEvent 
              ? (settings.event_name || 'Evento Speciale')
              : (settings.restaurant_name || 'CapClub - Café & Bistrot')
            }
          </h1>
          
          <p className="text-xs uppercase tracking-widest text-gray-600">
            {isEvent 
              ? (settings.event_subtitle || 'Private Gala Dinner')
              : (settings.restaurant_subtitle || 'Café, Sport & Private Club')
            }
          </p>
          
          <div className="w-16 h-[1px] bg-gray-400 mx-auto"></div>
        </header>

        {/* Categories / Items */}
        <div 
          className="print-items-grid flex-grow space-y-6"
          style={{
            gap: `${sectionSpacing}em`
          }}
        >
          {selectedSections.map((section, secIdx) => {
            const items = grouped[section] || [];
            if (items.length === 0) return null;
            
            const isCentred = settings.print_section_title_center === 'true';

            return (
              <div 
                key={section} 
                className={`print-section ${
                  sectionPerPage && secIdx > 0 ? 'print-section--page-break' : ''
                }`}
                style={{
                  pageBreakInside: 'avoid',
                  breakInside: 'avoid'
                }}
              >
                {/* Section Title */}
                <h2 
                  className={`text-lg font-bold border-b border-gray-300 pb-1 mb-4 ${
                    isCentred ? 'text-center' : 'text-left'
                  }`}
                  style={{ 
                    fontFamily: fontTitle, 
                    color: frameColor,
                    breakAfter: 'avoid',
                    pageBreakAfter: 'avoid'
                  }}
                >
                  {section}
                </h2>

                {/* Section Items */}
                <div 
                  className="space-y-4"
                  style={{
                    gap: `${itemSpacing}em`
                  }}
                >
                  {items.map(item => (
                    <div 
                      key={item.id} 
                      className="print-item space-y-0.5"
                      style={{
                        pageBreakInside: 'avoid',
                        breakInside: 'avoid'
                      }}
                    >
                      <div className="flex items-baseline justify-between font-medium">
                        <span className="font-semibold text-gray-900">{item.title}</span>
                        <span className="flex-grow border-b border-dotted border-gray-400 mx-2"></span>
                        <span className="font-bold text-gray-900 shrink-0">
                          {formatPrice(item.price, settings.currency_symbol)}
                        </span>
                      </div>
                      
                      {item.description && (
                        <p className="text-[10px] text-gray-600 italic font-light pr-8 leading-tight">
                          {item.description}
                        </p>
                      )}
                    </div>
                  ))}
                </div>

              </div>
            );
          })}
        </div>

        {/* Footer info */}
        <footer className="text-center text-[9px] text-gray-500 pt-8 mt-auto border-t border-gray-200">
          <p>
            {isEvent 
              ? `Presso ${settings.restaurant_name || 'CapClub'} - Riservato ai Membri del Club`
              : 'CapClub Private Club & Dining Lounge'
            }
          </p>
        </footer>

      </div>

    </div>
  );
});

export default PrintableMenu;
