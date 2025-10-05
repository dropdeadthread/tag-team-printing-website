import React from 'react';
import styled from 'styled-components';

const DualBioContainer = styled.div`
  background-image: url('/images/paper-bg.png');
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  min-height: 100vh;
  padding: 8rem 2rem 2rem 2rem;           "Whether he's drawing up a punk flyer at 2am or slinging shirts at a local show, Stacey's world revolves around creating the kind of work that moves people physically, visually, emotionally.",      "At the helm of Rock N Roll Print Shop, Stacey's pulled tens of thousands of prints: posters, record sleeves, zines, pizza boxes. Yep, pizza boxes. That passion evolved into the now-legendary Cornwall Pizza Record, pressed through his own Dive Bar Records label, featuring garage icon Bloodshot Bill and hometown hero Stagger Lee.",     "Stacey P. Case is a walking, printing, drumming archive of underground culture. A punk lifer with a screenprinting squeegee in one hand and a 45 in the other, Stacey has left his fingerprints on bands, books, storefronts, and film reels across Canada.",
        "Whether he's drawing up a punk flyer at 2am or slinging shirts at a local show, Stacey's world revolves around creating the kind of work that moves people — physically, visually, emotionally.",
        "When Stacey prints, you feel it."position: relative;
`;

const DualBioGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 2rem;
  max-width: 1600px;
  margin: 0 auto;
  
  @media (max-width: 1200px) {
    grid-template-columns: 1fr;
    gap: 3rem;
  }
`;

const BioCard = styled.div`
  border: 3px solid #2563EB;
  position: relative;
  overflow: hidden;
  transform: rotate(${props => props.side === 'left' ? '-0.5deg' : '0.5deg'});
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
  font-size: 2.2rem;
  font-weight: 900;
  text-transform: uppercase;
  letter-spacing: 2px;
  margin: 0;
  text-shadow: 3px 3px 0px #000;
  transform: scaleY(1.2);
  
  @media (max-width: 768px) {
    font-size: 1.8rem;
  }
`;

const Title = styled.h2`
  font-family: 'HawlersEightRough', 'Impact', 'Arial Black', sans-serif;
  font-size: 1.1rem;
  font-weight: 700;
  text-transform: uppercase;
  margin: 0.5rem 0 0 0;
  letter-spacing: 1px;
  
  @media (max-width: 768px) {
    font-size: 1rem;
  }
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
  font-size: 0.7rem;
  font-weight: bold;
  text-transform: uppercase;
  border: 2px solid #2563EB;
  transform: rotate(${props => Math.random() * 4 - 2}deg);
  box-shadow: 2px 2px 4px rgba(0,0,0,0.3);
`;

const BioContent = styled.div`
  padding: 1.5rem;
  color: #000;
`;

const Quote = styled.blockquote`
  font-family: 'HawlersEightRough', 'Impact', serif;
  font-size: 1.5rem;
  font-weight: bold;
  color: #2563EB;
  text-align: center;
  margin: 0 0 1.5rem 0;
  padding: 1rem;
  border-left: 5px solid #2563EB;
  font-style: italic;
  text-shadow: 1px 1px 2px rgba(0,0,0,0.5);
  position: relative;
  
  &::before {
    content: '"';
    font-size: 2rem;
    line-height: 1;
    margin-right: 0.25rem;
    vertical-align: top;
  }
  
  &::after {
    content: '"';
    font-size: 2rem;
    line-height: 1;
    margin-left: 0.25rem;
    vertical-align: top;
  }
  
  @media (max-width: 768px) {
    font-size: 1.3rem;
  }
`;

const BioParagraph = styled.p`
  font-family: 'Arial', sans-serif;
  font-size: 1rem;
  line-height: 1.6;
  margin-bottom: 1rem;
  text-align: justify;
  
  &:first-of-type::first-letter {
    font-family: 'HawlersEightRough', 'Impact', serif;
    font-size: 3.5rem;
    font-weight: bold;
    float: left;
    line-height: 2.8rem;
    margin: 0.3rem 0.5rem 0 0;
    color: #2563EB;
    text-shadow: 2px 2px 4px rgba(0,0,0,0.3);
  }
  
  @media (max-width: 768px) {
    font-size: 0.95rem;
    
    &:first-of-type::first-letter {
      font-size: 3rem;
      line-height: 2.5rem;
    }
  }
`;

const PhotosSection = styled.div`
  border-top: 3px solid #2563EB;
  padding: 1rem;
  margin-top: 1.5rem;
`;

const PhotosTitle = styled.h3`
  font-family: 'HawlersEightRough', 'Impact', sans-serif;
  font-size: 1.3rem;
  color: #2563EB;
  text-transform: uppercase;
  margin: 0 0 1rem 0;
  text-align: center;
`;

const PhotoGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: 0.8rem;
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
  height: 200px;
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
  font-size: 0.8rem;
  text-transform: uppercase;
  text-align: center;
`;

const PlaceholderPhoto = styled.div`
  width: 100%;
  height: 200px;
  background: linear-gradient(45deg, #333 25%, transparent 25%), linear-gradient(-45deg, #333 25%, transparent 25%), linear-gradient(45deg, transparent 75%, #333 75%), linear-gradient(-45deg, transparent 75%, #333 75%);
  background-size: 20px 20px;
  background-position: 0 0, 0 10px, 10px -10px, -10px 0px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #2563EB;
  font-family: 'HawlersEightRough', 'Impact', sans-serif;
  font-size: 1rem;
  text-transform: uppercase;
  text-align: center;
  border: 2px dashed #2563EB;
`;

const LinksSection = styled.div`
  border-top: 3px solid #2563EB;
  padding: 1rem;
  margin-top: 1.5rem;
`;

const LinksTitle = styled.h3`
  font-family: 'HawlersEightRough', 'Impact', sans-serif;
  font-size: 1.3rem;
  color: #2563EB;
  text-transform: uppercase;
  margin: 0 0 1rem 0;
  text-align: center;
`;

const LinkCategory = styled.div`
  margin-bottom: 1rem;
`;

const LinkCategoryTitle = styled.h4`
  font-family: 'HawlersEightRough', 'Impact', sans-serif;
  font-size: 1rem;
  color: #2563EB;
  text-transform: uppercase;
  margin: 0 0 0.5rem 0;
  border-bottom: 2px solid #2563EB;
  padding-bottom: 0.25rem;
`;

const Link = styled.a`
  display: block;
  color: #000;
  text-decoration: none;
  font-weight: bold;
  margin-bottom: 0.25rem;
  padding: 0.25rem 0;
  border-left: 3px solid transparent;
  transition: all 0.3s ease;
  font-size: 0.9rem;
  
  &:hover {
    color: #2563EB;
    border-left-color: #2563EB;
    padding-left: 0.5rem;
    text-shadow: 1px 1px 2px rgba(0,0,0,0.3);
  }
`;

const DualBioPage = () => {
  const staceyCase = {
    name: "Stacey P. Case",
    title: "Co-owner, Tag Team Printing",
    tags: ["Visual Artist", "Drummer", "Screenprinter", "Stamp Carver", "Vinyl Junkie", "Pizza Provocateur", "Certified Legend"],
    quote: "We don't print for the masses, we print for the misfits.",
    bio: {
      paragraphs: [
        "Stacey P. Case isn’t just an artist — he’s a walking, printing, drumming archive of underground culture. A punk lifer with a screenprinting squeegee in one hand and a 45 in the other, Stacey has left his fingerprints on bands, books, storefronts, and film reels across Canada.",
        "From co-founding punk outfit The Tijuana Bibles to sparking chaos with Toronto’s infamous Trash Palace cinema collective, his work has always been loud, fast, and unapologetically handmade. In 2004, he took that DIY ethos to absurd new heights when he co-created the Pillow Fight League, a semi-pro spectacle where women threw down in unscripted, full-contact pillow bouts that made international headlines.",
        "At the helm of Rock N Roll Print Shop, Stacey’s pulled tens of thousands of prints — posters, record sleeves, zines, pizza boxes. Yep, pizza boxes. That passion evolved into the now-legendary Cornwall Pizza Record, pressed through his own Dive Bar Records label, featuring garage icon Bloodshot Bill and hometown hero Stagger Lee.",
        "Whether he’s drawing up a punk flyer at 2am or slinging shirts at a local show, Stacey’s world revolves around creating the kind of work that moves people.",
        "When Stacey prints, you feel it."
      ]
    },
    photos: [
      { src: "/images/staceycasetrashpalace.png", caption: "Rockin' the Leather in St. Catherines" },
      { src: "/images/staceycasedjcase.png", caption: "DJ Case 45rpm in action" },
      { src: "/images/staceycaserocknrollprintshop.png", caption: "At Rock N Roll Print Shop" },
      { src: "/images/staceycaserocknrollprintshop1.png", caption: "Screenprinting mastery" }
    ],
    links: {
      Instagram: ["@staceypcase", "@rocknrollprintshop", "@djcase45rpm", "@cornwallpizza"],
      Media: {
        "StampBlankz Launch": "https://www.cornwallseawaynews.com/business/stacey-case-hosting-stampblankz-launch-at-cline-house-gallery/",
        "The Weirdies": "https://nowtoronto.com/music/the-weirdies-volatile/",
        "Tijuana Bibles Merch Feature": "https://www.cornwallseawaynews.com/community/tijuana-bibles-merch-hot-off-stacey-cases-press/",
        "Squeegee Rampage": "https://www.youtube.com/watch?v=uA2MhNAgGJQ"
      }
    }
  };

  const staceyForrester = {
    name: "Stacey Forrester",
    title: "Co-owner, Tag Team Printing",
    tags: ["Creative Director", "Brand Strategist", "Design Innovator", "Print Specialist", "Visual Storyteller", "Art Director"],
    quote: "Every design tells a story. We make sure it's worth telling.",
    bio: {
      paragraphs: [
        "Stacey Forrester is a screen printer, designer, punk rocker, and certified street rat raised on curb wax and cassette tapes. He grew up skating the cracked pavement of Cornwall in the 1990s, where style was DIY and every trick landed was earned. As part of the original crew that petitioned for and helped build Cornwall's second and third skateparks, Stacey learned early how to turn passion into concrete reality.",
        "That same drive took him to London, Ontario, where he spent over a decade shredding basslines in a thrash metal band and soaking in Canada's underground music scene. After years of playing shows, recording, and living loud, Stacey returned to Cornwall with a mission: to build something louder than amps. A print empire rooted in art, rebellion, and community.",
        "Stacey is a walking blueprint for DIY hustle and underground grit. As the co-founder of Tag Team Printing and Drop Dead Thread, he's equal parts illustrator, designer, and machine operator. Every print that leaves the shop is a battle-tested blend of craft and chaos: posters, tees, patches, stickers, album art, all built from scratch with analogue attitude.",
        "Music and art have always been his core fuel, and Tag Team is the engine where it all comes together: DIY ethics, artistic precision, and a little bit of beautiful mess."
      ]
    },
    photos: [
      { src: "/images/Staceyforresterpic1.jpg", caption: "Stacey in action" },
      { src: "/images/Staceyforresterpic2.jpg", caption: "Behind the scenes" },
      { src: "/images/Staceyforresterpic3.jpg", caption: "Creative process" },
      { src: "/images/Staceyforresterpic4.jpg", caption: "Art meets rebellion" }
    ],
    links: {
      Instagram: ["@dropdeadthreadapparel", "@tagteamprinting"],
      Media: {
        "Drop Dead Thread Website": "https://dropdeadthread.ca",
        "Design Portfolio": "#",
        "Creative Process": "#",
        "Brand Case Studies": "#"
      }
    }
  };

  const renderBio = (person, side) => (
    <BioCard side={side}>
      <BioHeader>
        <Name>{person.name}</Name>
        <Title>{person.title}</Title>
        <TagsContainer>
          {person.tags.map((tag, index) => (
            <Tag key={index}>{tag}</Tag>
          ))}
        </TagsContainer>
      </BioHeader>
      
      <BioContent>
        <Quote>{person.quote}</Quote>
        
        {person.bio.paragraphs.map((paragraph, index) => (
          <BioParagraph key={index}>
            {paragraph}
          </BioParagraph>
        ))}
        
        {person.photos && person.photos.length > 0 ? (
          <PhotosSection>
            <PhotosTitle>Gallery</PhotosTitle>
            <PhotoGrid>
              {person.photos.map((photo, index) => (
                <PhotoCard key={index}>
                  <PhotoImage 
                    src={photo.src} 
                    alt={photo.caption || `Photo ${index + 1}`}
                    onError={(e) => {
                      e.target.style.display = 'none';
                      e.target.nextSibling.style.display = 'flex';
                    }}
                  />
                  <PlaceholderPhoto style={{ display: 'none' }}>
                    Photo Coming Soon
                  </PlaceholderPhoto>
                  {photo.caption && (
                    <PhotoCaption>{photo.caption}</PhotoCaption>
                  )}
                </PhotoCard>
              ))}
            </PhotoGrid>
          </PhotosSection>
        ) : (
          <PhotosSection>
            <PhotosTitle>Gallery</PhotosTitle>
            <PhotoGrid>
              {[1, 2, 3, 4].map((_, index) => (
                <PhotoCard key={`placeholder-${index}`}>
                  <PlaceholderPhoto>
                    Photo Coming Soon
                  </PlaceholderPhoto>
                  <PhotoCaption>Add photos of {person.name.split(' ')[0]}</PhotoCaption>
                </PhotoCard>
              ))}
            </PhotoGrid>
          </PhotosSection>
        )}
        
        <LinksSection>
          <LinksTitle>Connect & Explore</LinksTitle>
          <LinkCategory>
            <LinkCategoryTitle>Instagram</LinkCategoryTitle>
            {person.links.Instagram.map((handle, index) => (
              <Link 
                key={index}
                href={`https://instagram.com/${handle}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                {handle}
              </Link>
            ))}
          </LinkCategory>
          
          <LinkCategory>
            <LinkCategoryTitle>Media & Features</LinkCategoryTitle>
            {Object.entries(person.links.Media).map(([title, url], index) => (
              <Link 
                key={index}
                href={url}
                target="_blank"
                rel="noopener noreferrer"
              >
                {title}
              </Link>
            ))}
          </LinkCategory>
        </LinksSection>
      </BioContent>
    </BioCard>
  );

  return (
    <DualBioContainer>
      <DualBioGrid>
        {renderBio(staceyCase, 'left')}
        {renderBio(staceyForrester, 'right')}
      </DualBioGrid>
    </DualBioContainer>
  );
};

export default DualBioPage;
