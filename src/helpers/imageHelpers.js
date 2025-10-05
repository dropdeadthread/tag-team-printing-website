export const getProductImageUrl = (styleImage, styleCode) => {
  if (!styleImage) return '/images/placeholder-product.jpg'
  
  // S&S images are served from their CDN
  const baseUrl = 'https://www.ssactivewear.com/'
  
  // styleImage comes as "Images/Style/39_fm.jpg"
  return `${baseUrl}${styleImage}`
}

export const getPlaceholderImage = () => {
  return '/images/placeholder-product.jpg'
}

export const formatImageAlt = (title, styleName) => {
  return `${title} - ${styleName}` || 'Product Image'
}