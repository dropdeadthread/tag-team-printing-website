import React from 'react';
import styled from 'styled-components';

const BioContainer = styled.div`
  background: ${props => props.background === 'blackPaper' ? 
    'linear-gradient(45deg, #1a1a1a 0%, #2d2d2d 50%, #1a1a1a 100%)' : 
    'linear-gradient(45deg, #f4e4b8 0%, #e6d49a 50%, #d4c382 100%)'};
  background-image: ${props => props.background === 'blackPaper' ? 
    `url('/images/vintage-black-paper.png'), 
     radial-gradient(circle at 20% 30%, rgba(255,255,255,0.05) 1px, transparent 1px),
     radial-gradient(circle at 80% 70%, rgba(255,255,255,0.03) 1px, transparent 1px)` : 
    `url('/images/paper-bg.png'),
     radial-gradient(circle at 25% 25%, rgba(0,0,0,0.1) 1px, transparent 1px),
     radial-gradient(circle at 75% 75%, rgba(0,0,0,0.05) 1px, transparent 1px)`};
  background-size: cover, auto, auto;
  background-repeat: no-repeat, repeat, repeat;
  background-position: center, 0 0, 0 0;
  background-attachment: fixed;
  background-blend-mode: multiply, screen, overlay;
  min-height: 100vh;
  padding: 2rem;
  position: relative;
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: repeating-linear-gradient(
      0deg,
      transparent,
      transparent 1px,
      rgba(0,0,0,0.02) 1px,
      rgba(0,0,0,0.02) 2px
    );
    pointer-events: none;
  }
`;

const BioCard = styled.div`
  max-width: 800px;
  margin: 0 auto;
  background: ${props => props.background === 'blackPaper' ? 
    'rgba(0,0,0,0.8)' : 'rgba(255,255,255,0.9)'};
  border: 3px solid #2563EB;
  box-shadow: 
    0 0 20px rgba(37, 99, 235, 0.3),
    inset 0 0 10px rgba(0,0,0,0.1);
  position: relative;
  overflow: hidden;
  transform: rotate(-0.5deg);
`;

const BioHeader = styled.div`
  background: #2563EB;
  color: white;
  padding: 1.5rem;
  text-align: center;
  position: relative;
  
  &::after {
    content: '';
    position: absolute;
    bottom: -10px;
    left: 0;
    right: 0;
    height: 10px;
    background: url('/images/torn-tape-rougher.png') repeat-x;
    background-size: auto 100%;
  }
`;

const Name = styled.h1`
  font-family: 'HawlersEightRough', 'Impact', 'Arial Black', sans-serif;
  font-size: 2.5rem;
  font-weight: 900;
  text-transform: uppercase;
  letter-spacing: 2px;
  margin: 0;
  text-shadow: 3px 3px 0px #000;
  transform: scaleY(1.2);
`;

const Title = styled.h2`
  font-family: 'HawlersEightRough', 'Impact', 'Arial Black', sans-serif;
  font-size: 1.2rem;
  font-weight: 700;
  text-transform: uppercase;
  margin: 0.5rem 0 0 0;
  letter-spacing: 1px;
`;

const TagsContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 0.5rem;
  margin-top: 1rem;
`;

const Tag = styled.span`
  background: #000;
  color: #fff;
  padding: 0.3rem 0.8rem;
  font-family: 'HawlersEightRough', 'Impact', sans-serif;
  font-size: 0.8rem;
  font-weight: bold;
  text-transform: uppercase;
  border: 2px solid #2563EB;
  transform: rotate(${props => Math.random() * 4 - 2}deg);
  box-shadow: 2px 2px 4px rgba(0,0,0,0.3);
`;

const BioContent = styled.div`
  padding: 2rem;
  color: ${props => props.background === 'blackPaper' ? '#fff' : '#000'};
`;

const Quote = styled.blockquote`
  font-family: 'HawlersEightRough', 'Impact', serif;
  font-size: 1.8rem;
  font-weight: bold;
  color: #2563EB;
  text-align: center;
  margin: 0 0 2rem 0;
  padding: 1rem;
  border-left: 5px solid #2563EB;
  background: ${props => props.background === 'blackPaper' ? 
    'rgba(37, 99, 235, 0.1)' : 'rgba(37, 99, 235, 0.05)'};
  font-style: italic;
  text-shadow: 1px 1px 2px rgba(0,0,0,0.5);
  position: relative;
  
  &::before {
    content: '"';
    font-size: 2.5rem;
    line-height: 1;
    margin-right: 0.25rem;
    vertical-align: top;
  }
  
  &::after {
    content: '"';
    font-size: 2.5rem;
    line-height: 1;
    margin-left: 0.25rem;
    vertical-align: top;
  }
`;

const BioParagraph = styled.p`
  font-family: 'Arial', sans-serif;
  font-size: 1.1rem;
  line-height: 1.6;
  margin-bottom: 1.5rem;
  text-align: justify;
  
  &:first-of-type::first-letter {
    font-family: 'HawlersEightRough', 'Impact', serif;
    font-size: 4rem;
    font-weight: bold;
    float: left;
    line-height: 3rem;
    margin: 0.5rem 0.5rem 0 0;
    color: #2563EB;
    text-shadow: 2px 2px 4px rgba(0,0,0,0.3);
  }
`;

const LinksSection = styled.div`
  background: ${props => props.background === 'blackPaper' ? 
    'rgba(37, 99, 235, 0.1)' : 'rgba(37, 99, 235, 0.05)'};
  border-top: 3px solid #2563EB;
  padding: 1.5rem;
  margin-top: 2rem;
`;

const LinksTitle = styled.h3`
  font-family: 'HawlersEightRough', 'Impact', sans-serif;
  font-size: 1.5rem;
  color: #2563EB;
  text-transform: uppercase;
  margin: 0 0 1rem 0;
  text-align: center;
`;

const LinkGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1rem;
`;

const LinkCategory = styled.div`
  margin-bottom: 1rem;
`;

const LinkCategoryTitle = styled.h4`
  font-family: 'HawlersEightRough', 'Impact', sans-serif;
  font-size: 1.1rem;
  color: #2563EB;
  text-transform: uppercase;
  margin: 0 0 0.5rem 0;
  border-bottom: 2px solid #2563EB;
  padding-bottom: 0.25rem;
`;

const Link = styled.a`
  display: block;
  color: ${props => props.background === 'blackPaper' ? '#fff' : '#000'};
  text-decoration: none;
  font-weight: bold;
  margin-bottom: 0.25rem;
  padding: 0.25rem 0;
  border-left: 3px solid transparent;
  transition: all 0.3s ease;
  
  &:hover {
    color: #2563EB;
    border-left-color: #2563EB;
    padding-left: 0.5rem;
    text-shadow: 1px 1px 2px rgba(0,0,0,0.3);
  }
`;

const PhotosSection = styled.div`
  background: ${props => props.background === 'blackPaper' ? 
    'rgba(37, 99, 235, 0.1)' : 'rgba(37, 99, 235, 0.05)'};
  border-top: 3px solid #2563EB;
  padding: 1.5rem;
  margin-top: 2rem;
`;

const PhotosTitle = styled.h3`
  font-family: 'HawlersEightRough', 'Impact', sans-serif;
  font-size: 1.5rem;
  color: #2563EB;
  text-transform: uppercase;
  margin: 0 0 1rem 0;
  text-align: center;
`;

const PhotoGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
  margin-top: 1rem;
`;

const PhotoCard = styled.div`
  position: relative;
  border: 2px solid #2563EB;
  border-radius: 8px;
  overflow: hidden;
  transform: rotate(${props => Math.random() * 2 - 1}deg);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  box-shadow: 0 4px 8px rgba(0,0,0,0.2);
  
  &:hover {
    transform: rotate(0deg) scale(1.05);
    box-shadow: 0 8px 16px rgba(37, 99, 235, 0.3);
  }
`;

const PhotoImage = styled.img`
  width: 100%;
  height: 250px;
  object-fit: cover;
  transition: transform 0.3s ease;
  
  ${PhotoCard}:hover & {
    transform: scale(1.1);
  }
`;

const PhotoCaption = styled.div`
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  background: linear-gradient(transparent, rgba(0,0,0,0.8));
  color: white;
  padding: 1rem 0.5rem 0.5rem;
  font-family: 'HawlersEightRough', 'Impact', sans-serif;
  font-size: 0.9rem;
  text-transform: uppercase;
  text-align: center;
`;

const PlaceholderPhoto = styled.div`
  width: 100%;
  height: 250px;
  background: ${props => props.background === 'blackPaper' ? 
    'linear-gradient(45deg, #333 25%, transparent 25%), linear-gradient(-45deg, #333 25%, transparent 25%), linear-gradient(45deg, transparent 75%, #333 75%), linear-gradient(-45deg, transparent 75%, #333 75%)' : 
    'linear-gradient(45deg, #ddd 25%, transparent 25%), linear-gradient(-45deg, #ddd 25%, transparent 25%), linear-gradient(45deg, transparent 75%, #ddd 75%), linear-gradient(-45deg, transparent 75%, #ddd 75%)'};
  background-size: 20px 20px;
  background-position: 0 0, 0 10px, 10px -10px, -10px 0px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #2563EB;
  font-family: 'HawlersEightRough', 'Impact', sans-serif;
  font-size: 1.1rem;
  text-transform: uppercase;
  text-align: center;
  border: 2px dashed #2563EB;
`;

const BioPage = ({ 
  name = "Stacey P. Case",
  title = "Co-owner, Tag Team Printing",
  tags = ["Visual Artist", "Drummer", "Screenprinter", "Stamp Carver", "Vinyl Junkie", "Pizza Provocateur", "Certified Legend"],
  quote = "We don't print for the masses — we print for the misfits.",
  bio = {
    paragraphs: [
      "Stacey P. Case isn't just an artist — he's a walking, printing, drumming archive of underground culture. A punk lifer with a screenprinting squeegee in one hand and a 45 record in the other, Stacey has left his mark on bands, books, storefronts, and film reels across Canada.",
      "From the infamous Trash Palace cinema collective to co-founding punk outfit The Tijuana Bibles, Stacey's style is loud, fast, and unapologetically handmade. He powered the beats for Toronto's wildest trio, The Weirdies, whose 2010 album Volatile earned rave reviews for its pounding rhythms and sassy duets.",
      "At the helm of Rock N Roll Print Shop, he's pulled tens of thousands of prints — posters, record sleeves, zines, pizza boxes. Yep, pizza boxes.",
      "That passion evolved into the now-legendary Cornwall Pizza Record, pressed through his own Dive Bar Records label. Featuring garage icon Bloodshot Bill and hometown hero Stagger Lee, the 7\" vinyl came wrapped in screenprinted pie boxes and launched Stacey's alter ego: The Pizza Freak. It wasn't just a release — it was a movement, complete with a soundtrack, live shows, and a documentary-in-progress (Crust to Dust).",
      "As creator of StampBlankz, Stacey carved custom rubber stamps into statement pieces, art objects, and portable rebellion. The 2024 launch at Cline House Gallery secured his place as Cornwall's Best Visual Artist — a title awarded by the people and backed by decades of work.",
      "He's co-author of the definitive Billy Van biography (Who's The Man?) and helped build the Billy Van Museum to preserve Canada's funkiest cult icon. When he's not printing or archiving, you'll find him spinning rare vinyl under the name DJ Case 45rpm, or loading up slices at Cornwall Pizza, where art, music, and food collide."
    ]
  },
  photos = [
    { src: "/images/staceycasetrashpalace.png", caption: "Rockin' the Leather in St. Catherines" },
    { src: "/images/staceycasedjcase.png", caption: "DJ Case 45rpm in action" },
    { src: "/images/staceycaserocknrollprintshop.png", caption: "At Rock N Roll Print Shop" },
    { src: "/images/staceycaserocknrollprintshop1.png", caption: "Screenprinting mastery" }
  ],
  style = {
    background: "blackPaper",
    colors: {
      text: "#2563EB",
      accent: "#000000"
    }
  },
  links = {
    Instagram: ["@staceypcase", "@rocknrollprintshop", "@djcase45rpm", "@cornwallpizza"],
    Media: {
      "StampBlankz Launch": "https://www.cornwallseawaynews.com/business/stacey-case-hosting-stampblankz-launch-at-cline-house-gallery/",
      "The Weirdies": "https://nowtoronto.com/music/the-weirdies-volatile/",
      "Tijuana Bibles 25th Anniversary": "https://exclaim.ca/music/article/tijuana-bibles-announce-25th-anniversary-greatest-hits-album",
      "Tijuana Bibles Merch Feature": "https://www.cornwallseawaynews.com/community/tijuana-bibles-merch-hot-off-stacey-cases-press/",
      "Billy Van Bio": "https://www.goodreads.com/book/show/56556657-who-s-the-man-billy-van",
      "Cornwall Pizza Record": "https://www.cornwallseawaynews.com/local/cornwall-pizza-gets-its-own-soundtrack/",
      "Bloodshot Bill Interview": "https://theperlichpost.blogspot.com/2025/03/bloodshot-bill-celebrates-pizza.html",
      "Squeegee Rampage": "https://www.youtube.com/watch?v=uA2MhNAgGJQ"
    }
  }
}) => {
  return (
    <BioContainer background={style.background}>
      <BioCard background={style.background}>
        <BioHeader>
          <Name>{name}</Name>
          <Title>{title}</Title>
          <TagsContainer>
            {tags.map((tag, index) => (
              <Tag key={index}>{tag}</Tag>
            ))}
          </TagsContainer>
        </BioHeader>
        
        <BioContent background={style.background}>
          <Quote background={style.background}>{quote}</Quote>
          
          {bio.paragraphs.map((paragraph, index) => (
            <BioParagraph key={index}>
              {paragraph}
            </BioParagraph>
          ))}
          
          {photos && photos.length > 0 && (
            <PhotosSection background={style.background}>
              <PhotosTitle>Gallery</PhotosTitle>
              <PhotoGrid>
                {photos.map((photo, index) => (
                  <PhotoCard key={index}>
                    <PhotoImage 
                      src={photo.src} 
                      alt={photo.caption || `Photo ${index + 1}`}
                      onError={(e) => {
                        e.target.style.display = 'none';
                        e.target.nextSibling.style.display = 'flex';
                      }}
                    />
                    <PlaceholderPhoto 
                      background={style.background} 
                      style={{ display: 'none' }}
                    >
                      Photo Coming Soon
                    </PlaceholderPhoto>
                    {photo.caption && (
                      <PhotoCaption>{photo.caption}</PhotoCaption>
                    )}
                  </PhotoCard>
                ))}
                {/* Show placeholders if no photos yet */}
                {photos.length === 0 && [1, 2, 3, 4].map((_, index) => (
                  <PhotoCard key={`placeholder-${index}`}>
                    <PlaceholderPhoto background={style.background}>
                      Photo Coming Soon
                    </PlaceholderPhoto>
                  </PhotoCard>
                ))}
              </PhotoGrid>
            </PhotosSection>
          )}
          
          {(!photos || photos.length === 0) && (
            <PhotosSection background={style.background}>
              <PhotosTitle>Gallery</PhotosTitle>
              <PhotoGrid>
                {[1, 2, 3, 4].map((_, index) => (
                  <PhotoCard key={`placeholder-${index}`}>
                    <PlaceholderPhoto background={style.background}>
                      Photo Coming Soon
                    </PlaceholderPhoto>
                    <PhotoCaption>Add photos of Stacey P. Case</PhotoCaption>
                  </PhotoCard>
                ))}
              </PhotoGrid>
            </PhotosSection>
          )}
          
          <LinksSection background={style.background}>
            <LinksTitle>Connect & Explore</LinksTitle>
            <LinkGrid>
              <LinkCategory>
                <LinkCategoryTitle>Instagram</LinkCategoryTitle>
                {links.Instagram.map((handle, index) => (
                  <Link 
                    key={index}
                    href={`https://instagram.com/${handle}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    background={style.background}
                  >
                    {handle}
                  </Link>
                ))}
              </LinkCategory>
              
              <LinkCategory>
                <LinkCategoryTitle>Media & Features</LinkCategoryTitle>
                {Object.entries(links.Media).map(([title, url], index) => (
                  <Link 
                    key={index}
                    href={url}
                    target="_blank"
                    rel="noopener noreferrer"
                    background={style.background}
                  >
                    {title}
                  </Link>
                ))}
              </LinkCategory>
            </LinkGrid>
          </LinksSection>
        </BioContent>
      </BioCard>
    </BioContainer>
  );
};

export default BioPage;
